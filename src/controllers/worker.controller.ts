import {Request,Response} from "express";
import {Application} from "express";
import WonderQueue from "../modules/wonder.queue";
import { WorkerService } from "../services/worker.service";

export class WorkerController{
    private worker_service: WorkerService;
    
    constructor(private app: Application, private queue: WonderQueue){
        this.worker_service = new WorkerService();
        this.routes();
    }
    private routes(){
        this.app.post('/operations', (req:Request, res:Response) => {
            this.worker_service.operations(this.queue,req,res);
        });

        this.app.post('/researchs', (req:Request, res:Response) => {
            this.worker_service.assignResearch(this.queue,req,res);
        });
    }
}