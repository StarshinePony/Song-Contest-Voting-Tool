# Main Features (bare minimum)
Voting Site:
* ~All musicians are listed with a Vote button~
* ~Votes are tracked with IP Address Logger~
* If you voted all of the other musicians should disappear
* ~Thanks for voting screen with a button to remove your vote and get back to the original voting screen~

Country Voting Site:
* ~Countries can log in page~
* Page where countries can give their points from 12 - 1 (without the 11 since that is the country itself)

Admin Panel:
* ~Admin panel with a set username (root) and a password~
* ~Panel Staff can add the Musicians to the voting site~
* Live view of current Voting statistics
* ~Field for creating new Country Accounts~
* An export button to create a CSV file into an output folder

## Project Stucture
### [app](https://github.com/Brambles-cat/server-thing/tree/master/src/app):
The main part of the web app which includes the main page in page.tsx, as well as the css styles in globals.css and page.odule.css, used for every other page

### [client](https://github.com/Brambles-cat/server-thing/tree/master/src/client):
components.tsx
- contains components that need to be rendered in the client side, since they utilize the DOM in some way
contexts.tsx
- contains states need to be shared between different components in the component tree

### [db](https://github.com/Brambles-cat/server-thing/tree/master/src/db):
database.ts
- contains a singleton db wrapper class with an sqlite3 db connection, as well as several methods for interacting with the db
init.ts
- an initialization script that populates the db with the needed tables and column names

### [pages](https://github.com/Brambles-cat/server-thing/tree/master/src/pages):
- contains all of the web app's pages that can be viewed through https://site_domain/page_file_name
- Nextjs treats files here as the app's routes, so utility files should be placed elsewhere
pages/api
- contains endpoints where the client can send requests for the server to perform some actuon, which usually involves adding or changing data in the db
- Nextjs treats all files in here as endpoints, so any utility files should be placed elsewhere

### [admin_handler.ts](https://github.com/Brambles-cat/server-thing/blob/master/src/admin_handler.ts):
Contains a handler function used for wrapping around any api endpoints' handlers so that they become accessible only if the client has admin credentials

### [credential_init.ts](https://github.com/Brambles-cat/server-thing/blob/master/src/credential_init.ts):
Initialization script for setting the admin username and password

### [credentials.ts](https://github.com/Brambles-cat/server-thing/blob/master/src/credentials.ts):
Utility file for comparing credentials provided by the client to the server's and returning whether or not they are valid

## Security notes:
* Should probably look into using certificates or at the very least an encryption method
* Currently vulnerable to MITM attacks both during and post client-server connection
* Vulnerable to ip-spoofing or users having reassigned ips in which case multiple votes can be cast by one person
