import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { MemberRole } from '@prisma/client';

import { currentProfile } from '@/lib/current-profile';
import Server from '@/app/models/server';
import Member from '@/app/models/member';
import Channel from '@/app/models/channel';

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();
        // console.log("current profile===>", profile.id);

        if (!profile) return new NextResponse('Unauth', { status: 401 });

        const server = await Server.create({
            profileId: profile.id,
            name,
            imageUrl,
            inviteCode: uuidv4(),
        });

        const defaultChannel = await Channel.create({
            serverId: server.id,
            name: 'general',
            profileId: profile.id,
        });

        const creatorMember = await Member.create({
            profileId: profile.id,
            serverId: server.id,
            role: MemberRole.ADMIN,
        });

        server.channels.push(defaultChannel);
        server.members.push(creatorMember);
        await server.save();

        // console.log("Server created:", server);

        return NextResponse.json(server);
    } catch (error) {
        console.log('[SERVERS_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
