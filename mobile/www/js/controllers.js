angular.module('app.controllers', [])

.controller('searchCtrl', function ($scope, $state, searchFactory, searchDetail) {
    $scope.s = searchDetail;

    $scope.search = function () {
        console.log('Starting search.. postal=' + $scope.s.postal + '= item=' + $scope.s.item + '=');
        searchFactory.query({
            postal: $scope.s.postal,
            item: $scope.s.item
        },
            function (response) {
                $scope.s.results = response;
                $state.go('groceryHunting.results');
            },
            function (response) {
                alert("Bad Search");
            }
        );
    };

})

.controller('resultsCtrl', function ($scope, $stateParams, searchDetail) {
    $scope.s = searchDetail;

    var disp = [];

    // process data
    for (var i = 0; i < searchDetail.results.length; i++) {
        // company
        var ci = searchDetail.results[i];
        for (var j = 0; j < ci.stores.length; j++) {
            // store
            var st = ci.stores[j];

            var dispItem = {
                name: ci.citem.item.name,
                price: ci.citem.price,
                store: st.name,
                company: st.company.name,
            };
            disp.push(dispItem);
        }
    }

    $scope.ds = disp;

})

