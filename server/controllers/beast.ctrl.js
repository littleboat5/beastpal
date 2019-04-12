const mongoose = require('mongoose');
const Beast = require("../models/beast");  // require models/beast.js
const Review = require("../models/review");  // require models/review.js
const cloudinary = require('cloudinary');

/*** enable google map { ****/
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);
/*** enable google map } ****/


module.exports = {
/*============ INDEX route - get all beasts ==============*/
  getAll: (req, res, next) => {
        Beast.find({}).exec((err, beasts)=> {
            if (err)
                res.send(err);
            else if (!beasts)
                res.sendStatus(404);
            else
                res.send(beasts);
            next();
        })
  },

/*============ SHOW route - get details of 1 beast ==============*/
  getBeast: (req, res, next) => {
      Beast.findById(req.params.id).populate("reviews").populate(
        {   path: "reviews",
            options: {sort: {updatedAt: -1}} // sort by updatedAt in descending order
        }).exec( (err, bb)=>{
            if (err)
              res.send(err);
            else if (!bb )
              res.sendStatus(404);
            else
              res.send(bb);
            next();
        });
  },

/*============ EDIT route - get details of 1 beast, exclude reviews ==============*/
  getBeast4Update: (req, res, next) => {
      Beast.findById(req.params.id, (err, bb)=>{
            if (err)
              res.send(err);
            else if (!bb )
              res.sendStatus(404);
            else
              res.send(bb);
            next();
        });
  },

/*============ CREATE route - add new beast to DB ==============*/
  addBeast: (req, res, next) => {
    let isBuy = false,
        isRent = false;

    req.body.buy == 'true' ? isBuy = true : isBuy=false;
    req.body.rent == 'true' ? isRent = true : isRent=false;

    //pull fields out of req.body and group them into bb which is an object
    let { region, type, name, location, lat, lng, description, contactId } = req.body;

// "image" in req.files.image must match name in input tag e.g.
// <input name="image" type="file"...>
    if (req.files && req.files.image ){
      cloudinary.uploader.upload(
        req.files.image.path, //1st param is the file path
        (result) => {
            let newbb = { region, type, name, location, lat, lng, description, contactId,
              image: result.secure_url != null ? result.secure_url : '' ,
              buy:isBuy,
              rent:isRent
            }
            saveBeast(newbb);
        }, //2nd param is a callback
        { resource_type: 'image',
          eager: [ {effect: 'sepia'} ]
        }  //3rd param
      );

    }
// no image file
    else {
      let newbb = { region, type, name, location, lat, lng, description, contactId,
        buy:isBuy,
        rent:isRent
      }
      saveBeast(newbb);
    }

    function saveBeast(newbb) {
      if (!newbb.location || !newbb.location.length ) {
// locaiton is not provided, don't bother with geocoder
        new Beast(newbb).save((err, beast) => {
            if (err)
              res.send(err);
            else if (!beast )
              res.sendStatus(404);
            else {
              return res.send(beast);
            }
            next();
        });
      } //end if
      else {
// location provided, try to find its coordinates
        geocoder.geocode(newbb.location, (err, data) => {
          let invalidLoc = false;

          if (err || !data.length) {
              invalidLoc = true;
          } else {
              newbb.lat = data[0].latitude;
              newbb.lng = data[0].longitude;
              newbb.location = data[0].formattedAddress;
          }
          new Beast(newbb).save((err, beast) => {
              if (err)
                res.send(err);
              else if (!beast )
                res.sendStatus(404);
              else {
                return res.send(beast);
              }
              next();
          }); //end new Beast
        }); //end geocoder
      } //end else
    } //end function saveBeast
  }, // end addBeast

/*============ UPDATE route - udpate existing beast ==============*/
  updateBeast: (req, res, next) => {
    const query = {_id: req.params.id};
    let newbb = req.body;

    if (req.files && req.files.image ){
      cloudinary.uploader.upload(
        req.files.image.path, //1st param is the file path
        (result) => {
          newbb = {...req.body, image: result.secure_url != null ? result.secure_url : '' }
          updateBB(newbb);
        }, //2nd param is a callback
        { resource_type: 'image',
          eager: [ {effect: 'sepia'} ]
        }  //3rd param
      );
    }
    // no image file
    else {
      updateBB(newbb);
    }
    // next(); comment out coz it's causing multiple res.send
/*----------------------*/
    function updateBB(newbb){
      if (!newbb.location || !newbb.location.length ) {
// locaiton is not provided, don't bother with geocoder
        Beast.findOneAndUpdate(query, newbb, {new:true},
          (err, updatedBeast)=>{
            if(err)
              return res.send(err);
            else if (!updatedBeast)
              return res.send("There are issues when updating beast: "+req.params.id);
            else {
              return res.send(updatedBeast);
          } //end else
        }); //end findByIdAndUpdate
      } // end if
      else {
// location provided, try to find its coordinates
        geocoder.geocode(newbb.location, (err, data) => {
          let invalidLoc = false;
          if (err || !data.length) {
              invalidLoc = true;
          } else {
              // newbb.lat = data[0].latitude;
              // newbb.lng = data[0].longitude;
            newbb.location = data[0].formattedAddress;
            newbb = {...newbb, lat:data[0].latitude, lng:data[0].longitude }
          }

          Beast.findOneAndUpdate(query, newbb, {new:true},
            (err, updatedBeast)=>{
              if(err)
                return res.send(err);
              else if (!updatedBeast)
                return res.send("There are issues when updating beast: "+req.params.id);
              else {
                return res.send(updatedBeast);
            } //end else
          }); //end findByIdAndUpdate
        });//end geocoder
      } //end else
    } // end updateBB
  },

/*======== DESTROY route - remove one beast from db ******/
// !!! DON'T use next in delete route???
  deleteBeast: (req, res) => {
    Beast.findById(req.params.id, (err, beast) => {
        if (err)
          res.send(err);
        else if (!beast )
          res.sendStatus(404);
        else {
          // deletes all reviews associated with the beast
          Review.deleteMany({ "_id": {$in: beast.reviews}}, function (err) {
            if (err)
              res.send(err);
            else {
              beast.remove(); // remove beast from DB
              res.send(`${beast.name} removed`);
              // res.redirect("/beasts");
            }
          });
        }

    });
  } // end deleteBeast

}
