# FreeTrip

## User Stories

- 404: As a user I want to receive feedback on the page if I get into a non-existing page.
- 500: As a user I want to receive feedback when there is a server error.
- Homepage: As a user I want to access the homepage so I can see what the app is about and log in or sign up.
- Sign Up: As a user I want to sign up and create my own account.
- Log In: As a user I want to log in to my account so I can access to all the app's functionalities.
- Log Out: As a user I want to log out of my account.
- Create activities: As a user I want to create new activities and share them with the rest of the users.
- Edit activities: As a user I want to edit the activities that I created.
- Delete activities: As a user I want to delete the activities that I created.
- Detail activity: As a user I want to access the activity details of any activity.
- List activities: As a user I want to see a list of all the activities created.


## Backlog

- Add favourites
- Search activities (filter: city, price, type)
- Hashtags
- Budget trip for wishlist


## Routes

GET /
- renders the homepage

GET /Home
- renders to user's homepage

GET /auth/signup
- renders to sign up page
- redirects to / if user is logged in

POST /auth/signup
- 

redirects to / if user logged in
validate unique email and required content
body:
username
password
redirects to /services

GET /auth/login

redirects to / if user logged in
renders the login form (with flash msg)
POST /auth/login

redirects to / if user logged in
validate username and password
body:
username
password
redirects to /services
