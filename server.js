//Şifreleme ve socket kütüphanelerinin eklenmesi
import spn from "./spn.js";
import sha256 from "js-sha256";
import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';

//Server ve socket'in oluşturulması
const app = express(); 
const server = createServer(app);
const io = new Server (server,{
    cors:{
        origins :'*:*'
    }
});
server.listen(3000);


//Seçilen yönteme göre şifrelemenin yapılması
function hash(string,type) {
    if(type == "sha")
    return sha256(string)
    else if(type == "spn")
    return spn.encrypt(string)
  }


  
  //Socket'te kullanılmak üzere alınacak bilgiler
const kullanici = {}
let datas = ""

//Socket ile kullanıcıların bağlantısının kurulması
io.on('connection', socket=> {
    console.log("new user")
    socket.on('new-user', name => {
     kullanici[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', data =>{
        socket.broadcast.emit('chat-message',{data :data, name: kullanici[socket.id]})
    })
    socket.on('disconnect-user', () => {
        socket.broadcast.emit('user-disconnected', kullanici[socket.id])
        delete kullanici[socket.id]
    })
})