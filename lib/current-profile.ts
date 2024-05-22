import { auth } from '@clerk/nextjs';
import Profile from '../app/models/profile';


export const currentProfile = async () => {

    const { userId } = auth();

    if (!userId) return null;


    const profile = await Profile.findOne({
        userId,
    });
    return profile;
};