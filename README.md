# remind-me

App for Android that lets you easily keep notes and reminders in one place.

# setup

create a file called `.env` with the following information:

```
// fill this out according to your Firebase project
FIREBASE_API_KEY= ...
FIREBASE_AUTH_DOMAIN=app-name.firebaseapp.com
FIREBASE_DATABASE_URL=https://app-name-default-rtdb.europe-west1.firebasedatabase.app
FIREBASE_PROJECT_ID=app-name
FIREBASE_STORAGE_BUCKET=app-name.appspot.com
FIREBASE_MESSAGING_SENDER_ID= ...
FIREBASE_APP_ID= ...
```

## todo

-   Design how notes/reminders will be split and work [x]
-   Fullscreen note editor [x]
-   Fullscreen reminder editor [x]
-   Light/Dark theme [x]
-   make IDs when adding new notes never repeat [x]
-   General note/reminder logic(?) [x]
-   time format setting [x]
-   Prettier time formatting [x]
-   Switch to camelCase [x]
-   Higher ActiveOpacity for all TouchableOpacities [x]
-   Themable components [TouchableOpacity, Text] [x]
-   handle deleting notifications when reminders are deleted [x]
-   24hr/12hr time format logic [x]
-   Amount of files attached in notes and reminders main view [x]
-   Remove @ts-ignores [x]
-   Split every loose component into each separate file [x]
-   Logging into firebase [x]
-   Splash screen for new app installs [x]
-   Privatize the Firebase API keys [x]
-   Saving app data to firebase [x]
-   Reading app data from Firebase [x]
-   Truncate note content in the list view [x]
-   Save notes without leaving the edit screen [x]
-   Animate switching between delete and add icons [x]
-   Option to maximize an image to a note [x]
-   aspect ratio on images in notes [x]
-   reset pinned image when it's deleted [X]

## todo

-   images over firebase
-   uploading images to the cloud
-   syncing images to the cloud
-   caching images locally from the cloud
    https://firebase.google.com/docs/storage/web/upload-files

## testing

-   make sure notifications carry over when restoring cloud state
