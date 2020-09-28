import {Request,Response} from "express";
import { TokenGenerator } from 'ts-token-generator';
import { subscribe_outcome, wonder_value } from "../modules/wonder.dto";
import WonderQueue from "../modules/wonder.queue";


/** 
 * The best practice says that workers are consuming messages
 * from queue for specific operations, in our "demo" we gonna
 * set two different operations in the same class, one for resolve SUMs and other 
 * for "assign" research to researcher. Again this is not a correct
 * way but it is for test application proposal
 */

 interface operation{
     x: number,
     y: number
 }

 interface research{
     id: string,
     title: string,
     author: string,
     researcher?: string
 }

 interface processed{
    _id: string;
    result: any;
 }

export class WorkerService{

    public async operations(queue: WonderQueue, req:Request, res:Response){
        
        const name: string|undefined = req.body.queue;
        const subscription:subscribe_outcome = await queue.subscribe(name);

        if( subscription.successed ){
            let worked:processed[] = [];
            while(true){
                const value:wonder_value|undefined =  queue.getMessage(subscription,name);
                if(value){
                    let opt:operation = value.message;
                    let result:processed = {
                        _id: value._id,
                        result: (opt.x + opt.y)
                    }
                    worked = [...worked,result];
                    queue.shiftMessage(subscription,name);
                }else{
                    break;
                }
            }
            res.status(202).send(worked);
        }else{
            res.status(202).send({
                message: "Not pending"
            });
        }

        
    }

    public async assignResearch(queue: WonderQueue, req:Request, res:Response){
        
        const name: string|undefined = req.body.queue;
        const subscription:subscribe_outcome = await queue.subscribe(name);
        let tokengen: TokenGenerator = new TokenGenerator();
        if( subscription.successed ){
            let worked:processed[] = [];
            while(true){
                const value:wonder_value|undefined =  queue.getMessage(subscription,name);
                if(value){
                    let re:research = value.message;
                    re.researcher = tokengen.generate();
                    let result:processed = {
                        _id: value._id,
                        result: re
                    }
                    worked = [...worked,result];
                    queue.shiftMessage(subscription,name);
                }else{
                    break;
                }
            }
            res.status(202).send(worked);
        }else{
            res.status(202).send({
                message: "Not pending"
            });
        }

        
    }

}