
import nats , {Stan} from 'node-nats-streaming';
import { randomBytes } from "crypto";


class NatsWrapper{
    private _client?:Stan;
    get client(){
        if(!this._client){
            throw new Error('Cannot access client before connecting');
        }
        return this._client
    }
    connect(clusterId:string ,clientId:string, url:string):Promise<void>{
       this._client=nats.connect(clusterId,clientId,{url});
       return new Promise((resolve,reject)=>{
        this._client!.on('connect',()=>{
            console.log('Connected To Nats');
            resolve();
        })
        this._client!.on('error',(err)=>{
            console.log('Connected To Nats');
              reject(err);
           })
       }
       )
    }
}

export const natsWrapper = new NatsWrapper();