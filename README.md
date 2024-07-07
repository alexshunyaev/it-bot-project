This is a project for Italian company which will allow managers not to work with all the inquiries from customers.

The chat bot API version can be found [here](https://superstudiochatroom.biz/)


## Installation and Usage Manual for the Keyword Spotting version

**Prerequisites**

- `Node.js and npm`: Ensure you have `Node.js` and `npm` installed on your machine. You can download and install them from [here](https://nodejs.org/en).

### **Offline Installation**

1. **Download the Project Files**

- Ensure you have the following files: `index.html`, `styles.css`, `scripts.js`, and `server.js`.

2. **Set Up the Project Directory**

- Create a project directory and place the downloaded files in it.
- The structure should look like this:
```Copy code
project-directory/
├── front-end/
│   ├── index.html
│   ├── styles.css
│   └── scripts.js
├── server.js
└──keywordSpotting.js
```
3. **Install Node.js Dependencies**

- Navigate to your project directory in the terminal.
- Run the following command to initialize a new `Node.js` project:
```bash
npm init -y
```
- Install the necessary packages:
```bash
npm install express axios body-parser cors socket.io dotenv
```

4. **Run the Server**

- Start your server by running:
```bash
node server.js
```
- Your server should now be running on `http://localhost:3000`.


## Usage
1. **Access the Chatbot**

- Open a web browser and navigate to http://localhost:3000.
- You should see the chatbot interface.

2. **Interact with the Chatbot**

- Type your messages in the input field and click "Send" or press "Enter".
- The bot will respond to your queries regarding room bookings for events at SuperStudio.

3. **Handling Cookies**

- On the first visit, the bot will ask for your name and phone number to set a cookie for personalized service.
- This cookie is stored for 7 days and will be used to remember your details on subsequent visits.