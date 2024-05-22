// @ts-nocheck
import { currentProfile } from "@/lib/current-profile"
import { redirect } from "next/navigation"
import Server from "@/app/models/server"
import Channel from "@/app/models/channel"
import Member from "@/app/models/member"
import ServerHeader from "./server-header"
import { ScrollArea } from "../ui/scroll-area"
import { ChannelType } from "@prisma/client"
import { Hash, Mic, Video } from "lucide-react"
import { MemberRole } from "@prisma/client"
import { ShieldCheck, ShieldAlert } from "lucide-react"
import ServerSearch from "./server-search"
import { Separator } from "../ui/separator"
import ServerSection from "./server-section"
import ServerChannel from "./server-channel"
import ServerMember from "./server-member"


interface ServerSideBarProps {
    serverId: string
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: (
        <ShieldCheck className="h-4 w-4 mr-3 text-indigo-500" />
    ),
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-3 text-rose-500" />,
};

export const ServerSidebar = async ({ serverId }: ServerSideBarProps) => {

    const profile = await currentProfile()

    if (!profile) {
        redirect('/')
    }


    const server = await Server.findOne({ _id: serverId });

    const Channels = await Channel.find({ serverId: serverId }).sort({ createdAt: 1 });

    const Members = await Member.find({ serverId: serverId }).populate('profileId').sort({ role: 1 });
    // console.log('members are ===>', Members);
    // console.log(Members);

    const Servers = {
        ...server.toObject(),
        channels: Channels.map(channel => channel.toObject()),
        members: Members.map(member => ({
            ...member.toObject(),
        }))
    };

    // console.log(Servers, '+++++++++++');

    const textChannels = Servers?.channels.filter(
        (channel: any) => channel.type === 'TEXT'
    );

    const audioChannels = Servers?.channels.filter(
        (channel: any) => channel.type === 'AUDIO'
    );

    const videoChannels = Servers?.channels.filter(
        (channel: any) => channel.type === "VIDEO"
    );



    const members = Servers?.members.filter((member: any) => member.profileId._id != profile.id)

    if (!server) {
        return redirect('/')
    }
    // console.log(profile.id, Members[0].profileId.toString());


    const role = await Servers?.members.find((member: any) => {
        // console.log(member);

        return member.profileId._id.toString() == profile.id
    })
    // console.log('role', role);


    // console.log('role is -----', role);
    const serv = JSON.stringify(Servers)
    // console.log('/////////', JSON.parse(serv));
    // const ab = JSON.parse(serv)


    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader server={JSON.parse(serv)} role={role.role} />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: 'Text Channels',
                                type: 'channel',
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: 'Voice Channels',
                                type: 'channel',
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: 'Video Channels',
                                type: 'channel',
                                data: videoChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            // {
                            //     label: 'Members',
                            //     type: 'member',
                            //     data: members?.map((member) => ({
                            //         id: member.id,
                            //         name: member.profileId.name,
                            //         icon: roleIconMap[member.role],
                            //     })),
                            // },
                        ]}
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                {!!textChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.TEXT}
                            role={role}
                            label="Text Channels"
                        />
                        <div className="space-y-[2px]">
                            {textChannels?.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={Servers}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!audioChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.AUDIO}
                            role={role}
                            label="Voice Channels"
                        />
                        <div className="space-y-[2px]">
                            {audioChannels?.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={Servers}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!videoChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.VIDEO}
                            role={role}
                            label="Video Channels"
                        />
                        <div className="space-y-[2px]">
                            {videoChannels?.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={Servers}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {/* {!!members?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="members"
                            channelType={ChannelType.TEXT}
                            role={role}
                            label="Members"
                            server={Servers}
                        />
                        <div className="space-y-[2px]">
                            {members?.map((member) => (
                                <ServerMember key={member.id} member={member} server={server} />
                            ))}
                        </div>
                    </div>
                )} */}

            </ScrollArea>
        </div>
    )
}