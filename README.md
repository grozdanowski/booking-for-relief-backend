
# Booking for Relief (reliefApp) - a web app (quickly) made for crisis response

  

## Background

This app was developed (hastily) when a massive earthquake hit central Croatia. In order to help coordinate help offers, aid requests and other issues, an initiative was started to develop this app.

  

## Current deployment

Frontend (public): [https://potres.app/](https://booking-for-relief.vercel.app/)

Backend (volunteer coordinators and admins): [https://relief-app-backend.herokuapp.com/admin](https://relief-app-backend.herokuapp.com/admin)

  

## Architecture

Booking for Relief is fully open source. The backend is powered by [Strapi](https://strapi.io/documentation/developer-docs/latest/getting-started/introduction.html), and meant to be deployed to Heroku for speed and scaling purposes. The frontend consumes the data via an API, and is made in [NestJS](https://nextjs.org/docs) - again for purposes of speed in both development, as well as speed in rendering on mobile devices (SSR capabilities and all).

The frontend is located in the following repo: [https://github.com/grozdanowski/booking-for-relief-frontend](https://github.com/grozdanowski/booking-for-relief-frontend)

  

## Note

The app is, once again, done in haste. Work is underway to improve it, but currently because of the crisis that's ongoing and constantly shifting requests from volunteers in the field, we are focused on feature development first. We are fully aware of certain issues in architecture and implementation, and any help is well appreciated! But PLEASE, refrain from testing or trying to exploit anything regarding production - **this is currently used by volunteers that are essentially saving lives**!

  

# Usage

The app has two uses: public interface that allows volunteers and all other good people to see the current aid requests, as well as to offer help in various ways and mark humanitarian aid collection points. It offers locations on maps, as well as a public commenting system on single issues.

  

Volunteers can simply sign up using Facebook Login, in which case they are able to assign tasks to themselves (coordinators can also assign through backend), and then have a view of assigned tasks. If you are assigned to a task, you can also see the internal coordination notes for the task.

The admin interface is a standard Strapi admin interface, but it allows coordinators to track tasks, set their statuses etc.

The app is extended to work with other external services:
- Integromat - when a user assigns/unassigns for a task, or marks a task as done, information is sent to a webhook (env variables: `EMIT_VOLUNTEER_ASSIGNED_HOOK`, `EMIT_VOLUNTEER_DONE_HOOK`). Integromat then takes the data and sends notifications to selected Telegram groups that volunteer coordinators use to monitor processes.
- There are specific API endpoints built into the codebase to handle incoming information specifically from a Ushahidi deployment (potres2020.openit.hr). Reasoning for this is that the Ushahidi instance was initially used for (volunteer) response, so we need to get valuable data from it. This is to be deprecated at some point for a more general API set that allows webhook-style import of data in some sort of a standardized format.
- (todo) we will add control of user-entered phone numbers in the frontend using InfoBip's system to check whether the number is not only valid, but also active with the network provider. This will greatly improve the validity of data in the app.

  
  

# Development

  

As noted, you are welcome to submit PRs and Issues in order to help the efforts.

  

## Setting up the local dev environment

  

### Install the backend

  

First, clone this repo into `<your-dev-folder>`:
`git clone git@github.com:grozdanowski/booking-for-relief-backend.git`

Next, go into the backend folder:
`cd booking-for-relief-backend`

Then, install the dependencies:
`yarn install`

Finally, run the dev environment:
`yarn develop`

Go to `localhost:1337/admin` and you'll be asked to create your initial superuser. Models are already there, but you'll need to go and open the API up in Admin (because currently we don't have auth on API level, but will be adding that - help is most welcome :)) by:

  

1. Navigate to Settings

2. Under USERS & PERMISSIONS PLUGIN" go to Roles

3. Select Public

4. Enable everything except DELETE for: Accommodation, Aid-collection, Aid-request, Transport, Comment
5. Enable FIND (and FINDONE where available) for: Terms, Additional-information, Item tag

6. Save and you're good to go

  

### Set up the frontend as well

  

First, clone the frontend:
`git clone git@github.com:grozdanowski/booking-for-relief-frontend.git`

Move to the frontend folder:
`cd booking-for-relief-frontend`

Install dependencies:
`yarn install`

Create your .env.local file:
`touch .env.local`

Set values of the env file. Note: in order to have Facebook auth you'll need to set up a new Facebook app for dev purposes yourself, so you will need [a Facebook developer account](https://developers.facebook.com/) and then [register](https://developers.facebook.com/apps/) your app and fill in the form accordingly. Same goes for Google Maps API. Fill in the env file:

    BASE_URL=http://localhost:1337
    FACEBOOK_CLIENT_ID=<YOUR_FACEBOOK_APP_ID>
    FACEBOOK_CLIENT_SECRET=<YOUR_FACEBOOK_APP_SECRET>
    GOOGLE_MAPS_API_KEY=<YOUR_GOOGLE_MAPS_API_KEY>
    EMIT_VOLUNTEER_ASSIGNED_HOOK=<WEBHOOK_URL>
    EMIT_VOLUNTEER_DONE_HOOK=<WEBHOOK_URL>


Finally, run the app:
`yarn dev`

You are good to go, your app frontend is waiting for you at:
http://localhost:3000

It has hot reloading as you code and all of other niceties. Nice niceties. Nice.

  

# Deployment

The backend for this app was deployed to Heroku, while the frontend is deployed to Vercel. To deploy use the simple standard deployment instructions from respective docs linked above.

# Contributing

Rules are in place that prevent direct pushes to the main branch. In order to contribute, please create a new branch and create a PR. Once a PR is approved by code owner(s), it will be merged and, in case of frontend, automatically deployed.

# TO DO:
There is a whole list of items that need to be improved in the app. Some are in issues, but here are some more general ones:

 - We need to refactor the app/models in a way that the app works better for various purposes. Currently we have a fixed set of models which reflects in frontend as well. We need to refactor to have this be more modular / configurable.
 - Same goes for static pages such as Terms of Use, Privacy Policy, etc.
 - Improve SEO
 - Work on performance improvements. Currently all pages use SSR - this should not be the case. NextJS allows us to selectively use different rendering methods. Some pages should be generated fully as static pages, while some pages should be fully client-rendered because their SEO is not really important.
 - Create secure API endpoints for frontend/backend communication. Currently Strapi doesn't support access tokens, but rather only user authentication. This doesn't really suit our purposes. The solution that should (will) be implemented:
 --  a new data model called "Tokens" which holds hash tokens + information for apps associated to respective tokens.
 -- new API endpoints that require a token to be supplied. The token is checked against tokens in the abovementioned data model. If the check passes, the endpoints allow certain data actions (PUSH, PUT).
 - Plus more that will be added here.

  

# Another thing

Yes, we know we have flaws in the code, but please keep in mind it's done in sleepless nights under high stress from a damn natural and humanitarian disaster. If you can, please feel free to help us improve. If not - please refrain from malicious intents. Thank you.