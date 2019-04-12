const reviewController = require('./../controllers/review.ctrl');
const multipart = require('connect-multiparty');
const multipartWare = multipart();

module.exports = (router) => {


/*========= INDEX - get ALL reviews ===========*/
  router
      .route('/beasts/:id/reviews')
      .get(reviewController.getAll);

/*========= CREATE - add new review ===========*/
  router
      .route('/beasts/:id/reviews')
      .post(multipartWare, reviewController.addReview);

/*========= DESTROY - remove 1 review ===========*/
  router
      .route('/beasts/:id/reviews/:review_id')
      .delete(reviewController.deleteReview);
}
