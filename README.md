# basic-mern
A demonstration of how to implement a basic MERN application.

To run the application, you'll first need to add a file `credentials.js` to
the main project directory with the following

```javascript
const dbRoute = <mongo db connection string uri>

module.exports = {dbRoute: dbRoute}
```

The application can then be run from the project directory using

```
npm install
npm start
```

## preparation

### mac
To get ready to make our basic app, we're gonna need some packages installed.
First, homebrew, a mac and linux package manager. First, check if it's already
installed by opening terminal and typing `brew`. If you see a list of commands,
you're good to go. If not, run this command.

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

With brew installed, we'll now run the following command (the first may take a while
to complete).

```
brew install node
```

### windows
We'll need some basics installed for the rest of the tutorial. Visit
(this link)[https://nodejs.org/en/download/] and install the latest version
of node. From now on, whenever typing commands in terminal, use the node.js
command prompt that installed.

## front end

With our preparation done, we'll need to install one more package. In terminal,
run

```
npm install --global create-react-app
```

Now we can create the react app using (you guessed it) create-react-app. To do
this, type in terminal

```
create-react-app client
```

This will create a folder with boilerplate code for react and install the necessary
packages (there's a lot). This may also take a couple of minutes. It will also
create a README with some useful instructions and links.

The files we'll be looking at are in the `src` directory inside the client folder
that was just created. Specifically, `App.js` holds the code that will be rendered
when we launch our app. To take a look at this type in terminal

```
cd client
npm start
```

Allow terminal to accept connections and a browser window should launch
with a spinning react logo. Let's make some edits and see what happens.
Open `App.js` in your favorite text editor and delete everything inside of the
`return()` and replace it with

```html
<p>Welcome to our basic mern app!</p>
```

Once you save the file, your browser window should refresh and show the
text you just entered. If you get any errors, make sure you didn't delete
too much and that your text is wrapped in `<p></p>`.

## backend

Now that we have a basic page rendering, let's look at the backend. We'll go
back to the main directory and initialize a node project. Exit react with
`control+c` and type

```
cd ..
npm init
```

This will prompt you with some questions, but you can just hit `enter` to
stick with the default choices.

Inside the main project folder, create a file called `server.js` which will hold
all of our code for the backend of our app.

We'll need to install a couple more packages to get our app working, so go
back to terminal and type

```
npm install --save mongoose express body-parser
```

You'll notice new lines added to `package.json` and a new file created called
`package-lock.json` both of which contains lists of your app dependencies so
other developers can easily install them without you rehosting them all online.
Because of this, let's create a file called `.gitignore` that tells git not to
track certain directories and files that we don't want uploaded. To the new
file, simply add

```
/node_modules
```

Let's head back to our server logic and start writing some code. Open up
`server.js` and add the following code

```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Listening on port ${port}.`))
```

This creates the most basic app possible using react. Let's take a look at
how it works. In terminal type

```
node server.js
```

Now open a browser and visit `localhost:3000`. You'll see a white page that
says Hello World! at the top.

## connecting front and back

We now have a basic express app and a basic react app, but you'll notice that
they both ran on the same port. We'll need to fix it so that our express app
handles API calls and our react app knows to make API calls to the express app.
To start with, update `server.js` to look like

```javascript
const express = require('express')
const app = express()
const port = 5000

app.get('/api_call', (req, res) => res.send({message: 'Hello World!'}))

app.listen(port, () => console.log(`Listening on port ${port}.`))
```

We've now changed the port, the route express is handling (i.e., we'd now
visit `localhost:5000/api_call` instead of `localhost:5000`), and updated
its message to be in JSON format instead of raw text.

Now to let react know that we have a backend. Open the `package.json` file
in the `client` directory and add a comma at the end of the last item before
the closing `}` and add the line

```json
"proxy": "http://localhost:5000/"
```

That's it. React now knows that our API requests should be redirected to the
express server!

To see this in action, open back up `App.js` in the `client/src` directory
and change it too look like

```javascript
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    data: null
  }

  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({data: res.message}))
      .catch(err => console.log(err));
  }

  callBackendAPI = async () => {
    const response = await fetch('/api_call');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  }

  render() {
    return (
      <p>{this.state.data}</p>
    );
  }
}

