/// <reference path="../batch.d.ts" />
import * as mongoose from 'mongoose';
import {BatchActivity} from '../batch';
import BS_ClearStatus from './BS_ClearStatus';
import {UsbRepository, IUsbModel} from "../models/usb";

export default class BA_ClearStatus extends BatchActivity<String, BS_ClearStatus> {
    
    
    public selectData(callback){
        let repo = new UsbRepository()

        repo.retrieve((err, res) => {
            callback(res)
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
        return new BS_ClearStatus();
    }
    
    
}