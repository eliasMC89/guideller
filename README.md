# Guideller
Travel app to check and create new activities by location, price and type. User can create personal trips with a limited budget and add activities to it. It allows the user to plan trips according to the budget and the activities price.

## User Stories

- 404: As a user I want to receive feedback on the page if I get into a non-existing page.
- 500: As a user I want to receive feedback when there is a server error.
- Homepage/not loged in: As a user I want to access the homepage so I can have a better idea of what the app is about.
- Sign Up: As a user I want to sign up and create my own account so I can use the platform.
- Log In: As a user I want to log in to my account so I can access to all the app's functionalities.
- Log Out: As a user I want to log out of my account so no one else can use my account.
- Homepage/loged in: As a loged in user I want to access a homepage with a list of activities to start looking for new plans.
- Create activities: As a user I want to create new activities and share them with the rest of the users.
- List activities: As a user I want to see a list of all the activities created.
- Detail activity: As a user I want to access the activity details of any activity.
- Edit activities: As a user I want to edit the activities that I created.
- Delete activities: As a user I want to delete the activities that I created.


## Backlog

- Add favourites
- Upload picture to activity
- Search activities (filter: city, price, type)
- Hashtags
- Budget trip for wishlist


## Routes

### index

GET /
- renders the user to the homepage

### auth

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

GET /auth/logout
- protect if the user is logged out
- redirect the user to the homepage after loging out

### activities

GET /activities
- renders a list of activities to the user

GET /activities/new
- renders the new activity form to the user
- redirect to /activities if user is not logged in

POST /activities
- receives the new activity created
- body:
  name
  country
  city
  price
  rating
  description
  reservation
  photo
  owner
- redirects to the user's list of activities

GET /activities/my
- renders the list of activities created by the user
- redirect to /activities if user is not logged in
- redirect to /activities if user is not the same as the one logged in

GET /activities/:activityId/edit
- renders the /activities/:userid/edit page to edit the users activity
- redirect to / if user is not logged in
- redirect to /activities if user is not the owner of the activity
- throws 404 if id is invalid

POST /activities/:activityId/edit
- receives the new activity edited
- body:
  name
  country
  city
  price
  rating
  description
  reservation
  photo
  owner
- redirects to the user's list of activities
- throws 404 if id is invalid
- redirect to /activities if user is not the owner of the activity
- redirect to / if user is not logged in

POST /activities/:activityId/delete
- throws 404 if id is invalid
- deletes the user's activity
- redirect to /activities if user is not logged in
- redirect to /activities if user is not the owner of the activity

GET /activities/:activityId
- renders user to activity detail
- throws 404 if id is invalid


## Models

User Model

```
const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, );
 ```

Activity

```
const activitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  photoURL: {
    type: String,
  },
  reservation: {
    type: String,
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: User Object ID,
    required: true
  }
}, );
```

