import {environment as environmentStaging} from './environment.staging';
import {environment as environmentProd} from './environment.prod';


fdescribe('Environment', () => {

  it('should have urls ending in trailing slashes', () => {

    let environments = [ environmentStaging, environmentProd];

    for (let i = 0; i < environments.length; i++) {

      expect(environments[i].apiUrl.slice(-1)).toEqual('/');
      expect(environments[i].atilaMicroservicesNodeApiUrl.slice(-1)).toEqual('/');
      expect(environments[i].atilaMicroservicesApiUrl.slice(-1)).toEqual('/');
    }
  });
});

