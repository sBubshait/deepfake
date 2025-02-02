import os
import random

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

mongo_db_password = os.environ.get("MONGO_DB_PASSWORD")

uri = (
    f"mongodb+srv://deepfakeDB:{mongo_db_password}"
    "@cluster0.fwfhc.mongodb.net/"
    "?retryWrites=true&w=majority"
)
client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Connected to the database!")
except Exception as e:
    print(e)

db = client['data']


def get_characters():
    """
    Return a list of characters from the database
    """
    characters_collection = db['characters']
    characters_list = list(characters_collection.find({}, {"_id": 0}))
    return characters_list


def get_random_character():
    """
    Return a random character from the database
    """
    characters_collection = db['characters']
    random_character = characters_collection.aggregate([
        {"$sample": {"size": 1}},
        {"$project": {"_id": 0}}
    ])
    return list(random_character)[0]


def get_real_audio_path(character_id):
    """
    Return a random path to the real audio for the given character
    """
    real_audio_collection = db['real']
    audio_data = list(real_audio_collection.find({
        "characterID": character_id,
        "type": "audio"
    }))

    if not audio_data:
        return None

    return random.choice(audio_data)['path']


def get_fake_voice_id(character_id):
    """
    Return the voice ID for the fake audio for the given character
    """
    fake_audio_collection = db['fake']
    audio_data = fake_audio_collection.find_one({
        "characterID": character_id
    })
    return audio_data['voiceID']


def get_real_text(character_id):
    """
    Return a random text for the real audio for the given character
    """
    real_audio_collection = db['real']
    audio_data = list(real_audio_collection.find({
        "characterID": character_id,
        "type": "text"
    }))

    if not audio_data:
        return None

    return random.choice(audio_data)['text']