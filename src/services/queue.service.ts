import {Request,Response} from "express";
import { subscribe_outcome } from "../modules/wonder.dto";
import WonderQueue from "../modules/wonder.queue";

export class QueueService{
    public size(queue: WonderQueue, req:Request, res:Response){
        const results:number = queue.sizeQueue(req.params.name);
        res.status(202).send({
            size: results
        });
    }

    public initQueue(queue: WonderQueue, req:Request, res:Response){
        queue.init_wonder_queue(req.body.queue);
        res.status(202).send({
            successed: true
        });
    }

    public async subscribe(queue: WonderQueue, req:Request, res:Response){
        const outcome:subscribe_outcome = await queue.subscribe(req.body.queue,req.body.time);
        res.status(202).send(outcome);
    }
}