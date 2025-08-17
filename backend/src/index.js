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

connectDB()
  .then(() => {
    app.listen(8000, () => {
      console.log(`Server is running on port 8000`);
    });
  })
  .catch((error) => {
    console.error(`Failed to connect to the database: ${error}`);
    process.exit(1); // Exit the process with failure
  });
