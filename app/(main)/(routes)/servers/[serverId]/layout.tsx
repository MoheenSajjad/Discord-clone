import { currentProfile } from "@/lib/current-profile"
import { redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { ServerSidebar } from "@/components/server/server-sidebar"


import Server from "@/app/models/server"
import { connect } from '@/lib/db'

const ServerIdLayout = async ({ children, params }:
    {
        children: React.ReactNode,
        params: { serverId: string }
    }) => {
    // connect()
    const profile = await currentProfile()
    // console.log('current user is in layout ', profile.id);

    if (!profile) {
        return redirectToSignIn()
    }



    // yahna par hia issue jab server ko gte kar raha hai yahan par check karo k wo array ana chahiya ya single value


    const server = await Server.find({
        _id: params.serverId,
        members: {
            $elemMatch: {
                profileId: profile.id
            }
        }
    });


    if (!server) return redirect('/');

    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ServerSidebar serverId={params.serverId} />
            </div>
            <main className="h-full md:pl-60">{children}</main>
        </div>
    )
}

export default ServerIdLayout