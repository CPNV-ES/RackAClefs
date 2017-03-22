/**
 * Load dependencies
 */
var monitor = require('node-usb-detection')
var spawn = require('child_process').spawn

/**
 * Export Usb detection module
 */
module.exports = function () {
  /**
   * Catch add usb event
   */
  monitor.add((device) => {
    setTimeout(() => {
      // Launch batch for usb processing with 10 seconds to wait usb mounting on OS
      var add = spawn('node', [__dirname + '/../scripts/batch/chainBatch/addusbkey.js'])
      add.on('close', (code) => { console.log('Finish add all key') })
    }, 10000)
  })

  /**
   * Catch remove usb event
   */
  monitor.remove((device) => {
    // Launch batch for usb processing
    var remove = spawn('node', [__dirname + '/../scripts/batch/chainBatch/checkusbs.js'])
    remove.on('close', (code) => { console.log('Finish check all key') })
  })
}
