import { currentProfilePages } from '@/lib/current-profile-pages';
import Server from '@/app/models/server';
import Channel from '@/app/models/channel';
import { NextApiResponseServerIo } from '@/types';
import { NextApiRequest } from 'next';
import Member from '@/app/models/member';
import Message from '@/app/models/message';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const profile = await currentProfilePages(req);
        const { content, fileUrl } = req.body;
        const { serverId, channelId } = req.query;

        if (!profile) return res.status(401).json({ error: 'Unauth' });

        if (!serverId) return res.status(400).json({ error: 'Channel Id Missing' });

        if (!content) return res.status(400).json({ error: 'Content missing' });
        console.log("serverid profile id", serverId, profile._id);


        const mem = await Member.findOne({
            profileId: profile._id,
            serverId: serverId
        })
        // console.log("mem-------", mem);

        const server = await Server.findOne({
            _id: serverId,
            'members': { $in: mem._id }
        }).populate('members');

        console.log("server found is -----------", server, profile._id);

        if (!server) return res.status(404).json({ message: 'Sserver not found' });

        const channel = await Channel.findOne({
            _id: channelId, serverId: serverId
        })
        // console.log("channel found is --------------", channel);

        // const channel = await db.channel.findFirst({
        //     where: {
        //         id: channelId as string,
        //         serverId: serverId as string,
        //     },
        // });

        if (!channel) return res.status(404).json({ message: 'Channel not found' });

        console.log(server.members);

        const member = server.members.find((member: any) => {
            return (
                member.profileId.toString() === profile._id.toString()
            )

        })



        if (!member) return res.status(404).json({ message: 'Member not found' });

        // console.log("member found are --------", member, profile._id);



        if (!member) return res.status(404).json({ message: 'Member not found' });

        console.log("chanell id is ,member id is =------------------", channelId, member._id);

        const message = await (await Message.create({
            content,
            fileUrl,
            channelId: channelId,
            memberId: member._id,
        })).populate({
            path: "memberId",
            populate: {
                path: 'profileId',
                model: 'Profile'
            }
        })

        console.log("message created is --------------", message);


        const channelKey = `chat:${channelId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.log('Messages_POST', error);
        return res.status(500).json({ message: 'Internal error' });
    }
}