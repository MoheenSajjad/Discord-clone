import { currentProfile } from '@/lib/current-profile';
import Channel from '@/app/models/channel';
import { MemberRole } from '@prisma/client';
import { SERVER_DIRECTORY } from 'next/dist/shared/lib/constants';
import { NextResponse } from 'next/server';
import Member from '@/app/models/member';
import Server from '@/app/models/server';

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get('serverId');

        if (!profile) return new NextResponse('Unauth', { status: 401 });

        if (!serverId)
            return new NextResponse('Server Id missing', { status: 400 });

        if (name === 'general')
            return new NextResponse('Name cannot be general', { status: 400 });

        const member = await Member.findOne({ profileId: profile._id })
        // console.log(member);
        let channel
        if (member.role == 'ADMIN' || member.role == 'MODERATOR') {
            channel = await Channel.create({ serverId, profileId: profile._id, name, type })


        } else {
            return new NextResponse('you are not allowed to create channel', { status: 400 });
        }

        const servers = await Server.findOneAndUpdate(
            { _id: serverId },
            { $push: { channels: channel._id } },
            { new: true }
        );

        const Channels = await Channel.find({ serverId: serverId }).sort({ createdAt: 1 });


        const Members = await Member.find({ serverId: serverId }).populate('profileId').sort({ role: 1 });
        // console.log('members are ===>', Members);

        const server = {
            ...servers.toObject(),
            channels: Channels.map(channel => channel.toObject()),
            members: Members.map(member => ({
                ...member.toObject(),
            }))
        };


        return NextResponse.json(server);
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}