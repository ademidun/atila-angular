import {Component, Input, OnInit} from '@angular/core';
import {MyFirebaseService} from '../../_services/myfirebase.service';
import {AuthService} from '../../_services/auth.service';

@Component({
  selector: 'app-share-item',
  templateUrl: './share-item.component.html',
  styleUrls: ['./share-item.component.scss']
})
//todo change to a component that can also like and scroll to view comments
export class ShareItemComponent implements OnInit {

  @Input() item:any = {};
  @Input() itemCopy:any = {};
  @Input() metadata:any = {};
  @Input() shareItemStyle:any = {};
  constructor(
    public firebaseService: MyFirebaseService,
    public authService: AuthService,
  ) { }

  ngOnInit() {

    this.shareItemStyle = this.metadata.shareItemStyle || this.shareItemStyle;
  }

  logShareType(sharingType) {
    this.itemCopy.share_type = sharingType;
    this.itemCopy.item_type = this.item.type;
    this.itemCopy.item_id= this.item.id;
    this.itemCopy.share_source= this.item.source;
    this.firebaseService.saveUserAnalytics(this.itemCopy,'item_sharing');
  }

  webShare() {

    // if(this.userProfile && (this.userProfile.user == 4 || this.userProfile.user == 1)) {


      if ((<any>navigator).share) {

        this.logShareType('web_share_api');
        (<any>navigator).share({
          title: this.item.title,
          text: +this.item.title,
          url: this.item.url,
        })
          .then(() => {})
          .catch((error) => {});
      }
    }


}
