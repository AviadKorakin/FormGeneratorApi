const axios = require('axios');

const pingServer = () => {
    const url = process.env.SERVER_URL; // Replace with your server URL
    axios.get(url)
        .then((response) => {
            console.log('Ping successful:', response.status);
        })
        .catch((error) => {
            console.error('Error pinging server:', error.message);
        });
};


module.exports= {
    pingServer
};
