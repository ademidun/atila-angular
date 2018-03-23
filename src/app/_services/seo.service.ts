import { Injectable } from '@angular/core';

import {Meta, Title} from '@angular/platform-browser';

import * as $ from 'jquery';

// https://angularfirebase.com/lessons/seo-angular-part-1-rendertron-meta-tags/#Setting-Social-Media-Meta-Tags-in-Angular
@Injectable()
export class SeoService {

  constructor(private meta: Meta,
              public titleService: Title) { }

  generateTags(config) {
    /*
    // default values
    config = {
      title: 'Atila | Scholarships Automated. The Right Way.',
      description: 'Automatically find and apply to scholarships at the click of a button. Learn and share information about education, career and life.',
      image: 'https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/public%2Fatila-gradient-banner-march-14.png?alt=media&token=9d791ba9-18d0-4750-ace8-b390a4e90fdc',
      slug: '',
    };

    */

    config.title = config.title + ' - Atila';
    this.titleService.setTitle( config.title);
    if (config.image)  {
      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    }
    else {
      this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    }
    this.meta.updateTag({ name: 'twitter:site', content: '@atilatech' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.image });

    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Atila' });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: config.image });
    this.meta.updateTag({ property: 'og:url', content: `https://atila.ca/${config.slug}` });

    // ['name','description','image'].forEach(tag => {
    //   this.meta.removeTag(tag)
    // });

    try {
      if ($) {
        $('meta[itemprop="name"]').attr('content',config.title);
        $('meta[itemprop="description"]').attr('content',config.description);
        $('meta[name="Description"]').attr('content',config.description);
        $('meta[name="description"]').attr('content',config.description);
        $('meta[itemprop="image"]').attr('content',config.image);
      }
    }
    catch (e) {
      this.meta.updateTag({ itemprop: 'name', content: config.title });
      this.meta.updateTag({ itemprop: 'description', content: config.description });
      this.meta.updateTag({ name: 'description', content: config.description });
      this.meta.updateTag({ name: 'Description', content: config.title });
      this.meta.updateTag({ itemprop: 'image', content: config.image });
    }



  }
}
