import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import linkRoutes from "./routes/linkRoutes.js";
import { socketHandler } from "./SocketServer.js";

const professionalAppointments = [
  {
    professionalsFullName: "Faisal Shrideh",
    apptDate: Date.now() + 500000,
    uuid: 1,
    clientName: "Jim Jones",
  },
  {
    professionalsFullName: "Faisal Shrideh",
    apptDate: Date.now() - 2000000,
    uuid: 2, // uuid:uuidv4(),
    clientName: "Jon Doe",
  },
  {
    professionalsFullName: "Faisal Shrideh",
    apptDate: Date.now() + 10000000,
    uuid: 3, //uuid:uuidv4(),
    clientName: "Mike Williams",
  },
];
const port = 3000 || process.env.PORT;

export const app = express();
const expressServer = http.createServer(app);
export const io = new Server(expressServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(
  cors({
    credentials: true,
    origin: true,
  })
); //this will open our Express API to ANY domain
app.use(express.static("/public"));
app.use(express.json()); //this will allow us to parse json in the body with the body parser
app.set("professionalAppointments", professionalAppointments);

app.use("/", linkRoutes);
socketHandler(io, app);

expressServer.listen(port, () => {
  console.log(`server listening on ${port}`);
});
