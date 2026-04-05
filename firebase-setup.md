# Firebase setup for JR Soluciones

## What you need to do

1. Create a Firebase project in the Firebase Console.
2. Add a Web app to that project.
3. Copy the web config object from the Firebase Console.
4. Paste those values into `firebase-config.js`.
5. If you want to deploy with Firebase Hosting, install the Firebase CLI and initialize Hosting for this folder.

## Where to get the config

In Firebase Console:

1. Open your project.
2. Go to Project settings.
3. Scroll to Your apps.
4. Select the Web app.
5. Copy the config values into `firebase-config.js`.

## Current code behavior

- If `firebase-config.js` still has `REPLACE_ME`, the site works in fallback mode.
- When the real config is added, `main.js` will try to load the document `site/home` from Firestore.
- The page will use any matching fields from that document to replace the on-page text.
- The admin panel only allows editing after signing in with the admin email.
- Image fields upload to Firebase Storage automatically when you select a file.

## One more Firebase step

Firebase Storage must be initialized once in the Console before image uploads work.

1. Open Firebase Console.
2. Go to **Storage**.
3. Click **Get started**.
4. Choose the default location Firebase suggests for the project.
5. Finish the setup.

After that, the storage rules in `storage.rules` can be deployed normally.

## Suggested Firestore document

Collection: `site`

Document: `home`

Fields example:

```json
{
  "heroTitle": "JR Soluciones",
  "heroDescription": "Texto actualizado desde Firebase...",
  "qrKicker": "Llévatelo con",
  "qrOffer": "0% de inicial",
  "ownerName": "Juan Rodríguez",
  "ownerRole": "Propietario y Gerente General",
  "ownerAddress": "Calle Principal #123, Santo Domingo, República Dominicana"
}
```
