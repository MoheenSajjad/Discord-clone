import { FC } from 'react';

import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { currentProfile } from '@/lib/current-profile';
import Server from '@/app/models/server';
import Member from '@/app/models/member';

interface inviteCodeProps {
    params: {
        inviteCode: string;
    };
}

const InviteCodePage: FC<inviteCodeProps> = async ({ params }) => {
    const profile = await currentProfile();

    if (!profile) return redirectToSignIn();

    if (!params.inviteCode) return redirect('/');



    const existingServer = await Server.findOne({ inviteCode: params.inviteCode })
        .populate({
            path: 'members',
            match: { profileId: profile.id }
        });



    if (existingServer.members.length > 0) return redirect(`/servers/${existingServer.id}`);


    // const server = await Server.findOne(
    //     { inviteCode: params.inviteCode },
    //     // { $push: { members: { profileId: profile.id } } }
    // );

    const member = await Member.create({ profileId: profile.id, serverId: existingServer._id })

    const updateServer = await Server.findOneAndUpdate(
        {
            inviteCode: params.inviteCode
        },
        {
            $push: { members: member._id }
        }
    )

    if (updateServer) return redirect(`/servers/${updateServer.id}`);

    return null;
};

export default InviteCodePage;