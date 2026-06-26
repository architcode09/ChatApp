//const express = require("express")
import express from "express"
import "dotenv/config"
import { connectionDB } from "./lib/db.js";
import User from "./models/user.model.js";
import {clerkMiddleware} from "@clerk/express";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT;
const FRONTEND_URL=process.env.FRONTEND_URL;

const publicDir = path.join(process.cwd(),"public");


app.use(express.json());
app.use(cors({origin:FRONTEND_URL,credentials:true}));
app.use(clerkMiddleware());
app.use(express.static(publicDir));


app.get("/health",(req,res) => {
    res.status(200).json({ok:true})
});

app.get("/{*any}",(req,res,next) => {
    res.sendFile(path.join(publicDir,"index.html"),(err)=> next(err));
});
 
app.listen(PORT,()=> {
    connectionDB();
    console.log("Server is running peacefully on PORT",PORT)
});

