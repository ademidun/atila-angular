export const environment =  {
  name: 'staging',
  production: true,
  testUserId: 70,
  testAppId: 35,
  adminIds: [1],
  apiUrl: 'https://atila-7-staging.herokuapp.com/api/',
  atilaMicroservicesApiUrl: 'https://w142p4uzua.execute-api.us-east-1.amazonaws.com/dev/',
  atilaMicroservicesNodeApiUrl: 'https://tgrr8bis30.execute-api.us-east-1.amazonaws.com/staging/',
  firebase : {
    apiKey: 'AIzaSyDs2UY2qe7SJyGGPqKt32zutqWwB-SfANE',
    authDomain: 'atila-7.firebaseapp.com',
    databaseURL: 'https://atila-7.firebaseio.com',
    projectId: 'atila-7',
    storageBucket: 'atila-7.appspot.com',
    messagingSenderId: '148649271725'
  },

};
console.log('refactored environment.staging');
