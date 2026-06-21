import { Server } from "socket.io";
import http from "http";
import express from "express";

//CREATE EXPRESS APP AND HTTP SERVER
const app=express();
const server=http.createServer(app);

//INITIALIZE SOCKET.IO SERVER
const io = new Server(server, {
    cors : {origin: "*"}
})

//STORE ONLINE USERS
const userSocketMap = {};

//SOCKET IO CONNECTION HANDLER
io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;         //READ THEIR USERID FROM THE QUERY SENT BY FRONTEND
    console.log("User Connected", userId);
    if  (userId) userSocketMap[userId] = socket.id;

    //EMIT ONLINE USERS TO ALL CONNECTED CLIENTS
    io.emit("getOnlineUsers",Object.keys(userSocketMap)); //TELL ALL CLIENTS WHO IS ONLINE

    socket.on("disconnect",()=>{
        console.log("User Disconnected",userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
});

export { io, app, userSocketMap, server };