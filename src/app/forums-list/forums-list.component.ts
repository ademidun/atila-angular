import { Component, OnInit } from '@angular/core';
import { ForumService } from "../_services/forum.service";

import { Forum } from "../_models/forum";
@Component({
  selector: 'app-forums-list',
  templateUrl: './forums-list.component.html',
  styleUrls: ['./forums-list.component.scss']
})
export class ForumsListComponent implements OnInit {

  private forums: Forum[]
  constructor(
    private forumService: ForumService
  ) { }

  ngOnInit() {
    this.forumService.list().subscribe(
      res => {
        this.forums = res.results;
      }
    );

  }

}
