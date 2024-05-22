// lib/mongodb/models/member.js

import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    role: {
        type: String,
        default: 'GUEST'
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
    directMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DirectMessage' }],
    conversationsInitiated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
    conversationsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);

export default Member;
