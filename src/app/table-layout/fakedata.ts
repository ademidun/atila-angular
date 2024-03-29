// ./project-center/fakedata.ts
import { Project, Person } from './models';
import { Scholarship } from '../_models/scholarship';
import { UploadFile } from '../_models/upload-file';

//Heavily inspired by this tutorial
// https://medium.com/@ct7/building-a-reusable-table-layout-for-your-angular-2-project-adf6bba3b498

export const PROJECTS: Project[] = [
    {
        id: 1,
        name: 'Mercury',
        cost: 277000000,
        first_flight: 'September 9, 1959',
        status: 'Complete'
    },
    {
        id: 2,
        name: 'Gemini',
        cost: 1300000000,
        first_flight: 'April 8, 1964',
        status: 'Complete'
    },
    {
        id: 3,
        name: 'Apollo',
        cost: 25400000000,
        first_flight: 'February 26, 1966',
        status: 'Complete'
    },
    {
        id: 4,
        name: 'Skylab',
        launch: 'May 14, 1973',
        status: 'Complete'
    },
    {
        id: 5,
        name: 'Apollo-Soyuz',
        launch: 'July 15, 1975',
        status: 'Complete'
    },
    {
        id: 6,
        name: 'Space Shuttle',
        total_cost: 196000000000,
        first_flight: 'August 12, 1977',
        status: 'Complete'
    }
    
];
export const PERSONNEL: Person[] = [
    { 
        id: 151, 
        name: 'Alan B. Shepard, Jr.', 
        job: 'Astronaut', 
        year_joined: 1959,
        missions: ['MR-3', 'Apollo 14']
    },
    { 
        id: 152, 
        name: 'Virgil I. Grissom', 
        job: 'Astronaut', 
        year_joined: 1959,
        missions: ['MR-4', 'Apollo 1']
    },
    { 
        id: 153, 
        name: 'John H. Glenn, Jr.', 
        job: 'Astronaut', 
        year_joined: 1959,
        missions: ['MA-6','STS-95']
    },
    { 
        id: 154, 
        name: 'M. Scott Carpenter', 
        job: 'Astronaut', 
        year_joined: 1959,
        missions: ['MA-7']
    }
];