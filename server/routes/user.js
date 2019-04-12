const userController = require('./../controllers/user.ctrl');

module.exports = (router) => {

/*========= GET a user ===========*/
  router
      .route('/user/:id')
      .get(userController.getUser);

/*========= CREATE route: add a user ===========*/
  router
      .route('/user')
      .post(userController.addUser);
}
