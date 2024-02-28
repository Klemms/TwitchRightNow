# TTV Right Now

Welcome to the TTV Right Now browser extension repository

Everyone is free to contribute to the project via pull requests

## Contributing
You are free to contribute via pull requests, note however that there are some rules :
* No copyrighted code or material should be used
* Don't add any user-tracking or data-collecting code
* Try to keep things simple
* The backgroung.js is an important file, but also contains some old code, be careful when editing it
* Try to limit calls to the Twitch API, as rate-limits apply
* When saving data, remember to choose wisely if you need local or synced storage

## Building & Testing
1. Clone the repo
2. Run `npm ci` to install all npm packages
3. Make your changes
4. Do `npm run build` (or `npm run watch`, but the /public folder isn't watched)
5. Go to chrome or any Chromium browser (Chrome/Edge/Opera/Vivaldi/Brave...)
6. Go to the extension page of that browser and enable developer mode
7. Click on "Load unpacked extension"
8. Go to the clone folder, select the `build` folder
9. You did it !

When you make changes I recommend reloading the extension using the reload icon the extension page.
You can also close and re-open the extension window but the background.js (service worker) file won't be reloaded

## Distributing
I would prefer if you don't distribute the packed extension as it would make hard to maintain and support multiple versions.
I'll make and upload a new version to the Chrome Webstore when needed, note however that Google takes a few days to review the extension everytime
