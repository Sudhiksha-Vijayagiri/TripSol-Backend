const admin=require('firebase-admin');
const service_account=require('./firebasekey.json');

admin.initializeApp({
    credential:admin.credential.cert(service_account),
    databaseURL:'https://tripsol-login.firebaseio.com',


});

const db=admin.firestore();
module.exports={admin,db};