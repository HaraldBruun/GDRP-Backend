const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const usersRoute = require("./routes/users");
const dataRoute = require("./routes/data");
const permissionRoute = require("./routes/permission");
const requestRoute = require("./routes/request")
const {authenticationRoute, validToken} = require("./routes/authentication")
const crypto = require("crypto")
const User = require("./models/User")
const { generateKeyPairs } = require("./utils")
require("dotenv").config();

app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        err ? console.log(err) : console.log("Connected to DB");
    }
);

app.use("/login", authenticationRoute);

// Create new user
app.post("/user", async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: crypto
            .createHash("sha256")
            .update(req.body.password)
            .digest("hex"),
        accountAddress: req.body.accountAddress,
        citizenContract: req.body.citizenContract,
    });
    try {
        const newUser = await user.save();
        const privateKey = await generateKeyPairs(newUser._id, newUser.accountAddress)        
        res.send({privateKey: privateKey});
    } catch (err) {
        res.send(err);
    }
});

// Token authenticator for all routes below
app.use((req, res, next) => {
    if (validToken(req, res)) {
        next();
    } else {
        res.sendStatus(401);
    }
});

// middleware
app.use("/user", usersRoute);
app.use("/data", dataRoute);
app.use("/permission", permissionRoute);
app.use("/request", requestRoute);

app.get("/", (req, res) => {
  res.send({message: "Hello world"})
})

app.listen(process.env.PORT || 3000, function () {
    console.log(
        "Express server listening on port %d in %s mode",
        this.address().port,
        app.settings.env
    );
});