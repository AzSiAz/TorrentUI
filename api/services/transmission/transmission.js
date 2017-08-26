const Transmission = require('transmission');

const transmission = new Transmission({
    host: '127.0.0.1',
    port: 9091,
    username: 'transmission',
    password: '$5$YS9K5ePBav27$Js3nKBjvyiwWfzGZ04LiKppmq2yoCRUtgLYq6Kzo5W1'
});

module.exports = transmission;
