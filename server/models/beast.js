const mongoose = require("mongoose");  // mongoDB modeling tool


const beastSchema = new mongoose.Schema( {
    region: String,
    type: String,
    name: String,
    location: String,
    lat: Number,
    lng: Number,
    image: String,
    buy: {type:Boolean, default:false},
    rent: {type:Boolean, default:false},
    description: String,

    contactId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" //the string "User" should be the model name exported from user.js
    },

    reviews: [
        {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Review"  //the string "Review" should be the model name exported fron review.js
        }
    ],

    rating: {
        type: Number,
        default: 0
    }
});

// can't use ES6 syntax (contact_id)=>{}, don't know why
beastSchema.methods.addContact = function(contact_id) {
  this.contactId = contact_id;
  return this.save();
}

module.exports = mongoose.model("Beast", beastSchema);
