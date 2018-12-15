import {environment as prodEnvironment} from './environment.prod';

const stagingEnvironment =  prodEnvironment;

stagingEnvironment.apiUrl = 'https://atila-7-staging.herokuapp.com/api/';
stagingEnvironment.name = 'staging';
export const environment = stagingEnvironment;
