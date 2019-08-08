# Dev Journal

Keep track of different things I've done

## May 1 2019

**Heroku Staging, Redis, Refresh Scholarship Cache Async Task**

Trying to fix scholarships list display so I added a button to allow user's to refresh scholarship cache.
Tried it on staging but was getting cors errors when I tried to send a POST request to refresh user scholarship cache:
1. Request URL: https://atila-7-staging.herokuapp.com/api/user-profiles/31/refresh-scholarship-cache/
2. Request Method: POST
3. Status Code: 503 Service Unavailable


The error is that Heroku was trying to create an async task using Redis and Celery.
Problem is that atila-7-staging on Heroku does not have a redis instance.
At first I connected the one on prod (atila-7) to staging but realized they should probably use separate data stores so I created a new one.
Noticed that Heroku Postgres is also sharing its database with staging. We should consider changing this.

**Update Scholarship List and Cache**

Updating the algorithm used to display the scholarships list and cache.
Was wondering why Celery was not running tasks based on updated code, then realized you have to refresh Celery.
### Further Reading

https://devcenter.heroku.com/articles/add-ons#sharing-an-add-on-between-apps


### TODO:
Noticed that Heroku Postgres is also sharing its database with staging. We should consider changing this.

## May 8 2019 
**Landing page, screenshots and gif**
- Creating Screenshot/Gif to explain how Atila works on Landing page
- Use this resource to get gifs for mobile stuff: https://mobilemoxie.com/tools/mobile-page-test/
-  May 10 2019 UPDATE: dont use mobile moxie use Chrome devtools and show device frame works better
- Use ezGif to convert MP4 screen shots to gif and optimize and you can select `optimize for static background` checkbox: https://ezgif.com/video-to-gif/

## May 21 2019 
**Testing Push Notifications in dev**
- Trying to get push notifications to work in dev but the `this.swPush.requestSubscription()` handler is not being called
- I originally thought that maybe it was working in dev before and I changed something and now it is no longer working in dev 
but I think it was never actually working in dev. We have to use prod to debug? Or we can create a dummy Promise when testing in dev


## August 7, 2019
- Try to create a scholarship helper function to determine if we should show extra criteria, realized that we need more info returned in the scholarships search serializer JSON response

