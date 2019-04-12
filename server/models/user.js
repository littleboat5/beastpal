const mongoose = require("mongoose");  // mongoDB modeling tool
// const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new mongoose.Schema( {
  name: String,
  email: String,
  provider: String,
  provider_id: String,
  token: String,
  profile_pic: String

});

// userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
