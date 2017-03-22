var Usb = require('../model/usb')
var Reservation = require('../model/reservation')

module.exports = function (io, domain) {
  io.on('connection', function (socket) {
    global.users[socket.id] = socket
    console.log(socket.id + ' connected')

    socket.on('disconnect', () => {
      delete global.users[socket.id]
    })

    /**
     * USB ORM
     */

    // Return list of all usb keys
    socket.on('usb/list', (callback) => {
      Usb.find({ }, callback)
    })

    /**
     * ADMIN USB ORM
     */
    // Return list of all usb keys
    socket.on(adminUniq + '/admin/usb/list', (callback) => {
      Usb.find({ }, callback)
    })

    // Add manualy usb key to the MongoDB storage
    socket.on(adminUniq + '/admin/usb/save', (usb, callback) => {
      if (usb._id != null) {
        Usb.findById(usb._id, (err, u) => {
          u.name = usb.name
          u.status = usb.status
          u.save(callback)
        })
      } else {
        var u = new Usb(usb)
        u.save(callback)
      }
    })

    // Delete usb key from the MongoDB storage
    socket.on(adminUniq + '/admin/usb/delete', (usb, callback) => {
      Usb.findById(usb._id, (err, u) => {
        if (err) {
          callback(err, null)
          return
        }

        u.remove(callback)
      })
    })

    /**
     * Reservation ORM
     */

    // Return list of all reservation
    socket.on('reservation/list', (callback) => {
      Reservation.find({}, callback)
    })

    // Create and edit a reservation
    socket.on('reservation/save', (data, callback) => {

      // Edit reservation
      if (data.id != null) {
        Reservation.findById(data.id, function (err, reservation) {
          reservation.name = data.name
          var usbCount = reservation.usbs.length - data.count
          if (usbCount > 0) {
            Usb.find({ status: true, reserved: false, initialized: true}).limit(usbCount).exec(function (err, usbs) {
              if (err) {
                callback(err, null)
                return false
              }
              for (var uz in usbs) {
                var usb = usbs[u]

                usb.reserved = true

                usb.save(function (err, usbData) {
                  reservation.usbs.push(usbData)
                })
              }

              reservation.save(callback)
            })
          } else if (usbCount < 0) {
            var start = reservation.usbs.length - (usbCount * -1)
            var usbs = reservation.usbs.slice(start, reservation.usbs.length)
            console.log(reservation.usbs, usbs)
          }
        })
      } else {

        // Create reservation
        var reservation = new Reservation()
        reservation.name = data.name
        reservation.user = data.user
        reservation.reserved_at = new Date()
        reservation.status = true

        Usb.find({ status: true, reserved: false, initialized: true}).limit(data.count).exec(function (err, usbs) {
          if (err) {
            callback(err, null)
            return false
          }

          for (var u in usbs) {
            var usb = usbs[u]

            usb.reserved = true

            usb.save(function (err, usbData) {
              console.log('UsbData', usbData)
              reservation.usbs.push(usbData)
            })
          }

          reservation.save(callback)
        })
      }
    })


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
