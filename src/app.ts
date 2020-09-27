import express,{Application} from "express";

import bodyParser from "body-parser";
import cors from "cors";

import { config } from "dotenv";
import { resolve } from "path";

import WonderQueue from './modules/wonder.queue';

config({ path: resolve(__dirname, "../.env") });

class App{
    public app: Application;
    public queue: WonderQueue;
    constructor(){        
        this.app = express();
        this.queue = new WonderQueue(process.env.DB_NAME!,process.env.QUEUE!);
        this.setConfig();
    }

    private setConfig(){
        this.app.use(bodyParser.json({limit:"50mb"}));
        this.app.use(bodyParser.urlencoded({limit:"50mb", extended:true}));
        this.app.use(cors());
        const id: string = this.queue.write({name:"uayeb"});
        console.log(id);
    }
    
}

export default new App().app;
