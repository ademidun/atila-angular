"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var question_base_1 = require("./question-base");
var DateQuestion = (function (_super) {
    __extends(DateQuestion, _super);
    function DateQuestion(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        _this.controlType = 'date';
        _this.type = options['type'] || '';
        return _this;
    }
    return DateQuestion;
}(question_base_1.QuestionBase));
exports.DateQuestion = DateQuestion;
