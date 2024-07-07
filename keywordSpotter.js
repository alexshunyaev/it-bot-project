
function keywordSpotting(prompt) {
    const keywordMap = { //keyword map, answers to the given keywords
        //Soft responces
        'available': 'To find out if the venue is available, we recommend you contact our manager.',
        'occupied': 'To find out if the venue is available, we recommend you contact our manager.',
        'price': 'Price on the venue rent depends on many factors such as date, time, and type of occasion, so we recommend you contact our manager.',
        'payment': 'Price on the venue rent depends on many factors such as date, time, and type of occasion, so we recommend you contact our manager.',
        'discount': 'Price on the venue rent depends on many factors such as date, time, and type of occasion, so we recommend you contact our manager.',
        'date': 'Unfortunately, the information quickly changes so I suggest you give us a call.',
        'times': 'Unfortunately, the information quickly changes so I suggest you give us a call.',

        //Answers to the questions with keywords
        'capacity': 'Most venues have different capacities for different types of occasions: dinner, standing, and sitting.',
        'vr': 'Our company rents out VR sets and other equipment for virtual reality events.',
        'virtual reality': 'Our company rents out VR sets and other equipment for virtual reality events.',
        'electricity': 'Most venues are equipped with power sockets of 220V. If you have equipment that needs higher voltage, we suggest you contact our manager.',
        'power': 'Most venues are equipped with power sockets of 220V. If you have equipment that needs higher voltage, we suggest you contact our manager.',
        'sockets': 'Most venues are equipped with power sockets of 220V. If you have equipment that needs higher voltage, we suggest you contact our manager.',
        'wi-fi': 'All venues are equipped with high-speed Wi-Fi connections that can support many users at the same time.',
        'internet': 'All venues are equipped with high-speed Wi-Fi connections that can support many users at the same time.',
        'wireless': 'All venues are equipped with high-speed Wi-Fi connections that can support many users at the same time.',
        'support': 'We provide support 24/7 for ongoing events. Our phone number is: 02 42250154.',
        'help': 'We provide support 24/7 for ongoing events. Our phone number is: 02 42250154.',
        'assistance': 'We provide support 24/7 for ongoing events. Our phone number is: 02 42250154.',
        'area': 'Our venues range from 20m² up to 4000m². Detailed descriptions for each venue can be found on our website.',
        'flash': 'Our venues range from 20m² up to 4000m². Detailed descriptions for each venue can be found on our website.',
        'cash': 'We accept all kinds of payment, including cash.',
        'credit': 'We accept all kinds of payment, including cash.',
        'checks': 'We accept all kinds of payment, including cash.',
        'contact': 'Address: via Tortona, 27 20144 Milano. Phone: 0242250154. Email: info@superstudioevents.com',
        'contacting': 'Address: via Tortona, 27 20144 Milano. Phone: 0242250154. Email: info@superstudioevents.com',
        'contacts': 'Address: via Tortona, 27 20144 Milano. Phone: 0242250154. Email: info@superstudioevents.com',
        'parking': 'Our venues as well as our office have parking lots nearby, so large events with many people will not cause any problems.',
        'parklot': 'Our venues as well as our office have parking lots nearby, so large events with many people will not cause any problems.',
        'restrooms': 'Most venues have at least 1 restroom on site. There are also additional restrooms for extra price.',
        'toilets': 'Most venues have at least 1 restroom on site. There are also additional restrooms for extra price.',
        'wc': 'Most venues have at least 1 restroom on site. There are also additional restrooms for extra price.',
        'waterpoint': 'All our venues are equipped with at least one waterpoint.',
        'water access': 'All our venues are equipped with at least one waterpoint.'
    };

    //Returning identifies keywords, if none found - returning keywords_not_found
    const foundCommands = Object.keys(keywordMap)
        .filter(keyword => prompt.toLowerCase().includes(keyword))
        .map(keyword => keywordMap[keyword]);

    const result = foundCommands.length === 0 ? 'keywords_not_found' : foundCommands;
    return result;
}

module.exports = keywordSpotting;
