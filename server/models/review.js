const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
{
// field 1
    rating: {
        type: Number,  // Setting the field type
        // required: "Please provide a rating (1-5 stars).", // Making the star rating required
        min: 1, // Defining min and max values
        max: 5,
        default: 5
        // // Adding validation to see if the entry is an integer
        // validate: {
        //     validator: Number.isInteger, // validator accepts a function definition which it uses for validation
        //     message: "{VALUE} is not an integer value."
        // }
    },
// field 2
    text: {
        type: String
    },
// field 3
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    },
// field 4 - beast associated with the review
    beast_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beast"
    }
},

// 2nd argument in mongoose.Schema()
    {  // if timestamps are set to true, mongoose assigns createdAt and updatedAt fields to your schema, the type assigned is Date.
        timestamps: true
    }

);

// Setting up a .pre middleware function
reviewSchema.pre("remove", function(next){
// delete any references to this review from beasts when "remove()" is executed in the review destroy router
    try{
      this.model("Beast").updateOne(
          { "_id": this.beast_id },
          { "$pull": {"reviews": this._id}},
          next
      );
    } catch (err) {}

});


module.exports = mongoose.model("Review", reviewSchema);
