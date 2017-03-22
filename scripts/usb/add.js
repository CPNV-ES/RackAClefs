/**
 * Load dependencies and model
 */
var Usb = require('../../model/usb')
var uniqid = require('uniqid')

console.log(`Generating random data for usb (name, uuid)`)
// Generate random uuid and name for an usb key
let uuid = uniqid().substr(0, 4) + '-' + uniqid().substr(0, 4)
let name = uniqid()

console.log(`Creating usb for database storing`)
// Create an new Usb Entity
let usb = new Usb()
usb.name = name
usb.status = true
usb.reserved = false
usb.uuid = uuid
usb.initialized = true

console.log(`Saving usb in database`)
// Save Usb Entity
usb.save((err, u) => {
  if (err) {
    // Catch error if has
    console.log(`Error on saving usb : ${err}`)
    return
  }
  console.log(`Usb successfully created with name : ${u.name} and uuid : ${u.uuid}`)
})
