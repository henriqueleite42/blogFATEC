const express = require('express');
const router = express.Router();

const adm = require('../../Middleware/Adm');
const auth = require('../../Middleware/AuthToken');

const Users = require('../../Schemas/userSchema');
const Posts = require('../../Schemas/postSchema');

router.use(auth);
router.use(adm);

// List All Users
router.get('/', async (req, res) => {
    try {
        const users = await Users.find().select(['+created', '+email', '+status']);

        return res.send({
            status: 'OK',
            results: users
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            status: 'UNKNOWN_ERROR',
            results: []
        });
    }
});

// Show Specifc User
router.get('/:userId', async (req, res) => {
    try {
        const user = await Users.findById(req.params.userId).select(['+created', '+email', '+status']);

        return res.send({
            status: 'OK',
            results: user
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            status: 'UNKNOWN_ERROR',
            results: []
        });
    }
});

// Manage BookMarks
router.put('/bookmarks', async (req, res) => {
    try {
        const user = await Users.findOne(
            { _id: req.userId },
            { bookmarks: 1, _id: 0 }
        );

        const bookmarks = user.bookmarks;
        if (bookmarks != undefined && bookmarks.includes(req.query.postId)) {
            if ( bookmarks.includes(req.query.postId) ) {
                await Users.findOneAndUpdate(
                    { _id: req.userId },
                    { '$pull': { 'bookmarks': req.query.postId } },
                    { returnOriginal: false }
                );

                return res.send({
                    status: 'OK'
                });
            }
        } else {
            await Users.findOneAndUpdate(
                { _id: req.userId },
                { '$push': { 'bookmarks': req.query.postId } },
                { returnOriginal: false }
            );

            return res.send({
                status: 'OK'
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            status: 'UNKNOWN_ERROR',
            results: []
        });
    }
});

// List Bookmarks
router.get('/bookmarks', async (req, res) => {
    try {
        const bookmarks = await Users.findOne({ _id: req.userId }, { bookmarks: 1 }).select(['+bookmarks']);

        return res.send({
            status: 'OK',
            results: bookmarks
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            status: 'UNKNOWN_ERROR',
            results: []
        });
    }
});

module.exports = app => app.use('/users', router);