export default App;
```

This may look like some drastic changes, but it's not too complicated. First,
we create a *state* which is a way for a react component to hold pieces of data.
After this, we added a `componentDidMount()` function, which react automatically
will call when the component loads. It calls our next function and saves the
result in the state we created earlier. We then wrote a function called
`callBackendAPI()` which asynchronously calls our API and returns the response.
Finally, in the `render()` function (which holds the actual information react
displays), we indicated to display the data from our state.

Let's take a look at this in action, back in terminal, navigate the the project
directory and type

```
npm install --save concurrently
```

In `package.json`, we'll add a command to run both the express backend and
the react app at the same time. Modify the existing `"scripts"` part of the file
to look like

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "concurrently \"node server.js\" \"cd client && npm start\""
},
```

Now in terminal, we can type

```
npm start
```

And a browser window will open to `localhost:3000` with the message we sent
from express appearing in our react app!

## database connection

Now that we have the ern part of our mern application put together, let's
add a database. For this, I recommend using
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas) which
will host up to 512 MB of data free, will prevent you from having to run your
own mongo database, and will allow your team to share the data in the database
easily.

To get started, create an account and click build a cluster. You should
be able to leave all the default options selected, but before you click
create cluster at the bottom, ensure that the cost is free. It will take some
time for your cluster to launch.

While that's working, we'll need to add some code to our server that will
connect to the database, send data to the react app, and allow us to change
data. To the top of `sever.js` add

```javascript
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const credentials = require('./credentials')
const Data = require('./data')
```

and after we call `const app = express()`, add

```javascript
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

mongoose.connect(credentials.dbRoute, {useNewUrlParser: true})
let db = mongoose.connection

db.once("open", () => console.log("Connected to the database."))
db.on("error", console.error.bind(console, "MongoDB connection error:"))
```

These lines will let us connect to the database and notify us when we're
connected, or if we encounter any unexpected errors. Along with this, we'll
need to create a couple more files.

First, create a file in the main directory called `data.js`. This will hold
the *data schema* of our database, essentially the structure of information.

In this file, we'll add

```javascript
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DataSchema = new Schema(
  {
    message: String
  },
  {timestamps: true}
)

module.exports = mongoose.model("Data", DataSchema)
```

All we've done is define a data schema that has a message, which is a string.
Also note every mongoDB document by default has a field called `_id`, which
is a unique identifier. We then export that schema so that we can
import it in `server.js` with the line `const Data = require(./data)`.

Now, we'll create `credentials.js`. This file will hold the connection link
to our database. Hopefully the database cluster has been spun up by now, but
if not you can move on and come back to this section later. The reason we
keep the connection link here is because it holds all the information necessary
for **anyone** to access your database, so we don't want to push it to GitHub
(this also means you'll need to communicate it to your team in some other way).

Before editing `credentials.js`, go back to your Atlas account and click
the connect button on your cluster. You'll need to whitelist your IP (as
well as the IP of any teammates who will be accessing it) and add a user.
Be sure to save the user credentials. After this, click choose a connection
method, and select connect your application. You should then be able to select
the short SRV connection string and copy it.

Now, in `credentials.js`, add the following

```javascript
const dbRoute = "<connection string with user password inserted>"

module.exports = {dbRoute: dbRoute}
```

Finally, we'll want to add a line to `.gitignore` to indicate that our
credentials file shouldn't be pushed, so insert

```
credentials.js
```

on a new line in the `.gitignore` in the main project directory.

You should now be able to run the server with `node server.js` and see
the console output `Connected to the database`.

## database routes

Let's now make the app actually display and change some data from the database.
To do this, we need to add some routes to the server that our react app can call.
Open up `server.js` and replace our current `app.get()` with the following

