import {stagingEnvironment} from './environment.staging';
import {prodEnvironment} from './environment.prod';


fdescribe('Environment', () => {

  it('should have urls ending in trailing slashes', () => {

    let environments = [ stagingEnvironment, prodEnvironment];

    for (let i = 0; i < environments.length; i++) {
      expect(environments[i].apiUrl.slice(-1)).toEqual('/');
      expect(environments[i].atilaMicroservicesNodeApiUrl.slice(-1)).toEqual('/');
      expect(environments[i].atilaMicroservicesApiUrl.slice(-1)).toEqual('/');
    }
  });
});

