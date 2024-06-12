from openai import OpenAI
import os
import json

client = OpenAI()


def load_data(file_path):
    with open(file_path, 'r') as file:
        events_data = json.load(file)
    return events_data


def chat(message, studios, home, contacts, about):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": f"You are a website assistant for Superstudio Events. The website home page content is:\n{json.dumps(home, indent=2)}. The website contacts and about pages:\n{json.dumps(contacts, indent=2)},{json.dumps(about, indent=2)}.Here is the information about the halls and studios:\n{json.dumps(studios, indent=2)}"},
            {"role": "user", "content": message}
        ],
        max_tokens=150
    )

    return response.choices[0].message.content


studios_data = load_data("../train/data.json")
home_data = load_data("../train/website_home_data.json")
contacts_data = load_data("../train/website_contacts_data.json")
about_data = load_data("../train/website_about_data.json")

user_message = input()
print(chat(user_message, studios_data, home_data, contacts_data, about_data))
