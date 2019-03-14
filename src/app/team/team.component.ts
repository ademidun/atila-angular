import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {SeoService} from '../_services/seo.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  teamData: any[] = [
    {
      'first_name': 'Tomiwa',
      'last_name': 'Ademidun',
      'username': 'tomiwa',
      'position': 'Founder',
      'img_url': '../../assets/img/team/tomiwa.jpg',
      'description_1': 'Tomiwa is currently taking a year off a dual degree in software engineering and business at Ivey Business School in Canada to start Atila.',
      'description_2': 'He enjoys playing soccer and is a big Arsenal F.C. fan.',
      'link_type': 'Website',
      'link_url': 'http://tomiwa.ca'
    },
    {
      'first_name': 'Lea',
      'last_name': 'Handal',
      'username': 'lhandal',
      'position': 'Marketing',
      'img_url': '../../assets/img/team/lhandal.jpg',
      'description_1': 'Manpreet is currently studying computer technology at Seneca College.',
      'description_2': 'Prior to Atila, Manpreet worked at RBC as a software developer.',
      // "link_type": "LinkedIn",
      // "link_url": "https://ca.linkedin.com/in/matharumanpreet"
    },
    {
      'first_name': 'Valentine',
      'last_name': 'Kuznetcov',
      'username': 'valentine',
      'position': 'Engineering',
      'img_url': '../../assets/img/team/valentine.jpg',
      'description_1': 'Valentin studied at the Ivey Business School at Western University.',
      'description_2': 'He is currently the CFO of in-lite Outdoor Lighting NA.',
      'link_type': 'LinkedIn',
      'link_url': 'https://ca.linkedin.com/in/matharumanpreet'
    },
    {
      'first_name': 'Aurorita',
      'last_name': 'Mahbub',
      'username': 'auroritam',
      'position': 'Marketing',
      'img_url': '../../assets/img/team/aurorita.jpg',
      'description_1': 'Manpreet is currently studying computer technology at Seneca College.',
      'description_2': 'Prior to Atila, Manpreet worked at RBC as a software developer.',
      'link_type': 'LinkedIn',
      'link_url': 'https://ca.linkedin.com/in/matharumanpreet'
    },
    {
      'first_name': 'Jotham',
      'last_name': 'D\'ailly',
      'username': 'jotham',
      'position': 'Engineering',
      'img_url': '../../assets/img/team/jotham.jpg',
      'description_1': 'Manpreet is currently studying computer technology at Seneca College.',
      'description_2': 'Prior to Atila, Manpreet worked at RBC as a software developer.',
      'link_type': 'LinkedIn',
      'link_url': 'https://ca.linkedin.com/in/matharumanpreet'
    },
  ];

  constructor(seoService: SeoService) {

    let metaTags = {
      title: 'Meet the Atila Team',
      description: 'Ann. Kitan. Manpreet. Tomiwa. Meet the people helping build Atila.',
      image: 'https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/public%2Fatila-team-header-2-new.png?alt=media&token=877be9e1-a694-44f8-8b31-f77e0d6958dc',
      slug: 'team',
    };
    seoService.generateTags(metaTags);
  }

  ngOnInit() {

  }

}
