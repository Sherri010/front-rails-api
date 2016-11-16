 var app = angular.module("userApp", ['ngRoute']);
 app.controller("UsersController",UsersController);


 app.config(function($routeProvider){
   $routeProvider
     .when("/users",{
       templateUrl:"templates/user-list.html",
       controller:"UsersController",
       controllerAs: "usersCtrl"
     })
     .otherwise({
      redirectTo:"/users"
    });

 });

 function UsersController($scope,$http){
    var uc = this;

    $http({
    method: 'GET',
    url: 'http://localhost:3000/users'
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
