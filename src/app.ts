import express,{Application} from "express";

import bodyParser from "body-parser";
import cors from "cors";


import { config } from "dotenv";
import { resolve } from "path";

import WonderQueue from './modules/wonder.queue';
import { WritterController } from "./controllers/writer.controller";
import { QueueController } from "./controllers/queue.controller";
import { WorkerController } from "./controllers/worker.controller";

config({ path: resolve(__dirname, "../.env") });

class App{
    public app: Application;
    public queue: WonderQueue;
    public writter: WritterController;
    public worker: WorkerController
    public queueC: QueueController;
    constructor(){        
        this.app = express();
        this.queue = new WonderQueue(process.env.DB_NAME!,process.env.QUEUE!);
        this.setConfig();
        this.writter = new WritterController(this.app,this.queue);
        this.worker = new WorkerController(this.app,this.queue);
        this.queueC = new QueueController(this.app,this.queue);
    }

    private async setConfig(){
        this.app.use(bodyParser.json({limit:"50mb"}));
        this.app.use(bodyParser.urlencoded({limit:"50mb", extended:true}));
        this.app.use(cors());
    }
    
}

export default new App().app;
