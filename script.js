 var app = angular.module("userApp", ['ngRoute']);
 app.controller("UsersController",UsersController);


 app.config(function($routeProvider){
   $routeProvider
   .when("/login",{
     templateUrl:"templates/login.html",
     controller:"loginController",
     controllerAs: "loginCtrl"
   })
     .when("/users",{
       templateUrl:"templates/user-list.html",
       controller:"UsersController",
       controllerAs: "usersCtrl"
     })
     .when("/users/:id/edit",{
       templateUrl:"templates/edit_user.html",
       controller:"editController",
       controllerAs: "editCtrl"
     })
     .otherwise({
      redirectTo:"/users"
    });
 });

 function UsersController($scope,$http,$routeParams ,AuthService){
   AuthService.isAuthenticated();
    var uc = this;

    $http({
    method: 'GET',
    url: 'http://localhost:3000/users',
    headers:{
      "Authorization":"Token token="+ AuthService.getToken()
    }
    }).success(function successCallback(response) {
         uc.list = response;
         console.log("uc",uc.list)
    }).error(function errorCallback(response) {
        console.log("error: ",response);
   });





    uc.submitUser = function(event){
      event.preventDefault();

       $http({
            method: 'POST',
            data:{
            user: uc.user
    } ,
    headers:{
      "Authorization":"Token token="+ AuthService.getToken()
    },
    url: 'http://localhost:3000/users'
    }).success(function successCallback(response) {
         uc.list.push(response);
         console.log("OK");
         uc.user ={};
         $("#add-user-modal").modal("hide");

    }).error(function errorCallback(response) {
        console.log("error: ",response);
   });



  }
}

app.controller("editController",function($http,$location, $routeParams, AuthService){
     AuthService.isAuthenticated();
   var vm = this;

    //Pull specific user and insert into edit form
    $http({
        method: "GET",
        url: "http://localhost:3000/users/" + $routeParams.id + "/edit",
        headers:{
          "Authorization":"Token token="+ AuthService.getToken()
        }
    }).success(function(user) {
        vm.user = user;
    }).error(function() {
        alert("Error getting specific user");
    });

    //Capture submit event, prevent default, and update user server-side
    vm.submitEdits = function(event) {
        event.preventDefault();

        $http({
            method: "PUT",
            url: "http://localhost:3000/users/" + $routeParams.id,
            data: {
                user: vm.user
            },
            headers:{
              "Authorization":"Token token="+ AuthService.getToken()
            }
        }).success(function() {
            $location.path("/users");
        }).error(function() {
            alert("Error updating user");
        });
    }

});

app.controller("loginController",function($http,$location,AuthService){
var vm=this;
  vm.login = function(event){
     event.preventDefault();

     $http({
       method:"POST",
       url:"http://localhost:3000/users/login",
       data:vm.user
     }).success(function(user){
         AuthService.setSession(user);
         $location.path("/users");
       }).error(function(){
        alert("Unauth");
     })
  }
});


app.service("AuthService",function($location){
  this.setSession = function(user){
    localStorage.setItem("current_user", JSON.stringify(user));
  }

  this.getToken = function(){
    var current_user = JSON.parse(localStorage.getItem("current_user"));
    return current_user.auth_token;
  }

  this.currentUser = function (){
    return JSON.parse(localStorage.getItem("current_user"));
  }

  this.isAuthenticated = function(){
    if (this.currentUser()){
      return;
    }else {
      $location.path("/login");
    }
  }
});
