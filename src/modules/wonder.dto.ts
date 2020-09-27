export interface wander_queue{
    queue: any[];
    taken?: Date|undefined;
    libarate?: Date|undefined;
}

export interface wander_db{
    db: string;
    queues: {[id:string]:wander_queue};
}