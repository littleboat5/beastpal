const mongoose = require("mongoose");

const reserveSchema = mongoose.Schema(
{
  //field 1 - user who make the reservation
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User" //the string "User" should be the model name exported from user.js
  },
  // field 2 - beast being reserved
  beastId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Beast"
  },
  // field 3, 4 - start/end date
  startDate: Date,
  endDate: Date

});


module.exports = mongoose.model("Reserve", reserveSchema);
