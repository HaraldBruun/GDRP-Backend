const express = require("express");
const User = require("../models/User");
const router = express.Router();
const crypto = require("crypto");

router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.send(error);
    }
});

router.post("/", async (req, res) => {
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
        res.json(newUser);
    } catch (err) {
        res.send(err);
    }
});

router.get("/id/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.send(err);
    }
});

router.get("/userid/:id", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.id });
        if (user) {
            res.json(user);
        } else {
            res.send({ message: "User not found" });
        }
    } catch (err) {
        res.send(err);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedUser = await User.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    username: req.body.username,
                    password: req.body.password,
                },
            }
        );
        res.json(updatedUser);
    } catch (err) {
        res.send(err);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await User.remove({ _id: req.params.id });
        res.json(deletedUser);
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;
