angular.module("contactsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                controller: "NewContactController",
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
    .factory('auth', ['$http', '$window', function($http, $window){
      var auth = {};
      var admin = false;
      var username = "";
      var location;

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
          console.log(data);
        }).error(function(err){
          console.log(err);
        });
      };

      auth.updateLocation = function(location){
        return $http.post('/update_location', location).success(function(data){
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
        $window.localStorage.removeItem('flapper-news-token');
      };

      auth.checkPermissionForView = function(view) {
          if (!view.authenticated) {
              return true;
          }
          return auth.isLoggedIn();
      };

      return auth;
    }])
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
        console.log($scope.location);
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
        $scope.location.categories[index].items.push({name:"",price:"",description:""});
      }
      $scope.removeItem = function(parent, index){
        console.log($scope.location.categories[parent]);
        $scope.location.categories[parent].items.splice(index,1);;
      }
      $scope.viewItem = function($index) {
        if($scope.loading[$index] != true){
          $scope.loading[$index] = true;
        } else {
          $scope.loading[$index] = false;
        }
      };
    })
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
