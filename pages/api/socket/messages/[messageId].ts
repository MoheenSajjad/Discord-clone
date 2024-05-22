import Channel from '@/app/models/channel';
import Member from '@/app/models/member';
import Message from '@/app/models/message';
import Server from '@/app/models/server';
import { currentProfilePages } from '@/lib/current-profile-pages';

import { NextApiResponseServerIo } from '@/types';
import { MemberRole } from '@prisma/client';
import { NextApiRequest } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
) {
    if (req.method !== 'DELETE' && req.method !== 'PATCH') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const profile = await currentProfilePages(req);
        const { messageId, serverId, channelId } = req.query;
        const { content } = req.body;

        if (!profile) return res.status(401).json({ error: 'Unatuh' });

        if (!serverId)
            return res.status(401).json({ error: 'Server id not found' });

        if (!channelId)
            return res.status(401).json({ error: 'Client id not found' });


        const member = await Member.findOne({ profileId: profile._id })


        const server = await Server.findOne({ _id: serverId }).populate("members")
        if (!server) return res.status(404).json({ error: 'Server not found' });

        const channel = await Channel.findOne({ _id: channelId, serverId: serverId })
        if (!channel) return res.status(404).json({ error: 'Channel not found' });


        const serverMembers = server.members.find((member: any) => member.profileId == profile._id)
        if (!member) return res.status(404).json({ error: 'Member not found' });


        let message = await Message.findOne({ _id: messageId, channelId: channelId })
        if (!message || message.deleted) {
            return res.status(404).json({ error: 'Message not allowed' });
        }

        // console.log('message is=------------------', message);










        // console.log("member is -----------", member);


        const isMessageOwner = message.memberId.toString() === member._id.toString();
        // console.log("-------------", isMessageOwner);

        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;

        if (!canModify) {
            return res.status(401).json({ error: 'Unauth' });
        }

        if (req.method === 'DELETE') {
            message = await Message.findByIdAndUpdate({ _id: message._id }, { fileUrl: null, content: 'This Message has been deleted', deleted: true },
                { new: true }).populate({
                    path: 'memberId',
                    populate: {
                        path: 'profileId',
                        model: 'Profile'
                    }
                })
        }


        if (req.method === 'PATCH') {
            // console.log("trying to update the budshdihsioddjdsifjsifj----------------------");

            if (!isMessageOwner) {
                return res.status(401).json({ error: "Unauthorized not allowed to edit the message" })
            }

            message = await Message.findByIdAndUpdate({ _id: message._id }, { content, updatedAt: Date.now() },
                { new: true }).populate({
                    path: 'memberId',
                    populate: {
                        path: 'profileId',
                        model: 'Profile'
                    }
                })
        }


        // console.log("message updated is ---------------", message);




        const updateKey = `chat:${channelId}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.log('Message Id', error);
    }
}