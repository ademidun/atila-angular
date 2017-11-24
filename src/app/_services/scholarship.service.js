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
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toPromise");
var environment_1 = require("../../environments/environment");
var ScholarshipService = (function () {
    function ScholarshipService(http) {
        this.http = http;
        this.scholarshipsUrl = environment_1.environment.apiUrl + 'scholarships/';
        this.scholarshipsPreviewUrl = environment_1.environment.apiUrl + 'scholarship-preview/';
        this.scholarshipSlugUrl = environment_1.environment.apiUrl + 'scholarship-slug/';
    }
    ScholarshipService.prototype.create = function (scholarship) {
        return this.http.post(this.scholarshipsUrl, scholarship)
            .map(this.extractData)
            .catch(this.handleError);
    };
    ScholarshipService.prototype.createAny = function (data) {
        return this.http.post(this.scholarshipsUrl, data)
            .map(this.extractData)
            .catch(this.handleError);
    };
    ScholarshipService.prototype.update = function (scholarship) {
        return this.http.put("" + this.scholarshipsUrl + scholarship['id'] + "/", scholarship)
            .map(this.extractData)
            .catch(this.handleError);
    };
    ScholarshipService.prototype.updateAny = function (data) {
        return this.http.put("" + this.scholarshipsUrl + data.scholarship['id'] + "/", data)
            .map(this.extractData)
            .catch(this.handleError);
    };
    ScholarshipService.prototype.setScholarshipPreviewForm = function (user_data) {
        this.form_data = user_data;
        return Promise.resolve(this.form_data);
    };
    ScholarshipService.prototype.getScholarshipPreviewForm = function () {
        return Promise.resolve(this.form_data);
    };
    ScholarshipService.prototype.getScholarshipPreviewList = function (form_data) {
        return this.http.post(this.scholarshipsPreviewUrl, form_data)
            .map(this.extractData)
            .catch(this.handleError);
    };
    ScholarshipService.prototype.getPaginatedscholarships = function (form_data, page) {
        return this.http.post(this.scholarshipsPreviewUrl + "?page=" + page + "/", form_data)
            .map(this.extractData)
            .catch(this.handleError);
    };
    ScholarshipService.prototype.getById = function (id) {
        return this.http.get("" + this.scholarshipsUrl + id + "/")
            .map(this.extractData)
            .catch(this.handleError);
    };
    ScholarshipService.prototype.getBySlug = function (slug) {
        return this.http.get(this.scholarshipSlugUrl + "?slug=" + slug + "/")
            .map(this.extractData)
            .catch(this.handleError);
    };
    ScholarshipService.prototype.extractData = function (res) {
        return res || {};
    };
    ScholarshipService.prototype.handleError = function (error) {
        // In a real world app, you might use a remote logging infrastructure
        console.error(error);
        return Observable_1.Observable.throw(error);
    };
    ScholarshipService = __decorate([
        core_1.Injectable()
    ], ScholarshipService);
    return ScholarshipService;
}());
exports.ScholarshipService = ScholarshipService;
