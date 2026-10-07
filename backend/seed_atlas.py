import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
import re
from datetime import datetime, timezone
import bcrypt

ATLAS_URI = "mongodb+srv://atiyashoukat200_db_user:Atiya%4012345@cluster0.b0oy38k.mongodb.net/kem_enterprises?retryWrites=true&w=majority&appName=Cluster0"

client = AsyncIOMotorClient(ATLAS_URI)
db = client["kem_enterprises"]

def slugify(text):
    text = re.sub(r"[^\w\s-]", "", text.lower()).strip()
    return re.sub(r"[-\s]+", "-", text)

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

from seed_data import JHULA, SIGNAGE, DUCTING, DETAILED_SPECS, image_for

async def seed_atlas():
    print("Connecting to MongoDB Atlas...")
    
    # Clean old kem_enterprises data if any
    await db.categories.delete_many({})
    await db.products.delete_many({})
    await db.users.delete_many({})
    await db.settings.delete_many({})
    
    # 1. Admin
    admin_doc = {
        "id": str(uuid.uuid4()),
        "email": "admin@kementerprises.com",
        "password_hash": hash_password("admin123"),
        "name": "KEM Super Admin",
        "role": "super_admin",
        "created_at": now_iso(),
    }
    await db.users.insert_one(admin_doc)
    print("Admin user seeded: admin@kementerprises.com / admin123")
    
    # 2. Categories & Products
    rows = JHULA + SIGNAGE + DUCTING
    cat_names = []
    for _, _, cat, _, _ in rows:
        if cat not in cat_names:
            cat_names.append(cat)
            
    cat_first_img = {}
    for code, _, cat, _, _ in rows:
        if cat not in cat_first_img:
            cat_first_img[cat] = image_for(code)
            
    cats = []
    for order, name in enumerate(cat_names):
        img = cat_first_img.get(name, "")
        c = {
            "id": str(uuid.uuid4()),
            "name": name,
            "slug": slugify(name),
            "description": f"{name} from the official KEM Enterprises product catalogue.",
            "image": img,
            "parent_id": None,
            "order": order,
            "active": True,
            "seo_title": f"{name} | KEM Enterprises",
            "seo_description": f"Explore {name} products from KEM Enterprises.",
            "seo_keywords": name.lower(),
            "created_at": now_iso()
        }
        cats.append(c)
        
    await db.categories.insert_many(cats)
    by = {c["name"]: c for c in cats}
    
    docs = []
    for code, name, cat, spec, rate in rows:
        c = by[cat]
        specs = []
        if code in DETAILED_SPECS:
            specs = [{"label": label, "value": value} for label, value in DETAILED_SPECS[code]]
        else:
            if spec:
                specs.append({"label": "Catalogue Specification", "value": spec})
            specs.append({"label": "Catalogue Rate", "value": rate})
            
        docs.append({
            "id": str(uuid.uuid4()),
            "name": name,
            "slug": slugify(f"{code}-{name}"),
            "sku": code,
            "category_id": c["id"],
            "category_name": cat,
            "subcategory": "",
            "images": [image_for(code)],
            "video": "",
            "short_description": f"{name} ({code}) from the KEM Enterprises catalogue.",
            "description": f"{name}, catalogue code {code}. Specifications and rates are preserved from the supplied KEM Enterprises catalogue.",
            "specifications": specs,
            "material": "",
            "finish": "",
            "size": spec,
            "dimensions": "",
            "wire_diameter": "",
            "load_capacity": "",
            "thread_size": "",
            "application": "",
            "variants": [],
            "packaging": "",
            "moq": "",
            "brand": "KEM Enterprises",
            "tags": [cat.lower(), code.lower()],
            "related_ids": [],
            "downloads": [],
            "price": 0,
            "show_price": False,
            "featured": code in ["B1", "B4", "B9", "A1", "A35", "A37", "C1", "C28"],
            "is_new": code in ["B2", "B10", "A10", "A43", "C2", "C30"],
            "best_seller": code in ["B2", "B10", "A10", "A43", "C2", "C30"],
            "popular": False,
            "active": True,
            "views": 0,
            "enquiry_count": 0,
            "seo_title": f"{name} | KEM Enterprises",
            "seo_description": f"{name} ({code}) - KEM Enterprises {cat}.",
            "seo_keywords": f"{name}, {cat}, KEM Enterprises",
            "created_at": now_iso()
        })
    await db.products.insert_many(docs)
    
    # 3. Settings
    settings_doc = {
        "id": "global",
        "company": {
            "name": "KEM Enterprises",
            "logo": "",
            "favicon": "",
            "about": "Manufacturer, wholesaler and dealer of hardware and tool accessories.",
            "address": "Shop 34/R1, Asmi Complex, Ram Mandir Road, Goregaon (W), Near Mrinal Tai Gore Flyover, Mumbai - 400104",
            "gstin": "27HTHPK1096M1Z1"
        },
        "contact": {
            "phone": "+91 8003224406",
            "alt_phone": "+91 7742379326",
            "whatsapp": "+91 8003224406",
            "email": "info@kementerprise.com",
            "hours": "Mon - Sat"
        },
        "social": {
            "instagram": "",
            "facebook": "",
            "linkedin": "",
            "youtube": ""
        },
        "whatsapp": {
            "number": "918003224406",
            "default_message": "Hello KEM Enterprises, I would like to know more about your products.",
            "product_template": "Hello KEM Enterprises, I am interested in {product}. Please share price, availability and specifications."
        },
        "homepage": {
            "hero_title": "Affordable Solution for Your Need",
            "hero_subtitle": "All type of hardware and tool accessories available. Manufacturer, wholesaler and dealer.",
            "hero_image": ""
        },
        "invoice": {
            "prefix": "INV",
            "start": 1001,
            "gst": 18,
            "terms": "Terms as agreed."
        },
        "created_at": now_iso()
    }
    await db.settings.insert_one(settings_doc)
    
    total_cats = await db.categories.count_documents({})
    total_prods = await db.products.count_documents({})
    total_users = await db.users.count_documents({})
    print(f"SUCCESS: Seeded MongoDB Atlas! Categories: {total_cats}, Products: {total_prods}, Users: {total_users}")

if __name__ == "__main__":
    asyncio.run(seed_atlas())