```javascript
app.post("/write_data", (req, res) => {
  let data = new Data()
  const {message} = req.body

  if (!message) return res.json({success: false, error: "Invalid input."})

  data.message = message
  data.save(err => {
    if (err) return res.json({success: false, error: err})
    return res.json({success: true})
  })
})

app.get("/get_data", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({success: false, error: err})
    return res.json({success: true, data: data})
  })
})
```

We've added a couple functions. One will write data to the database that is
sent in the body of a request to the URL. The other will return data from the
database (all the data in the database in this case).

To see this in effect, let's use these routes in our react app. First we need
to install a package that will let us interact with the *post* function that
we put in our app. Open terminal to your home directory and type

```
cd client
npm install --save axios
```

Now open up `App.js` and delete the code from within `componentDidMount()`.
You can also delete the `callBackendAPI()` function. Now let's write a few
functions to call our backend routes. At the top of the file, add

```javascript
import axios from "axios";
```

Then inside the class `App` add these new functions

```javascript
getDataFromDB = () => {
  fetch('/get_data')
    .then((data) => data.json())
    .then((res) => this.setState({data: res.data}))
}

writeDataToDB = (message) => {
  axios.post('/write_data', {message: message})
    .then(() => this.getDataFromDB())
}
```

Ok, so these functions simply call our api with the necessary information
and update our state with the response (which will make react re-render
our website).

We still need to add some code to display the elements on the page that will
let us interact with the api. Again in `App.js`, edit the return statement to

```javascript
return(
  <div>
    <div>
      <ul>
        {this.state.data.length <= 0
          ? "No entries in database yet."
          : this.state.data.map(dat => (
            <li style={{padding: "10px"}} key={this.state.data.message}>
              <span style={{color: "gray"}}> id: </span> {dat.id} <br/>
              <span style={{color: "gray"}}> data: </span> {dat.message}
            </li>
          ))}
      </ul>
    </div>
    <div style={{padding: "10px"}}>
      <input type="text" onChange={(e) => this.setState({ message: e.target.value })}
        placeholder="add something in the database" style={{width: "200px"}}/>
      <button onClick={() => this.writeDataToDB(this.state.message)}>add</button>
    </div>
    <div style={{padding: "10px"}}>
      <button onClick={() => this.getDataFromDB()}>load</button>
    </div>
  </div>
)
```

This again looks like quite a bit of code, but most of it is just HTML and some
styling. The important parts are a list that maps each entry in the data we
load to an element in the list, each of which shows the id and the data stored.
The next is an input that stores its current value in our state and a button
that writes that current value to the database when clicked. Finally, we have
a button that loads all our data from the database.

If you remember our state, we didn't actually have a message field and our
data was null, not a list. So, let's edit the state to have a couple more fields

```javascript
state = {
  data: [],
  message: null
}
```

We can now run the app and see ourselves interact with the database. As a
reminder, we can run the program by typing `npm start` in the main directory.
Then, type something in the input box, click add, and click load. You should
see the message that indicates no entries in the database replaced with
id 0 and your message.

If you restart the app and run it again, you'll see that it still indicates
we have no entries in the database. To fix this, we'll change the
`componentDidMount()` function we deleted the contents from earlier. Place the
following in it

```javascript
this.getDataFromDB()
```

If you restart the app now, you'll see the data populated without clicking
the load button.

That's it, you now have a working MERN app, congratulations! As an exercise,
try to add a couple more pieces of functionality to the app. Specifically, the
ability to delete entries from the database (given their ID) and the ability
to update entries in the database (given their ID and a new message).

For delete, you'll need to add a new route in your server (define it with
`app.delete()`) that calls the `Data.findByIdAndDelete()` function which you can
learn more about
[here](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete).
You'll also need to add a new input box and button to the react app, which
calls your new server route.

For update, you'll again need a new server route (this time use `app.post()`)
that calls the `Data.findByIdAndUpdate()` function which you can learn more
about [here](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate).
For this, you'll need to add two new input boxes and a button to the react app.

If you get stuck, the code with this functionality is in this repository,
but try to figure it out on your own first.
