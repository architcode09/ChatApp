import { CronJob } from "cron";
import http from "node:http";
import https from "node:https";

//every 14 minutes send a GET request to the health endpoint
const job = new CronJob("*/14 * * * *", function () {
    const base =
        process.env.RENDER_EXTERNAL_URL ||
        process.env.APP_URL ||
        process.env.FRONTEND_URL;

    if (!base) {
        console.warn("Cron ping skipped because no public app URL is configured");
        return;
    }

    let url;
    try {
        url = new URL("/health", base);
    } catch (error) {
        console.error("Cron ping skipped because the app URL is invalid", error);
        return;
    }

    const client = url.protocol === "https:" ? https : http;

    client
        .get(url,(res)=> {
            if(res.statusCode === 200) console.log("GET request sent successfully");
            else console.log("GET request failed" , res.statusCode);

            res.resume();
        })
        .on("error",(e)=> console.error("Error while sending request",e));

});

export default job;
