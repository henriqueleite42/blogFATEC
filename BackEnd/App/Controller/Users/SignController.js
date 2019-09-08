const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authKey = require('../../../Config/Auth');

const User = require('../../Schemas/userSchema');

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authKey.secret, { expiresIn: 259200000 });
}


router.post('/register', async (req, res) => {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    try {
        const { email, password } = req.body;

        if (await  ! emailRegex.test(email)) {
            return res.status(400).send({ error: 'Invalid E-mail.' });
        }

        if (await User.findOne({ email })) {
            return res.status(400).send({ error: 'User Already Exists.' });
        }

        if (await ! passwordRegex.test(password)) {
            return res.status(400).send({ error: 'Invalid Password' });
        }

        const user = await User.create( req.body );

        res.cookie('blogFatec', generateToken({ id: user._id }), { maxAge: 259200000, httpOnly: true });

        return res.send({ ok: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Registration Fail.'});
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select(['+password', '+email']);

        if (!user) {
            return res.status(400).send({ error: 'User Not Found.' });
        }

        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).send({ error: 'Invalid Password.'});
        }

        res.cookie('blogFatec', generateToken({ id: user._id }), { maxAge: 259200000, httpOnly: true });

        return res.send({ ok: true });
    } catch (err) {
        return res.status(400).send({ error: 'Login Fail.'});
    }
});

module.exports = app => app.use('/auth', router);