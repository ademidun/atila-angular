import {Component, OnInit, OnDestroy, HostListener, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

import { ScholarshipService } from "../_services/scholarship.service";

import { Router, ActivatedRoute } from '@angular/router';

import {NgModel} from '@angular/forms';
import { GooglePlaceDirective } from "../_directives/google-place.directive";
import {GoogleAnalyticsEventsService} from '../_services/google-analytics-events.service';
import {MatDialog} from '@angular/material';
import {SubscriberDialogComponent} from '../subscriber-dialog/subscriber-dialog.component';
import {UserProfileService} from '../_services/user-profile.service';
import {MyFirebaseService} from '../_services/myfirebase.service';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../_services/auth.service';
//import {GeocoderAddressComponent} from '@types/googlemaps'

//import 'googlemaps';
export class PreviewResponse {


  constructor(
  public location = {
  city: '',
  province: '',
  country: '',
  name: '',
  },
  public education_level :string[],
  public education_field :string[],
  public errors :string,
    ) { }
}


@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit, OnDestroy {

    EDUCATION_LEVEL = [
    'Secondary School',
    'University',
    'College',
    'Workplace or Apprenticeship',
  ];

    blogs = [
    {
      "id": 9,
      "title": "How I got interviews at Google, Facebook and Bridgewater",
      "slug": "how-i-got-interviews-at-google-facebook-and-bridgewater",
      "alternate_slugs": [
        "got-interviews-google-facebook-bridgewater"
      ],
      "dummy_field_detect_migrations_heroku": null,
      "date_created": "2018-03-27T13:17:20Z",
      "description": "Last summer, I decided that I wanted to work at a top tech company such as Google or Bridgewater. Problem. I didn't go to a target school, my grades were just okay and I had little work experience. If I wanted to get a chance at these companies I would have to get creative.",
      "header_image_url": "https://lh6.googleusercontent.com/U1oHmeuzUcMbPLHFhpDHc_8KsFWq7IX_jE6kUBl1svTSnffIukAjJ0QDgfXJCdZ_rONXiZzhtNnz3CrFMDEnrIrMc5MpnWcSuUfEURbNRFM9lxYPN6qDMSMHPqC02h9o0pO9UlUP",
      "published": true,
      "up_votes_count": 0,
      "down_votes_count": 0,
      "up_votes_id": [],
      "down_votes_id": [],
      "user": {
        "first_name": "Tomiwa",
        "last_name": "Ademidun",
        "username": "tomiwa",
        "profile_pic_url": "https://firebasestorage.googleapis.com/v0/b/atila-7-dev/o/user-profiles%2F4%2Fprofile-pictures%2Fgithub-profile-picture.jpeg?alt=media&token=4d2ba5a2-e4d8-46e3-8323-e63a65b356cb",
        "title": "Software Engineering Student",
        "post_secondary_school": "",
        "secondary-school": "",
        "id": 4
      },
      "contributors": [],
      "metadata": {
        "comments_count":1
      }
    },
    {
        "id": 7,
        "title": "How to Get a Research Internship and What I Learned Through Research",
        "slug": "how-to-get-a-research-internship-and-what-i-learned-through-research",
        "alternate_slugs": [],
        "dummy_field_detect_migrations_heroku": null,
        "body": "<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt; text-align: center;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Source: </span><a href=\"http://enjoy-teaching.com/enjoy-teaching-scientific-method.html\" style=\"text-decoration: none;\" target=\"_blank\"><span style=\"font-size: 13pt; font-family: Arial; color: #1155cc; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: underline; -webkit-text-decoration-skip: none; text-decoration-skip-ink: none; vertical-align: baseline; white-space: pre-wrap;\">Enjoy Teaching, 2015</span></a></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong id=\"docs-internal-guid-7835c006-5ba9-be94-3d70-c56722e4262d\" style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.2; margin-top: 4pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">What I did Last Summer</span></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Why do Research?</span></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">How is Research organized, and what types of research are there?</span></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">How I Got the Research Position</span></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">What You Should Do</span></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Other Thoughts on Research:</span></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt; text-indent: 36pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Domain Expertise and Problem Finding</span></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt; text-indent: 36pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Earning some money</span></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">What I Would Do Differently</span></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Conclusion</span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<h2 dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 6pt;\"><span style=\"font-size: 18pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">What I did Last Summer</span></h2>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Last Summer I did a research project with the Electrical and Computer Engineering department on smart building energy consumption predictions. You can see some of </span><a href=\"https://github.com/rshamsy/Summer-Research\" style=\"text-decoration: none;\" target=\"_blank\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">my work</span></a><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\"> here. This is a field where I had limited exposure to and no relationships with professors doing research in this field. Despite those initial shortcomings I was able to get a research position where I learnt a lot. This article will explain how I was able to get a research internship despite my limited initial knowledge and some advice on how you can do the same and a few important lessons I learnt. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 16pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\"><span style=\"font-size: 18pt;\">Why do Research</span> </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"> </p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">In its most basic sense, research is the process of investigating how a problem can be solved. The ‘scientific’ process, which is constantly hypothesizing (how the problem can be solved), creating tests, testing hypotheses, gaining insight, hypothesizing again, and repeating the process -  is a great tool in figuring that out. Having a knack for experimenting is truly valuable, not only in research but in one’s career, that research prepares you for a way of thinking about problems. It keeps you humble - you don’t know the answer to a question, but you have calculated guesses of what they may be, so you test it out. This process is the backbone of anything that requires creation, be it a startup (check out </span><a href=\"https://www.amazon.com/Lean-Startup-Entrepreneurs-Continuous-Innovation/dp/0307887898\" style=\"text-decoration: none;\" target=\"_blank\"><span style=\"font-size: 13pt; font-family: Arial; color: #1155cc; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: underline; -webkit-text-decoration-skip: none; text-decoration-skip-ink: none; vertical-align: baseline; white-space: pre-wrap;\">The Lean Startup</span></a><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\"> by Eric Ries), a product (that requires design thinking), or creating knowledge for the benefit of others. Research puts you in the habit of cycling through this scientific method, and that is invaluable. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"> </p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Academic research, as far as my experiences go, requires learning quickly, and applying those learnings as you go. As an example, before I could begin working with the building’s energy data, I had to learn about statistical modelling tools like machine learning, and what form of data was necessary. I then had to translate this into visualizing, cleaning and wrangling the data, using Python packages such as Matplotlib, seaborn, Pandas and SciPy to work with the data. Learning quickly and applying learnings effectively was very important, and this is a skill I have developed through research, thankfully. Not only that, but getting research guidance and supervision from professors and post-doctoral students was immensely helpful, as I could draw from others’ learnings and adopt best practices. Best practices, and doing what you are doing to the best standard is very pivotal in research and in one’s career in general. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<h2 dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 6pt;\"><span style=\"font-size: 16pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\"><br class=\"kix-line-break\"/></span><span style=\"font-size: 18pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">How is Research organized, and What Types of Research are There</span></h2>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Professors at universities are usually part of broader research groups, which share a research theme. Each professor would specialize in a certain sub-area that they are interested in; they will have multiple students they supervise in research projects. You should browse the ‘Research’ link on your university/faculty-of-interest’s website, and browse through the various research work that is performed. As an example, Civil Engineering research work done at my school can be found in the following link - the links in this website lead to specific research groups (e.g. FIDS) - </span><a href=\"https://www.eng.uwo.ca/civil/research/index.html\" style=\"text-decoration: none;\" target=\"_blank\"><span style=\"font-size: 13pt; font-family: Arial; color: #1155cc; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: underline; -webkit-text-decoration-skip: none; text-decoration-skip-ink: none; vertical-align: baseline; white-space: pre-wrap;\">https://www.eng.uwo.ca/civil/research/index.html</span></a><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Every research project undertaken by professors at universities are aimed at solving certain problems. Nonetheless, some problems that professors are working on involve directly solving a practical issues (e.g. projecting insurance risks based on climate modelling, using statistics), whereas others involve indirectly solving practical issues (e.g. making improvements to statistical modelling tools, which will then be used to more accurately solve practical problems). Making this distinction when browsing research work is important, and I advise you to understand what type of research you want to work on. This will help you narrow down the various opportunities. Both types have their benefits and drawbacks, but it all depends on what YOU are after, and you should pursue opportunities YOU are most interested in. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"><br/><br/><br/></strong></p>\n<h2 dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 6pt;\"><span style=\"font-size: 18pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">How I Got the Research Position</span></h2>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Machine learning is a field which I’m very interested in and my goal is to start a company in that field. But, I felt like there was a skill gap between what I knew and what I needed to know in order to build something. I felt like a research internship would be a great way to learn a lot about a very technical field while being advised by knowledgeable professors, fellow researchers and gaining industry exposure. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Once I knew that I wanted to do a research internship, I sifted through researchers’ profiles at Western, and came across my supervisor’s research group. I also reached out to one of my professors (who taught me in first year), expressing my interest in learning about applying machine learning - I learned about research work being done in the area at Western. Doing both (researchers’ websites, and reaching out to professors) exposed me to multiple options - I used this information to cast a wide net. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">I was particularly interested in a professor, who applied machine learning to smart building technologies within the ECE department at Western. As a Civil Engineering student, I had come across the statistic that Buildings consume more than 40% of electricity in America - this to me was an area where energy efficiency could lead to positive environmental effects. How could I resist such an opportunity? Learn how to apply something I was interested in, and create a positive impact. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Usually, professors link information for summer undergraduate researchers on their personal or research-group websites. That would be the first place to start - shows who wants help for the summer, and who may not. Instead of blindly applying, I would suggest you go speak to the professor, especially if you lack the skills. But before you go meet the professor, you need to show that what you lack in skills, you make up for in hard work and commitment to continuous learning. Learn something related in the field and SHOW that you are committed, rather than just saying that you are. This is essentially what I did to secure the opportunity. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">The first time I emailed my professor, she made it clear that she was very busy and that she couldn’t meet. At that point, I thought to keep the conversation going, and mentioned how I would like to meet for advice on how to learn in order to build skills for research in the future. Once she returned from her travels, she agreed to meet me and from there it was how well I sold my learning abilities. I truly had to hustle to learn and get to meet her. Lots of luck involved, but lots of hard work as well. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Seeing that I was dedicated to learn and contribute to the group’s work, she brought me on as a Summer Research Associate and I was fortunate to get a scholarship as well. I was offered a position working with the university’s Facilities Management department on on-campus building efficiency. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<h2 dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 6pt;\"><span style=\"font-size: 18pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">What You Should Do</span></h2>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">In summary, the steps YOU should follow (in my opinion) if you want to seek a position:</span></p>\n<ol style=\"margin-top: 0pt; margin-bottom: 0pt;\">\n<li dir=\"ltr\" style=\"list-style-type: decimal; font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Think about where you want to be in a few years, and work backwards to figure out what skills you need (Directly vs Indirectly Applied Research; Which domain-related problem you want to explore; What researching tools do you want to learn - data analysis or test creation techniques)</span></p>\n</li>\n<li dir=\"ltr\" style=\"list-style-type: decimal; font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Reach out to professors who you have a good relationship with (you should seek to build these relationships throughout undergrad - they are very knowledgeable and truly want to help). Ask them about what research they know of where you can build those skills and apply them</span></p>\n</li>\n<li dir=\"ltr\" style=\"list-style-type: decimal; font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Do your own research - your faculty/faculty-of-interest will have a ‘Research’ link on their website. Look at the various research groups, and research professors. Start by a first pass - shortlist those that interest you while you read about their work. </span></p>\n</li>\n<li dir=\"ltr\" style=\"list-style-type: decimal; font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Learn more about the work that each of the shortlisted professors do. Do your own research in those areas (Google!), and make sure they:</span></p>\n</li>\n<ol style=\"margin-top: 0pt; margin-bottom: 0pt;\">\n<li dir=\"ltr\" style=\"list-style-type: lower-alpha; font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Have a strong link to your skill development goals</span></p>\n</li>\n<li dir=\"ltr\" style=\"list-style-type: lower-alpha; font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Keep you engaged</span></p>\n</li>\n</ol>\n<li dir=\"ltr\" style=\"list-style-type: decimal; font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">You should arrive at 3-5 professors you would really want to work with. </span></p>\n</li>\n<li dir=\"ltr\" style=\"list-style-type: decimal; font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Start with your top-choice, and do some self-learning, if you don’t know anything about the field they are in/the tools they use. I didn’t know much about Machine Learning, so I went ahead and did a mini online course. </span></p>\n</li>\n<li dir=\"ltr\" style=\"list-style-type: decimal; font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Reach out to the professor, mention how you are interested in the work they do, tell them you are interested in the area they are doing research in, and the tools they are using. Relate to what you have learned about the tools, and ask them specific questions about how they are using those tools in their research (be genuinely curious). Arrange a meeting with them, but make it about learning from them (Not about you doing summer research with them!). </span></p>\n</li>\n<li dir=\"ltr\" style=\"list-style-type: decimal; font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">When you meet the professor, speak about their work, and ask those specific questions. Start with general questions (why they research in that area, and what work they have done in the past) and then go to specific (asking questions about the specific research that interests you). Most of the conversation should be ABOUT the research work they do. Mention how you have done self-learning, and that is what makes you curious. Ideally, they should see your interest as commendable, and that makes it easier for the next step. </span></p>\n</li>\n<li dir=\"ltr\" style=\"list-style-type: decimal; font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Ask them in the meeting - towards the end - if you can help with the research they are doing because (as you will have proven) - it genuinely piques your interest. </span></p>\n</li>\n</ol>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<h2 dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 6pt;\"><span style=\"font-size: 18pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Other Thoughts on Research:</span></h2>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<h3 dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 16pt; margin-bottom: 4pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #434343; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Domain Expertise and Problem Finding:</span></h3>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Sometimes, research in one area will make you realize of other areas that require problem-solving. This could manifest itself as a business idea, or a further research project idea. Over time, I have noticed that successful companies have been created as a result of commercializing academic research. More specifically by applying researched problems to practical scenarios. There are many big (and obvious) companies in this categories, such as Google and , but there are many less mainstream companies such as </span><a href=\"https://betakit.com/machine-learning-startup-maluuba-raises-9-million-series-a/\" style=\"text-decoration: none;\" target=\"_blank\"><span style=\"font-size: 13pt; font-family: Arial; color: #1155cc; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: underline; -webkit-text-decoration-skip: none; text-decoration-skip-ink: none; vertical-align: baseline; white-space: pre-wrap;\">Maluuba</span></a><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\"> (acquired by Microsoft), </span><a href=\"https://www.utoronto.ca/news/french-cosmetics-giant-buys-u-t-beauty-tech-startup\" style=\"text-decoration: none;\" target=\"_blank\"><span style=\"font-size: 13pt; font-family: Arial; color: #1155cc; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: underline; -webkit-text-decoration-skip: none; text-decoration-skip-ink: none; vertical-align: baseline; white-space: pre-wrap;\">ModiFace</span></a><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\"> (acquired by L’Oreal), that have been started either through specific researchers or by experienced researchers. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<h3 dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 16pt; margin-bottom: 4pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #434343; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Earning some money:</span></h3>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">There is lots of money is available for research. Here are some good resources to get you started:</span></p>\n<ul style=\"margin-top: 0pt; margin-bottom: 0pt;\">\n<li dir=\"ltr\" style=\"list-style-type: disc; font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: -18pt; margin-bottom: 0pt;\"><a href=\"http://www.nserc-crsng.gc.ca/Students-Etudiants/UG-PC/USRA-BRPC_eng.asp\" style=\"text-decoration: none;\" target=\"_blank\"><span style=\"font-size: 13pt; font-family: Arial; color: #1155cc; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: underline; -webkit-text-decoration-skip: none; text-decoration-skip-ink: none; vertical-align: baseline; white-space: pre-wrap;\">NSERC Undergraduate Student Research Awards (USRA)</span></a></p>\n</li>\n<li dir=\"ltr\" style=\"list-style-type: disc; font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Research scholarships offered by your school - check your school’s scholarship offerings</span></p>\n</li>\n</ul>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<h2 dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 6pt;\"><span style=\"font-size: 18pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">What I Would Do Differently</span></h2>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">From the onset, my research project was loosely defined. This could be a good thing, as it may allow for the flexibility that IS required in research, as you are constantly iterating and updating your assumptions. You MUST be comfortable with uncertainty if you are to do research - from the definition of the research project, to how you would answer the questions asked. Perhaps having a loosely defined project is not best practice; perhaps ‘best practice’ is relative. Regardless, I wish I ‘embraced the uncertainty’ more than I did. You need to realize that you are getting frustrated, and you need to stop. I thank my post-doctoral advisors who consistently reminded me of this, and that helped me a lot. After all, I was getting a real taste of research - not too sure how I feel about that still. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Because my supervisor was on sabbatical leave during the period (and therefore intermittently on campus), it was difficult to build a working relationship with her. Nonetheless, the post-doctoral researchers in her group made up for her absence, for which I am truly grateful. This was surprising to me in the beginning, as I was expecting to work closely with the head of the group (the professor) herself. As far as expectations go, you should make sure who you will work with, as that may affect whether or not the learning opportunity is attractive - what you will achieve may be a function of how strong your direct-supervisors are. I was lucky to have worked with post-docs and other professors who were truly helpful, but it would have helped to have that clear from the onset. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<h2 dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 6pt;\"><span style=\"font-size: 16pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Conclusion</span></h2>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">There’s lots that I could talk about, but the most important things are the following:</span></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Self-learning is an exceptional skill to have, and I have not witnessed faster learners than the post-docs at the research group I was with. They were notorious about learning quickly, learning the most important aspects of what you need, and quickly applying what you learn to create something valuable. I am nowhere near emulating the level of learning these postdocs were undertaking, but I am much closer than I was before. It has helped me to continue learn about a variety of topics I have been interested over the past year - Machine Learning, How the Internet Works, How Blockchain Works, and many more. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Research is a great way to bridge your schooling knowledge to real-life application of the knowledge. This will prepare you for more fruitful career opportunities, as it will equip you with invaluable skills and knowledge specific to the domain you are researching in, and general to research. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">In the end, ås hard as you may work, there may be factors out of your control. For me, the quality of the data I was provided was the real constraint, as it lacked the specificity and feature-detailing required for creating an accurate supervised predictive model. Coming to terms with this possibility may prepare you better for such situations. Again, as a first-time undergraduate researcher, it should be about learning and the process of research - not the outcome. With subsequent research projects, focusing on the result may be more wise. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">If there is anything I have missed, or gotten incorrect, I would love to know so I can learn about it. I would also love to answer any questions that you may have. Reach out to me on Twitter </span><a href=\"https://twitter.com/rahimshamsy\" style=\"text-decoration: none;\" target=\"_blank\"><span style=\"font-size: 13pt; font-family: Arial; color: #1155cc; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: underline; -webkit-text-decoration-skip: none; text-decoration-skip-ink: none; vertical-align: baseline; white-space: pre-wrap;\">@RahimShamsy</span></a><span style=\"font-size: 13pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">. </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><br/><br/></p>",
        "date_created": "2018-03-25T04:40:37.235094Z",
        "description": "Last Summer I did a research project with the Electrical and Computer Engineering department on smart building energy consumption. This article will explain how I was able to get a research internship despite my limited initial knowledge and some advice on how you can do the same and a few important lessons I learnt.",
        "header_image_url": "https://lh4.googleusercontent.com/KNwXlOrE-ehxIfBBi0Dii71VSOdJ44DNZq9z5inZ5LOGIOeXnwNrnkXlom6BL2I0MiUMp1uK0MYp1Ao1PpyGxOyJhVEHhtXITM6hSQxIf5v5FrJXZfXR6MFz_zl5qiwRDOTRq4XE",
        "published": true,
        "up_votes_count": 0,
        "down_votes_count": 0,
        "up_votes_id": [],
        "down_votes_id": [],
        "metadata": {
          "comments_count": 0,
        },
        "user": {
          "first_name": "Rahim",
          "last_name": "Shamsy",
          "username": "rshamsy",
          "profile_pic_url": "https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/user-profiles%2F116%2Fprofile-pictures%2Frahim-profile-pic.jpg?alt=media&token=f4970d20-c0e2-4728-aa0f-3fea9ba6a656",
          "title": "",
          "post_secondary_school": "",
          "secondary-school": "",
          "id": 116
        },
        "contributors": [],
      },
    {
        "id": 9,
        "title": "Starting A Dating Company While in University",
        "slug": "starting-a-dating-company-while-in-university",
        "alternate_slugs": [],
        "dummy_field_detect_migrations_heroku": null,
        "body": "<p><span id=\"docs-internal-guid-31d61bcf-64da-f984-2474-a37e9d536e9c\"> </span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">While my friends were getting ready for graduation and trying to find full time jobs I decided to start </span><a href=\"https://itunes.apple.com/ca/app/lucid-see-who-likes-you/id1219887468?mt=8\" rel=\"noopener\" style=\"text-decoration: none;\" target=\"_blank\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">a dating company</span></a><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">, while overloading a full-time dual degree in computer science and business. Hectic would be an understatement.</span></p>\n<h2 dir=\"ltr\" style=\"line-height: 1.38; margin-top: 18pt; margin-bottom: 6pt;\"><span style=\"font-size: 18pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">What is Lucid</span></h2>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt; text-align: center;\"><strong id=\"docs-internal-guid-31d61bcf-64db-62da-52e1-045d957a3f17\" style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><a href=\"https://itunes.apple.com/ca/app/lucid-see-who-likes-you/id1219887468?mt=8\" rel=\"noopener\" style=\"text-decoration: none;\" target=\"_blank\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #1155cc; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: underline; -webkit-text-decoration-skip: none; text-decoration-skip-ink: none; vertical-align: baseline; white-space: pre-wrap;\">Lucid</span></a><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\"> is a dating app for your friends, network and people at your school. It is basically everyone you would know or at least see around you. It could include your crush, people who you wonder if they like you and people you probably have feelings for but haven’t expressed it.</span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt; text-align: center;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">We grew pretty fast in the first months using a couple facebook posts, gaining 400+ users in the first week. Check us out, here’s our link: </span><a href=\"http://lucid.fyi\" rel=\"noopener\" style=\"text-decoration: none;\" target=\"_blank\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #1155cc; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: underline; -webkit-text-decoration-skip: none; text-decoration-skip-ink: none; vertical-align: baseline; white-space: pre-wrap;\">lucid.fyi</span></a></p>\n<h2 dir=\"ltr\" style=\"line-height: 1.38; margin-top: 18pt; margin-bottom: 6pt;\"><span style=\"font-size: 18pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">What It's Like Running a Dating Company During School</span></h2>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt; text-align: center;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">It is pretty hectic, I overloaded my courses to gain time and thus juggling the app development was pretty hard. I pretty much only studied for my exams and got 80%+ on them by not sleeping for couple days before the exam. On the other hand, I have never struggled with courses so it was easier to manage for me.</span></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt; text-align: center;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">As well, there is a lot more than just developing the app you have to handle, there is marketing the app, maintaining and also trying to come up with ways to improve or gain more users which all take up time and effort.</span></p>\n<h2 dir=\"ltr\" style=\"line-height: 1.38; margin-top: 18pt; margin-bottom: 6pt;\"><span style=\"font-size: 18pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">A Few Things I Learnt</span></h2>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Few points:</span></p>\n<ul style=\"margin-top: 0pt; margin-bottom: 0pt;\">\n<li dir=\"ltr\" style=\"list-style-type: disc; font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Your first version isn’t good and will change a lot</span></p>\n</li>\n<li dir=\"ltr\" style=\"list-style-type: disc; font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">It’s harder than just making something people want because there’s more steps</span></p>\n</li>\n<li dir=\"ltr\" style=\"list-style-type: disc; font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Take time to schedule interviews with people who are using your app actively and follow their insights if you run out of ideas</span></p>\n</li>\n<li dir=\"ltr\" style=\"list-style-type: disc; font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Don’t try to add a lot of features in because you won’t be able to and people don’t care unless a lot of other people are using the same features</span></p>\n</li>\n<li dir=\"ltr\" style=\"list-style-type: disc; font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">For marketing, strive for conversion (getting people to download) instead of awareness because when you’re a young company, you have to first show your product in use otherwise money is wasted because awareness is usually excuse for just a load of people who won’t download or care.</span></p>\n</li>\n<li dir=\"ltr\" style=\"list-style-type: disc; font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Find or get to know people who are “influential” in your community or online, always useful no matter what</span></p>\n</li>\n<li dir=\"ltr\" style=\"list-style-type: disc; font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">If an app feature needs a lot of explaining and instructions, the chances of it actually getting used is very little.</span></p>\n</li>\n</ul>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt; text-align: center;\"><strong style=\"font-weight: normal;\"> </strong></p>\n<h2 dir=\"ltr\" style=\"line-height: 1.38; margin-top: 18pt; margin-bottom: 6pt;\"><span style=\"font-size: 18pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Other Random Questions</span></h2>\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt; text-align: center;\"> </p>\n<ul style=\"margin-top: 0pt; margin-bottom: 0pt;\">\n<li dir=\"ltr\" style=\"list-style-type: disc; font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: bold; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: bold; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">What are the most fun and rewarding parts of Running Lucid?</span></p>\n</li>\n<ul style=\"margin-top: 0pt; margin-bottom: 0pt;\">\n<li dir=\"ltr\" style=\"list-style-type: circle; font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Seeing people get excited about using the app and then telling their friends on social media, there has also been a lot of learning but I wouldn’t call that fun.</span></p>\n</li>\n</ul>\n<li dir=\"ltr\" style=\"list-style-type: disc; font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: bold; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: bold; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">What are some hard parts of running Lucid?</span></p>\n</li>\n<ul style=\"margin-top: 0pt; margin-bottom: 0pt;\">\n<li dir=\"ltr\" style=\"list-style-type: circle; font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Developing some stuff but that really has just consumed time. The hardest parts is still figuring out what people want from the app and marketing it.</span></p>\n</li>\n</ul>\n<li dir=\"ltr\" style=\"list-style-type: disc; font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: bold; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: bold; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Any advice for aspiring student entrepreneurs?</span></p>\n</li>\n<ul style=\"margin-top: 0pt; margin-bottom: 0pt;\">\n<li dir=\"ltr\" style=\"list-style-type: circle; font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre;\">\n<p dir=\"ltr\" style=\"line-height: 1.38; margin-top: -18pt; margin-bottom: 0pt;\"><span style=\"font-size: 13.999999999999998pt; font-family: Arial; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">Don’t do it unless you really want to, its a roller coaster ride.</span></p>\n</li>\n</ul>\n</ul>",
        "date_created": "2018-03-27T00:29:11Z",
        "description": "While my friends were getting ready for graduation and trying to find full time jobs I decided to start a dating company, while overloading a full-time dual degree in computer science and business. Hectic would be an understatement.",
        "header_image_url": "https://lh6.googleusercontent.com/Je3UMTLTs4y_fDcbk9iZIT9sDReM7hagbKHUz5PevY4erS_CKFWSdsws5HII7SuFvloWCAxSyteRmlyEiwRpoz7fa7IAXmyn5SXOIPMJwMra9WdQ1VbbL3WIC7UHKG8ZRYUqdleY",
        "published": true,
        "up_votes_count": 0,
        "down_votes_count": 0,
        "up_votes_id": [],
        "down_votes_id": [],
        "metadata": {
          "comments_count": 0,
        },
        "user": {
          "first_name": "Michael",
          "last_name": "Ding",
          "username": "mding5692",
          "profile_pic_url": "https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/user-profiles%2F17%2Fprofile-pictures%2Fmding-profile-pic.jpg?alt=media&token=11da0398-d23b-4090-9b59-fda1dfbd35cd",
          "title": "",
          "post_secondary_school": "",
          "secondary-school": "",
          "id": 17
        },
        "contributors": []
      },
  ]

    EDUCATION_FIELD = [
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


    model = new PreviewResponse({
    city: '',
    province: '',
    country: '',
    name: '',
    },[],[],'');

    /**
    * If the Google Places API is not working, only ask for city.
    */
    public locationPlaceHolder = 'City, Province or Country';
    public subscriber: any = {};
    @ViewChild('trySearch') public popover: NgbPopover;
    constructor(
    public scholarshipService: ScholarshipService,
    public firebaseService: MyFirebaseService,
    public router: Router,
    public googleAnalyticsEventService: GoogleAnalyticsEventsService,
    public dialog: MatDialog,
    public authService: AuthService,
    ) {

    }

  ngOnInit() {

    $(function(){
      $('iframe.lazy-load-element').attr('src', '//www.youtube.com/embed/c_K4342WMwQ?cc_load_policy=1');
    });

  }

  ngOnDestroy() {
    document.body.style.backgroundColor = null;
  }
  /**
   * Adding Google Places API Autocomplete for User Location:
   * @param {google.maps.places.PlaceResult} placeResult
   * https://developers.google.com/maps/documentation/javascript/reference#PlaceResult
   * https://developers.google.com/maps/documentation/javascript/places-autocomplete#address_forms
   * https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
   * https://stackoverflow.com/questions/42341930/google-places-autocomplete-angular2
   */
  placeAutoComplete(placeResult:any, locationModel: NgModel){ //Assign types to the parameters place result is a PlaceResult Type, see documentation


    this.predictLocation(this.model.location, placeResult);

  }

  /**
   * Translate the PlaceResult object into an Atila location object, containing only the city, province/state and country.
   * @param location
   * @param placeResult
   */
  predictLocation(location, placeResult){
    var addressComponents = placeResult.address_components ;

    var keys = ['city', 'province', 'country'];

    //TODO: Find a more elegant solution for this.


    addressComponents.forEach((element, i, arr) => {
      if (i == 0) {
        this.model.location.name = element.long_name;
      }
      if(element.types[0]=='locality' || element.types[0]=='administrative_area_level_3' ||  element.types[0]=='postal_town'||  element.types[0]=='sublocality_level_1'){
        this.model.location.city = element.long_name;
      }

      if(element.types[0]=='administrative_area_level_1'){
        this.model.location.province = element.long_name;
      }

      if(element.types[0]=='country'){
        this.model.location[element.types[0]] = element.long_name;
      }
    });



  }
/**
 * If the Google Place API did not load, then change the placeholder message to only ask for a city (or country?).
 */
  googlePlaceNoLoad(){
    this.locationPlaceHolder = 'City'
  }

  /**
   * If user presses enter on location button, don't allow the form to submit because we still need to pull the location Data from Google Maps.
   */
  keyDownHandler(event: Event) {

    if((<KeyboardEvent>event).keyCode == 13) {

      event.preventDefault();
    }
    //TODO! Change this, allow user to submit with enterButton.
  }

  onSubmit(form: NgForm){


    if (form.value['education_field'].length==0 && form.value['education_level'].length==0 && form.value['location'] == '') {
      this.model.errors = 'Please enter at least one field.';

      return;
    }

    else {
      delete this.model.errors;
    }

    this.subscriber.action = 'preview_scholarship';
    this.subscriber.preview_choices = this.model;

    this.firebaseService.saveUserAnalytics(this.subscriber,'preview_scholarship')
      .then(res => {
        },
        err => {});

    // TODO What's the proper way of saving form values with Google Analytics

    this.googleAnalyticsEventService.emitEvent("userCategory", "previewAction", JSON.stringify(this.model.location), 1)


    this.scholarshipService.setScholarshipPreviewForm(this.model)
      .then(
      res => this.router.navigate(['scholarship']))  //use promise to ensure that form is saved to Service before navigating away

}

  addSubscriber(event?: KeyboardEvent) {

    if(!this.subscriber.email) {
      this.subscriber.response ='Please enter email.';
      return;
    }

    if(event){
      event.preventDefault();
      this.subscriber.dialog_open_event = event.key;
    }
    else {
      this.subscriber.dialog_open_event = 'ButtonClick';
    }



    this.subscriber.utm_source =       'preview_scholarships';
    let dialogRef = this.dialog.open(SubscriberDialogComponent, {
      width: '300px',
      data: this.subscriber,
    });

    dialogRef.afterClosed().subscribe(
      result => {
              this.subscriber = result;

              if (this.subscriber) {
              this.subscriber.dialog_submit_event = result.dialog_submit_event || 'ButtonClick';

                this.firebaseService.addSubscriber(this.subscriber)
                  .then(res => {
                      this.subscriber.response ='Successfully subscribed to Atila 😄.';
                    },
                    err => this.subscriber.response ='Add Subscriber error, try again.')
              }
              else {
                this.subscriber = {};
                this.subscriber.response ='Please enter subscription information 😄.';
              }

            });




  }


  toggleSearchModal(data?:any){

    // disable search Modal until we figure out how to make it less annoying

    if(this){
      return;
    }
    if(data && data['toggle']) {
      const isOpen = this.popover.isOpen();
      if(isOpen){
        this.popover.close()
      }
      else{
        this.popover.open()
      }
      return;
    }

    // TODO check to see if we have already asked user to prevent repetitve asking
    // if(this.userProfile) {
    //   if (!this.userProfile.preferences['try_search_reminder']) {
    //     this.userProfile.preferences['try_search_reminder'] = new Date().getTime();
    //     this.userProfileService.updateHelper(this.userProfile).subscribe();
    //   }
    //   else {
    //     return;
    //   }
    // }

    const isOpen = this.popover.isOpen();
    if(isOpen){
      this.popover.close()
    }
    else{
      this.popover.open()
    }
  }


}
