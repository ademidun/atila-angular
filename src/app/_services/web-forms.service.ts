/*
TODO:  come back and work on client side selenium later
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/toPromise';


import * as webdriver from 'selenium-webdriver';

@Injectable()
export class WebFormsService {

  constructor() { }


  fillWebForm(webForm,formData, userData): Promise<any>{
    
    
    var By = webdriver.By;

    var until = webdriver.until;

    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();

    driver.get('http://www.google.com/ncr');
    

    driver.findElement(By.name('q')).sendKeys('webdriver');
    let element = driver.findElement(By.name('btnG'));
    
    element.click()
    driver.wait(until.titleIs('webdriver - Google Search'), 1000);

    driver.quit();

    return Promise.resolve(driver);

  }

}
*/
