
import Conversation from '../app/models/conversation'


export const getOrCreateConversation = async (
    memberOneId: string,
    memberTwoId: string
) => {
    let conversation =
        (await findConversation(memberOneId, memberTwoId)) ||
        (await findConversation(memberTwoId, memberOneId));

    // console.log("conversation result is -------------", conversation);


    if (!conversation) {
        conversation = await createNewConversation(memberOneId, memberTwoId);
    }

    return conversation

};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        const conversation = await Conversation.findOne({
            memberOneId: memberOneId,
            memberTwoId: memberTwoId
        }).populate({
            path: 'memberOneId',
            populate: {
                path: 'profileId',
                model: 'Profile'
            }
        }).populate({
            path: 'memberTwoId',
            populate: {
                path: 'profileId',
                model: 'Profile'
            }
        });

        // console.log("conversation found is ", conversation);
        return conversation
    } catch (error) {
        console.log("error finding teh conversation", error);

        return null;
    }
};




const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        const conv = await Conversation.create({ memberOneId, memberTwoId })

        const conversation = await Conversation.findOne({
            _id: conv._id
        }).populate({
            path: 'memberOneId',
            populate: {
                path: 'profileId',
                model: 'Profile'
            }
        }).populate({
            path: 'memberTwoId',
            populate: {
                path: 'profileId',
                model: 'Profile'
            }
        });

        console.log("created new conversation +++++++", conversation._id);

        return conversation

    } catch (error) {
        console.error("Error creating conversation:", error);
        return null;
    }
};
