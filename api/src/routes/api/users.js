const mongoose = require('mongoose');
const router = require('express').Router();
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/register', async function (req, res) {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName) {
            return res.status(400).send("First name is required");
        }
        if (!lastName) {
            return res.status(400).send("Last name is required");
        }
        if (!email) {
            return res.status(400).send("Email is required");
        }
        if (!password) {
            return res.status(400).send("Password is required");
        }

        const isExistingUser = await User.findOne({ email });
        if (isExistingUser) {
            return res.status(400).send("User already exists");
        }
        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: encryptedPassword
        })

        const jwtToken = jwt.sign({
            userId: newUser._id,
            email
        }, process.env.TOKEN_KEY, {
            expiresIn: "1h"
        });

        newUser.token = jwtToken;

        return res.status(201).json(newUser);

    } catch (err) {
        console.error(err);
    }
});

router.post('/login', async function (req, res) {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(403).send('Email is required');
        }
        if (!password) {
            return res.status(403).send('Password is required');
        }
        const isUserExists = await User.findOne({ email });
        if (!isUserExists) {
            return res.status(403).send('User not found');
        }
        const isMatches = await bcrypt.compare(password, isUserExists.password);
        if (isMatches) {
            const jwtToken = jwt.sign({
                userId: isUserExists._id, email
            }, process.env.TOKEN_KEY, {
                expiresIn: '1h'
            });
            jwt.sign
            isUserExists.token = jwtToken;

            return res.status(200).send(isUserExists);
        }
        return res.status(400).json('Invalid password');
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
