"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var environment_1 = require("../../environments/environment");
var UserProfileService = (function () {
    function UserProfileService(http, authService, snackBar) {
        this.http = http;
        this.authService = authService;
        this.snackBar = snackBar;
        this.userEndpoint = environment_1.environment.apiUrl + 'users/';
        this.userProfileEndpoint = environment_1.environment.apiUrl + 'user-profiles/';
    }
    UserProfileService.prototype.createUser = function (user) {
        return this.http.post(this.userEndpoint, user)
            .map(this.extractData)
            .catch(this.handleError);
    };
    UserProfileService.prototype.createUserAndProfile = function (data) {
        return this.http.post(this.userEndpoint, data)
            .map(this.extractData)
            .catch(this.handleError);
    };
    UserProfileService.prototype.getById = function (id) {
        // add authorization header with jwt token
        return this.http.get("" + this.userProfileEndpoint + id + "/")
            .map(this.extractData)
            .catch(this.handleError);
    };
    UserProfileService.prototype.getByUsername = function (username) {
        // note urls missing the apropriate '/' will be redirected and be blocked by CORS policy.
        return this.http.get(this.userProfileEndpoint + "user-name/?username=" + username + "/")
            .map(this.extractData)
            .catch(this.handleError);
    };
    UserProfileService.prototype.isLoggedIn = function () {
        // Determines if user is logged in from the token
        var token = localStorage.getItem('token');
        if (token) {
            return true;
        }
        return false;
    };
    UserProfileService.prototype.update = function (profile) {
        return this.http.put("" + this.userProfileEndpoint + profile['user'] + "/", profile)
            .map(this.extractData)
            .catch(function (err) { return err; });
    };
    UserProfileService.prototype.updateHelper = function (userProfile) {
        /**
         * Put method, with added feature of automatically extracting the location data to match the API backend format.
         */
        var locationData = {};
        if (userProfile.city.length > 0) {
            locationData.city = userProfile.city[0].name;
            locationData.country = userProfile.city[0].country;
            locationData.province = userProfile.city[0].province;
        }
        var sendData = {
            userProfile: userProfile,
            locationData: locationData,
        };
        return this.http.put("" + this.userProfileEndpoint + userProfile['user'] + "/", sendData)
            .map(this.extractData)
            .catch(this.handleError);
    };
    UserProfileService.prototype.updateAny = function (data) {
        return this.http.put("" + this.userProfileEndpoint + data.userProfile['user'] + "/", data)
            .map(this.extractData)
            .catch(this.handleError);
    };
    UserProfileService.prototype.extractData = function (res) {
        var body = res.body;
        return res || {};
    };
    UserProfileService.prototype.handleError = function (error) {
        // In a real world app, you might use a remote logging infrastructure
        var errMsg;
        var err;
        return error;
    };
    UserProfileService = __decorate([
        core_1.Injectable()
    ], UserProfileService);
    return UserProfileService;
}());
exports.UserProfileService = UserProfileService;
