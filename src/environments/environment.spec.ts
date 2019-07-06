import {stagingEnvironment} from './environment.staging';
import {prodEnvironment} from './environment.prod';
import {devEnvironment} from './environment';


fdescribe('Environment', () => {

  it('should have urls ending in trailing slashes', () => {

    let environments = [ stagingEnvironment, prodEnvironment, devEnvironment];

    for (let i = 0; i < environments.length; i++) {
      console.log('environments[i]', environments[i]);
      console.log('environments[i].atilaMicroservicesNodeApiUrl', environments[i].atilaMicroservicesNodeApiUrl);
      expect(environments[i].apiUrl.slice(-1)).toEqual('/');
      expect(environments[i].atilaMicroservicesNodeApiUrl.slice(-1)).toEqual('/');
      expect(environments[i].atilaMicroservicesApiUrl.slice(-1)).toEqual('/');
    }
  });
});

