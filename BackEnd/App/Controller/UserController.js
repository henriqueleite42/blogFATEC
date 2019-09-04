const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authKey = require("../../Config/Auth");

const User = require("../Schemas/userSchema");

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authKey.secret, { expiresIn: 86400 });
}


router.post("/register", async (req, res) => {
    const { email } = req.body;

    try {
        if (await User.findOne({ email })) {
            return res.status(400).send({error: "User Already Exists."});
        }

        const user = await User.create( req.body );

        user.password = undefined;

        return res.send({ user, token: generateToken({ id: user.id }) });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Registration Fail."});
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select(["+password", "+email"]);

    if (!user) {
        return res.status(400).send({ error: "User Not Found." });
    }

    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({ error: "Invalid Password."});
    }

    user.password = undefined;

    res.send({ user, token: generateToken({ id: user.id }) });
});

module.exports = app => app.use("/auth", router);