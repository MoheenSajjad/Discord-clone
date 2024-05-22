// lib/mongodb/models/profile.js

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true
    },
    name: String,
    imageUrl: String,
    email: String,
    servers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Server'
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    }],
    channels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile;
