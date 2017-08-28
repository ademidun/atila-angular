import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";

export class User {
  
      constructor(
          public email: string,
          public username: string,
          public password: string,
      ) { }
  }

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  
  
  constructor(
    private router: Router) { }

  model = new User('','','');

  ngOnInit() {
  }

  registerUser(registerForm: NgForm){
    
    console.log('registerForm: ', registerForm)
    
    if(registerForm.valid){
      this.router.navigate(['create-profile']);      
    }
  }

}
