from flask import Flask, jsonify, request
from flask_cors import CORS
import db
import claude_api as llm
import elevenlabs_api as tts
import random as rnd

app = Flask(__name__)


@app.route('/characters', methods=['GET'])
def characters():
    """
    Return a list of characters from the database
    """
    characters_list = db.get_characters()
    return jsonify(characters_list)


@app.route('/random', methods=['GET'])
def random():
    # Return a path to random fake or real data for a random character
    media_type = request.args.get('type')
    character = db.get_random_character()
    is_real = rnd.choice([True, False])
    match media_type:
        case 'audio':
            if is_real:
                real_audio = db.get_real_audio_path(character['characterID'])
                return jsonify({
                    'audio_path': real_audio,
                    'is_real': True,
                })
            else:
                fake_voice_id = db.get_fake_voice_id(character['characterID'])
                fake_text = llm.get_fake_text(character['name'])
                fake_audio = tts.get_audio_path(fake_text, fake_voice_id)
                return jsonify({
                    'audio_path': fake_audio,
                    'is_real': False
                })
        case _:
            raise ValueError("Invalid type")


@app.route('/pair', methods=['GET'])
def pair():
    # Return a path to a pair of real and fake data for a random character
    media_type = request.args.get('type')
    match media_type:
        case 'audio':
            character = db.get_random_character()
            real_audio = db.get_real_audio_path(character['characterID'])
            fake_voice_id = db.get_fake_voice_id(character['characterID'])
            fake_text = llm.get_fake_text(character['name'])
            fake_audio = tts.get_audio_path(fake_text, fake_voice_id)
            return jsonify({
                'real_audio_path': real_audio,
                'fake_audio_path': fake_audio,
            })
        case _:
            raise ValueError("Invalid type")

CORS(app)
if __name__ == '__main__':
    app.run()
