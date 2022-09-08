## Summary

Project for Northcoders Backend Week 3.

Hosted on Heroku
Found: https://nc-be-project-nc-games.herokuapp.com/api

An api used to review board games and comment on the reviews. All endpoints serve json responses and detailed instruction of how to use the endpoints can be found in endpoints.json.

### Cloning the repository

#### Minimum requirements:

- node version 16.16.0 or later
- psql 12.12 or later

fork the repository and then run npm i to install all the dependencies listed in the package.json

### Initialising the databases

run: "npm run setup-dbs" from the command line to set up the postgreSQL databases
then run "npm run seed" to add the data to the databases

### Connecting to local Database

To connect to your own database locally, create ".env.development" and ".env.test" in the root folder of this project, these files should contain PGDATABASE=<nc_games> and PGDATABASE=<nc_games_test> respectively as seen in "env-example".

### Testing

run: "npm t" to test using jest

to run server locally run "npm run dev"
