angular.module('app.services', ['ngResource'])

//.constant("baseURL", "https://localhost:3443/")
.constant("baseURL", "https://wbtech-courser2.cloudapp.net:3443/")

.factory('searchFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    return $resource(baseURL + "search/:postal/item/:item");

}])

.factory('searchDetail', function () {
    obj = {};
    obj.postal = '';
    obj.item = '';
    obj.results = [];
    return obj;
})

;
