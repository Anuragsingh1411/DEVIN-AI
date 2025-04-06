import 'dotenv/config';
import http from "http";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import { Server } from "socket.io";
import app from "./app.js";
import projectModel from './models/project.model.js';
import {generateResult} from './services/ai.service.js';


const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io =  new Server(server , {
  cors: {
    origin: '*',
  }
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];
    const projectId = socket.handshake.query.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid Project Id"));
    }

    const project = await projectModel.findById(projectId);
    if (!project) {
      return next(new Error("Project not found"));
    }

    socket.project = project; // Assign the project to socket.project

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new Error("Invalid Token");
    }

    socket.user = decoded; // Assign the decoded user to socket.user
    next();
  } catch (error) {
    next(error);
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();
  console.log("New client connected");

  socket.join(socket.roomId);

  // Ensure socket.project is defined before accessing its _id
  if (socket.project && socket.project._id) {
    socket.join(socket.project._id);

    socket.on("project-message", async data => {
      const message = data.message;

      const aiIsPresent = message.includes("@ai");
      socket.broadcast.to(socket.roomId).emit("project-message", data);


      if (aiIsPresent) {
        // socket.emit("project-message", {
        //   sender: data.sender,
        //   message: "AI is present",
        // });
        const prompt = message.replace("@ai", "");
        const result = await generateResult(prompt);

        io.to(socket.roomId).emit("project-message", {
          message: result,
          sender:{
            _id:'ai',
            email:'AI'
          }
        });
        return;
      }

      // console.log( 'message', data);
    });

    // socket.on("event", (data) => {
    //   // ...existing code...
    // });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      socket.leave(socket.roomId);
      
    });
  } else {
    console.error("Socket project is undefined or invalid");
  }
});

server.listen(port, () => {
  console.log("Server is running on port 3000");
});
