// import express from "express"

// const app = express();

// app.get("/",(req,res)=>{
//     res.send("Hello")
// })

// app.listen(8000,()=>{
//     console.log(`server is running `)
// })

import connectDB from "./db/index.js";
import { app } from "./app.js";
const port = process.env.PORT || 8000
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running`);
    });
  })
  .catch((error) => {
    console.error(`Failed to connect to the database: ${error}`);
    process.exit(1); // Exit the process with failure
  });
