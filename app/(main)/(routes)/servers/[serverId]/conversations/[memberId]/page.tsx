import Member from "@/app/models/member"
import { getOrCreateConversation } from "@/lib/conversation"
import { currentProfile } from "@/lib/current-profile"
import { redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import ChatHeader from "@/components/chat/chat-header"
import ChatMessages from "@/components/chat/chat-messages"
import ChatInput from "@/components/chat/chat-input"
import { MediaRoom } from "@/components/media-room"

interface MemberIdPageProps {
    params: {
        memberId: string,
        serverId: string
    },
    searchParams: {
        video: boolean
    }
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {

    const profile = await currentProfile()

    if (!profile) {
        return redirectToSignIn
    }

    const currentMember = await Member.findOne({
        serverId: params.serverId,
        profileId: profile._id,
    }).populate("profileId")

    if (!currentMember) {
        return redirect('/')
    }

    const conversation = await getOrCreateConversation(currentMember._id, params.memberId)
    if (!conversation) {
        return redirect(`/servers/${params.serverId}`)
    }
    console.log("conversation is---------------", conversation._id);

    const { memberOneId, memberTwoId } = conversation

    const otherMember = memberOneId.profileId._id === profile._id ? memberTwoId : memberOneId
    console.log("current conversation is ", conversation);

    console.log("other member is ", otherMember);

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                imageUrl={otherMember.profileId.imageUrl}
                name={otherMember.profileId.name}
                serverId={params.serverId}
                type="conversation"
            />
            {searchParams.video && (
                <MediaRoom chatId={conversation._id} video={true} audio={true} />
            )}
            {!searchParams.video && <>
                <ChatMessages
                    member={currentMember}
                    name={otherMember.profileId.name}
                    chatId={conversation._id}
                    type="conversation"
                    apiUrl="/api/direct-messages"
                    paramKey="conversationId"
                    paramValue={conversation._id}
                    socketUrl="/api/socket/direct-messages"
                    socketQuery={{ conversationId: conversation._id }}
                />
                <ChatInput
                    name={otherMember.profileId.name}
                    type="conversation"
                    apiUrl="/api/socket/direct-messages"
                    query={{ conversationId: conversation._id }}
                />
            </>}

        </div>
    )
}

export default MemberIdPage