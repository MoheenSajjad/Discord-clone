import { currentProfile } from '@/lib/current-profile';
import Server from '@/app/models/server';
import { NextResponse } from 'next/server';
import Member from '@/app/models/member';
import mongoose from 'mongoose';
import Channel from '@/app/models/channel';







export async function DELETE(
    req: Request,
    { params }: { params: { memberId: string } }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get('serverId');

        if (!profile) return new NextResponse('Unauth', { status: 400 });

        if (!serverId)
            return new NextResponse('Server id missing', { status: 400 });

        if (!params.memberId)
            return new NextResponse('Member Id Missing', { status: 400 });

        const memberIdObjectId = new mongoose.Types.ObjectId(params.memberId);
        const serverIdObjectId = new mongoose.Types.ObjectId(serverId);

        const memberDelete = await Member.deleteMany(
            {
                _id: memberIdObjectId, serverId: serverIdObjectId
            },
            {
                new: true
            }
        )




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
        console.log('Member id delete', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}





export async function PATCH(
    req: Request,
    { params }: { params: { memberId: string } }
) {
    try {
        // console.log('changing member');

        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const { role } = await req.json();

        const serverId = searchParams.get('serverId');

        if (!profile) return new NextResponse('Unauthorized', { status: 401 });

        if (!serverId)
            return new NextResponse('Server Id missing', { status: 400 });

        if (!params.memberId)
            return new NextResponse('Member Id Missing', { status: 400 });


        const memberIdObjectId = new mongoose.Types.ObjectId(params.memberId);
        const serverIdObjectId = new mongoose.Types.ObjectId(serverId);

        // console.log('member id is ', memberIdObjectId);
        // console.log('serverid is ', serverIdObjectId);
        // console.log('profile id is ', profile._id);

        const memberUpdate = await Member.findOneAndUpdate(
            {
                _id: memberIdObjectId,
                serverId: serverIdObjectId,
            },
            {
                role: role
            },
            { new: true } // Pass new: true as the fourth argument
        );
        // console.log('mmemremrmemreiaoifbduofdioj', memberUpdate);

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


        // const server = await Server.update({
        //     where: {
        //         id: serverId,
        //         profileId: profile.id,
        //     },
        //     data: {
        //         members: {
        //             update: {
        //                 where: {
        //                     id: params.memberId,
        //                     profileId: {
        //                         not: profile.id,
        //                     },
        //                 },
        //                 data: {
        //                     role,
        //                 },
        //             },
        //         },
        //     },
        //     include: {
        //         members: {
        //             include: {
        //                 profile: true,
        //             },
        //             orderBy: {
        //                 role: 'asc',
        //             },
        //         },
        //     },
        // });

        return NextResponse.json(server);
    } catch (error) {
        console.log('[MEMBERS_ID_PATCH]', error);
        return new NextResponse('Interna Error', { status: 500 });
    }
}