"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
function socketServer(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: ['http://localhost:5173'],
            methods: ['GET', 'POST']
        }
    });
    let users = [];
    const addUsers = (userId, socketId) => {
        const existingUser = users.find(user => userId === user.userId);
        if (existingUser) {
            existingUser.socketId = socketId;
            existingUser.online = true;
        }
        else {
            users.push({ userId, socketId, online: true });
        }
        io.emit('usersOnline', users.filter(user => user.online));
    };
    const removeUser = (socketId) => {
        const user = users.find(user => socketId === user.socketId);
        if (user) {
            user.online = false;
        }
        io.emit('usersOnline', users.filter(user => user.online));
    };
    const getUser = (userId) => users.find(user => userId === user.userId);
    io.on('connection', (socket) => {
        socket.on('addUser', (userId) => {
            addUsers(userId, socket.id);
            io.emit('getUsers', users);
        });
        socket.on('sendMessage', ({ senderId, receiverId, text, createdAt }) => {
            const user = getUser(receiverId);
            if (user) {
                io.to(user.socketId).emit('getMessage', { senderId, text, createdAt });
            }
        });
        socket.on('sendImageMessage', ({ senderId, receiverId, text, createdAt }) => {
            const user = getUser(receiverId);
            if (user) {
                io.to(user.socketId).emit('getImageMessage', { senderId, text, createdAt });
            }
        });
        socket.on('sendVideoMessage', ({ senderId, receiverId, text, createdAt }) => {
            const user = getUser(receiverId);
            if (user) {
                io.to(user.socketId).emit('getVideoMessage', { senderId, text, createdAt });
            }
        });
        socket.on('disconnect', () => {
            removeUser(socket.id);
            io.emit('usersOnline', users.filter(user => user.online));
        });
        socket.on('changeStatus', ({ providerId, notification, createdAt }) => {
            const provider = getUser(providerId);
            if (provider) {
                io.to(provider.socketId).emit('getNotification', { providerId, notification, createdAt });
            }
        });
    });
}
exports.default = socketServer;
