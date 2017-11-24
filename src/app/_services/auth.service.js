"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var CryptoJS = require("crypto-js");
var environment_1 = require("../../environments/environment");
var AuthService = (function () {
    function AuthService(http, snackBar, router) {
        this.http = http;
        this.snackBar = snackBar;
        this.router = router;
        this.loginUrl = environment_1.environment.apiUrl + 'login/';
        this.userUrl = environment_1.environment.apiUrl + 'users/';
        this.usernameUrl = environment_1.environment.apiUrl + 'user-name/';
        this.apiKeyUrl = environment_1.environment.apiUrl + 'api-keys/';
        this.isLoggedIn = false; //should this be public or protected?
        this.token = localStorage.token;
        this.initializeSecretKey();
    }
    AuthService.prototype.logout = function () {
        // remove user from local storage to log user out
        localStorage.clear();
        // there should always be a secret key available even after you clear local storage
        this.initializeSecretKey(true);
        this.isLoggedIn = false;
    };
    AuthService.prototype.login = function (credentials) {
        return this.http.post(this.loginUrl, credentials)
            .map(this.extractToken)
            .catch(this.handleError);
    };
    //https://stackoverflow.com/questions/35739791/encrypting-the-client-side-local-storage-data-using-angularjs
    /**
     * Encrypt a certain value berfore placing it in Local storage pseudocode = localstorage.setItem(key, encrypy(secretKey, value))
     * @param key
     * @param value
     */
    AuthService.prototype.encryptlocalStorage = function (key, value) {
        //base64 values must be converted to string first, before they can be saved
        this.initializeSecretKey();
        var encryptedData = CryptoJS.AES.encrypt(value.toString(), this.secretKey).toString();
        localStorage.setItem(key, encryptedData);
        this.decryptLocalStorage(key);
    };
    AuthService.prototype.decryptLocalStorage = function (key) {
        var encryptedData = localStorage.getItem(key);
        var decryptedValue = '';
        if (encryptedData) {
            decryptedValue = CryptoJS.AES.decrypt(encryptedData, this.secretKey).toString(CryptoJS.enc.Utf8);
            return decryptedValue;
        }
        return null;
    };
    AuthService.prototype.extractToken = function (res) {
        this.token = res['token'];
        return res || {};
    };
    AuthService.prototype.getToken = function () {
        return localStorage.getItem('token');
    };
    AuthService.prototype.getUser = function (userId) {
        return this.http.get(this.usernameUrl + "?user-id=" + userId + "/")
            .map(this.extractData)
            .catch(this.handleError);
    };
    AuthService.prototype.getAPIKey = function (apiKey) {
        return this.http.get(this.apiKeyUrl + "?api-key-name=" + apiKey)
            .map(this.extractData)
            .catch(this.handleError);
    };
    AuthService.prototype.extractData = function (res) {
        return res;
    };
    AuthService.prototype.handleError = function (error) {
        // In a real world app, you might use a remote logging infrastructure
        return Observable_1.Observable.throw(error);
    };
    AuthService.prototype.randomString = function (length) {
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i)
            result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    };
    /**
     * Always have a randomly generated key available for encrypting local storage values. Maintain the keys between browser refresh.
     */
    AuthService.prototype.initializeSecretKey = function (forceInsert) {
        if (forceInsert === void 0) { forceInsert = false; }
        if (forceInsert || !localStorage.getItem('xkcd')) {
            this.secretKey = this.randomString(16);
            this.secretKey = CryptoJS.AES.encrypt(this.secretKey, 'dante').toString();
            localStorage.setItem('xkcd', this.secretKey);
        }
        this.secretKey = localStorage.getItem('xkcd');
        this.secretKey = CryptoJS.AES.decrypt(this.secretKey, 'dante').toString(CryptoJS.enc.Utf8);
    };
    AuthService = __decorate([
        core_1.Injectable()
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
function handleError(error) {
    return Observable_1.Observable.throw(error);
}
exports.handleError = handleError;
function extractData(res) {
    var body = res.json();
    return body;
}
exports.extractData = extractData;
