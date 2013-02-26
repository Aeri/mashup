# Instructor comments for improvement of skills

## General Comments

* Make a `.gitignore` file and put `node_modules/` in it so that Git will ignore your node modules.  You specify the modules in the `package.json` and they will be installed for other people when they run `npm install`.

## `app.js`

* Hide your `appId` and `secret`.  You don't want other people to be able to see these.
* In Line 48, don't use debugging statements.  Those are okay for testing, but shouldn't be included in the finished product.
* Put your routes in their own files rather than directly into `app.js`.  Makes it easier to read the `app.js` file and keeps it less cluttered.
* Line 61: You should `return console.log (error);` otherwise the code will continue and execute the stuff that's only supposed to execute upon success.  Also log the error, not an arbitrary string.  Logging the error itself is more useful.

## routes

### `user.js`

* You shouldn't have any `console.log`s (most of the time).  These are meant to be for debugging, and you don't want your server code to be dumping random text into the logs.
  * The best thing to do when there's an error is to render an error page.
* Are you using `export.tweet`?  If not, DELETE.

### `index.js`

* I don't think you use this file, you can get rid of it.

## views

### `book.jade`

* Never leave a `console.log` in client-side JS code.  A user using your app will be able to see these logs.
