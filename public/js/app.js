angular.module("contactsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                controller: "Home",
                templateUrl: "home.html"
            })
            .when("/signin", {
              controller:"SignIn",
              templateUrl:"sign_in.html",
              authenticated: false
            })
            .when("/signup", {
              controller:"SignUp",
              templateUrl:"sign_up.html",
              authenticated: false
            })
            .when("/locationAdmin", {
              controller:"Admin",
              templateUrl:"location_admin.html",
              authenticated: true
            })
            .when("/locations", {
              controller:"Locations",
              templateUrl:"locations.html",
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .run(function($rootScope, $location, auth) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        if(!auth.checkPermissionForView(next)){
          $location.path("/");
        }
      })
    })
    .factory('auth', ['$http', '$window','$location', function($http, $window, $location){
      var auth = {};
      var admin = false;
      var username = "";
      var location;
      var locationsData;

      auth.saveToken = function (token){
        $window.localStorage['munch-token'] = token;
      };

      auth.getToken = function (){
        return $window.localStorage['munch-token'];
      }

      auth.isLoggedIn = function(){
        var token = auth.getToken();

        if(token){
          var payload = JSON.parse($window.atob(token.split('.')[1]));

          return payload.exp > Date.now() / 1000;
        } else {
          return false;
        }
      };

      auth.currentUser = function(){
        if(auth.isLoggedIn()){
          var token = auth.getToken();
          var payload = JSON.parse($window.atob(token.split('.')[1]));

          return payload.username;
        }
      };

      auth.register = function(user){
        return $http.post('/register', user).success(function(data){
          auth.saveToken(data.token);
        });
      };

      auth.locationDetails = function(user){
        return $http.post('/location', {username:user}).success(function(data){
          auth.location = data;
        }).error(function(err){
          console.log(err);
        });
      };

      auth.locations = function(user){
        return $http.get('/locations').success(function(data){
          auth.locationsData = data;
        }).error(function(err){
          console.log(err);
        });
      };

      auth.updateLocation = function(location){
        return $http.post('/update_location', location,{headers: {Authorization: 'Bearer '+auth.getToken()}})
      .success(function(data){
          console.log(data);
        }).error(function(err){
          console.log(err);
        });
      };

      auth.logIn = function(user){
        return $http.post('/login', user).success(function(data){
          auth.saveToken(data.token);
          auth.admin = data.admin;
        }).error(function(err){
          console.log(err);
        });
      };

      auth.logOut = function(){
        $window.localStorage.removeItem('munch-token');
        $location.path("/");
      };

      auth.checkPermissionForView = function(view) {
          if (!view.authenticated) {
              return true;
          }
          return auth.isLoggedIn();
      };

      return auth;
    }])
    .controller("Home", function($scope, $location, auth) {
      console.log("Here");
        $scope.findFood = function() {
            console.log("findFood");
            $location.path("/locations");
        }
    })
    .controller("Locations", function($scope, $location, auth) {
        auth.locations().error(function(error){
          $scope.error = error;
          console.log(error);
        }).then(function(){
          $scope.locations = auth.locationsData;
        });
        $scope.showCategories = function(user){
          auth.locationDetails(user).error(function(error){
            $scope.error = error;
            console.log(error);
          }).then(function(){
            $scope.location = auth.location;
            console.log($scope.location);
          });
        }
    })
    .controller("SignIn", function($scope, $location, auth) {
        $scope.sign_in = function() {
            //$location.path("#/");
            var username = $scope.user;
            if(username == undefined || username == ""){
              alert("You must enter a username");
            } else {
              auth.logIn($scope.user).error(function(error){
                $scope.error = error;
                console.log(error);
              }).then(function(){
                $location.path("/locationAdmin");
              });
            }
        }
    })
    .controller("Admin", function($scope, $location, auth) {
      console.log(auth.currentUser());

      auth.locationDetails(auth.currentUser()).error(function(error){
        $scope.error = error;
        console.log(error);
      }).then(function(){
        $scope.title = "Menu";
        $scope.location = auth.location;
      });
      $scope.update = function(){
        $scope.location.latitude = angular.element('#lat').val();
        $scope.location.longitude = angular.element('#long').val();
        auth.updateLocation($scope.location);
      }
      $scope.addCategory = function(){
        $scope.location.categories.push({category:"",items:[]});
      }
      $scope.removeCategory = function(index){
        console.log($scope.location.categories[index]);
        $scope.location.categories.splice(index,1);;
      }
      $scope.addItem = function(index){
        $scope.location.categories[index].items.push({name:"",price:"",description:"",options:[]});
      }
      $scope.removeItem = function(parent, index){
        console.log($scope.location.categories[parent]);
        $scope.location.categories[parent].items.splice(index,1);;
      }
      $scope.viewItem = function($index) {
        console.log($scope.items);
        if($scope.items[$index] != true){
          $scope.items[$index] = true;
        } else {
          $scope.items[$index] = false;
        }
      };
      $scope.viewOption = function($index) {
        console.log($scope.itemOptions);
        if($scope.itemOptions[$index] != true){
          $scope.itemOptions[$index] = true;
        } else {
          $scope.itemOptions[$index] = false;
        }
      };
      $scope.addOption = function(parentIndex,index){
        $scope.location.categories[parentIndex].items[index].options.push({name:"",multiple:"",elements:[]});
      }
      $scope.removeOption = function(parentParentIndex, parentIndex,index){
        $scope.location.categories[parentParentIndex].items[parentIndex].options.splice(index,1);
      }
      $scope.addElement = function(parentParentIndex, parentIndex,index){
        $scope.location.categories[parentParentIndex].items[parentIndex].options[index].elements.push({text:"",price:0});
      }
      $scope.removeElement = function(parentParentParentIndex,parentParentIndex, parentIndex,index){
        $scope.location.categories[parentParentParentIndex].items[parentParentIndex].options[parentIndex].elements.splice(index,1);
      }
      $scope.showURL = function(){
        if(!$scope.editURL){
          $scope.editURL = true;
        } else {
          $scope.editURL = false;
        }
      }
      $scope.displayMap = function(){
        if(!$scope.showMap){
          $scope.showMap = true;
          $scope.mapStatus = "Show";
        } else {
          $scope.showMap = false;
          $scope.mapStatus = "Hide";
        }
      }
    })
    .controller('NavCtrl', [
    '$scope',
    'auth',
    function($scope, auth){
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
      }
    ])
    .controller("SignUp", function($scope, $location, $http) {
        $scope.sign_up = function() {
            var username = $scope.username;
            var password = $scope.password;
            var email = $scope.email;
            var admin = true;

            if(username == undefined || username == ""){
              alert("You must enter a username");
            } else {
              $http({
                method: 'POST',
                url: '/register',
                headers: {'Content-Type': 'application/json'},
                data: {username: $scope.username, password: $scope.password, email: $scope.email, admin:true}
            }).success(function (data) {
              alert(data);
            });
            }
        }
        $scope.signIn = function() {
          $location.path("#/");
        }
    });
