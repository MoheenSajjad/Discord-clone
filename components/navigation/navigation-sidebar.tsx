import { currentProfile } from '@/lib/current-profile';
import { redirect } from 'next/navigation';
import { FC } from 'react';
import NavigationAction from './navigation-action';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import NavigationItem from './navigation-item';
import { ModeToggle } from '../mode-toggle';
import { UserButton } from '@clerk/nextjs';

import Server from '@/app/models/server';
import Member from '@/app/models/member';

interface navigationSidebarProps { }

const NavigationSidebar: FC<navigationSidebarProps> = async ({ }) => {
    const profile = await currentProfile();
    console.log("navigation sidebar===>", profile.id);
    if (!profile) return redirect('/');

    const mem = await Member.find()
    // console.log(mem);


    const servers = await Server.find({})
        .populate({
            path: 'members',
            match: { profileId: profile.id }
        })
    // console.log('servers are -----', servers);





    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
            <NavigationAction />
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            <ScrollArea className="flex-1 w-full">
                {servers.map((server: any) => (
                    <div key={server.id} className="mb-4">
                        <NavigationItem
                            id={server.id}
                            imageUrl={server.imageUrl}
                            name={server.name}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: { avatarBox: 'h-[48px] w-[48px]' },
                    }}
                />
            </div>
        </div>
    );
};

export default NavigationSidebar;