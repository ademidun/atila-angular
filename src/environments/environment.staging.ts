import {environment as prodEnvironment} from '../environments/environment.prod';

const stagingEnvironment =  prodEnvironment;

// stagingEnvironment.apiUrl = 'https://atila-7-staging.herokuapp.com/api/';
stagingEnvironment.name = 'staging';
export const environment = stagingEnvironment;
