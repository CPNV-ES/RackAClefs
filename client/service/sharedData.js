/**
 * Export SharedData Service
 */
module.exports = function () {
  // Contain all shared data
  var data = {}

  /**
   * Return getter and setter for shared data
   */
  return {
    get: function (key) {
      return data[key]
    },
    set: function (key, value) {
      data[key] = value
    }
  }
}
