require('dotenv').config();
import express from "express";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import http from 'http';
import userService from "./services/userService";
import socketIO from 'socket.io';
let app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.use(cookieParser("secret"));
app.use(session({
   secret: 'secret',
   resave: true,
   saveUninitialized: false,
   cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 86400000 1 day
   }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
viewEngine(app);
app.use(passport.initialize());
app.use(passport.session());
initWebRoutes(app);
/*io.on('connection', (socket) => {
   socket.on("updateUserData", async (data) => {
      try {


         console.log("New socket connection:", socket.id, "User ID:", data.userId);
         const fetchedData = await userService.fetchDataForUser(data.userId, data.selectedFields);
         // Gửi dữ liệu cho người dùng tương ứng
         //io.to("user:" + data.userId).emit("userData", fetchedData);
         //socket.join(data.userId); // Đăng ký socket vào phòng với tên là userId
         //socket.emit("userData", fetchedData);
         // Tìm kết nối của người dùng và gửi dữ liệu tới kết nối đó
         socket.on('joinRoom', ({ roomName }) => {
            socket.join(roomName);
         });
         console.log("Sent userData to user:", data.userId, { fetchedData }, "connect with ID: ", socket.id);
      } catch (error) {
         console.error('Error while processing updateUserData event:', error);
      }
   });
});*/
io.on('connection', (socket) => {
   socket.on('joinRoom', ({ roomName }) => {
      socket.join(roomName);
   });

   socket.on('updateUserData', async (data) => {
      const fetchedData = await userService.fetchDataForUser(data.userId, data.selectedFields);
      console.log({ fetchedData });
      io.to('user:' + data.userId).emit('userData', fetchedData);
   });
});
let port = process.env.PORT || 8000;
server.listen(port, () => {
   console.log(`App is running at the ${port}`);
});