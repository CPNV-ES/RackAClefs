module.exports = function ($http) {
  this.uploadFileToUrl = function (file, id, url) {
    var fd = new FormData()
    fd.append('file', file)
    fd.append('id', id)

    $http.post(url, fd, {
      transformRequest: angular.identity,
      headers: { 'Content-Type': undefined }
    }).success(function () {

    }).error(function () {

    })
  }
}
