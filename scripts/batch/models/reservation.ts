import * as mongoose from "mongoose"

export let Schema = mongoose.Schema
export let ObjectId = mongoose.Schema.Types.ObjectId
export let Mixed = mongoose.Schema.Types.Mixed

export interface IReservationModel extends mongoose.Document {
    name : string
    status: number
    usb: any
    filename: string
    reserved_at: Date
    returned_at: Date
    user: number
    created_at: Date
    updated_at: Date
}

let schema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    usb: {
        type: mongoose.Types.ObjectId,
        ref: 'Usb',
        required: true
    },
    user: {
        type: Number,
        required: true
    },
    reserved_at: {
        type: Date,
        require: false
    },
    returned_at: {
        type: Date,
        required: false
    },
    created_at: {
        type: Date,
        require: false
    },
    updated_at: {
        type: Date,
        required: false
    }
}).pre('save', (next) => {
    if(this._doc) {
        let doc = this._doc
        let now = new Date()
        if(! doc.create_at) {
            doc.created_at = now
        }

        if(! doc.reserved_at) {
            doc.reserved_at = now
        }

        doc.updated_at = now
    }
    next()
    return this
})

export let ReservationSchema = mongoose.model<IReservationModel>('reservation', schema, 'reservations', true)

export class ReservationModel {
    private _reservationModel: IReservationModel

    constructor(reservationModel: IReservationModel) {
        this._reservationModel = reservationModel
    }

    get name(): string {
        return this._reservationModel.name
    }

    get filename(): string {
        return this._reservationModel.filename
    }

    get usb(): any {
        return this._reservationModel.usb
    }

    get status(): number {
        return this._reservationModel.status
    }

    get reserved_at(): Date {
        return this._reservationModel.reserved_at
    }

    get returned_at(): Date {
        return this._reservationModel.returned_at
    }

    get user(): number {
        return this._reservationModel.user
    }

    static createReservation(name: string, status: number, filename: string, user: number) : Promise.IThenable<IReservationModel> {
        let p = new Promise((resolve, reject) => {
            let repo = new ReservationRepository()
            let usb = <IReservationModel> {
                name: name,
                status: status,
                filename: filename,
                user: user
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

    static findReservation(_id: string): Promise.IThenable<IUsbModel> {
        let p = new Promise((resolve, reject) => {
            let repo = new ReservationRepository()

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

Object.seal(ReservationModel)

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

export class ReservationRepository extends RepositoryBase<IReservationModel> {
  constructor() {
    super(ReservationSchema);
  }
}

Object.seal(ReservationRepository);