import {prodEnvironment} from './environment.prod';

export const stagingEnvironment =  Object.assign({}, prodEnvironment);

stagingEnvironment.apiUrl = 'https://atila-7-staging.herokuapp.com/api/';
stagingEnvironment.atilaMicroservicesNodeApiUrl = 'https://tgrr8bis30.execute-api.us-east-1.amazonaws.com/staging/';
stagingEnvironment.name = 'staging';
export const environment = stagingEnvironment;
console.log({stagingEnvironment});
console.log({environment});
