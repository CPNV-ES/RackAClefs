/// <reference path="../batch.d.ts" />
import * as mongoose from 'mongoose';
import {BatchActivity} from '../batch';
import BS_Insert from './BS_Insert';
let exec = require('child_process').exec

export default class BA_Insert extends BatchActivity<String, BS_Insert> {
    
    
    public selectData(callback){

        exec('blkid | grep -v Antergos', (error, stdout, stderr) => {
            let datas = []
            var objs = stdout.replace(/^\s+|\s+$/g, '').split("\n")
            if(objs[0] != "") {
                for(let obj of objs) {
                    var o = obj.split(" ")
                    var name = o[1].split("=")[1].replace(/'|"/g, "")
                    var uuid = o[2].split("=")[1].replace(/'|"/g, "")
                    datas.push({name: name, uuid: uuid})
                }
            }
            callback(datas);
        })
    }
    
    public splitData(datas: string[]){
        let packets = [];

        for(let i = 0; i < Math.floor(datas.length / this.packSize); i++){
            let packet = [];
            for(let j = i * this.packSize; j < ( (i +1) * this.packSize ); j++){
                packet.push(datas[j]);
            }
            packets.push(packet);
        }
        let packetFinal = []
        for(let j = Math.floor(datas.length / this.packSize) * this.packSize; j < datas.length; j++){
                packetFinal.push(datas[j]);
        }
        if(packetFinal.length > 0)
            packets.push(packetFinal)

        this.log(`${packets.length} packets`);

        return packets;
    }
    
    createBatchSession(){
        return new BS_Insert();
    }
    
    
}