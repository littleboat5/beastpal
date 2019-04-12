const User = require("../models/user");

module.exports = {

  /*============ CREATE route - add user to DB ==============*/
    addUser: (req, res) => {
// first find out if the user already exists in DB
      User.findOne( {email: req.body.email}).then( (err, user) =>{
        if (err)
          res.send(err);
        else if ( !user )  {
// create new user in DB
          new User(req.body).save((err, newUser) => {
            if (err)
                res.send(err);
            else if (!newUser)
                res.sendStatus(404);
            else
                res.send(newUser);
            });
        }
        else
          res.send(user);
      } ); //end .then

    } , // end addUser

/*============ GET route - get a user ==============*/
    getUser: (req, res, next) => {

      User.findById(req.params.id, (err, user)=> {
          if (err)
              res.send(err)
          else if (!user)
              res.sendStatus(404)
          else
              res.send(user)
          next()
      });
    } //end getUser

}
