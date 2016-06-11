'use strict';

var app = angular.module('confusionApp', ['ui.router', 'ngResource', 'ngDialog', 'underscore', 'xeditable'])
.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        // route for the home page
        .state('app', {
            url: '/',
            views: {
                'header': {
                    templateUrl: 'views/header.html',
                    controller: 'HeaderController'
                },
                'content': {
                    templateUrl: 'views/home.html',
                    controller: 'HomeController'
                },
                'footer': {
                    templateUrl: 'views/footer.html',
                }
            }

        })

        // route for the items page
        .state('app.items', {
            url: 'items',
            views: {
                'content@': {
                    templateUrl: 'views/items.html',
                    controller: 'ItemsController'
                }
            }
        })
        .state('app.item', {
            url: 'items/:id',
            views: {
                'content@': {
                    templateUrl: 'views/item.html',
                    controller: 'ItemDetailController'
                }
            }
        })
        
        // route for the company page
        .state('app.company', {
            url: 'company/:id',
            views: {
                'content@': {
                    templateUrl: 'views/company.html',
                    controller: 'CompanyController'
                }
            }
        })
        .state('app.companies', {
            url: 'company',
            views: {
                'content@': {
                    templateUrl: 'views/companies.html',
                    controller: 'CompaniesController'
                }
            }
        })

    ;

    $urlRouterProvider.otherwise('/');
})
;

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
})
;
