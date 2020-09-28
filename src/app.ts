import express,{Application} from "express";

import bodyParser from "body-parser";
import cors from "cors";


import { config } from "dotenv";
import { resolve } from "path";

import WonderQueue from './modules/wonder.queue';
import { subscribe_outcome } from "./modules/wonder.dto";
import { WritterController } from "./controllers/writer.controller";

config({ path: resolve(__dirname, "../.env") });

class App{
    public app: Application;
    public queue: WonderQueue;
    public writter: WritterController;
    constructor(){        
        this.app = express();
        this.queue = new WonderQueue(process.env.DB_NAME!,process.env.QUEUE!);
        this.setConfig();
        this.writter = new WritterController(this.app,this.queue);
    }

    private async setConfig(){
        this.app.use(bodyParser.json({limit:"50mb"}));
        this.app.use(bodyParser.urlencoded({limit:"50mb", extended:true}));
        this.app.use(cors());

    }
    
}

export default new App().app;
