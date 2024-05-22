import Server from "@/app/models/server";

import { currentProfile } from '@/lib/current-profile';
// import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { FC } from 'react';

interface ServerIdPageProps {
    params: {
        serverId: string;
    };
}



const ServerIdPage: FC<ServerIdPageProps> = async ({ params }) => {
    const profile = await currentProfile();

    if (!profile) return redirectToSignIn();

    const server = await Server.findOne({ _id: params.serverId }).populate("channels")
    // console.log("server is ---------", server);
    const initailChannel = server?.channels.find((ch: any) => ch.name == "general")
    // console.log(initailChannel);



    return redirect(`/servers/${params.serverId}/channels/${initailChannel._id}`);
};

export default ServerIdPage;