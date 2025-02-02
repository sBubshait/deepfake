import os
import uuid

from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

load_dotenv()

api_key = os.environ.get("ELEVENLABS_API_KEY")
client = ElevenLabs(api_key=api_key)


def get_audio_path(text, voice_id):
    response = client.text_to_speech.convert(
        text=text,
        voice_id=voice_id,
        model_id="eleven_multilingual_v2",
        output_format="mp3_44100_128",
    )

    save_file_path = f"audio/fake/{uuid.uuid4()}.mp3"
    os.makedirs(os.path.dirname(save_file_path), exist_ok=True)

    with open(save_file_path, "wb") as f:
        for chunk in response:
            if chunk:
                f.write(chunk)

    return save_file_path

