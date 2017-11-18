import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, Input } from '@angular/core';
import { Message } from '../_models/message';
import { MessagingService } from '../_services/messaging.service';
import { Thread } from '../_models/thread';
import { UserProfileService } from '../_services/user-profile.service';
import { UserProfile } from '../_models/user-profile';
import { AuthService } from "../_services/auth.service";
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  providers: [MessagingService, UserProfileService]
})
export class MessagesComponent implements OnInit {

  @ViewChild('discussion') public discussionContainer: ElementRef;

  public currentUser: number;
  public message: Message;
  public messages: Message[];
  public thread: number = 1;
  public threads: Thread[] = [];
  public selectedThreadNdx: number = 0;
  //The current active thread, as selected by the user. 

  public threadsLoaded: boolean = false;
  public userProfileMap = {};
  public hasMessages: boolean;

  constructor(
    public messagingService: MessagingService,
    public userProfileService: UserProfileService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.currentUser = parseInt(this.authService.decryptLocalStorage('uid'));
    this.message = new Message("", this.currentUser, this.thread);
    // Get user's threads
    this.messagingService.getUsersThreads(this.currentUser)
      .subscribe(
      threads => {
        if (threads.length !== 0) {
          this.hasMessages = true;
          threads.forEach((thread, index, arr) => {
            this.threads.push(thread);

            thread.users.filter(userId => !this.userProfileMap[userId]) // Remove the users that are already in the userProfileMap
              //forEach of the users that were not filtered out for already being in the userProfileMap
              // Get the user profiles for each user  
              .forEach((userId, index2, arr2) => {
                this.userProfileService.getById(userId).subscribe(
                  userProfile => {
                    this.userProfileMap[userId] = userProfile;
                    if (index === arr.length - 1 && index2 === arr2.length - 1) {
                      // All threads and user profiles are loaded
                      this.threadsLoaded = true;
                      //get the messages for the first thread
                      this.getMessages(this.threads[this.selectedThreadNdx].id);
                    }
                  },
                  err => {
                    console.log(err);
                  }
                );
              });
          });
        } 
        else {
          // User has no messages
          this.hasMessages = false;
        }
      },
      err => {
        console.log(err);
      });
  }

  sendMessage() {
    this.message.thread = this.threads[this.selectedThreadNdx].id;
    this.messagingService.sendMessage(this.message)
      .subscribe(
      res => {
        this.getMessages(this.threads[this.selectedThreadNdx].id);
        // Clear message field
        this.message.message = "";
      },
      err => {
        console.log(err);
      }
      );
  }

  getMessages(threadId: number) {
    this.messagingService.getThreadMessages(threadId)
      .subscribe(
      messages => {
        this.messages = messages;
      },
      err => {
        console.log(err);
      }
      );
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  // Scrolls discussion container to the bottom
  scrollToBottom(): void {
    try {
      this.discussionContainer.nativeElement.scrollTop = this.discussionContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }

  threadSelected(thread, index) {
    this.selectedThreadNdx = index;
    this.getMessages(this.threads[this.selectedThreadNdx].id);
  }

  // Get the recipient in the thread
  recipient(index): UserProfile {
    let threadUsers = this.threads[index].users;  
    if (this.currentUser === threadUsers[0]) {
      return this.userProfileMap[threadUsers[1]];
    }
    return this.userProfileMap[threadUsers[0]];
  }
}
