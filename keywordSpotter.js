// keywordSpotter.js

function keywordSpotting(prompt) {
    //сюда насрать кейвордов
    const keywordMap = {
        'avaliable': 'avalaability_check',
        'restrooms': 'restrooms_checlk',
        'price': 'price_check'
    };

    const foundCommands = Object.keys(keywordMap)
        .filter(keyword => prompt.toLowerCase().includes(keyword))
        .map(keyword => keywordMap[keyword]);

    return foundCommands;
}

module.exports = keywordSpotting;
