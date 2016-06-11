angular.module('app.routes', [])

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        .state('groceryHunting.search', {
            url: '/search',
            views: {
                'side-menu': {
                    templateUrl: 'templates/search.html',
                    controller: 'searchCtrl'
                }
            }
        })

    .state('groceryHunting.results', {
        url: '/results?results',
        cache: false,
        views: {
            'side-menu': {
                templateUrl: 'templates/results.html',
                controller: 'resultsCtrl'
            }
        }
    })

    .state('groceryHunting', {
        url: '/side-menu',
        templateUrl: 'templates/groceryHunting.html',
        abstract: true
    })

    $urlRouterProvider.otherwise('/side-menu/search')

});