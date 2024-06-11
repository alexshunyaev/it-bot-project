import openai
import json

openai.api_key = "your-openai-api-key"


def load_data(file_path):
    events_data = []
    with open(file_path, 'r') as file:
        for line in file:
            event = json.loads(line.strip())
            events_data.append(event)
    return events_data


def chat(user_message):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"You are an assistant for Superstudio Events. Here is the information about the halls and events:\n{superstudio_events_data}\nAnswer the user's question based on this information: {user_message}",
        max_tokens=150
    )
    
    return response.choices[0].text.strip()


superstudio_events_data = load_data("train/data.json")

user_message = "Hi."
print(chat(user_message))
