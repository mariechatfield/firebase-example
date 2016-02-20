# Firebase Example

**Talks You Should Watch** is an example web app that was developed for [this Firebase tutorial](https://github.com/mchat/tutorials/blob/master/firebase/README.md).

The original version is a pretty basic application, so here's a more fleshed out example of what you can do with this technology, including:

- Hosting app on Firebase
- Authenticating users anonymously
- Authenticating users with Twitter OAuth
- Reading multiple database entries from Firebase at a time

Note: if you want to fork this repo and try it out yourself, you'll need to:
- Create your own Firebase application
- Replace `myFirebaseApp` (in [public/scripts/database.js](public/scripts/database.js)) with your Firebase app name
- Replace the value of `Firebase` (in [firebase.json](firebase.json)) with your Firebase app name
- [Set up hosting](https://www.firebase.com/docs/hosting/quickstart.html) for your Firebase app
- Set up a Twitter application and allow your Firebase app to [authenticate users with Twitter](https://www.firebase.com/docs/web/guide/login/twitter.html)
- Allow your Firebase app to [authenticate users anonymously](https://www.firebase.com/docs/web/guide/login/anonymous.html)

This application also makes us of the [require.js](http://requirejs.org/) library. This library allows us to specify that certain scripts should only be run after all their dependencies have been loaded.

The overall structure of this app:
- `firebase.json`
    + Sets up configuration for hosting this website with Firebase
- `public/`
    + Directory which is publicly available and hosted on Firebase
    + `public/index.html`
        * This file is automatically loaded when you navigate to your hosted website.
    + `public/lib`
        * This directory contains scripts for external libraries used by this web application.
    + `public/scripts`
        * This directory contains scripts that will run our web application.
        * `public/scripts/application.js`
            - This script contains the primary application logic, and is loaded by `public/index.html`. It depends on `public/scripts/database.js`
        * `public/scripts/database.js`
            - This scripts contains the database specific logic, and is loaded by require.js before `public/scripts/application.js` is run
