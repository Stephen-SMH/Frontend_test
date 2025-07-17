import { Server as IOServer } from 'socket.io';
import type { NextApiRequest } from 'next';
import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';
import type { ServerResponse } from 'http';

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export default function handler(req: NextApiRequest, res: ServerResponse & { socket: SocketWithIO }) {
  if (!res.socket.server.io) {
    const io = new IOServer(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('editing-started', (patientId: string) => {
        socket.broadcast.emit('patient-editing', { patientId, status: 'editing' });
      });

      socket.on('editing-stopped', (patientId: string) => {
        socket.broadcast.emit('patient-editing', { patientId, status: 'idle' });
      });

      socket.on('form-submitted', (patientId: string) => {
        socket.broadcast.emit('patient-editing', { patientId, status: 'submitted' });
      });
    });
  }
  res.end();
}