const mongoose = require('mongoose');
const Beast = require("../models/beast");  // require models/beast.js
const Review = require("../models/review");  // require models/review.js
const User = require("../models/user");  // require models/user.js

module.exports = {
/*============ INDEX route - get all reviews for 1 beast ==============*/
  getAll: (req, res, next) => {
    Beast.findById( req.params.id)
         .populate("reviews")
         .exec( (err, bb)=>{
            if (err)
                res.send(err);
            else if (!bb)
                res.sendStatus(404);
            else
                res.send(bb);
            next();
        });
  },

/*============ CREATE route - add new review to DB ==============*/
// Don't call next, may cause ERR_HTTP_HEADERS_SENT (more than 1 res.send(..))
  addReview: (req, res, next) => {
    let {text, authorId} = req.body;
//  let userID = mongoose.Types.ObjectId(authorId);

//  1. look up review author info
    User.findById(authorId, (err, user)=> {
      if(err)
        res.send(err);
      else if (!user)
        res.send(`User ${authorId} not found in DB`);
      else {
// 2. look up beast, populate reviews so average rating can be calculated
        Beast.findById(req.params.id).populate("reviews").exec((err, bb)=>{
          if(err)
            res.send(err);
          else if (!bb)
            res.send(`Beast ${req.params.id} not found in DB`);
          else {
// 3. Create new Review
            let newReview = {text, beast_id:bb._id };
            new Review(newReview).save((err, rv) => {
              if (err)
                res.send(err);
              else if (!rv )
                res.send(`Problem saving review, text:${text}`);
              else {
                rv.author.id = user._id;
                rv.author.name = user.name;
                rv.save();
                bb.reviews.push(rv);
                bb.save();
                res.send(rv);
              } //end else Review
            }); //end new Review
          } //end else Beast
        }); //end Beast.findById
      } //end else User
// next();
    });//end User.findById
  }, // end addReview

  /*======== DESTROY route - remove one review from db ******/
    deleteReview: (req, res) => {
      Review.findById(req.params.review_id, (err, review) => {
          if (err )
            res.send(err);
          else if (!review)
            res.sendStatus(404);
          else {
            const rv = review;
            review.remove();
            res.send(rv);
          }
// all ref to this review in beast will also be delete. This is achieved by a pre middleware function
// set up in the review model

      });
    } // end deleteReview

  }
