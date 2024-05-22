import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";
import { connect } from '@/lib/db'



// in this it first check if any profile is created if not created then it will show
//  the initial modal and if created it will redirect to the /server/#id

import Server from "../models/server";

const SetupPage = async () => {
    await connect()
    const profile = await initialProfile();
    // console.log("profile found is ", profile);

    const server = await Server.findOne({


        profileId: profile.id

    })

    // console.log("server is found ==>>>", server);

    if (server) {
        return redirect(`/servers/${server.id}`)
    }

    return (
        <InitialModal />
    );
}

export default SetupPage;