import express from "express"
import "dotenv/config"
import { connectionDB } from "./lib/db.js";
import job from "./lib/cron.js";
import {clerkMiddleware} from "@clerk/express";
import cors from "cors";
import path from "path";
import fs from "fs";
import clerkWebhook from "./webhooks/clerk.webhook.js"

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL=process.env.FRONTEND_URL;

const publicDir = path.join(process.cwd(),"public");

// Clerk signs the exact raw request body, so this route must be registered
// before the JSON parser changes the payload.
app.use("/api/webhooks/clerk",express.raw({type: "application/json"}),clerkWebhook);

app.use(express.json());
app.use(cors({origin:FRONTEND_URL,credentials:true}));
app.use(clerkMiddleware());

app.get("/health",(req,res) => {
    res.status(200).json({ok:true})
});

// When the frontend has been built into /public, serve its assets first and
// then fall back to index.html for client-side routes.
if(fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));

    app.get("/{*any}",(req,res,next) => {
        res.sendFile(path.join(publicDir,"index.html"),(err)=> next(err));
    });
}
 
app.listen(PORT,()=> {
    connectionDB();
    console.log("Server is running peacefully on PORT",PORT)

    // Only keep the render-style keep-alive ping running in production.
    if(process.env.NODE_ENV === "production") {
        job.start()
    }
});

