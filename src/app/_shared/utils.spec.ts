import {inject} from '@angular/core/testing';
import {UserProfileService} from '../_services/user-profile.service';
import {createTestUserProfile} from '../_models/user-profile';
import {createTestBlogPost} from '../_models/blog-post';
import {createTestEssay} from '../_models/essay';
import {createTestScholarship} from '../_models/scholarship';
import {getItemType} from './utils';


fdescribe('#getItemType()', () => {
  it('It should return correct item type', () => {

    const userProfile = createTestUserProfile();
    const scholarship = createTestScholarship();
    const essay = createTestEssay();
    const blog = createTestBlogPost();

    let itemType = getItemType(scholarship);

    expect(itemType).toMatch('scholarship');

    itemType = getItemType(essay);
    expect(itemType).toMatch('essay');


    itemType = getItemType(blog);
    expect(itemType).toMatch('blog');

  })

});
