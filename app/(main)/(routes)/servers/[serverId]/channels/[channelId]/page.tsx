import { FC } from 'react';

import { currentProfile } from '@/lib/current-profile';
import { redirectToSignIn } from '@clerk/nextjs';
import Channel from '@/app/models/channel';
import Server from 'next/dist/server/base-server';
import Member from '@/app/models/member';
import { redirect } from 'next/navigation';
import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import ChatMessages from '@/components/chat/chat-messages';
import { MediaRoom } from '@/components/media-room';

interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
    };
}

const ChannelIdPage: FC<ChannelIdPageProps> = async ({ params }) => {
    const profile = await currentProfile();

    if (!profile) return redirectToSignIn();

    const channel = await Channel.findOne({ _id: params.channelId })

    const member = await Member.findOne({ serverId: params.serverId, profileId: profile._id })


    if (!channel || !member) redirect(`/`);

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                name={channel.name}
                serverId={channel.serverId}
                type="channel"
            />
            {channel.type === "TEXT" && <>
                <ChatMessages
                    member={member}
                    name={channel.name}
                    chatId={channel._id}
                    type="channel"
                    apiUrl="/api/messages"
                    socketUrl="/api/socket/messages"
                    socketQuery={{ channelId: channel._id, serverId: channel.serverId }}
                    paramKey="channelId"
                    paramValue={channel._id}
                />

                <ChatInput
                    apiUrl="/api/socket/messages"
                    name={channel.name}
                    type="channel"
                    query={{ channelId: channel._id, serverId: channel.serverId }}
                />
            </>}

            {channel.type === "AUDIO" && <>
                <MediaRoom chatId={channel._id} video={false} audio={true} />
            </>}

            {channel.type === "VIDEO" && <>
                <MediaRoom chatId={channel._id} video={true} audio={true} />
            </>}
        </div>
    );
};

export default ChannelIdPage;