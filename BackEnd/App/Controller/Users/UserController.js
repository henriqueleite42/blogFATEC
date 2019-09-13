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
            status: 'UNKNOWN_ERROR'
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
            status: 'UNKNOWN_ERROR'
        });
    }
});

// Delete User and User Comments
router.delete('/:userId', async (req, res) => {
    try {

        await Users.findByIdAndRemove(req.params.userId);

        return res.send({
            status: 'OK'
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            status: 'UNKNOWN_ERROR'
        });
    }
});

//BookMarks
router.put('/bookmark/:postId', async (req, res) => {
    try {
        const user = await Users.findOne({ _id: req.userId });

        const bookmarks = user.bookmarks;
        if (bookmarks != undefined && bookmarks.includes(req.params.postId)) {
            if ( bookmarks.includes(req.params.postId) ) {
                await Users.findOneAndUpdate(
                    { _id: req.userId },
                    { '$pull': { 'bookmarks': req.params.postId } },
                    { returnOriginal: false }
                );

                return res.send({
                    status: 'OK'
                });
            }
        } else {
            await Users.findOneAndUpdate(
                { _id: req.userId },
                { '$push': { 'bookmarks': req.params.postId } },
                { returnOriginal: false }
            );

            return res.send({
                status: 'OK'
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            status: 'UNKNOWN_ERROR'
        });
    }
});

module.exports = app => app.use('/users', router);