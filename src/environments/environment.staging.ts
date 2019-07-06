import {environment as prodEnvironment} from './environment.prod';

export const stagingEnvironment =  Object.assign({}, prodEnvironment);

stagingEnvironment.apiUrl = 'https://atila-7-staging.herokuapp.com/addpi/';
stagingEnvironment.atilaMicroservicesNodeApiUrl = 'https://tgrr8bis30.execute-api.us-east-1.amazonaws.com/staging/';
stagingEnvironment.name = 'staging';
export const environment = stagingEnvironment;
