const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp();

exports.fcmSend = functions.database.ref('/notificationMessages/{userId}/{messageId}').onCreate((snapshot, context) => {

  console.log( {snapshot});
  console.log( snapshot.val());
  console.log('context.params',context.params);

  const message =  snapshot.val();
  const userId  = context.params.userId;

  const payload = {
    notification: {
      title: message.title,
      body: message.body,
      icon: "https://i.imgur.com/BxROXu1.png"
    }
  };


  admin.database()
    .ref(`/fcmTokens/${userId}`)
    .once('value')
    .then(token => token.val() )
    .then(userFcmToken => {
      return admin.messaging().sendToDevice(userFcmToken, payload)
    })
    .then(res => {
      console.log("Sent Successfully", res);
    })
    .catch(err => {
      console.log(err);
    });

});

module.exports = {
  fcmSend: exports.fcmSend,
}
