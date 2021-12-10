const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cors = require("cors");
const usersRoute = require("./routes/users");
require("dotenv").config();

app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// middleware
app.use("/user", usersRoute);

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        err ? console.log(err) : console.log("Connected to DB");
    }
);

app.post("/login", (req, res) => {
    if (authenticated(req.body.username, req.body.password)) {
        let payload = { subject: req.body.username };
        let token = jwt.sign(payload, process.env.secret, { expiresIn: "1d" });
        res.status(200).send({ token });
    } else {
        res.status(401).send("Unauthorized");
    }
});

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

const validToken = (req) => {
    console.log(req.headers)
    if (!req.headers.authorization) {
        return false;
    }
    let token = req.headers.authorization
    console.log(token)
    if (token === "null") return false;
    let payload;
    try {
        payload = jwt.verify(token, process.env.secret);
    } catch (error) {
        console.log("Not verified");
    }
    if (!payload) return false;

    return true;
};

const authenticated = (password) => {
    // mongo login here
    var hashedPass = crypto.createHash("sha256").update(password).digest("hex");

    // return hashedPass === process.env.password

    return true;
};
