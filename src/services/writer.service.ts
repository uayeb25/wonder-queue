import {Request,Response} from "express";
import WonderQueue from "../modules/wonder.queue";

export class WriterService{
    public async write(queue: WonderQueue, req:Request, res:Response){
        const messages: any[] = req.body.messages;
        const results: string[] = await queue.write(messages, req.body.queue);
        res.status(202).send(results);
    }
}