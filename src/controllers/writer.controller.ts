import {Request,Response} from "express";
import {Application} from "express";
import WonderQueue from "../modules/wonder.queue";
import { WriterService } from "../services/writer.service";

export class WritterController{
    private writer_service: WriterService;
    
    constructor(private app: Application, private queue: WonderQueue){
        this.writer_service = new WriterService();
        this.routes();
    }
    private routes(){
        this.app.post('/writer', (req:Request, res:Response) => {
            this.writer_service.write(this.queue,req,res);
        });
    }
}