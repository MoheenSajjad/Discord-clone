import { currentProfile } from '@/lib/current-profile';
import Server from '@/app/models/server';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();
        if (!profile) return new NextResponse('UnAuth', { status: 401 });

        if (!params.serverId)
            return new NextResponse('missing server id', { status: 400 });

        const updatedServer = await Server.findOneAndUpdate(
            { _id: params.serverId, profileId: profile.id },
            { $set: { inviteCode: uuidv4() } },
            { new: true }
        );
        // console.log('update is ', updatedServer);


        return NextResponse.json(updatedServer);
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 });
    }
}