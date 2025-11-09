import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def cleanup_database():
    client = AsyncIOMotorClient("mongodb+srv://ihub:ihub@harlee.6sokd.mongodb.net/")
    db = client["Daily"]
    
    # Delete users with invalid role
    result = await db.users.delete_many({
        "$or": [
            {"role": {"$nin": ["admin", "manager", "employee"]}},
            {"username": {"$exists": False}},
            {"full_name": {"$exists": False}}
        ]
    })
    
    print(f"Deleted {result.deleted_count} invalid users")
    
    # Show remaining users
    count = await db.users.count_documents({})
    print(f"Remaining users: {count}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(cleanup_database())
