from openai import OpenAI
import os
import json

client = OpenAI()


def load_data(file_path):
    with open(file_path, 'r') as file:
        events_data = json.load(file)
    return events_data


def chat(message, events_data):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": f"You are an assistant for Superstudio Events. Here is the information about the halls and events:\n{json.dumps(events_data, indent=2)}"},
            {"role": "user", "content": message}
        ],
        max_tokens=50
    )

    return response.choices[0].message.content


superstudio_events_data = load_data("../train/data.json")

# user_message = "Hi. May you please recommend me a place for the meeting for 10 persons?"
user_message = "Hi. I need a place to make some photos, any ideas?"
print(chat(user_message, superstudio_events_data))
user_message = "How can I rent it?"
print(chat(user_message, superstudio_events_data))
