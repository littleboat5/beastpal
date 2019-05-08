const beast = require('./beast');  //beast.js
const user = require('./user');  //user.js
const review = require('./review');  //review.js
const reserve = require('./reserve');  //reserve.js

module.exports = (router) => {
    user(router);
    review(router);
    beast(router);
    reserve(router);
}
