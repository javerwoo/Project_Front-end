/// <reference path="c:\users\wu627\onedrive\documents\visual studio 2015\Projects\WebApplication1\WebApplication1\NewFolder1/angular-route.min.js" />
/// <reference path="c:\users\wu627\onedrive\documents\visual studio 2015\Projects\WebApplication1\WebApplication1\NewFolder1/angular.min.js" />
var data_arr = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : [];
var user_obj;
var duplicate = false;
var home_name;
var current_index;
var message_arr=localStorage.getItem("userMessage")?JSON.parse(localStorage.getItem("userMessage")):[];
var current_message;
var current_message_index;


function user_fn(username, password, firstname, lastname, email, phone, location) {
  return {
    'username': username,
    'password': password,
    'firstname': firstname,
    'lastname': lastname,
    'email': email,
    'phone': phone,
    'location': location
  }

}

var app = angular.module('myapp', ['ngRoute']);

app.run(function($window,$http){
  if(localStorage.getItem("userMessage")===null){
    $http({
      'method':'GET',
      'url':'message.json'
    })
    .then(function(success_response){
    message_arr=success_response.data;
    if(typeof(Storage)!='undefined'){
      localStorage.setItem("userMessage",JSON.stringify(message_arr));
    }
  },
  function(err_response){
    console.log(err_response);
  });
  }
});

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      redirectTo: '/login'
    })
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'login_ctrl'
    })
    .when('/signUp', {
      templateUrl: 'signUp.html',
      controller: 'signUp_ctrl'
    })
    .when('/profile', {
      templateUrl: 'profile.html',
      controller: 'profile_ctrl'
    })
    .when('/message', {
      templateUrl: 'message.html',
      controller: 'message_ctrl'
    })
    .when('/home', {
      templateUrl: 'home.html',
      controller: 'home_ctrl'
    })
    .when('/message_detail',{
      templateUrl:'message_detail.html',
      controller:'message_detail_ctrl'
    })
    .otherwise({
      redirectTo: '/login'
    })
})

app.controller('message_detail_ctrl',function($scope){
  $scope.name=home_name;
  $scope.recipient=current_message.recipient;
  $scope.recipient_img=current_message.recipient_img;
  $scope.sender=current_message.sender;
  $scope.sender_img=current_message.sender_img;
  $scope.title=current_message.title;
  $scope.description=current_message.description;
  $scope.created_at=current_message.created_at;
  $scope.important=message_arr[current_message_index].important;
  $scope.delete=function(){
    message_arr.splice(current_message_index,1);
    localStorage.setItem("userMessage", JSON.stringify(message_arr));
  };
  message_arr[current_message_index].reply=message_arr[current_message_index].reply?message_arr[current_message_index].reply:[];
  $scope.reply_arr=current_message.reply;
  $scope.reply=function(){
    message_arr[current_message_index].reply.push($scope.replyMessage);
    localStorage.setItem("userMessage", JSON.stringify(message_arr));
    $scope.replyMessage=null;
  };
  $scope.ifImportant=function(){
    if(message_arr[current_message_index].important=="important"){
      $scope.important="not important";
      message_arr[current_message_index].important="not important";
      localStorage.setItem("userMessage", JSON.stringify(message_arr));
    }else{
      $scope.important="important";
      message_arr[current_message_index].important="important";
      localStorage.setItem("userMessage", JSON.stringify(message_arr));
    }
  }
  
});

app.controller('message_ctrl',function($scope,$location){
  $scope.name=home_name;
  $scope.message=message_arr;
  $scope.show=function(message,message_index){
    current_message=message;
    current_message_index=message_index;
//    console.log(current_message_index);
    $location.path('/message_detail');

  };
});

app.controller('profile_ctrl',function($scope){
  $scope.name=home_name;
  $scope.username=data_arr[current_index].username;
    $scope.password=data_arr[current_index].password;
    $scope.firstname=data_arr[current_index].firstname;
    $scope.lastname=data_arr[current_index].lastname;
    $scope.email=data_arr[current_index].email;
    $scope.phone=data_arr[current_index].phone;
    $scope.location=data_arr[current_index].location;
  $scope.update=function(){
    data_arr[current_index].username=$scope.username;
    data_arr[current_index].password=$scope.password;
    data_arr[current_index].firstname=$scope.firstname;
    data_arr[current_index].lastname=$scope.lastname;
    data_arr[current_index].email=$scope.email;
    data_arr[current_index].phone=$scope.phone;
    data_arr[current_index].location=$scope.location;
    alert('Update successfully!');
    home_name=$scope.firstname;
    $scope.name=home_name;
    localStorage.setItem("userInfo", JSON.stringify(data_arr));
  }
});

app.controller('home_ctrl', function($scope,$http) {
  
$scope.name=home_name;

});

app.controller('login_ctrl', function($scope, $location) {
  $scope.login = function() {
    if ($scope.username === null) {
      $scope.username_alert = false;
      return;
    } else if ($scope.password === null) {
      $scope.password_alert = false;
      return;
    } else {
      $scope.username_alert = true;
      $scope.password_alert = true;
    }
    data_arr.forEach(function(item, index) {
      
    });
    var verifier=false;
    for(var i=0;i<data_arr.length;i++){
      if (data_arr[i].username == $scope.username && data_arr[i].password == $scope.password) {
        home_name = data_arr[i].firstname;
        current_index=i;
        verifier=true;
        $location.path('/home');
        return;
      } else {
        verifier=false;
      }
    }
    if(!verifier){
      alert("Username or password is not correct!");
    }
  }
});

app.controller('signUp_ctrl', function($scope, $location) {
  $scope.signUp = function() {
    if ($scope.username === null) {
      alert('Username can not be empty!');
      return;
    } else if ($scope.password === null) {
      alert('Password can not be empty!');
      return;
    } else if ($scope.firstname === null) {
      alert('Firstname can not be empty!');
      return;
    }
    console.log($scope.username)
      //        console.log("username: " + $scope.username);      
    duplicate = false;
    for (var i = 0; i < data_arr.length; i++) {
      if (data_arr[i].username == $scope.username) {
        duplicate = true;
        alert($scope.username+' has been used!');
        return;
      }
    }

    if (data_arr != [] && duplicate === true) {
      alert('Username '+$scope.username + 'has been used, please choose another one!');
      return;
    } else {
      user_obj = user_fn($scope.username, $scope.password, $scope.firstname, $scope.lastname, $scope.email, $scope.phone, $scope.location);
      //            var arr = JSON.parse(user_arr);
      data_arr.push(user_obj);
      localStorage.setItem("userInfo", JSON.stringify(data_arr));
      alert('Signup successfully!')
      $location.path('/login');

    }
  }
});