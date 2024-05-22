import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    memberOneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    memberTwoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    directMessages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DirectMessage'
    }]
});

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);

export default Conversation