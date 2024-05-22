import { currentProfile } from '@/lib/current-profile';
import Message from '@/app/models/message';
import { NextResponse } from 'next/server';
import DirectMessage from '@/app/models/directMessage';

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get('cursor');
        const conversationId = searchParams.get('conversationId');

        if (!profile) return new NextResponse('Unauth', { status: 401 });

        if (!conversationId)
            return new NextResponse('conversation Id Missing', { status: 401 });

        // console.log("channelid cursor profile", channelId, profile._id);

        console.log("DIRECT MSGS ------------------------------");

        let messages = [];

        if (cursor) {


            // console.log(cursor);

            // const cursorNumber = parseInt(cursor as string, 10);
            console.log("cursor is defined-----------------");
            // console.log(channelId, cursorNumber, MESSAGES_BATCH);
            messages = await DirectMessage.find({ conversationId, _id: { $gt: cursor } })
                .populate({
                    path: 'memberId',
                    populate: { path: 'profileId' }
                })
                .sort({ createdAt: -1 })
                .limit(MESSAGES_BATCH)
                .exec();

            // console.log("messages are ---------------", messages);

        } else {
            console.log("no cursor **********************");

            messages = await DirectMessage.find({ conversationId })
                .populate({
                    path: 'memberId',
                    populate: { path: 'profileId' }
                })
                .sort({ createdAt: -1 })
                .limit(MESSAGES_BATCH);

            // console.log("messages are ++++++++++++++++--", messages)
        }

        let nextCursor = null;

        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH - 1]._id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor,
        });
    } catch (error) {
        console.log('[Direct-Messages GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}