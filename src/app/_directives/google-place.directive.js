"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var GooglePlaceDirective = (function () {
    //Adding Autocomplete for User Location:
    // https://developers.google.com/maps/documentation/javascript/places-autocomplete#address_forms
    // https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
    //https://stackoverflow.com/questions/42341930/google-places-autocomplete-angular2
    function GooglePlaceDirective(el, model) {
        var _this = this;
        this.model = model;
        /**
        * This directive is used to add the [Google Place Autocomplete Api]{@link https://developers.google.com/maps/documentation/javascript/places-autocomplete#address_forms} to an input element
        */
        this.setAddress = new core_1.EventEmitter();
        this.googlePlaceNoLoad = new core_1.EventEmitter();
        this._el = el.nativeElement;
        this.modelValue = this.model;
        var input = this._el;
        if (typeof google !== 'undefined') {
            this.autocomplete = new google.maps.places.Autocomplete(input, {});
            google.maps.event.addListener(this.autocomplete, 'place_changed', function () {
                var place = _this.autocomplete.getPlace();
                _this.invokeEvent(place);
            });
        }
        else {
            //TODO: Emit event to let preview form that Google Autocomplete is not working.
            this.googlePlaceNoLoad.emit();
        }
    }
    GooglePlaceDirective.prototype.invokeEvent = function (place) {
        this.setAddress.emit(place);
    };
    GooglePlaceDirective.prototype.onInputChange = function () {
    };
    __decorate([
        core_1.Output()
    ], GooglePlaceDirective.prototype, "setAddress", void 0);
    __decorate([
        core_1.Output()
    ], GooglePlaceDirective.prototype, "googlePlaceNoLoad", void 0);
    GooglePlaceDirective = __decorate([
        core_1.Directive({
            selector: '[appGooglePlace]',
            providers: [forms_1.NgModel],
            host: {
                '(input)': 'onInputChange()'
            }
        })
        //https://stackoverflow.com/questions/42341930/google-places-autocomplete-angular2
    ], GooglePlaceDirective);
    return GooglePlaceDirective;
}());
exports.GooglePlaceDirective = GooglePlaceDirective;
