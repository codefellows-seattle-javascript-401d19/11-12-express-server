In the README.md write documention for starting your server and makeing requests to each endpoint it provides. The documentaion should describe how the server would respond to valid and invalid requests.

--------------------------------------------------------------------------

A] Starting this server:
In order to run my Node instance in this lab...
1. Clone the gitHub repository.
Since we're assuming this whole project is being run from your local system...
2. Create an ENV file with the following information:

PORT=3000[or your preferred port for Node to listen on]
MONGODB_URI=http://localhost

From the project's root directory
3. ...run ($ npm install).
4. ...create a 'db' folder, then run ($ mongod --dbpath "./db")
6. ...then run ($ jest) if jest is installed globally, or ($npm test) if it is installed locally.

B] Making requests:

The test suite is intended to make an automatic battery of requests to test the basic integrity of the server and its routes...

If a user wished to start the server and make custom calls against it themselves, the user would need to...

1. Install the program as described above (if not already done so),
2. Using a program which can custom-make requests, and target custom URLs (or URIs), target the desired route (either a proper or a breaking URI) with the URL, form a payload (empty, corrupt, or accurate), and then send off the requests to view the results.

Available endpoints are as follows:

[site]/api/plants
- This url only responds POST requests
- When posted to with an well-populated 'Plant' object, this route will commit it to the local MongoDB, and then respond with *that* object (plus additional fields returned by Mongo as it wrote the object), and a 200 Status Code.
- When posted to with a malformed 'Plant' object, this route will respond with a 400 Status Code.
- If an unexpected error happens at any point during this Route's processing, it will return a 500 Status Code.

[site]/api/plants:id | 
- This url only responds GET requests
- When posted to with an valid 'plant._id' string, this route will retrieve the Plant object with that '._id' from the local MongoDB, and then respond with *that* object and a 200 Status Code.
- When posted to with a nonexistent 'Plant ._id' value, this route will respond with a 404 Status Code.
- If an unexpected error happens at any point during this Route's processing, it will return a 500 Status Code.
