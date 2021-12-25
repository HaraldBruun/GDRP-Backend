const express = require("express");
const User = require("../models/User");
const authenticationRoute = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

authenticationRoute.post("/", async (req, res) => {
        if (await authenticated(req.body.username, req.body.password)) {
            let payload = { subject: req.body.username };
            let token = jwt.sign(payload, process.env.secret, {
                expiresIn: 60,
            });
            res.status(200).send({ token });
        } else {
            res.status(401).send("Unauthorized");
        }
});

const authenticated = async (username, password) => {
    let user = await User.findOne({ username: username });
    if (user) {
        let hashedPass = crypto
            .createHash("sha256")
            .update(password)
            .digest("hex");
        return user.password === hashedPass;
    } else {
        return false;
    }
};

const validToken = (req) => {
    if (!req.headers.authorization) {
        return false;
    }
    let token = req.headers.authorization.split(" ")[1];
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

module.exports = { authenticationRoute, validToken };
