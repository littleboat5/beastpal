const reserveController = require('./../controllers/reserve.ctrl');
const multipart = require('connect-multiparty');
const multipartWare = multipart();

module.exports = (router) => {


  /*========= INDEX - get ALL reservations for 1 beast ===========*/
    router
        .route('/beasts/:id/reservations')
        .get(reserveController.getAll);

  /*========= CREATE - add new reservation ===========*/
    router
        .route('/beasts/:id/reservations')
        .post(multipartWare, reserveController.addReserve);

  /*========= UPDATE - update reservation ===========*/
    router
        .route('/beasts/:id/reservations/:reserve_id')
        .put(multipartWare, reserveController.updateReserve);

  /*========= DESTROY - remove 1 reservation ===========*/
    router
        .route('/beasts/:id/reservations/:reserve_id')
        .delete(reserveController.deleteReserve);
}
