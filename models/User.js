const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    githubId: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    bannedUntil: { type: Date, default: null } // null means not banned
});

module.exports = mongoose.model('User', UserSchema);
