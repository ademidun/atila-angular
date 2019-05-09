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
