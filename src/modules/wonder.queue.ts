import loki from 'lokijs';
import moment from 'moment';
import { TokenGenerator } from 'ts-token-generator';
import {
    wander_db,
    wonder_value,
    subscribe_outcome 
} from './wonder.dto';

class WonderQueue{

    private db: Loki;
    private collection: Collection<any>;
    private tokengen: TokenGenerator;
    
    constructor(private dbname:string,private defaultqueue:string,private take: number = 60){
        this.db = new loki(dbname);
        this.collection = this.db.addCollection("collection");
        const db: wander_db = {
            db: dbname,
            queues: {}
        }
        this.collection.insert(db);
        this.init_wonder_queue(defaultqueue);
        this.tokengen = new TokenGenerator();
    }

    public init_wonder_queue(name:string){
        const db:wander_db = this.collection.findOne({db: process.env.DB_NAME});
        db.queues[name] = [];
        this.collection.update(db); 
    }

    private async checkAvailability(queuename?:string):Promise<number>{
        return new Promise<number>(resolve=>{
            const db:wander_db = this.collection.findOne({db: process.env.DB_NAME});
            const name: string = queuename? queuename: this.defaultqueue;
            let updated:number = 0;
            for( let i in db.queues[name] ){
                if( db.queues[name][i].taken ){
                    if( moment(db.queues[name][i].libarate) < moment() ){
                        db.queues[name][i].taken = undefined;
                        db.queues[name][i].libarate = undefined;
                        updated++;
                    }
                }
            }
            if( updated > 0 ){
                this.collection.update(db);
            }
            resolve(updated);
        });
    }


    public async subscribe(queuename?:string,time?:number): Promise<subscribe_outcome>{
        const now_free:number = await this.checkAvailability(queuename?queuename:this.defaultqueue);
        console.log(now_free);
        return new Promise<subscribe_outcome>(resolve=>{
            
            const db:wander_db = this.collection.findOne({db: process.env.DB_NAME});
            const name: string = queuename? queuename: this.defaultqueue;
            let workWith: wonder_value[] = db.queues[name].filter( val => !val.taken );
            let currently: wonder_value[] = db.queues[name].filter( val => val.taken );
            if(workWith.length > 0){
                const take: number = time? time: this.take;
                const taken: string = moment().format();
                const libarate: string = moment(taken).add(take,'seconds').format();
                let processed: wonder_value[] = [];
                for( const v of workWith ){
                    v.taken = taken;
                    v.libarate = libarate;
                    processed = [...processed,v];
                }
                //if another writer insert new element while we were subscribing, it is a must get these new ones.
                const db2:wander_db = this.collection.findOne({db: process.env.DB_NAME});
                db2.queues[name].splice(0, workWith.length + currently.length );

                db.queues[name] = [ ...currently, ...processed, ...db2.queues[name] ];
                this.collection.update(db);
                const result:subscribe_outcome = {
                    successed: true,
                    message: `${processed.length} were subscribed`,
                    subscription: taken
                }
                resolve(result);
            }else{
                const result:subscribe_outcome = {
                    successed: false,
                    message: `there not pending elements to be worked`
                }
                resolve(result);
            }
        });
    }

    public async write(messages: any[], queue?: string): Promise<string[]>{
        return new Promise<string[]>(resolve=>{
            
            const db:wander_db = this.collection.findOne({db: this.dbname});

            let newones: wonder_value[] = [];
            let ids: string[] = [];
            for(let message of messages){
                let n:wonder_value = {
                    _id: this.tokengen.generate(),
                    message: message
                }
                newones = [...newones,n];
                ids = [...ids,n._id];
            }

            db.queues[queue ? queue : this.defaultqueue] = [
                ...db.queues[queue ? queue : this.defaultqueue],
                ...newones
            ];

            this.collection.update(db);
            resolve(ids);
        });
    }

    public getMessage(subscription: subscribe_outcome, queuename?: string): wonder_value{
        const name: string = queuename? queuename: this.defaultqueue;
        const db:wander_db = this.collection.findOne({db: process.env.DB_NAME});
        const queue:wonder_value[] = db.queues[name];
        return queue.filter(_q => _q.taken === subscription.subscription)[0];
    }

    public shiftMessage(subscription: subscribe_outcome, queuename?: string): wonder_value{
        const name: string = queuename? queuename: this.defaultqueue;
        const db:wander_db = this.collection.findOne({db: process.env.DB_NAME});
        let queue_subscribed:wonder_value[] = db.queues[name].filter(_q => _q.taken === subscription.subscription);
        const queue_no_subscribed:wonder_value[] = db.queues[name].filter(_q => _q.taken !== subscription.subscription);

        const deleted:wonder_value = queue_subscribed.splice(0,1)[0];
        
        /* As we done an job in our queue we can update the rest of the element with a new liberate 
        to guarantee the full execution of the subscribed elements */
        const new_libarate:string = moment().add(this.take,'seconds').format();
        for(let element of queue_subscribed){
            element.libarate = new_libarate;
        }

        db.queues[name] = [...queue_subscribed,...queue_no_subscribed];
        this.collection.update(db);

        return deleted;
    }


}

export default WonderQueue;