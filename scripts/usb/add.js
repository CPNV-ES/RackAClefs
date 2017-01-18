var Usb = require('../../model/usb')
var uniqid = require('uniqid')

console.log(`Generating random data for usb (name, uuid)`)
let uuid = uniqid().substr(0, 4) + '-' + uniqid().substr(0, 4)
let name = uniqid()

console.log(`Creating usb for database storing`)
let usb = new Usb()
usb.name = name
usb.status = true
usb.reserved = false
usb.uuid = uuid
usb.initialized = true

console.log(`Saving usb in database`)
usb.save((err, u) => {
    if (err) {
        console.log(`Error on saving usb : ${err}`)
        return
    }

    console.log(`Usb successfully created with name : ${u.name} and uuid : ${u.uuid}`)
})