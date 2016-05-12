# Atlas
### Backend API for the Atlas front-end

[![Build Status](https://travis-ci.org/IGME-RIT/backend.svg?branch=master)](https://travis-ci.org/IGME-RIT/backend)

## Setup

### Prerequisites
In order to run the Atlas backend, all you need is Node.js version 0.10 or later and the environment variables (envars) outlined below defined.

```
export MONGOLAB_URI=
export GITHUB_CLIENT_ID=
export GITHUB_CLIENT_SECRET=
export FQDN=localhost:5000
```

### Environment Variables 

In order to run the backend locally, create a `credentials` file in the `./bin` folder and populate it with the following envars:

* `MONGOLAB_URI` - [MongoLab access URI](https://elements.heroku.com/addons/mongolab), outlined on Heroku. You can also use a personal MongoDB URI but the envar name must remain the same.
* `GITHUB_CLIENT_ID ` - Client ID from GitHub OAuth application  
* `GITHUB_CLIENT_SECRET ` - Client Secret from GitHub OAuth application
* `FQDN ` - Fully-Qualified Domain Name

### GitHub OAuth Application

1. [Add an OAuth application](https://github.com/settings/applications/new) to the GitHub user or organization this is running under.
2. Set the **Authorization callback URL** to `https://<FQDN>/sync/auth/callback` where `<FQDN>` is the FQDN of your local environment (i.e. `localhost:5000`, `*.herokuapp.com`, etc.).
3. Set the `GITHUB_CLIENT_ID` and `GITHUB_SECRET_ID` envars to the tokens provided on the application settings page once it's been created.

## Running

In order to run the Atlas backend, just run `npm start` in a shell.