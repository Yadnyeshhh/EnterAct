import express from "express";
const app = express();

import { config } from "dotenv";
config();

import cors from "cors";
import router from "./router/stream.js";
import chatRouter from "./router/chat.js";

// frontend ports to allow
const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL].filter(
  Boolean,
);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes("*")
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Alternatively allow dynamically or validate strictly
      }
    },
    credentials: true,
  }),
);

// stream router
// http://localhost:3000/api/v1/stream/...

app.get("/", (req, res) => {
  res.send("API running!");
});

app.use("/api/v1/stream", router);
app.use("/api/v1/chat", chatRouter);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is listening to PORT ${PORT}`);
  });
}

export default app;
