/**
 * Export FileUploader Service
 */
module.exports = function ($http) {

  /**
   * File Upload function
   * will upload file to specified url
   */
  this.uploadFileToUrl = function (file, id, url) {
    // Create FormData
    var fd = new FormData()
    // Add file to FormData
    fd.append('file', file)
    // Add object id to FormData
    fd.append('id', id)
  
    /**
     * Post FormData with the HTTP Service of AngularJS
     * @callback success: catch when http is successfull
     * @callback error: catch all http error
     */
    $http.post(url, fd, {
      transformRequest: angular.identity,
      headers: { 'Content-Type': undefined }
    }).success(function () {

    }).error(function () {

    })
  }
}
