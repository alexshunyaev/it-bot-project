// keywordSpotter.js

function keywordSpotting(prompt) {
    //сюда насрать кейвордов
    const keywordMap = {
        'avaliable': 'To find out if the vanue is avaliablie we recommend you contact our manager.',
        'restrooms': 'Most venues have at least 1 restroom on the location.',
        'price': 'Price on the venue rent depends on meny factors so we recommend you contact our manager.'
    };

    const foundCommands = Object.keys(keywordMap)
        .filter(keyword => prompt.toLowerCase().includes(keyword))
        .map(keyword => keywordMap[keyword]);

    return foundCommands;
}

module.exports = keywordSpotting;
