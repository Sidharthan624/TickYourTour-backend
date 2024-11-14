import { Server, Socket } from 'socket.io'

interface User {
    userId: string,
    socketId: string,
    online?: boolean
}
function socketServer(server: any) {
    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173'],
            methods: ['GET', 'POST']
        }
    })
    let users: User[] = []

    const addUsers = (userId: string, socketId: string) => {
        const existingUser = users.find(user => userId === user.userId)
        if(existingUser) {
            existingUser.socketId = socketId
            existingUser.online = true
        } else {
            users.push({ userId, socketId, online: true })
        }
        io.emit('usersOnline', users.filter(user => user.online))
    }
    const removeUser = (socketId: string) => {
        const user = users.find(user => socketId === user.socketId)
        if(user) {
            user.online = false
        }
        io.emit('usersOnline', users.filter(user => user.online))
    }
    const getUser = (userId: string) => users.find(user => userId === user.userId)
    io.on('connection', (socket: Socket) => {
        socket.on('addUser', (userId: string) => {
            addUsers(userId, socket.id)
            io.emit('getUsers', users)
        })
        socket.on('sendMessage', ({ senderId, receiverId, text, createdAt }) => {
            const user = getUser(receiverId)
            if(user) {
                io.to(user.socketId).emit('getMessage', { senderId, text, createdAt })
            }
        })
        socket.on('sendImageMessage',({ senderId, receiverId, text, createdAt }) => {
            const user = getUser(receiverId)
            if(user) {
                io.to(user.socketId).emit('getImageMessage', { senderId, text, createdAt })
            }
        })
        socket.on('sendVideoMessage', ({ senderId, receiverId, text, createdAt}) => {
            const user = getUser(receiverId)
            if(user) {
                io.to(user.socketId).emit('getVideoMessage', { senderId, text, createdAt })
            }
        })
        socket.on('disconnect', () => {
            removeUser(socket.id)
            io.emit('usersOnline', users.filter(user => user.online))
        })
        socket.on('changeStatus', ({ providerId, notification, createdAt }) => {
            const provider = getUser(providerId)
            if(provider) {
               io.to(provider.socketId).emit('getNotification', { providerId, notification, createdAt })
            }
        })
    })
    
}
export default socketServer