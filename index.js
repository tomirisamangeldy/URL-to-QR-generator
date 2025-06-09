"use strict";
import QRCode from 'qrcode'; //qr code generator module
import express from 'express'; //express node module
import bodyParser from "body-parser";  //html form input retreiver

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 5000;
let user_url="";

//form input and static files - middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public")); //serve CSS styles too since its in the public folder

//retreive variable containing user provided url;
function urlBody(req, res, next) {
  user_url = req.body["url"];  //find html form elements by name "url"
  next();
}
app.use(urlBody);

//redirect to new HTML page with QR code
app.post("/submit", (req, res) => {
  res.sendFile(__dirname + "/public/qr.html");
  // After saving the QR code, send the HTML page
  QRCode.toFile(__dirname + "/public/qr.png", user_url, function (err){
  if (err) throw err;
  console.log('QR code saved to qr.png');
  //HTML display
  app.get("/", (req, res)=>{
  res.sendFile(__dirname + "/public/index.html"); //use 'sendFile' to send page instead of 'send' to send HTML element
  });
  });
});

// Start server 
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});