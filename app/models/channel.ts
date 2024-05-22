// lib/mongodb/models/channel.js

import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    name: String,
    type: {
        type: String,
        default: 'TEXT'
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    serverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Server',
        required: true
    },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Channel = mongoose.models.Channel || mongoose.model('Channel', channelSchema);

export default Channel;
