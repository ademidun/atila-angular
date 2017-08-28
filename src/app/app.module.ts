import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PreviewComponent } from './preview/preview.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule }   from '@angular/forms';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScholarshipsListComponent } from './scholarships-list/scholarships-list.component';
import { ScholarshipCardComponent } from './scholarship-card/scholarship-card.component';
import { ScholarshipService } from './_services/scholarship.service';
import { UserProfileService } from './_services/user-profile.service';

import { TruncatePipe } from './_pipes/truncate.pipe';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PreviewComponent,
    FooterComponent,
    ScholarshipsListComponent,
    ScholarshipCardComponent,
    TruncatePipe,
    LoginComponent,
    RegisterComponent,
    CreateProfileComponent,
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpModule,
  ],
  providers: [ScholarshipService, UserProfileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
