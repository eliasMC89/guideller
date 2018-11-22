# Guideller
Travel app to check and create new activities by location, price and type. User can create personal trips with a limited budget and add activities to it. It allows the user to plan trips according to the budget and the activities price.

## User Stories

- 404: As a user I want to receive feedback on the page if I get into a non-existing page.
- 500: As a user I want to receive feedback when there is a server error.
- Homepage/not loged in: As a user I want to access the homepage so I can have a better idea of what the app is about.
- Sign Up: As a user I want to sign up and create my own account.
- Log In: As a user I want to log in to my account so I can access to all the app's functionalities.
- Log Out: As a user I want to log out of my account.
- Homepage/loged in: As a loged in user I want to access a homepage with a list of activities to start looking for new plans.
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
- renders the not logged in homepage

GET /activities
- renders to user's homepage once logged in
- redirect to / if user is not logged in

GET /auth/signup
- renders to sign up page
- redirects to /activities if user is logged in

POST /auth/signup
- redirect to /activities if user is logged in
- body:
  username
  password
- redirects to /activities once you click the "SIGN UP" button

GET /auth/login
- redirects to /activities if user logged in
- renders the login form (with flash msg)

POST /auth/login
- redirects to /activities if user logged in
- validate username and password
- body:
  username
  password
- redirects to /activities once you click the "LOG IN" button

GET /activities/:userid/new
- renders the /activities/new page to create a new activity linked to the user
- redirect to / if user is not logged in

POST /activities/:userid/new
- redirect to / if user is not logged in
- body:
  name
  location
  price
  description
  photo
  reservation

GET /activities/:userid/list
- renders the /activities/:userid/list page to see the list of the activities the user has created
- redirect to / if user is not logged in
- redirect to / if user is not the same as the one logged in

GET /activities/:userid/:activityid/edit
- renders the /activities/:userid/edit page to edit the users activity
- redirect to / if user is not logged in
- redirect to / if user is not the same as the one logged in

POST /activities/:userid/:activityid/edit
- redirect to / if user is not logged in
- body:
  name
  location
  price
  description
  photo
  reservation

GET /activities/:userid/:activityid/remove
- renders the /activities/:userid/delete page to delete the users activity
- redirect to / if user is not logged in
- redirect to / if user is not the same as the one logged in

POST /activities/:userid/:activityid/remove


## Models

User Model

 ```username: String, required
 password: String, required```
 

Activity

```name: string, required
city: string, required
country: string, required
type: string, required
price: number, required
rating: number, required
Photo: file
Location: string
Description: string```

