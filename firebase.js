// firebase.js
const admin = require('firebase-admin');


// Initialize Firebase Admin SDK
var serviceAccount = require("./skevents-e8718-firebase-adminsdk-fbsvc-f3766a9f32.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "skevents-e8718.appspot.com",
});

const bucket = admin.storage().bucket();

module.exports = bucket;