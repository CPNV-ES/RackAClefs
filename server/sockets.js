var Usb = require('../model/usb')
var Reservation = require('../model/reservation')

//var usbDriver = require('usb-driver');

module.exports = function(io, domain) {

    io.on('connection', function (socket) {
        global.users[socket.id] = socket
        console.log(socket.id + " connected")

        socket.on('disconnect', () => {
            delete global.users[socket.id]
        }) 

        /**
         * USB ORM
         */
        socket.on('usb/list', (callback) => {
            Usb.find({ }, callback)
        })


        /**
         * ADMIN USB ORM
         */
        socket.on(adminUniq + '/admin/usb/list', (callback) => {
            Usb.find({ }, callback)
        })

        socket.on(adminUniq + '/admin/usb/save', (usb, callback) => {
            if(usb._id != null) {
                Usb.findById(usb._id, (err, u) => {
                    u.name = usb.name
                    u.status = usb.status
                    u.save(callback)
                })
            }else {
                var u = new Usb(usb)
                u.save(callback)
            }
        }) 

        socket.on(adminUniq + '/admin/usb/delete', (usb, callback) => {
            Usb.findById(usb._id, (err, u) => {
                if(err) {
                    callback(err, null)
                    return
                }

                u.remove(callback)
            })
        })

        /**
         * Reservation ORM
         */
        socket.on('reservation/list', (callback) => {
            Reservation.find({}, callback)
        })

        /**
         * USB Event
         */
        /*usbDriver.on('attach', function(device) { console.log('add', device) });
        usbDriver.on('detach', function(device) { console.log('remove', device) });*/
        /**
         * Catching domain errors
         */
        domain.on('error', (err) => {
            socket.emit('server-error', err.message, err)
        })

        domain.on('uncaughtExeption', (err) => {
            socket.emit(err.message, err)
        })
    })
}