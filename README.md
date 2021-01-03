# Booking  for Relief - a web app (quickly) made for crisis response

## Background
This app was developed (hastily) when a massive earthquake hit central Croatia. In order to help coordinate help offers, aid requests and other issues, an initiative was started to develop this app.

## Current deployment
Frontend (public): [https://booking-for-relief.vercel.app/](https://booking-for-relief.vercel.app/)
Backend (volunteer coordinators and admins): [https://lit-coast-00350.herokuapp.com/admin](https://lit-coast-00350.herokuapp.com/admin)

## Architecture
Booking for Relief is fully open source. The backend is powered by [Strapi](https://strapi.io/documentation/developer-docs/latest/getting-started/introduction.html), and meant to be deployed to Heroku for speed and scaling purposes. The frontend consumes the data via an API, and is made in [NestJS](https://nextjs.org/docs) - again for purposes of speed in both development, as well as speed in rendering on mobile devices (SSR capabilities and all).
The frontend is located in the following repo: [https://github.com/grozdanowski/booking-for-relief-frontend](https://github.com/grozdanowski/booking-for-relief-frontend)

## Note
The app is, once again, done in haste. Work is underway to improve it, but currently because of the crisis that's ongoing and constantly shifting requests from volunteers in the field, we are focused on feature development first. We are fully aware of certain issues in architecture and implementation, and any help is well appreciated! But PLEASE, refrain from testing or trying to exploit anything regarding production - **this is currently used by volunteers that are essentially saving lives**!

# Usage
The app has two uses: public interface that allows volunteers and all other good people to see the current aid requests, as well as to offer help in various ways and mark humanitarian aid collection points. It offers locations on maps, as well as a public commenting system on single issues.

Volunteers can simply sign up using Facebook Login, in which case they are able to assign tasks to themselves (coordinators can also assign through backend), and then have a view of assigned tasks. If you are assigned to a task, you can also see the internal coordination notes for the task.
The admin interface is a standard Strapi admin interface, but it allows coordinators to track tasks, set their statuses etc.


# Development

As noted, you are welcome to submit PRs and Issues in order to help the efforts.

## Setting up the local dev environment

### Install the backend

First, clone this repo into `<your-dev-folder>`:

    git clone git@github.com:grozdanowski/booking-for-relief-backend.git
Next, go into the backend folder:

    cd booking-for-relief-backend
Then, install the dependencies:

    yarn install
Finally, run the dev environment:

    yarn develop

Go to `localhost:1337/admin` and you'll be asked to create your initial superuser. Models are already there, but you'll need to go and open the API up in Admin (because currently we don't have auth on API level, but will be adding that - help is most welcome :)) by:

 1. Navigate to Settings
 2. Under USERS & PERMISSIONS PLUGIN" go to Roles
 3. Select Public
 4. Enable everything except DELETE for: Accommodation, Aid-collection, Aid-request, Transport, Comment
 5. Save and you're good to go

### Set up the frontend as well

First, clone the frontend:

    git clone git@github.com:grozdanowski/booking-for-relief-frontend.git

Move to the frontend folder:

    cd booking-for-relief-frontend
Install dependencies:

    yarn install
Create your .env.local file:

    touch .env.local
Set values of the env file. Note: in order to have Facebook auth you'll need to set up a new Facebook app for dev purposes yourself, so you will need [a Facebook developer account](https://developers.facebook.com/) and then [register](https://developers.facebook.com/apps/) your app and fill in the form accordingly:

    BASE_URL=http://localhost:1337
    FACEBOOK_CLIENT_ID=<YOUR_FACEBOOK_APP_ID>
    FACEBOOK_CLIENT_SECRET=<YOUR_FACEBOOK_APP_SECRET>
Finally, run the app:

    yarn dev
You are good to go, your app frontend is waiting for you at:

    http://localhost:3000
It has hot reloading as you code and all of other niceties. Nice niceties. Nice.

# Deployment
The backend for this app was deployed to Heroku, while the frontend is deployed to Vercel. To deploy use the simple standard deployment instructions from respective docs linked above.

# Another thing
Yes, we know we have flaws in the code, but please keep in mind it's done in sleepless nights under high stress from a damn natural and humanitarian disaster. If you can, please feel free to help us improve. If not - please refrain from malicious intents. Thank you.