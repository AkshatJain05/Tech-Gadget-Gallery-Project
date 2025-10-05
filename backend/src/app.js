import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.json({ limit: "16kb" }));

app.use(cors({
<<<<<<< HEAD
  origin: ["https://tech-gadget-gallery-project-frontend.onrender.com","http://localhost:5173"], // your frontend origin
=======
  origin:["https://tech-gadget-gallery-project-frontend.onrender.com","http://localhost:5173"],// your frontend origin
>>>>>>> 9e226a2027f9018e255bea0515e9c5b9dca4029e
  credentials: true               // allow cookies
}));



app.use(cookieParser());
app.use(express.static("public"));

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";  
import hostRouter from "./routes/host.route.js";
import paymentRouter from "./routes/payment.route.js";



app.use("/api/user", userRouter);
app.use("/api/host",hostRouter)
app.use("/api/auth",authRouter)
app.use("/api/payment",paymentRouter)

export { app };
