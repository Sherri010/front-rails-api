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

 function UsersController($scope,$http,$routeParams){
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

app.controller("editController",function($http,$location, $routeParams){
   var vm = this;

    //Pull specific user and insert into edit form
    $http({
        method: "GET",
        url: "http://localhost:3000/users/" + $routeParams.id + "/edit"
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
            }
        }).success(function() {
            $location.path("/users");
        }).error(function() {
            alert("Error updating user");
        });
    }

});

app.controller("loginController",function($http){
var vm=this;
  vm.login = function(event){
     event.preventDefault();

     $http({
       method:"POST",
       url:"http://localhost:3000/users/login",
       data:vm.user
     }).success(function(user){
         console.log(user);
     }).error(function(){
        alert("Unauth");
     })
  }
});
