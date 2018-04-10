import { Component, OnInit } from '@angular/core';
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
      "first_name": "Tomiwa",
      "last_name": "Ademidun",
      "username": "tomiwa",
      "position": "Founder",
      "img_url": "https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/user-profiles%2F1%2Fprofile-pictures%2Ffacebook-profile-picture.jpg?alt=media&token=143797ab-ef34-4a67-91d1-f55504f5b726",
      "description_1": "Tomiwa is currently taking a year off a dual degree in software engineering and business at Ivey Business School in Canada to start Atila.",
      "description_2": "He enjoys playing soccer and is a big Arsenal F.C. fan.",
      "link_type": "Website",
      "link_url": "http://tomiwa.ca"
    },
    {
      "first_name": "Manpreet",
      "last_name": "Singh",
      "username": "matharumanpreet",
      "position": "Engineering",
      "img_url": "https://scontent.fyto1-1.fna.fbcdn.net/v/t1.0-9/10351170_861597783896802_6247911242716139928_n.jpg?oh=d8b0644e41f299bb309cb7377d974622&oe=5B0A513E",
      "description_1": "Manpreet is currently studying computer technology at Seneca College.",
      "description_2": "Prior to Atila, Manpreet worked at RBC as a software developer.",
      "link_type": "LinkedIn",
      "link_url": "https://ca.linkedin.com/in/matharumanpreet"
    },
    {
      "first_name": "Ananya",
      "position": "Engineering",
      // "username": "Engineer",
      "img_url": "https://scontent.fyto1-1.fna.fbcdn.net/v/t1.0-9/22552858_1412415602202113_5425964300103171619_n.jpg?oh=f632de4e6b20a31f55e5130f465e845d&oe=5B08D226",
      "description_1": "Ananya is currently a master's computer science student at University of Waterloo.",
      "description_2": "She previously worked at Amazon as a software engineer",
      "link_type": "LinkedIn",
      "link_url": "https://ca.linkedin.com/in/ananya-3009"
    },
    {
      "first_name": "Brian",
      "last_name": "He",
      "position": "Engineering",
      "username": "BH",
      "img_url": "https://scontent.fyto1-1.fna.fbcdn.net/v/t31.0-8/13173392_10208125023714570_1061138361353955966_o.jpg?oh=34d6bfb288dbd700edc5310a4d8e1780&oe=5B05F46E",
      "description_1": "Brian is studying software engineering and business at Ivey Business School.",
      "description_2": "In the summer, Brian will be joining facebook as a software engineer.",
      "link_type": "LinkedIn",
      "link_url": "https://ca.linkedin.com/in/hebrian"
    },
    {
      "first_name": "Kitan",
      "last_name": "Ademidun",
      "position": "Engineer + Marketing",
      "username": "orekitan",
      "img_url": "https://scontent.fyto1-1.fna.fbcdn.net/v/t1.0-9/14237540_1196065180456920_3858531177241864113_n.jpg?oh=c8bc19db36d39f67779e3f7255b99a2e&oe=5B4B7162",
      "description_1": "Kitan is currently studying software engineering and is in the AEO program at Ivey Business School",
      "description_2": "Prior to Atila she worked at AXA Mansard, a Nigerian insurance company.",
      "link_type": "LinkedIn",
      "link_url": "https://www.linkedin.com/in/kitan-ademidun-881330149/"
    },
    {
      "first_name": "Ann",
      "last_name": "Mathulla",
      "username": "AnnMathulla",
      "position": "Product Manager",
      "img_url": "https://scontent.fyto1-1.fna.fbcdn.net/v/t1.0-9/15178296_963120957154483_6847353746981618246_n.jpg?oh=d2f678f3ebb0f9c9c85d5851f3ba4a16&oe=5B039270",
      "description_1": "Ann is currently studying business at Smith school of Business, Queen's University. She's also the recipient of the Queen's Chancellor scholarship.",
      "description_2": " Last summer, she worked at Financeit, an edtech startup acquired by Goldman Sachs.",
      "link_type": "LinkedIn",
      "link_url": "https://ca.linkedin.com/in/ann-mathulla"
    },
    {
      "first_name": "Madalitso",
      "last_name": "Mchaina",
      "username": "dill_mchaina",
      "position": "Engineering",
      "img_url": "https://scontent.fyto1-1.fna.fbcdn.net/v/t31.0-8/21083563_10154804494487091_9189518977606889948_o.jpg?oh=29e40b71745f5d88498b2b48fb1e0314&oe=5B4DD7ED",
      "description_1": "Madalitso is currently studying computer engineering and medical biophysics at Western University.",
      "description_2": "Last summer, he worked as a Biomedical Engineering Research Assistant at CSTAR (Canadian Surgical Technologies & Advanced Robotics) Research Lab.",
      "link_type": "LinkedIn",
      "link_url": "https://www.linkedin.com/in/madalitso-mchaina-247598138/"
    },
    {
      "first_name": "Mariam",
      "last_name": "Walaa",
      // "username": "Product Manager",
      "position": "Advisor",
      "img_url": "https://scontent.fyto1-1.fna.fbcdn.net/v/t1.0-1/28377469_10204156139741793_8293032094223382732_n.jpg?oh=3da6391b71fcc27f64c8c39a3c901901&oe=5B0FC80F",
      "description_1": "Mariam is currently studying business at Schulich school of Business, York University and is on a year off.",
      "description_2": "She is also the cofounder of <a  href=\"https://www.linkedin.com/company/nestcanada/\">edNEST</a>, an edtech community in Toronto.",
      "link_type": "LinkedIn",
      "link_url": "https://ca.linkedin.com/in/mariamwalaa"
    }
  ];

  constructor(seoService: SeoService) {

    let metaTags = {
      title: 'Meet the Atila Team',
      description: 'Meet the people helping build Atila.',
      image: 'https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/public%2Fatila-team-header-2-new.png?alt=media&token=877be9e1-a694-44f8-8b31-f77e0d6958dc',
      slug: 'team',
    };
    seoService.generateTags(metaTags);
  }

  ngOnInit() {

  }

}
