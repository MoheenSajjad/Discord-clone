// lib/mongodb/models/server.js

const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
    inviteCode: {
        type: String,
        unique: true
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
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

const Server = mongoose.models.Server || mongoose.model('Server', serverSchema);

export default Server
