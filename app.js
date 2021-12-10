const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const usersRoute = require("./routes/users");
const {authenticationRoute, validToken} = require("./routes/authentication")
require("dotenv").config();

app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// middleware
app.use("/user", usersRoute);
app.use("/login", authenticationRoute);

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        err ? console.log(err) : console.log("Connected to DB");
    }
);

app.use((req, res, next) => {
    if (validToken(req, res)) {
        next();
    } else {
        res.sendStatus(401);
    }
});

app.get("/", (req, res) => {
  res.send("Hello world")
})

app.listen(process.env.PORT || 3000, function () {
    console.log(
        "Express server listening on port %d in %s mode",
        this.address().port,
        app.settings.env
    );
});