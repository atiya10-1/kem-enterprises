import asyncio
from db import db

async def update_images():
    categories = await db.categories.find().to_list(100)
    products = await db.products.find().to_list(300)
    
    updated = 0
    for cat in categories:
        cat_id = cat["id"]
        # find products in this category that have an image
        matching = [p for p in products if p.get("category_id") == cat_id and p.get("images") and p["images"][0]]
        if matching:
            first_img = matching[0]["images"][0]
            await db.categories.update_one({"id": cat_id}, {"$set": {"image": first_img}})
            print(f"Updated category '{cat['name']}' -> image: {first_img}")
            updated += 1
        else:
            print(f"No products found for category '{cat['name']}'")
            
    # Also let's set some featured and is_new products so the homepage 'Engineered Highlights' and 'Fresh Additions' show up!
    await db.products.update_many({"sku": {"$in": ["B1", "B4", "B9", "A1", "A35", "A37", "C1", "C28"]}}, {"$set": {"featured": True}})
    await db.products.update_many({"sku": {"$in": ["B2", "B10", "A10", "A43", "C2", "C30"]}}, {"$set": {"is_new": True, "best_seller": True}})
    
    print(f"Done! Updated {updated} categories.")

if __name__ == "__main__":
    asyncio.run(update_images())
