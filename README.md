# Edinburgh SFF

A custom ReactJS web app using modern Web patterns.

## Local development

> Prerequisite: `sass` and `yarn` (install via `npm i sass yarn -g`)

1. Check out this project into a local folder.
2. From that folder, `yarn install` to ensure development requirements are in place.
3. Firebase configuration is required to run the app. Create a `.env.local` file in the root of the project and add the following:

```VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_GOOGLEMAPS_API_KEY=```

### Quick start

* `yarn dev`

### Deploy

This app is designed to be deployed to Vercel. The `vercel.json` file contains the configuration for the deployment.

* Ensure the environment variables are set in the Vercel project.
* Merge changes into Master branch. Deployment will happen automatically.

### Architecture

* Vercel: Serverless hosting
* Firebase: Database
* ReactJS: Front-end framework
* MUI: UI framework