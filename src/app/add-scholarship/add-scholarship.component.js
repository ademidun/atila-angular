"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var scholarship_1 = require("../_models/scholarship");
var upload_file_1 = require("../_models/upload-file");
var Observable_1 = require("rxjs/Observable");
var add_question_modal_component_1 = require("../add-question-modal/add-question-modal.component");
var firebase = require("firebase");
var AddScholarshipComponent = (function () {
    function AddScholarshipComponent(router, snackBar, scholarshipService, dialog, authService, route, userProfileService, titleService) {
        this.router = router;
        this.snackBar = snackBar;
        this.scholarshipService = scholarshipService;
        this.dialog = dialog;
        this.authService = authService;
        this.route = route;
        this.userProfileService = userProfileService;
        this.titleService = titleService;
        this.EDUCATION_LEVELS = [
            'University',
            'College',
            'Workplace or Apprenticeship',
        ];
        this.EDUCATION_FIELDS = [
            'Arts (Undergrad)',
            'STEM (Undergrad)',
            'Trade School',
            'Visual + Performing Arts',
            'Law School',
            'Medical School',
            'MBA',
            'Arts (Grad School)',
            'STEM (Grad School)',
            'Other'
        ];
        this.stringDict = {
            'city': '',
            'province': '',
            'country': '',
            'eligible_schools': ''
        };
        this.FUNDING_TYPES = [
            'Scholarship',
            'Loan',
            'Other',
        ];
        this.APPLICATION_FORM_TYPES = [
            'PDF',
            'Web',
            'Other'
        ];
        this.LOCATION_TYPES = ['city', 'province', 'country'];
        this.pageNo = 1;
        this.scholarship = new scholarship_1.Scholarship();
        this.generalInfo = true; // Display general info section
        this.showFormUpload = false;
        this.showUploadLoading = false;
        this.editMode = false;
        this.locationData = [];
        this.locationList = [];
        this.locationInput = {
            city: '',
        };
        this.locationPlaceHolder = 'City, Province/State, or Country';
        this.isOwner = false;
        this.countries = [];
        this.provinces = [];
        this.cities = [];
        this.activeCountry = '';
        this.activeProvince = {};
        this.myJson = JSON;
        this.scholarshipSlug = route.snapshot.params['slug'];
    }
    AddScholarshipComponent.prototype.ngOnInit = function () {
        // Retrieve the user id
        this.userId = parseInt(this.authService.decryptLocalStorage('uid'));
        if (this.scholarshipSlug) {
            this.editMode = true;
            this.loadScholarshipDatabase();
        }
        this.loadScholarshipDefaults();
    };
    AddScholarshipComponent.prototype.ngAfterViewInit = function () {
    };
    AddScholarshipComponent.prototype.stringInputToArray = function (event) {
        var _this = this;
        this.scholarship[event.target.name] = {};
        var tempString = event.target.value;
        tempString = tempString.trim();
        var stringArray = tempString.split(",");
        stringArray.forEach(function (element) {
            element = element.trim();
            _this.scholarship[event.target.name][element] = element;
        });
        for (var key in stringArray) {
        }
        /* for (var i = 0; i < event.srcElement.form.length; i++) {
    
           event.srcElement.form[i].disabled = true;
    
         }
         */
    };
    AddScholarshipComponent.prototype.createLocation = function (type) {
        switch (type) {
            case 'countries':
                {
                    this.countries.push({
                        'country': ''
                    });
                }
                break;
            case 'provinces':
                {
                    this.provinces.push({
                        'country': this.activeCountry,
                        'province': ''
                    });
                }
                break;
            case 'provinces':
                {
                    this.provinces.push({
                        'country': this.activeCountry,
                        'province': ''
                    });
                }
                break;
            case 'cities':
                {
                    //loop through the provinces objects, looking for the
                    //matching province and extract its country
                    this.cities.push({
                        'country': this.activeProvince.country,
                        'province': this.activeProvince.province,
                        'city': ''
                    });
                }
                break;
            default:
                break;
        }
    };
    AddScholarshipComponent.prototype.removeLocation = function (index, type, value) {
        this[type].splice(index, 1);
        /*switch (type) {
          case 'countries':
            {
              this.countries.splice(index,1);
            }
            break;
          case 'provinces':
          {
            this.provinces.splice(index,1);
          }
          break;
          case 'cities':
          {
            this.cities.splice(index,1);
          }
          break;
    
          default:
            break;
        }
        */
    };
    AddScholarshipComponent.prototype.editLocation = function (index, type, event) {
        switch (type) {
            case 'countries':
                {
                    this.countries[index] = {
                        'country': event.target.value
                    };
                }
                break;
            case 'provinces':
                {
                    this.provinces[index] = {
                        'country': this.activeCountry,
                        'province': event.target.value
                    };
                }
                break;
            case 'cities':
                {
                    //loop through the provinces objects, looking for the
                    //matching province and extract its country
                    this.cities[index] = {
                        'country': this.activeProvince.country,
                        'province': this.activeProvince.province,
                        'city': event.target.value
                    };
                }
                break;
            default:
                break;
        }
    };
    AddScholarshipComponent.prototype.setActiveLocation = function (event, type, value) {
        //value will be an array of locations, we are looking for the
        //value where event.value == value[i].type
        switch (type) {
            case 'country':
                {
                    this.activeCountry = event.value;
                }
                break;
            case 'province':
                {
                    this.activeProvince = {
                        'country': '',
                        'province': event.value
                    };
                    for (var i = 0; i < this.provinces.length; i++) {
                        var element = this.provinces[i];
                        if (element.province == this.activeProvince.province) {
                            this.activeProvince.country = element.country;
                            break;
                        }
                    }
                }
                break;
            default:
                break;
        }
    };
    AddScholarshipComponent.prototype.trackByFn = function (index, item) {
        return index;
    };
    AddScholarshipComponent.prototype.next = function () {
        this.pageNo = Math.min(3, this.pageNo + 1);
    };
    AddScholarshipComponent.prototype.loadScholarshipDefaults = function () {
        this.scholarship.owner = this.userId;
        this.scholarship.extra_questions = {};
        this.scholarship.submission_info = {};
        // TODO: Are most scholarships pdf forms this.APPLICATION_FORM_TYPES[0] or web forms this.APPLICATION_FORM_TYPES[1]
        this.scholarship.submission_info.application_form_type = [this.APPLICATION_FORM_TYPES[0]];
        this.scholarship.reference_letter_required = 0;
        this.scholarship.number_available_scholarships = 1;
        this.stringDict.eligible_schools = '';
        this.stringDict['city'] = '';
        this.scholarship.submission_info.web_form_entries = [
            {
                attribute_type: '',
                attribute_value: '',
                question_key: ''
            },
        ];
        this.scholarship.submission_info.web_form_parent = {
            element_type: '',
            attribute_type: '',
            attribute_value: '',
        };
    };
    AddScholarshipComponent.prototype.loadScholarshipDatabase = function () {
        var _this = this;
        this.scholarshipService.getBySlug(this.scholarshipSlug)
            .subscribe(function (scholarship) {
            _this.scholarship = scholarship;
            //If the current scholarship has a web form and the web_form_entries have not been defined, initialize them with default values
            if (_this.scholarship.submission_info.application_form_type == 'Web' && !_this.scholarship.submission_info.web_form_entries) {
                _this.scholarship.submission_info.web_form_entries = [
                    {
                        attribute_type: '',
                        attribute_value: '',
                        question_key: ''
                    },
                ];
            }
            if (_this.scholarship.submission_info.application_form_type == 'Web' && !_this.scholarship.submission_info.web_form_parent) {
                _this.scholarship.submission_info.web_form_parent = {
                    element_type: '',
                    attribute_type: '',
                    attribute_value: '',
                };
            }
            //The webForms value in the table is populated using the scholarship.submission_info.web_form_entries
            _this.webForms = _this.scholarship.submission_info.web_form_entries;
            // Get the user profile of the scholarship owner
            _this.titleService.setTitle('Atila - Edit - ' + _this.scholarship.name);
            if (_this.scholarship.owner) {
                _this.userProfileService.getById(scholarship.owner)
                    .subscribe(function (user) {
                    _this.scholarshipOwner = user;
                    if (_this.userId == _this.scholarship.owner) {
                        _this.isOwner = true;
                    }
                    _this.arrayToString();
                }, function (err) {
                });
            }
            _this.initializeLocations();
        }, function (err) {
        }, function () {
            if (_this.userId == _this.scholarship.owner) {
                _this.isOwner = true;
            }
            if (_this.editMode && !_this.isOwner) {
                $("#scholarshipForm :input").prop("disabled", true);
            }
        });
    };
    AddScholarshipComponent.prototype.openModal = function () {
        var _this = this;
        var dialogRef = this.dialog.open(add_question_modal_component_1.AddQuestionModalComponent);
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.scholarship.extra_questions[result.key] = result;
            }
        });
    };
    // Edit existing question
    AddScholarshipComponent.prototype.edit = function (key) {
        var _this = this;
        var dialogRef = this.dialog.open(add_question_modal_component_1.AddQuestionModalComponent, {
            data: this.scholarship.extra_questions[key]
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.scholarship.extra_questions[key] = result;
            }
        });
    };
    // Edit existing question from question array
    AddScholarshipComponent.prototype.delete = function (key) {
        delete this.scholarship.extra_questions[key];
    };
    AddScholarshipComponent.prototype.back = function () {
        this.pageNo = Math.max(1, this.pageNo - 1);
    };
    AddScholarshipComponent.prototype.generateArray = function (obj) {
        return Object.keys(obj).map(function (key) { return obj[key]; });
    };
    AddScholarshipComponent.prototype.saveScholarship = function (scholarshipForm) {
        var _this = this;
        if (this.editMode && !this.isOwner) {
            this.snackBar.open("You are not authorized to make Changes", '', {
                duration: 3000
            });
            return;
        }
        if (scholarshipForm.valid) {
            var postOperation = void 0;
            this.scholarship.owner = this.userId;
            var locationData = {
                countries: this.countries,
                provinces: this.provinces,
                cities: this.cities
            };
            var sendData = {
                'scholarship': this.scholarship,
                'locationData': this.locationList,
            };
            if (this.editMode) {
                this.scholarshipService.updateAny(sendData)
                    .subscribe(function (res) {
                    _this.snackBar.open("Scholarship succesfully Saved", '', {
                        duration: 3000
                    });
                }, function (err) {
                    _this.snackBar.open("Error - " + err, '', {
                        duration: 3000
                    });
                });
            }
            else {
                postOperation = this.scholarshipService.createAny(sendData);
                postOperation.subscribe(function (data) {
                    _this.snackBar.open("Scholarship succesfully created", '', {
                        duration: 3000
                    });
                    _this.showFormUpload = true;
                    _this.scholarship = data;
                    // todo change to this.router.navigate(['my-scholarships'])
                    //this.router.navigate(['scholarships-list']);
                }, function (err) {
                    _this.snackBar.open("Error - " + err, '', {
                        duration: 3000
                    });
                });
            }
        }
        else {
            this.snackBar.open("Invalid form", '', {
                duration: 3000
            });
        }
    };
    AddScholarshipComponent.prototype.scholarshipAppFormChangeEvent = function (fileInput) {
        this.scholarshipFormFile = fileInput.target.files[0];
    };
    AddScholarshipComponent.prototype.uploadScholarshipAppForm = function () {
        //let uploadOperation: Observable<any>;
        //create Upload file and configure its properties before uploading.
        this.showUploadLoading = true;
        this.appFormFile = new upload_file_1.UploadFile(this.scholarshipFormFile);
        this.appFormFile.name = this.scholarshipFormFile.name;
        this.appFormFile.uploadInstructions = {
            type: 'update_model',
            model: "Scholarship",
            id: this.scholarship.id,
            fieldName: 'form_url'
        };
        this.appFormFile.path = "scholarships/" + this.scholarship.id + "/scholarship-templates/";
        this.appFormFile.path = this.appFormFile.path + this.appFormFile.name;
        this.fileUpload(this.appFormFile)
            .subscribe(function (res) { });
    };
    //TODO: Refactor this code into the firebase service
    AddScholarshipComponent.prototype.fileUpload = function (uploadFile) {
        var _this = this;
        return this.authService.getAPIKey("FIREBASE_CONFIG_KEYS")
            .map(function (res) { return _this.uploadFileFirebase(res, uploadFile); })
            .catch(function (err) { return Observable_1.Observable.throw(err); });
    };
    AddScholarshipComponent.prototype.uploadFileFirebase = function (res, uploadFile) {
        /**
         * Refactor this into a firebase service, using streaming of observables.
         */
        var _this = this;
        var config;
        config = res['api_key'];
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        uploadFile.name = config.toString();
        //why does google documentation use var instead of ref
        //preparing the firebase storage for upload
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var uploadRef = storageRef.child(uploadFile.path);
        var metadata = {
            contentType: uploadFile.file.type,
            size: uploadFile.file.size,
            name: uploadFile.file.name,
        };
        var uploadTask = uploadRef.put(uploadFile.file, metadata);
        //https://firebase.google.com/docs/storage/web/upload-files?authuser=0
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        }, function (error) {
        }, function () {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            //var downloadURL = uploadTask.snapshot.downloadURL;
            _this.scholarship.form_url = uploadTask.snapshot.downloadURL;
            _this.showUploadLoading = false;
        });
    };
    AddScholarshipComponent.prototype.initializeLocations = function () {
        // See createLocations() int edit-scholarship or add-scholarship.component.ts
        for (var index = 0; index < this.scholarship.country.length; index++) {
            var element = this.scholarship.country[index];
            this.locationList.push({
                'country': element.name
            });
        }
        for (var index = 0; index < this.scholarship.province.length; index++) {
            var element = this.scholarship.province[index];
            this.locationList.push({
                'country': element.country,
                'province': element.name
            });
        }
        for (var index = 0; index < this.scholarship.city.length; index++) {
            var element = this.scholarship.city[index];
            this.locationList.push({
                'country': element.country,
                'province': element.province,
                'city': element.name,
            });
        }
    };
    AddScholarshipComponent.prototype.deleteLocationRow = function (index) {
        this.locationList.splice(index, 1);
    };
    AddScholarshipComponent.prototype.saveTableChanges = function (tableData) {
        this.webForms = tableData;
        this.scholarship.submission_info.web_form_entries = tableData;
    };
    AddScholarshipComponent.prototype.saveEditScholarship = function (scholarshipForm) {
        var _this = this;
        if (scholarshipForm.valid) {
            this.scholarshipService.update(this.scholarship)
                .subscribe(function (res) {
                _this.scholarship = res,
                    _this.snackBar.open("Scholarship succesfully Saved", '', {
                        duration: 3000
                    });
            }, function (err) {
                _this.snackBar.open("Error - " + err, '', {
                    duration: 3000
                });
            });
        }
    };
    AddScholarshipComponent.prototype.arrayToString = function () {
        var i = 0;
        //convert the various JSOn values to string for displaying in the text input
        for (var key in this.stringDict) {
            i = 0;
            for (var element in this.scholarship[key]) {
                if (i == 0) {
                    this.stringDict[key] = element;
                }
                else {
                    this.stringDict[key] = this.stringDict[key] + ", " + element;
                }
                i++;
            }
        }
    };
    //Location Google API
    /**
     * Adding Google Places API Autocomplete for User Location:
     * @param {google.maps.places.PlaceResult} placeResult
     * https://developers.google.com/maps/documentation/javascript/reference#PlaceResult
     * https://developers.google.com/maps/documentation/javascript/places-autocomplete#address_forms
     * https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
     * https://stackoverflow.com/questions/42341930/google-places-autocomplete-angular2
     */
    AddScholarshipComponent.prototype.placeAutoComplete = function (placeResult, locationModel) {
        this.predictLocation(this.locationInput, placeResult);
    };
    /**
     * Translate the PlaceResult object into an Atila location object, containing only the city, province/state and country.
     * @param location
     * @param placeResult
     */
    AddScholarshipComponent.prototype.predictLocation = function (location, placeResult) {
        var _this = this;
        var addressComponents = placeResult.address_components;
        var keys = ['city', 'province', 'country'];
        //TODO: Find a more elegant solution for this.
        //remove the autocomplet original query
        this.locationInput = {};
        addressComponents.forEach(function (element) {
            if (element.types[0] == 'locality' || element.types[0] == 'administrative_area_level_3') {
                _this.locationInput.city = element.long_name;
                _this.locationInput.name = _this.locationInput.city;
            }
            if (element.types[0] == 'administrative_area_level_1') {
                _this.locationInput.province = element.long_name;
            }
            if (element.types[0] == 'country') {
                _this.locationInput[element.types[0]] = element.long_name;
            }
        });
        //prevent changes in locationInput to be tracked in LocationList
        this.locationList.push(JSON.parse(JSON.stringify(this.locationInput)));
    };
    /**
     * If the Google Place API did not load, then change the placeholder message to only ask for a city (or country?).
     */
    AddScholarshipComponent.prototype.googlePlaceNoLoad = function () {
        this.locationPlaceHolder = 'City';
    };
    /**
     * If user presses enter on location button, don't allow the form to submit because we still need to pull the location Data from Google Maps.
     */
    AddScholarshipComponent.prototype.keyDownHandler = function (event) {
        if (event.keyCode == 13) {
            // rest of your code
            event.preventDefault();
        }
        //TODO! Change this, allow user to submit with enterButton.
    };
    AddScholarshipComponent = __decorate([
        core_1.Component({
            selector: 'app-add-scholarship',
            templateUrl: './add-scholarship.component.html',
            styleUrls: ['./add-scholarship.component.scss']
        })
    ], AddScholarshipComponent);
    return AddScholarshipComponent;
}());
exports.AddScholarshipComponent = AddScholarshipComponent;
