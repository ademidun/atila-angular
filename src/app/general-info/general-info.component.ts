import { Component, OnInit } from '@angular/core';
import {MyFirebaseService} from '../_services/myfirebase.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {

  model: any = {};
  sendMessageResponse: any;
  internalReferral: any;

  sitemapData: any;
  constructor(
    public firebaseService: MyFirebaseService,
    public route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.internalReferral = this.route.snapshot.queryParams['atila_ref'];

    if(this.route.snapshot.url[0].path.indexOf('sitemap') > -1) {
      this.sitemapData = {
        "scholarships": [
          "https://atila.ca/scholarship/aist-steel-intern-scholarships",
          "https://atila.ca/scholarship/doreen-m-dinsdale-memorial-award",
          "https://atila.ca/scholarship/dr-ev-buchanan-prize",
          "https://atila.ca/scholarship/london-chapter-of-consulting-engineers-of-ontario-award",
          "https://atila.ca/scholarship/order-of-the-white-rose-scholarship",
          "https://atila.ca/scholarship/western-universityfirst-engineering-scholarship",
          "https://atila.ca/scholarship/dave-donley-memorial-scholarship",
          "https://atila.ca/scholarship/kpmg-developing-potential-accounting-scholarship",
          "https://atila.ca/scholarship/kpmg-developing-potential-marketing-scholarship",
          "https://atila.ca/scholarship/tacuna-systems-women-in-engineering-empowerment-scholarship",
          "https://atila.ca/scholarship/selenium-form-debug-encodable-filechuck",
          "https://atila.ca/scholarship/wow",
          "https://atila.ca/scholarship/1800wheelchairca-scholarship",
          "https://atila.ca/scholarship/7-binary-options-scholarship-essay-contest",
          "https://atila.ca/scholarship/american-pavilion-annual-general-education-scholarship",
          "https://atila.ca/scholarship/arctic-chiropractic-fairbanks-scholarship",
          "https://atila.ca/scholarship/flight-network-scholarship",
          "https://atila.ca/scholarship/flowmetrics-general-science-and-engineering-scholarship",
          "https://atila.ca/scholarship/global-lift-equipment-scholarship",
          "https://atila.ca/scholarship/horratio-alger-of-canada-scholarship",
          "https://atila.ca/scholarship/isee-western-chapter-scholarship",
          "https://atila.ca/scholarship/jccf-essay-contest",
          "https://atila.ca/scholarship/loran-scholar",
          "https://atila.ca/scholarship/rbc-students-leading-change-scholarship",
          "https://atila.ca/scholarship/sikh-foundation-scholarship",
          "https://atila.ca/scholarship/simple-mechanic-internet-marketing-scholarship-program",
          "https://atila.ca/scholarship/student-tour-deals-scholarships",
          "https://atila.ca/scholarship/the-rbc-black-history-month-student-essay-competition",
          "https://atila.ca/scholarship/bbpa-national-scholarships",
          "https://atila.ca/scholarship/blitz-sales-software-annual-scholarship",
          "https://atila.ca/scholarship/burger-king-scholars",
          "https://atila.ca/scholarship/canadian-assosciation-of-women-in-construction-bursary",
          "https://atila.ca/scholarship/hiline-coffee-scholarship",
          "https://atila.ca/scholarship/kin-canada-bursary",
          "https://atila.ca/scholarship/lead-roster-b2b-sales-marketing-scholarship",
          "https://atila.ca/scholarship/pretty-photoshop-actions-bi-annual-scholarship",
          "https://atila.ca/scholarship/rapidseedboxs-scholarship-for-computer-engineering-students",
          "https://atila.ca/scholarship/rbc-capital-markets-scholarship-diversity",
          "https://atila.ca/scholarship/rbc-capital-markets-scholarship-for-women",
          "https://atila.ca/scholarship/soroptimist-grants-for-canadian-women-graduate-students",
          "https://atila.ca/scholarship/soroptimist-live-your-dream-awards",
          "https://atila.ca/scholarship/thomas-g-flanagan-sc-scholarship",
          "https://atila.ca/scholarship/transportation-association-of-canada-scholarship",
          "https://atila.ca/scholarship/aia-and-the-university-of-the-aftermarket-foundation-uofaf-scholarship-program",
          "https://atila.ca/scholarship/ayn-rand-atlas-shrugged-essay-contest",
          "https://atila.ca/scholarship/ayn-rand-fountainhead-essay-contest",
          "https://atila.ca/scholarship/bill-7-award",
          "https://atila.ca/scholarship/canadas-luckiest-student",
          "https://atila.ca/scholarship/canadian-women-in-municipal-government-scholarship",
          "https://atila.ca/scholarship/cemf-rona-hatt-engineering-ambassador-award-in-chemical-engineering",
          "https://atila.ca/scholarship/fct-charitable-foundation-william-g-davis-scholarship",
          "https://atila.ca/scholarship/fraser-institute-student-essay-contest",
          "https://atila.ca/scholarship/novus-biologicals-scholarship-program",
          "https://atila.ca/scholarship/pretty-lightroom-presets-scholarship-program",
          "https://atila.ca/scholarship/retail-as-a-career-scholarship",
          "https://atila.ca/scholarship/tac-foundation-3m-canada-bob-margison-memorial-scholarship",
          "https://atila.ca/scholarship/african-leaders-of-tomorrow-scholarship",
          "https://atila.ca/scholarship/balandra-scholarship",
          "https://atila.ca/scholarship/bigsun-scholarship-2018",
          "https://atila.ca/scholarship/ctaa-undergraduate-scholarship",
          "https://atila.ca/scholarship/formswift-scholarship-program",
          "https://atila.ca/scholarship/husky-energy-aboriginal-students-scholarship",
          "https://atila.ca/scholarship/mastercard-foundation-scholars-program",
          "https://atila.ca/scholarship/microsoft-diversity-conference-scholarship",
          "https://atila.ca/scholarship/quesnel-woodlot-association-ted-kennedy-memorial-scholarship",
          "https://atila.ca/scholarship/shine-music-bursary",
          "https://atila.ca/scholarship/starfleet-scholarships",
          "https://atila.ca/scholarship/student-challenge-for-affordable-rental-housing",
          "https://atila.ca/scholarship/tough-turtle-turf-scholarship",
          "https://atila.ca/scholarship/aes-engineering-scholarship",
          "https://atila.ca/scholarship/arthur-and-theresa-macdonald-charitable-trust",
          "https://atila.ca/scholarship/central-scholarship-program",
          "https://atila.ca/scholarship/dorothy-corrigan-entrance-bursary",
          "https://atila.ca/scholarship/esperanza-education-fund-scholarship",
          "https://atila.ca/scholarship/maryland-senatorial-scholarship",
          "https://atila.ca/scholarship/saskatchewan-school-boards-association",
          "https://atila.ca/scholarship/sasktel-scholarship",
          "https://atila.ca/scholarship/2018-mahatma-gandhi-memorial-scholarships",
          "https://atila.ca/scholarship/achieve-atlanta-scholarship",
          "https://atila.ca/scholarship/arya-samaj-markham-youth-scholarship-program",
          "https://atila.ca/scholarship/ascend-educational-fund-scholarship",
          "https://atila.ca/scholarship/black-canadian-scholarship-fund",
          "https://atila.ca/scholarship/chelseas-light-foundation-academic-scholarship",
          "https://atila.ca/scholarship/churchs-community-scholarships",
          "https://atila.ca/scholarship/general-dynamics-land-systems-canada-proficiency-awards",
          "https://atila.ca/scholarship/georgia-futures-hope-scholarship",
          "https://atila.ca/scholarship/jean-ciriani-scholarship",
          "https://atila.ca/scholarship/jean-m-coon-humanitarian-award",
          "https://atila.ca/scholarship/mohamad-hanan-fakih-all-star-achievement-scholarship",
          "https://atila.ca/scholarship/san-diego-foundation-common-scholarship-application",
          "https://atila.ca/scholarship/trevor-linden-community-spirit-scholarship",
          "https://atila.ca/scholarship/walsh-john-e-computer-studies-award",
          "https://atila.ca/scholarship/william-siegel-scholarship-award",
          "https://atila.ca/scholarship/bristol-university-think-big-scholarships",
          "https://atila.ca/scholarship/canada-caricom-leadership-scholarships-program",
          "https://atila.ca/scholarship/carleton-entrance-awards-for-international-students",
          "https://atila.ca/scholarship/cranfield-sub-saharan-africa-merit-scholarship-in-leadership-and-management",
          "https://atila.ca/scholarship/drew-hildebrand",
          "https://atila.ca/scholarship/emerging-leaders-in-the-americas-program-elap",
          "https://atila.ca/scholarship/humber-international-entrance-scholarships",
          "https://atila.ca/scholarship/ontario-graduate-scholarship-ogs-program",
          "https://atila.ca/scholarship/sheffield-university-international-merit-undergraduate-scholarship-2018",
          "https://atila.ca/scholarship/terry-fox-humanitarian-award",
          "https://atila.ca/scholarship/vanier-canada-graduate-scholarships-vanier-cgs",
          "https://atila.ca/scholarship/mceuen-scholarship",
          "https://atila.ca/scholarship/association-of-food-drug-officials-scholarship",
          "https://atila.ca/scholarship/best-cat-info-student-scholarship",
          "https://atila.ca/scholarship/canadian-japanese-mennonite-scholarship",
          "https://atila.ca/scholarship/candices-sickle-cell-disease-scholarship",
          "https://atila.ca/scholarship/cool-dehumidifier-asthma-scholarship",
          "https://atila.ca/scholarship/dick-martin-scholarship-award",
          "https://atila.ca/scholarship/export-development-canada-international-business-scholarships",
          "https://atila.ca/scholarship/frank-j-richter-scholarship",
          "https://atila.ca/scholarship/gordon-hay-scholarship",
          "https://atila.ca/scholarship/john-evans-engineering-entrance-award",
          "https://atila.ca/scholarship/mensa-canada-scholarship",
          "https://atila.ca/scholarship/rapid-access-medical-scholarships",
          "https://atila.ca/scholarship/richard-and-elizabeth-dean-scholarship",
          "https://atila.ca/scholarship/seniorszen-scholarship",
          "https://atila.ca/scholarship/tourism-cares-academic-scholarships",
          "https://atila.ca/scholarship/bluestacks-scholarship",
          "https://atila.ca/scholarship/danielle-sandhu-leadership-award",
          "https://atila.ca/scholarship/engineers-canada-manulife-scholarship",
          "https://atila.ca/scholarship/tcdsb-student-achievement-award",
          "https://atila.ca/scholarship/technology-addiction-awareness-scholarship",
          "https://atila.ca/scholarship/cariati-law-college-scholarship",
          "https://atila.ca/scholarship/helmetgearlab-scholarship",
          "https://atila.ca/scholarship/odenza-vacations-scholarship",
          "https://atila.ca/scholarship/energyratesca-college-scholarship-2018",
          "https://atila.ca/scholarship/fccp-interest-free-student-loan",
          "https://atila.ca/scholarship/la-tutors-123-scholarship",
          "https://atila.ca/scholarship/paul-g-complin-memorial-scholarship",
          "https://atila.ca/scholarship/seniorcarecom-aging-matters-scholarship",
          "https://atila.ca/scholarship/sleep-importance-scholarship",
          "https://atila.ca/scholarship/beart-presets-academic-scholarship-program",
          "https://atila.ca/scholarship/the-expert-institutes-2017-healthcare-and-life-sciences-scholarship",
          "https://atila.ca/scholarship/dr-ethel-chapman-scholarship",
          "https://atila.ca/scholarship/zeqr-scholarship"
        ],
        "blogs": [
          "https://atila.ca/blog/rshamsy/how-to-get-a-research-internship-and-what-i-learned-through-research",
          "https://atila.ca/blog/orekitan/what-i-learnt-from-my-internship-in-nigeria-africa",
          "https://atila.ca/blog/tomiwa/phlock-my-hardware-startup-that-disappeared",
          "https://atila.ca/blog/tomiwa/building-atila-the-essential-software-startup-tech-stack",
          "https://atila.ca/blog/tomiwa/the-indian-model-what-china-and-nigeria-can-learn-from-india",
          "https://atila.ca/blog/atila/what-is-atila",
          "https://atila.ca/blog/tomiwa/why-i-write"
        ],
        "forums": [
          "https://atila.ca/forum/deciding-between-kinesiology-health-studies-or-medical-science",
          "https://atila.ca/forum/queens-chancellor-recipient-2016-and-queens-commerce-ama",
          "https://atila.ca/forum/whats-the-best-way-to-network-and-recruit-for-a-consulting-career",
          "https://atila.ca/forum/should-i-study-computer-science-software-or-computer-engineering",
          "https://atila.ca/forum/should-i-go-to-university-college-or-an-apprenticeship"
        ]
      };
    }
  }

  sendMessage() {
    this.firebaseService.saveAny('contact_form',this.model)
      .then(res=> {
        this.sendMessageResponse = 'Thank you. You will receive a response within 1 day.'
      } );
  }

  removeDomain(str: string) {
    return str.replace('https://atila.ca','')
  }
}
