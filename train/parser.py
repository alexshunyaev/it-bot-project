import requests
from bs4 import BeautifulSoup
import json


def parse_website(url):
    # Send a GET request to the URL
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content of the page
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract information from the parsed HTML
        # Replace the following lines with code specific to the website'studios_data structure

        # Example: Extract title
        title = soup.title.string

        # Example: Extract paragraphs
        paragraphs = [p.text for p in soup.find_all('p')]

        # Create a dictionary to store the extracted data
        data = {
            'title': title,
            'paragraphs': paragraphs
        }

        # Save the data to a JSON file
        with open('website_about_data.json', 'w') as json_file:
            json.dump(data, json_file, indent=4)

        print("Data saved to website_about_data.json")
    else:
        print("Failed to retrieve website content")


# URL of the website to parse
url = "https://www.superstudioevents.com/en/about/"

# Call the parse_website function with the URL
parse_website(url)
