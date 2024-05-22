import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { connect } from '@/lib/db'

import Profile from "../app/models/profile";

export const initialProfile = async () => {
    const user = await currentUser();

    if (!user) {
        return redirectToSignIn();
    }
    console.log("finding", user.id);

    const profile = await Profile.findOne({

        userId: user.id

    })

    if (profile) {
        return profile;
    }

    console.log("user is ", user);

    const newProfile = await Profile.create({
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress
    })
    console.log("new profile is ", newProfile);

    return newProfile;
}