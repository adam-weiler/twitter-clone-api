// Dependencies:
//
// mongodb : A MongoDB database driver that allows your Node.js applications to connect to the database and work with data.
// express: The web framework for Node.js.
// cors: A Node.js package that allows cross origin resource sharing.
// dotenv: The module that loads environment variables from the .env file into processes.env file. This seperates config files from the code.
// bcrypt: Used to has the password we save to the database.
// jsonwebtoken: Used to authorize a user has access to a certain route, after they have already been authenticated.
// mongoose: Used to connect to a database.
// body-parser: Allows us to access post data from React in our post requests.

// const express = require("express");
// const bodyParser = require("body-parser");

// const app = express();

// // body-parser middleware setup
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // The /home route returns an object when fetched.
// app.get("/home", (req, res) => {
//     res.json({
//         name: "Bill",
//         age: 99
//     })
// });

// const cors = require("cors");
// require("dotenv").config({ path: "./config.env" }); 
// const port = process.env.PORT || 5000;
// app.use(cors());
// app.use(express.json());
// // app.use(require("./routes/record"));
// // get driver connection
// // const dbo = require("./db/conn");

// app.post("/home", (req, res) => {
//   console.log(req.body);
// })
 
// app.listen(port, () => {
//   // perform a database connection when server starts
// //   dbo.connectToServer(function (err) {
// //     if (err) console.error(err);
 
// //   });
//   console.log(`Server is running on port: ${port}`);
// });






// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const Tweet = require("./models/Tweet");

// mongoose.connect("mongodb://127.0.0.1:27017/tweets", { useNewUrlParser: true });

// mongoose.connection.once("open", () => {
//   console.log("Mongodb connection established successfully");
// });

// const PORT = 4000;

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   Tweet.find((err, tweets) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.json(tweets);
//     }
//   });
// });

// app.post("/create", (req, res) => {
//   const tweet = new Tweet(req.body);
//   tweet
//     .save()
//     .then((tweet) => {
//       res.json(tweet);
//     })
//     .catch((err) => {
//       res.status(500).send(err.message);
//     });
// });

// app.get("/:id", (req, res) => {
//   const id = req.params.id;
//   Tweet.findById(id, (err, tweet) => {
//     res.json(tweet);
//   });
// });

// app.post("/:id", (req, res) => {
//   const id = req.params.id;
//   Tweet.findById(id, (err, tweet) => {
//     if (!tweet) {
//       res.status(404).send("Tweet not found");
//     } else {
//       tweet.text = req.body.text;

//       tweet
//         .save()
//         .then((tweet) => {
//           res.json(tweet);
//         })
//         .catch((err) => res.status(500).send(err.message));
//     }
//   });
// });

// app.listen(PORT, () => {
//   console.log("Server is running on port " + PORT);
// });


//This doesn't work:
//curl -H "Content-Type: application/json" --request POST -d '{"text":"test"}' http://localhost:4000/create

//This works:
//curl -i -X POST -H "Content-Type:application/json" -d "{\"text\": \"Frodo\"}" http://localhost:4000/create

//This works too:
//curl http://localhost:4000/62194786f0789e668829dca8
//





import express from "express";
import cors from "cors";
import allRoute from "./api/all.route.js";

const app = express();

app.use(cors());    // Apply our middleware, CORS module.
app.use(express.json());    // Our server can accept JSON in the body of a request. Previously required body-parser, but express can do this now.

app.use("/api/v1/tweets", allRoute);    // Accessed with http://localhost:5000/api/v1/tweets
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));    // A route that doesn't exist in our route file.

export default app; // Export this file as a module.