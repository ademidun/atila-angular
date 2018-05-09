import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserProfileService} from '../_services/user-profile.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  model: any = {};
  verificationResponse: any;
  differentPassword: any;
  verificationType: any;
  passwordVerificationResponse: any;

  constructor(private route: ActivatedRoute,
              private userProfileService: UserProfileService) { }

  ngOnInit() {
    this.model.username = this.route.snapshot.queryParams['username'];
    this.model.token = this.route.snapshot.queryParams['token'];
    this.verificationType = this.route.snapshot.queryParams['verification_type'];


    this.verifyToken();


  }

  verifyToken() {
    if (this.model.username && this.model.token) {
      this.userProfileService.verifyToken(this.model.username, this.model.token)
        .subscribe(
          res => {
            this.verificationResponse = {};
            this.verificationResponse.isValidToken = res.isValidToken;

          },
          err => {
            this.verificationResponse = {};

            this.verificationResponse.isValidToken = false;
          }
        )
    }
  }

  checkPassword() {

    this.differentPassword = this.model.password != this.model.confirmPassword;

  }

  changePassword() {

    if (this.model.username && this.model.token) {
      this.userProfileService.verifyResetPassword(this.model)
        .subscribe(
          res => {
            this.passwordVerificationResponse = res;

          },
          err => {
            this.passwordVerificationResponse = err.error;

          }
        )
    }
  }

}
