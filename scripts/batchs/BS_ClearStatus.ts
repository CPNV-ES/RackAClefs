/// <reference path="../typings/index.d.ts" />
/// <reference path="../batch.d.ts" />

import * as http from "http";
import * as url from "url";
import * as _ from "underscore";

import {BatchSession} from '../batch';

import {UsbRepository, IUsbModel} from "../models/usb";


export default class BS_ClearStatus extends BatchSession {
    
    public doElement(element: any){
        let repo = new UsbRepository()
        let usb = <IUsbModel> element
        usb.status = 0
        repo.update(usb.id, usb, (err, res) => {
            if (err){
                this.finishOneData(0)
            } else {
                this.finishOneData(-1)
            }
        })
    }
}