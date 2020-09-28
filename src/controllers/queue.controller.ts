import {Request,Response} from "express";
import {Application} from "express";
import WonderQueue from "../modules/wonder.queue";
import { QueueService } from "../services/queue.service";

export class QueueController{
    private queue_service: QueueService;
    
    constructor(private app: Application, private queue: WonderQueue){
        this.queue_service = new QueueService();
        this.routes();
    }
    private routes(){
        this.app.get('/queue', (req:Request, res:Response) => {
            this.queue_service.size(this.queue,req,res);
        });
        this.app.get('/queue/:name', (req:Request, res:Response) => {
            this.queue_service.size(this.queue,req,res);
        });

        /** CREATE A NEW QUEUE, THIS IS NOT A MANDATORY STEP, REMEMBER YOU WORK 
         * WITH DEFAULT QUEUE WHEN SERVICE RUNS AT FIRST TIME  **/
        this.app.post('/queue', (req:Request, res:Response) => {
            this.queue_service.initQueue(this.queue,req,res);
        });
        
        /** this endpoint is for TEST PROPOSAL, we gonna check if expiration works well
         * what we gonna simulate is a "worker" that takes a queue and never
         * actions. 
         */
        this.app.put('/queue', (req:Request, res:Response) => {
            this.queue_service.subscribe(this.queue,req,res);
        });

        

    }
}