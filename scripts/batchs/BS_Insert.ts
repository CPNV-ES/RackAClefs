/// <reference path="../typings/index.d.ts" />
/// <reference path="../batch.d.ts" />

import * as http from "http";
import * as url from "url";
import * as _ from "underscore";

import {BatchSession} from '../batch';

import {UsbModel} from "../models/usb";

const regex = /CPNV-([A-Z0-9])\w+/g

export default class BS_Insert extends BatchSession {
    
    
    public doElement(element: any){
        UsbModel.findUsb(element.uuid).then((res1) => {
            
            if(res1 == null) {      
                UsbModel.createUsb(element.name, true, false, element.uuid, regex.test(element.name)).then((res2) => {
                    this.log('Create')
                    this.finishOneData(-1)
                })
            }else {
                this.log('Exist')
                this.finishOneData(-1)
            }
        })        
    }
}