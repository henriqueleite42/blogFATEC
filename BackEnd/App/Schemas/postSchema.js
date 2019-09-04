const mongoose = require("../../Database");

const TagSchema = new mongoose.Schema({
    tag: {
        type: String,
        require: true
    }
});

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true
    },
    status: {
        type: Number,
        require: true,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    }
});

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
    modified: {
        type: Date
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    status: {
        type: Number,
        require: true,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    tags: {
        type: [TagSchema]
    },
    comments: [CommentSchema]
});

CommentSchema.pre("update", function(next) {
    this.modified = Date.now;
    next();
});

CommentSchema.pre("save", function(req, res, next) {
    this.author = req.userId;
    next();
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;