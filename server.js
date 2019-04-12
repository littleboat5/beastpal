// require('dotenv').config();

const express = require("express");
const routes = require('./server/routes/');  // routes/index.js
const bodyParser = require("body-parser"); //so we can use req.body in the POST route
const mongoose = require("mongoose");  // mongoDB modeling tool
const cors = require('cors');
const helmet = require('helmet');
const cloudinary = require('cloudinary');
const path = require('path');

const app = express();
const router = express.Router();

/*===============  configure cloudinary =============== */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/*=============== connect to DB =============== */
const dburl = process.env.DATABASEURL;

try {
  mongoose.connect(dburl, {useNewUrlParser: true});
} catch (error){
  console.log(error);
}

/*============= set up routes {API Endpoints} ============*/
routes(router);

/*=============== setup middlewares =============== */
app.use(cors()); //prevents cross-origin request errors
// app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(helmet()); //armours our API to prevent attacks

/* tell the server to also serves the build folder, which contains
all static assets, i.e. the client side code, aka, the react/redux stuff
*/
app.use(express.static(path.resolve(__dirname + 'build')));
app.get('/', (req, res) =>{
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.use('/api', router); // append '/api' in front of all routes

/*============== start server ==================*/
let port = process.env.PORT;

// tell express to listen for requests
app.listen(port, ()=>{
    console.log(dburl);
    console.log(`beastpal server started at port: ${port}`);
});
