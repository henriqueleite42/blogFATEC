const mongoose = require('../../Database');

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    answer: {
        type: mongoose.Schema.Types.ObjectId
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date
    },
    answer: {
        type: mongoose.Schema.Types.ObjectId
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
}, { versionKey: false });

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    text: {
        type: String,
        require: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        select: false
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    comments: [CommentSchema]
}, { versionKey: false });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;