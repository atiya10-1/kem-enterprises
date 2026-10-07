import asyncio
from db import db
from seed_data import seed_data
from auth import seed_admin
from server import seed_content

async def main():
    await seed_admin()
    await seed_data()
    try:
        await seed_content()
    except Exception as e:
        print("seed_content note:", e)
    cats = await db.categories.count_documents({})
    prods = await db.products.count_documents({})
    users = await db.users.count_documents({})
    print(f"DATABASE STATS -> Categories: {cats}, Products: {prods}, Users: {users}")

if __name__ == "__main__":
    asyncio.run(main())
