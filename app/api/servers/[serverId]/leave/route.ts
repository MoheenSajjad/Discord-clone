import { currentProfile } from '@/lib/current-profile';
import Member from '@/app/models/member';
import { NextResponse } from 'next/server';
import Server from '@/app/models/server';
import Channel from '@/app/models/channel';

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();

        if (!profile) return new NextResponse('Unauth', { status: 401 });

        if (!params.serverId)
            return new NextResponse('Server Id Missing', { status: 400 });
        // console.log('server id ', params.serverId);



        const members = await Member.findOne({ profileId: profile._id })
        await Member.deleteMany({ profileId: profile._id })

        const SERVER = await Server.updateOne(
            { _id: params.serverId },
            { $pull: { members: members._id } }
        );


        const servers = await Server.findOne({ _id: params.serverId });

        const Channels = await Channel.find({ serverId: params.serverId }).sort({ createdAt: 1 });

        const Members = await Member.find({ serverId: params.serverId }).populate('profileId').sort({ role: 1 });
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
        console.log('Server Id Leave', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}