import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.json({ limit: "16kb" }));

app.use(cors({
  origin: "https://tech-gadget-gallery-project-frontend.onrender.com/", // your frontend origin
  credentials: true               // allow cookies
}));



app.use(cookieParser());
app.use(express.static("public"));

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";  
import hostRouter from "./routes/host.route.js";
import paymentRouter from "./routes/payment.route.js";

app.get('/',(req,res)=>{
  console.log(" Hello")
})

app.use("/api/user", userRouter);
app.use("/api/host",hostRouter)
app.use("/api/auth",authRouter)
app.use("/api/payment",paymentRouter)

export { app };
