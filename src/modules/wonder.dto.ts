export interface wonder_value{
    _id: string;
    message: any;
    taken?: string|undefined;
    libarate?: string|undefined;
}

export interface wander_db{
    db: string;
    queues: {[id:string]:wonder_value[]};
}

export interface subscribe_outcome{
    successed: boolean;
    message: string;
    subscription?: string;
}