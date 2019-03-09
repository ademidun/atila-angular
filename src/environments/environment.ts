// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  name: 'dev',
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api/',
  atilaMicroservicesApiUrl: 'http://localhost:5000/',
  atilaMicroservicesApiUrlNode: 'http://localhost:9000/',
  testUserId: 52,
  testAppId: 37,
  adminIds: [4],
  firebase : {
    apiKey: "AIzaSyDs2UY2qe7SJyGGPqKt32zutqWwB-SfANE",
    authDomain: "atila-7.firebaseapp.com",
    databaseURL: "https://atila-7-dev.firebaseio.com",
    projectId: "atila-7",
    storageBucket: "atila-7-dev",
    messagingSenderId: "148649271725"
  },
};
