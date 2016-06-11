'use strict';

angular.module('confusionApp')

.controller('HomeController', ['$scope', function ($scope) {

}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;
    $scope.username = '';

    if (AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }

    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller: "LoginController" });
    };

    $scope.logOut = function () {
        AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };

    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });

    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });

    $scope.stateis = function (curstate) {
        return $state.is(curstate);
    };

}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.loginData = $localStorage.getObject('userinfo', '{}');

    $scope.doLogin = function () {
        if ($scope.rememberMe)
            $localStorage.storeObject('userinfo', $scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };

    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller: "RegisterController" });
    };

}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.register = {};
    $scope.loginData = {};

    $scope.doRegister = function () {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);

        ngDialog.close();

    };
}])

.controller('ItemsController', ['$scope', '$state', 'itemFactory', function ($scope, $state, itemFactory) {

    $scope.itemsLoaded = false;
    $scope.itemsMsg = "Loading...";

    itemFactory.query(
        function (response) {
            $scope.items = response;
            $scope.itemsLoaded = true;
        },
        function (response) {
            $scope.itemsMsg = "Error: " + response.status + " " + response.statusText;
        });

    $scope.removeItem = function (item) {
        console.log('delete item=' + item._id);
        itemFactory.delete({ id: item._id });

        var index = $scope.items.indexOf(item);
        $scope.items.splice(index, 1); 
    };

}])


.controller('ItemDetailController', ['$scope', '$state', '$stateParams', 'itemFactory', function ($scope, $state, $stateParams, itemFactory) {

    $scope.item = {}
    $scope.itemLoaded = false;
    $scope.itemMsg = "Loading...";
    $scope.add = false;
    if ($stateParams.id === ""
       || $stateParams.id === "add") {
        $scope.add = true;
    }

    if ($scope.add) {
        $scope.itemMsg = "Add new Item";
        $scope.item = {
            image: "",
            name: "",
            description: ""
        }
    }
    else {
        $scope.item = itemFactory.get({
            id: $stateParams.id
        })
            .$promise.then(
                function (response) {
                    $scope.item = response;
                    $scope.itemLoaded = true;
                },
                function (response) {
                    $scope.itemMsg = "Error: " + response.status + " " + response.statusText;
                }
            );
    }

    $scope.submitItem = function () {
        if ($scope.add) {
            itemFactory.save($scope.item);
        }
        else {
            itemFactory.update({ id: $stateParams.id }, $scope.item);
        }

        //$state.reload();//.go($state.current, {}, { reload: true });

    };

}])


.controller('CompaniesController', ['$scope', '$state', 'companyFactory', function ($scope, $state, companyFactory) {

    $scope.companiesLoaded = false;
    $scope.companiesMsg = "Loading...";

    companyFactory.query(
        function (response) {
            $scope.companies = response;
            $scope.companiesLoaded = true;
        },
        function (response) {
            $scope.companiesMsg = "Error: " + response.status + " " + response.statusText;
        });

    $scope.removeCompany = function (company) {
        console.log('delete company=' + company._id);
        companyFactory.delete({ id: company._id });
        var index = $scope.companies.indexOf(company);
        $scope.companies.splice(index, 1); 
    };

}])


