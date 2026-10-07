import os
import uuid
import jwt
import bcrypt
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, Request, Depends

from db import db

JWT_ALGORITHM = "HS256"

# Role -> allowed admin sections
ROLE_PERMISSIONS = {
    "super_admin": ["*"],
    "admin": ["dashboard", "products", "categories", "media", "enquiries",
              "quotations", "invoices", "payments", "customers", "catalogues",
              "reports", "content", "seo", "settings"],
    "sales": ["dashboard", "enquiries", "customers", "quotations", "catalogues"],
    "accounts": ["dashboard", "invoices", "payments", "reports", "customers"],
    "content_manager": ["dashboard", "products", "categories", "media", "content", "catalogues", "seo"],
}


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email,
               "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["sub"]}, {"password_hash": 0, "_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def user_can(user: dict, section: str) -> bool:
    perms = ROLE_PERMISSIONS.get(user.get("role", ""), [])
    return "*" in perms or section in perms


def require_section(section: str):
    async def dep(user: dict = Depends(get_current_user)) -> dict:
        if not user_can(user, section):
            raise HTTPException(status_code=403, detail="You do not have access to this section")
        return user
    return dep


async def seed_admin():
    email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()), "email": email, "password_hash": hash_password(password),
            "name": "KEM Super Admin", "role": "super_admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one({"email": email},
                                  {"$set": {"password_hash": hash_password(password), "role": "super_admin"}})
