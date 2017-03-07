import * as mongoose from "mongoose"

export let Schema = mongoose.Schema
export let ObjectId = mongoose.Schema.Types.ObjectId
export let Mixed = mongoose.Schema.Types.Mixed

export interface IReservationUsbModel extends mongoose.Document {
    reservation : string
    usb: string
}

let schema = new Schema({
    reservation: {
        type:  mongoose.Types.ObjectId,
        ref: 'Reservation',
        required: true
    },
    
    usb: {
        type: mongoose.Types.ObjectId,
        ref: 'Usb',
        required: true
    },
})

export let ReservationUsbSchema = mongoose.model<IReservationUsbModel>('reservationusb', schema, 'reservationusbs', true)

export class ReservationUsbModel {
    private _reservationModel: IReservationUsbModel

    constructor(reservationModel: IReservationUsbModel) {
        this._reservationModel = reservationModel
    }

    get reservation(): string {
        return this._reservationModel.reservation
    }

    get usb(): any {
        return this._reservationModel.usb
    }


    static createReservationUsb(reservation: string, usbkey: string) : Promise.IThenable<IReservationUsbModel> {
        let p = new Promise((resolve, reject) => {
            let repo = new ReservationUsbRepository()
            let usb = <IReservationUsbModel> {
                reservation: reservation,
                usb: usbkey
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

    static findReservationUsb(_id: string): Promise.IThenable<IUsbModel> {
        let p = new Promise((resolve, reject) => {
            let repo = new ReservationUsbRepository()

            repo.find({_id: mongoose.Types.ObjectId.createFromHexString(_id)}).sort({created_at: -1}).limit(1).exec((err, res) => {
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

Object.seal(ReservationUsbModel)

export interface IRead<T> {
    retrieve: (callback: (error: any, result: any) => void) => void
    findById: (id: string, callback: (error: any, result: T) => void) => void
    findOne(cond?: Object, callback?: (error: any, result: T) => void): mongoose.Query<T>
    find(cond: Object, fields: Object, options: Object, callbakc?: (error:any, result: T[]) => void): mongoose.Query<T[]>
}

export interface IWrite<T> {
    create : (item: T, callback: (error: any, result:any) => void) => void
    update: (_id: mongoose.Types.ObjectId, item: T, callback: (error : any, result: any) => void) => void
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

    update(_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
        this._model.update({_id: _id}, item, callback)
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

export class ReservationUsbRepository extends RepositoryBase<IReservationUsbModel> {
  constructor() {
    super(ReservationUsbSchema);
  }
}

Object.seal(ReservationUsbRepository);