.controller('CompanyController', ['$scope', '$state', '$stateParams', 'companyFactory', 'storeFactory', 'companyStoreFactory', 'companyItemsFactory', 'companyItemFactory',  'ngDialog', '$filter', function ($scope, $state, $stateParams, companyFactory, storeFactory, companyStoreFactory, companyItemsFactory, companyItemFactory, ngDialog, $filter) {

    $scope.company = {}
    $scope.companyLoaded = false;
    $scope.companyMsg = "Loading...";
    $scope.add = false;
    
    $scope.storesMsg = "Loading...";
    $scope.storesLoaded = false;
    
    $scope.itemsMsg = "Loading...";
    $scope.itemsLoaded = false;
    
    if ($stateParams.id === ""
       || $stateParams.id === "add") {
        $scope.add = true;
    }

    if ($scope.add) {
        $scope.companyMsg = "Add new Company";
        $scope.company = {
            image: "",
            name: ""
        }
    }
    else {
        $scope.company = companyFactory.get({
            id: $stateParams.id
        })
            .$promise.then(
                function (response) {
                    $scope.company = response;
                    $scope.companyLoaded = true;
                },
                function (response) {
                    $scope.companyMsg = "Error: " + response.status + " " + response.statusText;
                }
            );

        $scope.stores = companyStoreFactory.query({
            id: $stateParams.id
        })
            .$promise.then(
                function (response) {
                    $scope.stores = response;
                    $scope.storesLoaded = true;
                },
                function (response) {
                    $scope.storesMsg = "Error: " + response.status + " " + response.statusText;
                }
            );

        $scope.items = companyItemsFactory.query({
            id: $stateParams.id
        })
            .$promise.then(
                function (response) {
                    $scope.items = response;
                    // copy price off for comparison
                    for (var i = $scope.items.length; i--;) {
                        var sItem = $scope.items[i];
                        sItem.origPrice = sItem.price;                        
                    }
                    $scope.itemsLoaded = true;
                },
                function (response) {
                    $scope.itemsMsg = "Error: " + response.status + " " + response.statusText;
                }
            );
        
    }

    $scope.submitCompany = function () {
        if ($scope.add) {
            companyFactory.save($scope.company);
        }
        else {
            companyFactory.update({ id: $stateParams.id }, $scope.company);
        }
        //$state.reload();//.go($state.current, {}, { reload: true });
    };
    
    $scope.handleStore = function (theStore) {
        $scope.store = theStore;
        $scope.AddTheStore = false;
        if ( $scope.store == null )
        {
            $scope.AddTheStore = true;
            $scope.store = {company:$stateParams.id}
        }
        ngDialog.open({ 
            template: 'views/store.html', 
            scope: $scope, 
            className: 'ngdialog-theme-default', 
            controller: "StoreController" 
        });
    };
    
    $scope.removeStore = function (store) {
        console.log('delete store=' + store._id);
        storeFactory.delete({ id: store._id });
        
      var index = $scope.stores.indexOf(store);
      $scope.stores.splice(index, 1); 
    };
    
    $scope.selectItem = function () {
        $scope.companyId = $stateParams.id;
        
        ngDialog.open({ 
            template: 'views/selectItem.html', 
            scope: $scope, 
            className: 'ngdialog-theme-default', 
            controller: "SelectItemController" 
        });
    };
    
    $scope.removeItem = function (citem) {
        console.log('delete item from company=' + citem._id);
        companyItemFactory.delete({ id: citem._id });
        var index = $scope.items.indexOf(citem);
        $scope.items.splice(index, 1); 
    };
    
    
/// working on for editable table areas
    
  $scope.saveItemTable = function() {
    var results = [];
    for (var i = $scope.items.length; i--;) {
        var sItem = $scope.items[i];
        // only perform an update if the price is filled in and differs
        if ( sItem.price != "" && sItem.price != sItem.origPrice)
        {
            // perform the update
            sItem.origPrice = sItem.price;
            
            // need to build up new citem object to persist with id, company as id, item as id, and price as #.## must have period in it            
            var itemToUpdate = {
                _id:sItem._id,
                company: sItem.company,
                item: sItem.item._id,
                price: ""+sItem.price/100.0
            };
            companyItemFactory.update({ id: itemToUpdate._id }, itemToUpdate);
        }
    }
    return true;
  };
  $scope.cancelItemTable = function() {
  };

}])

.controller('StoreController', ['$scope','storeFactory','ngDialog', function ($scope, storeFactory, ngDialog) {
    $scope.doStoreChange = function (){
        if ($scope.AddTheStore) {
            $scope.AddTheStore = false;
            storeFactory.save($scope.store, function(data) {
                $scope.store._id = data._id;
                $scope.stores.push($scope.store);
            });            
        }
        else {
            storeFactory.update({ id: $scope.store._id }, $scope.store);
        }
        ngDialog.close();
    }
}])

.controller('SelectItemController', ['$scope','companyItemFactory', 'itemFactory', 'ngDialog', '_', function ($scope, companyItemFactory, itemFactory, ngDialog, _) {
    
    $scope.itemsLoaded = false;
    $scope.itemsMsg = "Loading...";

    itemFactory.query(
        function (response) {
            $scope.allItems = response;
            $scope.itemsLoaded = true;
            
            var result = [];
            _.each($scope.allItems, function(ea) {
                var entry = _.find($scope.items, function(eb) {return ea._id == eb.item._id;});
                if (!entry) result.push(ea);
            });
            
            $scope.notUsedItems = result;
        },
        function (response) {
            $scope.itemsMsg = "Error: " + response.status + " " + response.statusText;
        });

    
    $scope.selectedItem = null;
    $scope.selectItem = function (item)
    {
        $scope.selectedItem = item;
    }
    
    $scope.doAddItem = function (){
        if ( $scope.selectedItem == null )
        {
            return; // just exit because we can't do the add
        }
        
        $scope.itemToAdd = {
            company: $scope.companyId,
            item: $scope.selectedItem._id,
            price: $scope.price
        };

        companyItemFactory.save($scope.itemToAdd, function(data) {
            $scope.itemToAdd._id = data._id;
            $scope.itemToAdd.item = $scope.selectedItem;
            $scope.itemToAdd.price *= 100;
            $scope.items.push($scope.itemToAdd);
            ngDialog.close();
        });
    }
}])


;