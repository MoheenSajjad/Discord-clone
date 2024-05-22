import mongoose from "mongoose";


const directMessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


const DirectMessage = mongoose.model('DirectMessage', directMessageSchema);

export default DirectMessage
