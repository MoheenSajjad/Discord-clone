import Server from "@/app/models/server";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";





export async function DELETE(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();

        if (!profile) return new NextResponse('Unauthorized', { status: 401 });

        // const server = await Server.delete({
        //     where: {
        //         id: params.serverId,
        //         profileId: profile.id,
        //     },
        // });

        const server = await Server.deleteOne({
            _id: params.serverId,
            profileId: profile._id
        })
        return NextResponse.json(server);
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}


export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile()
        const { name, imageUrl } = await req.json()

        if (!profile) {
            return new NextResponse("UnAuthorized", { status: 401 })
        }

        const server = await Server.findOneAndUpdate({ _id: params.serverId, profileId: profile._id }, { $set: { name, imageUrl } }, { new: true })

        return NextResponse.json(server)
    } catch (error) {
        console.log('[SERVER-ID-PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}