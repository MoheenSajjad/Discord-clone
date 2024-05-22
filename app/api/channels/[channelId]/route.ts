import { currentProfile } from '@/lib/current-profile';
import Channel from '@/app/models/channel';
import { MemberRole } from '@prisma/client';
import MODERN_BROWSERSLIST_TARGET from 'next/dist/shared/lib/modern-browserslist-target';
import { NextResponse } from 'next/server';
import Server from '@/app/models/server';
import Member from '@/app/models/member';


export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get('serverId');
        if (!profile) return new NextResponse('Unauth', { status: 401 });

        if (!serverId)
            return new NextResponse('Server id Missing', { status: 400 });

        if (!params.channelId)
            return new NextResponse('Channe id Missing', { status: 400 });

        const channel = await Channel.findByIdAndDelete({ _id: params.channelId });
        const ServerUpdate = await Server.findByIdAndUpdate(
            { _id: serverId },
            { $pull: { channels: channel._id } },
            { new: true }
        );

        const servers = await Server.findOne({ _id: serverId });

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
        return new NextResponse('Iternal Error', { status: 500 });
    }
}





export async function PATCH(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get('serverId');
        if (!profile) return new NextResponse('Unauth', { status: 401 });

        if (!serverId)
            return new NextResponse('Server id Missing', { status: 400 });

        if (!params.channelId)
            return new NextResponse('Channe id Missing', { status: 400 });

        if (name === 'general')
            return new NextResponse('Name cannot be general', { status: 400 });

        const channel = await Channel.findByIdAndUpdate({ _id: params.channelId }, { name, type }, { new: true })


        const servers = await Server.findOne({ _id: serverId });

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
        return new NextResponse('Iternal Error', { status: 500 });
    }
}