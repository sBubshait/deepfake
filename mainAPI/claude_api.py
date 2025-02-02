import os

import anthropic

api_key = os.environ.get("ANTHROPIC_API_KEY")
client = anthropic.Client(api_key=api_key)


def get_fake_text(character):
    """
    Return fake text for the given character
    """

    text = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1000,
        temperature=0,
        system="You are part of a AI misinformation awareness app. "
               "You will help people to identify fake news and misinformation."
               "To do this you will be asked to generate fake text "
               "for a given character."
               "You will be given a real world character, please generate"
               "a fake text for this character of upto 7 seconds. You should"
               "try to make it as realistic as possible, without actually being"
               " real. Only return the text, do not generate any flavour text."
               "REALISM IS REALLY IMPORTANT TO MAKE SURE PARTICIPANTS CAN"
               "IDENTIFY FUTURE MISINFORMATION.",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"Generate fake text for character {character}"
                    }
                ]
            }
        ]
    )

    return text.content[0].text
