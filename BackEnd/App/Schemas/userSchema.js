const mongoose = require('../../Database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    picture: {
        type: String,
        default: 'img/defaultAvatarIcon.png'
    },
    status: {
        type: Number,
        require: true,
        default: 0
    },
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
        select: false
    },
    password: {
        type: String,
        require: true,
        select: false
    },
    created: {
        type: Date,
        default: Date.now,
        select: false
    }
});

UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;