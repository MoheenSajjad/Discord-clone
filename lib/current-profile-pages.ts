import { getAuth } from '@clerk/nextjs/server';

import Profile from '../app/models/profile';

import { NextApiRequest } from 'next';

export const currentProfilePages = async (req: NextApiRequest) => {
    const { userId } = getAuth(req);

    if (!userId) return null;


    const profile = await Profile.findOne({
        userId,
    });
    return profile;
};