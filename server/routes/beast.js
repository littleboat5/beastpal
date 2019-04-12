const beastController = require('./../controllers/beast.ctrl');
const multipart = require('connect-multiparty');
const multipartWare = multipart();

module.exports = (router) => {


/*========= INDEX - get ALL beasts ===========*/
  router
      .route('/beasts')
      .get(beastController.getAll);

/*========= SHOW - get 1 beast ===========*/
  router
      .route('/beasts/:id')
      .get(beastController.getBeast);

/*========= CREATE - add new beast ===========*/
  router
      .route('/beasts')
      .post(multipartWare, beastController.addBeast);

/*========= EDIT - edit beast ===========*/
  router
      .route('/beasts/:id/edit')
      .get(beastController.getBeast4Update);

/*========= UPDATE - update beast ===========*/
  router
      .route('/beasts/:id')
      .put(multipartWare, beastController.updateBeast);

/*========= DESTROY - remove 1 beast ===========*/
  router
      .route('/beasts/:id')
      .delete(beastController.deleteBeast);
}
