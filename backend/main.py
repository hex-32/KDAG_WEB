import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import dotenv
dotenv.load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "kdag_db")

app = FastAPI(title="KDAG Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncIOMotorClient(MONGODB_URI)
db = client[MONGODB_DB]
posts_coll = db["posts"]


@app.get("/posts")
async def get_posts():
    cursor = posts_coll.find()
    posts = []
    async for post in cursor:
        post["_id"] = str(post["_id"])
        posts.append(post)
    return posts


@app.get("/posts/{post_id}")
async def get_post(post_id: str):
    post = await posts_coll.find_one({"id": post_id})
    posts = []
    post["_id"] = str(post["_id"])
    posts.append(post)
    return posts

@app.post("/posts")
async def create_post(post: dict):
    if "id" not in post or not post["id"]:
        raise HTTPException(status_code=400, detail="Post must include an 'id' field")
    existing = await posts_coll.find_one({"id": post["id"]})
    if existing:
        raise HTTPException(status_code=409, detail="Post with this ID already exists")
    result = await posts_coll.insert_one(post)
    created = await posts_coll.find_one({"_id": result.inserted_id})
    # return created document in same shape as data.json (no _id)
    created.pop("_id", None)
    return created