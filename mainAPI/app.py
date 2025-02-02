from flask import Flask, jsonify, request
from flask_cors import CORS
import db
import claude_api as llm
import elevenlabs_api as tts
import random as rnd

app = Flask(__name__)
cnt = 0


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
        case 'text':
            if is_real:
                real_text = db.get_real_text(character['characterID'])
                return jsonify({
                    'character': character,
                    'text': real_text,
                    'is_real': True,
                })
            else:
                fake_text = llm.get_fake_text(character['name'])
                return jsonify({
                    'character': character,
                    'text': fake_text,
                    'is_real': False,
                })
        case 'audio':
            if is_real:
                real_audio = db.get_real_audio_path(character['characterID'])
                return jsonify({
                    'character': character,
                    'audio_path': real_audio,
                    'is_real': True,
                })
            else:
                fake_voice_id = db.get_fake_voice_id(character['characterID'])
                fake_text = llm.get_fake_text(character['name'])
                fake_audio_uuid = tts.get_audio_path(fake_text, fake_voice_id)
                return jsonify({
                    'character': character,
                    'audio_path': 'https://static.bubshait.me/ichack25/fake/' + str(
                        fake_audio_uuid) + ".mp3",
                    'is_real': False
                })
        case _:
            raise ValueError("Invalid type")




@app.route('/demo', methods=['GET'])
def demo():
    global cnt
    # Return a path to random fake or real data for a random character
    media_type = request.args.get('type')
    character_id = [1, 0, 3][cnt % 3]
    character = db.get_character_by_id(character_id)
    is_real = False if cnt % 3 == 1 else True
    cnt += 1

    match media_type:
        case 'text':
            if is_real:
                real_text = db.get_real_text(character['characterID'])
                return jsonify({
                    'character': character,
                    'text': real_text,
                    'is_real': True,
                })
            else:
                fake_text = llm.get_fake_text(character['name'])
                return jsonify({
                    'character': character,
                    'text': fake_text,
                    'is_real': False,
                })
        case 'audio':
            if is_real:
                return jsonify({
                    'character': character,
                    'audio_path': f'https://static.bubshait.me/ichack25/real/demo{character_id}.mp3',
                    'is_real': True,
                })
            else:
                return jsonify({
                    'character': character,
                    'audio_path': f'https://static.bubshait.me/ichack25/fake/demo{character_id}.mp3',
                    'is_real': False
                })
        case _:
            raise ValueError("Invalid type")


@app.route('/pair', methods=['GET'])
def pair():
    # Return a path to a pair of real and fake data for a random character
    media_type = request.args.get('type')
    match media_type:
        case 'text':
            character = db.get_random_character()
            real_text = db.get_real_text(character['characterID'])
            fake_text = llm.get_fake_text(character['name'])
            return jsonify({
                'character': character,
                'real_text': real_text,
                'fake_text': fake_text,
            })
        case 'audio':
            character = db.get_random_character()
            real_audio = db.get_real_audio_path(character['characterID'])
            fake_voice_id = db.get_fake_voice_id(character['characterID'])
            fake_text = llm.get_fake_text(character['name'])
            fake_audio = tts.get_audio_path(fake_text, fake_voice_id)
            return jsonify({
                'character': character,
                'real_audio_path': real_audio,
                'fake_audio_path': fake_audio,
            })
        case _:
            raise ValueError("Invalid type")


CORS(app)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3048)
