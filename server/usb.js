var monitor = require('node-usb-detection')
var spawn = require('child_process').spawn

module.exports = function() {
	monitor.add((device) => {
		setTimeout(() => {
			var add = spawn('node',[__dirname + '/../scripts/batch/chainBatch/addusbkey.js'])

			add.stdout.on('data', (data) => { })

			add.stderr.on('data', (data) => { })

			add.on('close', (code) => { console.log("Finish add all key") })
		}, 10000)
		
	})

	monitor.remove((device) => {
		var remove = spawn('node',[__dirname + '/../scripts/batch/chainBatch/checkusbs.js'])

		remove.stdout.on('data', (data) => { })

		remove.stderr.on('data', (data) => { })

		remove.on('close', (code) => { console.log("Finish check all key") })
	})
}