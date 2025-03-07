const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config')
const auth = require('../../middleware/auth')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');

const User = require('../../models/Users');
const { JsonWebTokenError } = require('jsonwebtoken');



// get current user profile

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// get all profiles

router.get('/', async (req, res) => {
    try {
        const profiles = await User.find();
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Route to register a new user
router.post('/', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please add a valid email').isEmail(),
    check('password', 'please enter a password').isLength({ min: 6 })
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, contact, dob, gender } = req.body;

        try {

            let user = await User.findOne({ email });

            if (user) {
                res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }

            user = new User({
                name,
                email,
                password,
                contact,
                dob,
                gender
            });

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'), { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })
                });

            // res.send('User registered');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    });


// @route    PUT api/users/buses
// @desc     Book Buses
// @access   Private
router.put(
    '/buses',
    auth,
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { from, to, nameArray, noArray, tokenData, dat } = req.body;
        try {
            const profile = await User.findById(req.user.id);
            profile.ticket.unshift({ from, to, nameArray, noArray, tokenData, dat });
            await profile.save();

            res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;