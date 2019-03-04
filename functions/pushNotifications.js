const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp();

exports.fcmSend = functions.database.ref('/notificationMessages/{userId}/{messageId}').onCreate(event => {

  console.log({event});
  console.log('event.after',event.after());
  console.log('event.params',event.params);

  const message = event.after.val()
  const userId  = event.params.userId

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
