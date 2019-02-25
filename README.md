# basic-mern
A demonstration of how to implement a basic MERN application

## preparation
To get ready to make our basic app, we're gonna need some packages installed.
First, homebrew, a mac and linux package manager. First, check if it's already
installed by opening terminal and typing `brew`. If you see a list of commands,
you're good to go. If not, run this command.

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

With brew installed, we'll now run the following commands (the first may take a while
to complete).

```
brew install node
npm install --global create-react-app
```

## front end

Now that we have these installed, we can create the react app using (you guessed it)
create-react-app. To do this, type in terminal

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
