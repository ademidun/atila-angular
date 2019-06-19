import {Injectable} from '@angular/core';

import {Meta, Title} from '@angular/platform-browser';

import * as $ from 'jquery';
import {environment} from '../../environments/environment';
import {MyFirebaseService} from './myfirebase.service';

// https://angularfirebase.com/lessons/seo-angular-part-1-rendertron-meta-tags/#Setting-Social-Media-Meta-Tags-in-Angular
@Injectable()
export class SeoService {

  constructor(private meta: Meta,
              public titleService: Title) {
  }

  generateTags(config) {
    /*
    // default values
    config = {
      title: 'Atila | Easily Find and Apply to Scholarships. The Right Way.',
      description: 'Easily find and apply to scholarships.
      Learn and share information about education, career and life.',
      image: 'https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/public%2Fatila-image-preview-jun-19-2019.png?alt=media&token=bd4ec128-8261-4957-8ff1-06566b911f0b',
      slug: '',
    };

    */

    config.title = config.title + ' - Atila';
    this.titleService.setTitle(config.title);
    if (config.image) {
      this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    }
    else {
      this.meta.updateTag({name: 'twitter:card', content: 'summary'});
    }
    this.meta.updateTag({name: 'twitter:site', content: '@atilatech'});
    this.meta.updateTag({name: 'twitter:title', content: config.title});
    this.meta.updateTag({name: 'twitter:description', content: config.description});
    this.meta.updateTag({name: 'twitter:image', content: config.image});

    this.meta.updateTag({property: 'og:type', content: 'article'});
    this.meta.updateTag({property: 'og:site_name', content: 'Atila'});
    this.meta.updateTag({property: 'og:title', content: config.title});
    this.meta.updateTag({property: 'og:description', content: config.description});
    this.meta.updateTag({property: 'og:image', content: config.image});
    this.meta.updateTag({property: 'og:url', content: `https://atila.ca/${config.slug}`});

    // ['name','description','image'].forEach(tag => {
    //   this.meta.removeTag(tag)
    // });

    try {
      if ($) {
        $('meta[itemprop="name"]').attr('content', config.title);
        $('meta[itemprop="description"]').attr('content', config.description);
        $('meta[name="Description"]').attr('content', config.description);
        $('meta[name="description"]').attr('content', config.description);
        $('meta[itemprop="image"]').attr('content', config.image);
      }
    }
    catch (e) {
      this.meta.updateTag({itemprop: 'name', content: config.title});
      this.meta.updateTag({itemprop: 'description', content: config.description});
      this.meta.updateTag({name: 'description', content: config.description});
      this.meta.updateTag({name: 'Description', content: config.title});
      this.meta.updateTag({itemprop: 'image', content: config.image});
    }


  }
}

export let seoServiceStub: Partial<SeoService> = {
  generateTags(config) {
  }
};
