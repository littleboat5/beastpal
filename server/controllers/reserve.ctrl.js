const mongoose = require('mongoose');
const Reserve = require("../models/reserve");

module.exports = {
/*============ INDEX route - get all reservations for 1 beast ==============*/
  getAll: (req, res, next) => {

    Reserve.find( {beastId: req.params.id})
      .exec((err, reservations)=> {
        if (err)
            res.send(err);
        else if (!reservations)
            res.sendStatus(404);
        else
            res.send(reservations);
        next();
    })
  }, //end getAll

/*============ CREATE route - add new reservation to DB ==============*/
  addReserve: (req, res, next) => {
    let {startDate, endDate, userId} = req.body;
    let newReserve = {startDate, endDate, userId, beastId:req.params.id}

    new Reserve(newReserve).save((err, reserve) => {
        if (err)
          res.send(err);
        else if (!reserve )
          res.sendStatus(404);
        else {
          return res.send(reserve);
        }
        // next();
    });

  }, //end addReserve

/*============ UPDATE route - udpate existing reservation ==============*/
  updateReserve: (req, res, next) => {

    Reserve.findOneAndUpdate({_id: req.params.reserve_id}, req.body, {new:true},
      (err, updatedResv)=>{
        if(err)
          return res.send(err);
        else if (!updatedResv)
          return res.send("There are issues when updating reservation: "+req.params.reserve_id);
        else
          return res.send(updatedResv);
    }); //end findByIdAndUpdate
  }, //end updateReserve

/*======== DESTROY route - remove one reservation from db ==============*/
  deleteReserve: (req, res) => {

    Reserve.findById(req.params.reserve_id, (err, reserve) => {
        if (err )
          res.send(err);
        else if (!reserve)
          res.sendStatus(404);
        else {
          const rv = reserve;
          reserve.remove();
          res.send(rv);
        }
    });
  } //end deleteReserve

}
