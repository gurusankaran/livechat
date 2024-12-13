const express = require('express')
const app = express()
const port = 3500


app.use(express.static('public'))
// app.get('/',(req,res)=>{
//     res.send('hi')
// })

const io = require('socket.io')(app.listen(port,()=>{
    console.log(`Port listening on http://localhost:${port}`);
const io = require('socket.io')
}))

let socketConnected = new Set()

io.on('connection',onConnected)

function onConnected(socket){
    console.log(socket.id);
    socketConnected.add(socket.id)

    io.emit('client-total',socketConnected.size)

    socket.on('disconnect',()=>{
        socketConnected.delete(socket.id)
        io.emit('client-total',socketConnected.size)
    })

    socket.on('message',(data)=>{
        const randomID = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
        data.id = randomID        
        console.log(data);
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data)
    })
}