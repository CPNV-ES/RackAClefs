import * as mongoose from "mongoose"

export let Schema = mongoose.Schema
export let ObjectId = mongoose.Schema.Types.ObjectId
export let Mixed = mongoose.Schema.Types.Mixed

export interface IUsbModel extends mongoose.Document {
    name : string
    status: boolean
    reserved: boolean
    uuid: string
    created_at: Date
    updated_at: Date
    initialized: boolean
}

let schema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    reserved: {
        type: Boolean,
        required: true
    },
    uuid: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        require: false
    },
    updated_at: {
        type: Date,
        required: false
    },
    initialized: {
        type: Boolean,
        required: true
    }
}).pre('save', (next) => {
    if(this._doc) {
        let doc = this._doc
        let now = new Date()
        if(! doc.create_at) {
            doc.created_at = now
        }

        doc.updated_at = now
    }
    next()
    return this
})

export let UsbSchema = mongoose.model<IUsbModel>('usb', schema, 'usbs', true)

export class UsbModel {
    private _usbModel: IUsbModel

    constructor(usbModel: IUsbModel) {
        this._usbModel = usbModel
    }

    get name(): string {
        return this._usbModel.name
    }

    get status(): boolean {
        return this._usbModel.status
    }

    get reserved(): boolean {
        return this._usbModel.reserved
    }

    get uuid(): string {
        return this._usbModel.uuid
    }
    get initialized(): boolean {
        return this._usbModel.initialized
    }

    static createUsb(name: string, status: boolean, reserved: boolean, uuid: string, initialized: boolean) : Promise.IThenable<IUsbModel> {
        let p = new Promise((resolve, reject) => {
            let repo = new UsbRepository()
            let usb = <IUsbModel> {
                name: name,
                status: status,
                reserved: reserved,
                uuid: uuid,
                initialized: initialized
            }

            repo.create(usb, (err, res) => {
                if(err) {
                    reject(err)
                }
                else {
                    resolve(res)
                }
            })
        })

        return p
    }

    static findUsb(uuid: string): Promise.IThenable<IUsbModel> {
        let p = new Promise((resolve, reject) => {
            let repo = new UsbRepository()

            repo.find({uuid: uuid}).sort({created_at: -1}).limit(1).exec((err, res) => {
                if(err) {
                    reject(err)
                }
                else {
                    if(res.length){
                        resolve(res[0])
                    }
                    else {
                        resolve(null)
                    }
                }
            })
        })

        return p
    }

}

Object.seal(UsbModel)

export interface IRead<T> {
    retrieve: (callback: (error: any, result: any) => void) => void
    findById: (id: string, callback: (error: any, result: T) => void) => void
    findOne(cond?: Object, callback?: (error: any, result: T) => void): mongoose.Query<T>
    find(cond: Object, fields: Object, options: Object, callbakc?: (error:any, result: T[]) => void): mongoose.Query<T[]>
}

export interface IWrite<T> {
    create : (item: T, callback: (error: any, result:any) => void) => void
    update: (_id: string, item: T, callback: (error : any, result: any) => void) => void
    delete: (_id: string, callback: (error: any, result: any) => void) => void
}

export class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T> {
    private _model: mongoose.Model<mongoose.Document>

    constructor(schemaModel: mongoose.Model<mongoose.Document>) {
        this._model = schemaModel
    }

    create(item: T, callback: (error:any, result: any) => void) {
        this._model.create(item, callback)
    }    

    retrieve(callback: (error: any, result: any) => void) {
        this._model.find({}, callback)
    }

    update(_id: string, item: T, callback: (error: any, result: any) => void) {
        this._model.update({_id: this.toObjectId(_id)}, item, callback)
    }

    delete(_id: string, callback: (error: any, result: any) => void) {
        this._model.remove({_id: this.toObjectId(_id)}, (err) => callback(err, null))
    }

    findById(_id: string, callback: (error: any, result: T) => void) {
        this._model.findById(_id, callback);
    }

    findOne(cond?: Object, callback?: (err: any, res: T) => void): mongoose.Query<T> {
        return this._model.findOne(cond, callback);
    }

    find(cond?: Object, fields?: Object, options?: Object, callback?: (err: any, res: T[]) => void): mongoose.Query<T[]> {
        return this._model.find(cond, options, callback);
    }

    private toObjectId(_id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(_id)
    }
}

export class UsbRepository extends RepositoryBase<IUsbModel> {
  constructor() {
    super(UsbSchema);
  }
}

Object.seal(UsbRepository);