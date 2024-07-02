
function keywordSpotting(prompt) {

    const keywordMap = {};
    // EXAMPLES OF KEYWORDS AND SOFT FALLBACK (?) 
    keywordMap['available', 'occupied'] = 'To find out if the venue is available, we recommend you contact our manager.';
    keywordMap['price', 'payment'] = 'Price on the venue rent depends on many factors such as date, time, and type of occasion, so we recommend you contact our manager.';
    
    // EXAMPLES OF KEYWORDS AND ANSWERS
    keywordMap['capacity'] = 'Most venues have different capacities for different types of occasions: dinner, standing, and sitting.';
    keywordMap['vr', 'virtual reality'] = 'Our company rents out VR sets and other equipment for virtual reality events.';
    keywordMap['electricity', 'power', 'sockets'] = 'Most venues are equipped with power sockets of 220V. If you have equipment that needs higher voltage, we suggest you contact our manager.';
    keywordMap['wi-fi', 'internet', 'wireless'] = 'All venues are equipped with high-speed Wi-Fi connections that can support many users at the same time.';
    keywordMap['support', 'help', 'assistance'] = 'We provide support 24/7 for ongoing events. Our phone number is: 02 42250154.';
    keywordMap['area', 'flash'] = 'Our venues range from 20m² up to 4000m². Detailed descriptions for each venue can be found on our website.';
    keywordMap['cash', 'credit', 'checks'] = 'We accept all kinds of payment, including cash.';
    keywordMap['contact', 'contacting', 'contacts'] = 'Address: via Tortona, 27 20144 Milano. Phone: 0242250154. Email: info@superstudioevents.com';
    keywordMap['parking', 'parklot'] = 'Our venues as well as our office have parking lots nearby, so large events with many people will not cause any problems.';
    keywordMap['restrooms', 'toilets', 'wc'] = 'Most venues have at least 1 restroom on site. There are also additional restrooms for extra price.';
    keywordMap['waterpoint', 'water access'] = 'All our venues are equipped with at least one waterpoint.';

    const foundCommands = Object.keys(keywordMap)
        .filter(keyword => prompt.toLowerCase().includes(keyword))
        .map(keyword => keywordMap[keyword]);

    // IF FOUND NO KEYWORDS, HARD FALLBACK (?)
    const result = foundCommands.length === 0 ? 'keywords_not_found' : foundCommands;
    return result;
}

module.exports = keywordSpotting;
