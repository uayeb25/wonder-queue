import express,{Application} from "express";

import bodyParser from "body-parser";
import cors from "cors";


import { config } from "dotenv";
import { resolve } from "path";

import WonderQueue from './modules/wonder.queue';
import { subscribe_outcome } from "./modules/wonder.dto";

config({ path: resolve(__dirname, "../.env") });

class App{
    public app: Application;
    public queue: WonderQueue;
    constructor(){        
        this.app = express();
        this.queue = new WonderQueue(process.env.DB_NAME!,process.env.QUEUE!);
        this.setConfig();
    }

    private async setConfig(){
        this.app.use(bodyParser.json({limit:"50mb"}));
        this.app.use(bodyParser.urlencoded({limit:"50mb", extended:true}));
        this.app.use(cors());


        const id = await this.queue.write([{name:"allison"},{name:"imix"},{name:"uayeb"}]);
        const s:subscribe_outcome =  await this.queue.subscribe();
        console.log(this.queue.getMessage(s));
        console.log(this.queue.shiftMessage(s));
        console.log(this.queue.getMessage(s));
        console.log(this.queue.getMessage(s));
    }
    
}

export default new App().app;
