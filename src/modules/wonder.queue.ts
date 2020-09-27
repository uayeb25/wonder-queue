import loki from 'lokijs';
import { TokenGenerator } from 'ts-token-generator';
import {wander_db,wander_queue} from './wonder.dto';

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

    init_wonder_queue(name:string){
        const db:wander_db = this.collection.findOne({db: process.env.DB_NAME});
        db.queues[name] = {
            queue: []
        };
        this.collection.update(db); 
    }

    write(message: any, queue?: string): string{
        const id:string = this.tokengen.generate();
        message["_id"] = id;
        const db:wander_db = this.collection.findOne({db: this.dbname});
        db.queues[queue ? queue : this.defaultqueue].queue = [
            ...db.queues[queue ? queue : this.defaultqueue].queue,
            message
        ];
        this.collection.update(db);
        return id;
    }


}

export default WonderQueue;