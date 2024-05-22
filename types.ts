import Server from '@/app/models/server'
import Member from './app/models/member'
import Profile from './app/models/profile'


import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

export type ServerWithMemberWithProfile = typeof Server & {
    member: (typeof Member & { profile: typeof Profile })[];
}

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        };
    };
};