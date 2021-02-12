
  

# Booking for Relief (reliefApp) - a web app (quickly) made for crisis response

  

  

## Background

  

This app was developed (hastily) when a massive earthquake hit central Croatia. In order to help coordinate help offers, aid requests and other issues, an initiative was started to develop this app.

  

  

## Current (first) deployment for Sisak & Petrinja 2020 earthquake response

  

Frontend (public): [https://potres.app/](https://booking-for-relief.vercel.app/)

  

Backend (volunteer coordinators and admins): [https://relief-app-backend.herokuapp.com/admin](https://relief-app-backend.herokuapp.com/admin)

  

  

## Architecture

  

Booking for Relief is fully open source. The backend is powered by [Strapi](https://strapi.io/documentation/developer-docs/latest/getting-started/introduction.html), and meant to be deployed to Heroku for speed and scaling purposes. The frontend consumes the data via an API, and is made in [NestJS](https://nextjs.org/docs) - again for purposes of speed in both development, as well as speed in rendering on mobile devices (SSR capabilities and all).

  

The frontend is located in the following repo: [https://github.com/grozdanowski/booking-for-relief-frontend](https://github.com/grozdanowski/booking-for-relief-frontend)
The backend is located in the following repo: [https://github.com/grozdanowski/booking-for-relief-backend](https://github.com/grozdanowski/booking-for-relief-backend)

  

  

## Note

  

The app is, once again, done in haste. Work is underway to improve it, but currently because of the crisis that's ongoing and constantly shifting requests from volunteers in the field, we are focused on feature development first. We are fully aware of certain issues in architecture and implementation, and any help is well appreciated! But PLEASE, refrain from testing or trying to exploit anything regarding production - **this is currently used by volunteers that are essentially saving lives**!

## The goal
Long term goal for this is to evolve into a platform that can be used as a quick-response tool that aggregates the needs for help and offers for help that people in need, volunteers, volunteer coordinators, NGOs and people with good will can utilise.
It is meant to be quickly deployed so the URL to it can be shared quickly and the information can be available in an organised and consistent way. The volunteers can be assigned, multiplication of responses to individual issues would be reduced, and this increase in efficiency would potentially help save lives.
It is planned to add One-click-deploy functionality to this, so a new instance can be deployed in minutes.

  

  

# Usage

  

The app has two uses: public interface that allows volunteers and all other good people to see the current aid requests, as well as to offer help in various ways and mark humanitarian aid collection points. It offers locations on maps, as well as a public commenting system on single issues.

Volunteers can simply sign up using Facebook Login, in which case they are able to assign tasks to themselves (coordinators can also assign through backend), and then have a view of assigned tasks. If you are assigned to a task, you can also see the internal coordination notes for the task.

The admin interface is a standard Strapi admin interface, but it allows coordinators to track tasks, set their statuses etc.

## Models

### Entry
Collection type. Entries are the core data block that holds the data about single entries reported to the system.

    {  
    "id": <unique_id>,  
    "title": "Title",  
    "location": "Location string",  
    "location_latitude": <geo_lat>,  
    "location_longitude": <geo_lon>,  
    "description": "Description text",  
    "contact_name": "Name",  
    "contact_email": "email@address.com",  
    "contact_phone": "phone_number",  
    "contact_available_on_whatsapp": true/false/null,  
    "contact_available_on_telegram": true/false/null,  
    "status": <from_list>,  
    "assigned_coordinator": <reference_to_volunteer_coordinator_object>,  
    "volunteer_assigned": "Assigned volunteer name, email, phone",  
    "done": true/false/null,  
    "follow_up_date": <date>/null,  
    "tags": "some, tags",  
    "date_from": <date>/null,  
    "date_until": <date>/null,  
    "entry_category": <relation_to_category>,  
    "notes": "text"/null,  
    "integrations_data": {  
        "someintegration": {  
            "original_id": <id>,  
            "last_synced_on": <date>,  
            "first_synced_on": <date>  
        },
        ...  
    },  
    "volunteer_marked_as_done": true/false/null,  
    "published_at": <date>,  
    "comments": [ <comment>, ...]  
    }

### Comment
Has two fields, `author` and `content`. Collection type. Used for entry comments that are publicly available.

### Coordinator
Collection type. A coordinator is a person that's responsible for monitoring a single issue and for coordinating with the on-the-ground volunteer handling the issue. The coordinator is responsible for checking the status of the issue, setting the status in system and in the end confirming its resolved status and marking the entry as Done in the system.

    {
	    id: <unique_id>,
	    name: <text>,
	    email: <text>,
	    phone_number: <text>
    }

### Entry category
Collection type. Used to define types of entries that the system will accept and categorise. This is strongly reflected in the frontend.

    {
	    id: <unique_id>,
	    type_slug: <text_unique>,
	    type_name: <text>,
	    available_in_public_menu: <bool>,
	    menu_title: <text>,
	    plural_title: <text>,
	    category_color_hex: <text>,
	    entries: <relation_to_entries>,
	    category_map_pin_icon: <strapi_image>,
		category_map_pin_icon_assigned: <strapi_image>,
		add_entry_label: <text>
    }

### Item tag
Collection type. Adding tags to this collection makes them available through the autocomplete dropdown in the frontend.

    {
	    tag: <text>
    }

### Static page
Collection type. Allows for creation of static frontend pages.

    {
	    page_title: <text>,
	    page_description: <text>,
	    page_content: <rich_text>,
	    page_slug: <text_unique>
    }


### Public site settings
Single type. Holds various settings for the frontend site such as menu items, site title etc.

### API Tokens
Single type. Can be used to add tokens that frontend apps (and other apps) can use to consume the data-apis. More under APIs.


## Integrations

The app is extended to work with other external services:

- Integromat - when a user assigns/unassigns for a task, or marks a task as done, information is sent to a webhook (env variables: `EMIT_VOLUNTEER_ASSIGNED_HOOK`, `EMIT_VOLUNTEER_DONE_HOOK`). Integromat then takes the data and sends notifications to selected Telegram groups that volunteer coordinators use to monitor processes. **note: this is currently partly hardcoded into the frontend, and further down the line needs to be optimised**
- The [InfoBip API](https://www.infobip.com/docs/number-lookup/number-lookup-over-api) is used to check whether the phone number added when creating the issue through the frontend is actually correct and working. You need an API token from InfoBip for this to work.

- There are specific API endpoints built into the codebase to handle incoming information. That way this app can aggregate data from other response-functionality apps (such as Ushahidi) using two API endpoints that allow for data adding and updating.

## APIs

For frontend and integrations I've built the following API endpoints - for all of them you will need to provide an API token in your request header as `Authorization: 'App <token>'`. Without that you cannot use the following APIs:

`GET <backend_url>/data-api/available-categories`
Example response:

    {
	  "availableEntryCategories": [
        {
            "id": 1,
            "type_slug": "smjestaj",
            "type_name": "Smještaj",
            "available_in_public_menu": true,
            "menu_title": "Smještaji",
            "plural_title": "Smještaji",
            "category_color_hex": "#333333",
            "created_at": "2021-02-03T15:25:10.273Z",
            "updated_at": "2021-02-05T15:55:16.262Z",
            "add_entry_label": "Nudim smještaj",
            "category_map_pin_icon": null,
            "category_map_pin_icon_assigned": null,
            "entries": [ ... ]
        },
        ...
       ]
   }

  
`GET <backend_url>/data-api/all-entries`
Example response:

    {
    "entries": [ <entry>, ... ]
    }

`GET <backend_url>/data-api/latest-entries`
Example response:

    {
    "entries": [ <entry>, ... ],
    "itemTags": [ <tag>, ... ],
    "availableEntryCategories": [ <category>, ... ],
    "publicSiteSettings": { ... }
    }
 
 `GET <backend_url>/data-api/category-entries/<slug>`
Example response:

    {
    "entries": [ <entry>, ... ],
    "itemTags": [ <tag>, ... ],
    "availableEntryCategories": [ <category>, ... ],
    "publicSiteSettings": { ... }
    }
 
`GET <backend_url>/data-api/search-entries/<term>`
Example response:

    {
    "entries": [ <entry>, ... ],
    "itemTags": [ <tag>, ... ],
    "availableEntryCategories": [ <category>, ... ],
    "publicSiteSettings": { ... }
    }
 
 `GET <backend_url>/data-api/volunteer-assigned-entries/<volunteer_email_or_name>`
Example response:

    {
    "entries": [ <entry>, ... ],
    "itemTags": [ <tag>, ... ],
    "availableEntryCategories": [ <category>, ... ],
    "publicSiteSettings": { ... }
    }
 
  `GET <backend_url>/data-api/entry/<id>`
Example response:

    {
    "entry": { ... },
    "itemTags": [ <tag>, ... ],
    "availableEntryCategories": [ <category>, ... ],
    "publicSiteSettings": { ... }
    }
 
  `POST <backend_url>/add-entry`
Expects the entry data JSON in request body. `title`, `description`, `location`, `contact_name`, `contact_phone` and `tags` are required fields.

  `POST <backend_url>/add-entry-comment`
Expects the following as JSON in request body:

    {
	    entryId: <entry_id>,
	    comment: {
		    author: <text>,
		    content: <text>
	    }
    }

  `POST <backend_url>/set-entry-volunteer`
Expects the following as JSON in request body:

    {
	    entryId: <entry_id>,
	    volunteer_assigned: <text>
    }

  `POST <backend_url>/volunteer-mark-entry-done`
Expects the following as JSON in request body:

    {
	    entryId: <entry_id>,
	    notes: <text>,
	    volunteer_marked_as_done: <true/false>
    }

  `POST <backend_url>/integration-add-entry`
This is built for other app integrations. Used to pull in issues from other apps. Will only add if it does not find an entry with the same integration name and original_id as provided. Expects the following as JSON in request body:

    {  
      "data": {  
        <entry_data>
      },  
      "integration": {  
        "name": "someIntegrationName",  
        "original_id": <id_in_original_app>  
      }  
    }

  `POST <backend_url>/integration-update-entry`
This is built for other app integrations. Used to pull in issues from other apps. Will only update if it finds an entry with the same integration name and original_id as provided. Expects the following as JSON in request body:

    {  
      "data": {  
        <changed_entry_fields>
      },  
      "integration": {  
        "name": "someIntegrationName",  
        "original_id": <id_in_original_app>  
      }  
    }
 




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

  

BASE_URL=<BACKEND_URL >
FACEBOOK_CLIENT_ID=<YOUR_FACEBOOK_APP_ID>
FACEBOOK_CLIENT_SECRET=<YOUR_FACEBOOK_APP_SECRET>
GOOGLE_MAPS_API_KEY=<YOUR_GOOGLE_MAPS_API_KEY>
EMIT_VOLUNTEER_ASSIGNED_HOOK=<WEBHOOK_URL>
EMIT_VOLUNTEER_DONE_HOOK=<WEBHOOK_URL>
INFOBIP_API_BASE_URL=<INFOBIP_API_BASE_URL>
INFOBIP_API_KEY=<INFOBIP_API_KEY>

  
  

Finally, run the app:

`yarn dev`

  

You are good to go, your app frontend is waiting for you at:

http://localhost:3000

  

It has hot reloading as you code and all of other niceties. Nice niceties. Nice.

  

  

# Deployment

  

The backend for this app was deployed to Heroku, while the frontend is deployed to Vercel. To deploy use the simple standard deployment instructions from respective docs linked above. Note you need to do full backend deployment and setup **first**, then deploy the frontend.

  

# Contributing

  

Rules are in place that prevent direct pushes to the main branch. In order to contribute, please create a new branch and create a PR. Once a PR is approved by code owner(s), it will be merged and, in case of frontend, automatically deployed.

  

# TO DO:

There is a whole list of items that need to be improved in the app. Some are in issues, but here are some more general ones:

  

- We need to refactor the app/models in a way that the app works better for various purposes. Currently we have a fixed set of models which reflects in frontend as well. We need to refactor to have this be more modular / configurable.

- Same goes for static pages such as Terms of Use, Privacy Policy, etc.

- Improve SEO

- Work on performance improvements. Currently all pages use SSR - this should not be the case. NextJS allows us to selectively use different rendering methods. Some pages should be generated fully as static pages, while some pages should be fully client-rendered because their SEO is not really important.

- Create secure API endpoints for frontend/backend communication. Currently Strapi doesn't support access tokens, but rather only user authentication. This doesn't really suit our purposes. The solution that should (will) be implemented:

-- a new data model called "Tokens" which holds hash tokens + information for apps associated to respective tokens.

-- new API endpoints that require a token to be supplied. The token is checked against tokens in the abovementioned data model. If the check passes, the endpoints allow certain data actions (PUSH, PUT).

- Plus more that will be added here.

  

  

# Another thing

  

Yes, we know we have flaws in the code, but please keep in mind it's done in sleepless nights under high stress from a damn natural and humanitarian disaster. If you can, please feel free to help us improve. If not - please refrain from malicious intents. Thank you.