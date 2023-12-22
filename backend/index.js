import express from "express";
import dotenv from "dotenv/config";
import cors from "cors";
import linkRoutes from "./routes/linkRoutes.js";

const app = express();
const port = 3000 || process.env.PORT;
// app.use(cors()); // will open out express api to any domain 
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(express.json()); // will allow us to parse  json in the body with the body parser

app.use("/", linkRoutes);

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
