angular.module('starter.controllers', ['ngOpenFB'])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $state, $timeout, $window, ngFB, dataServices) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  $scope.user = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    console.log("-- modal --",  modal);
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $rootScope.getProfile = function(){
      
      var promise = dataServices.getProfileDefer($window.device_id);

      promise.then(function(data){
        // $scope.polygonAlternatesList = data.polygon_alternates;
        // console.log(data);
        // data = JSON.parse(data)
        console.log(data);
        $rootScope.mainData = data;
        
        if (data.results.length==0){
          console.log("not logged in ");
          $rootScope.userFbData = {};
          $rootScope.getProfileStatus = false;
          $state.go('app.profile');
        }
        else{
          $rootScope.userFbData  = JSON.parse(data.results[0]['details']);
          
          $rootScope.getProfileStatus = true;
          console.log("logged in ");
          //$scope.modal.hide();

          var pr = dataServices.getNearByPeople($window.device_id);

          pr.then(function(data){

            $rootScope.mainData = data;

            console.log("--- reco data ---", JSON.parse(data[0][3]));
            $state.go('app.playlists');
          }, function(err){

            console.log("--- reco err --", err);

          });
        }

      }, function(err){
        $scope.getProfileStatus = false;
        $scope.user = {};
        console.log("--- save Polygon error---", err);
      });

    }

  $rootScope.saveProfile = function(){
      
    var promise = dataServices.saveProfileDefer($rootScope.userFbData);

    promise.then(function(data){
      // $scope.polygonAlternatesList = data.polygon_alternates;
      $scope.savingDatasetStatus = "Successfully saved.";
      $rootScope.getProfile();


    }, function(err){
      console.log("--- save Polygon error---", err);
    });

  }
  $scope.getProfile();

  $rootScope.getPlaceInfo = function(value){

    if(value){

      value = JSON.parse(value);

      if(value.work && value.work.length > 0 && value.work[0].location && value.work[0].location.name)
        return value.work[0].location.name;
      else
        return '';
    }
    else
      return '';
  }

  $rootScope.workInfo = function(value){

    console.log("--- workinfo ---", value, JSON.parse(value))

    if(value){

      value = JSON.parse(value);
      return value.work;
    }
  }
  $rootScope.educationInfo = function(value){

    if(value){

      value = JSON.parse(value);
      return value.education;
    }
  }

  $scope.fbLogin = function () {
    console.log("logging in ");
    console.log($scope.user.length);
    // debugger;
    if(!$scope.user.length){
      ngFB.login({scope: 'public_profile, email, user_friends, user_education_history, user_work_history'}).then(
        function (response) {
          console.log("logged in ");
          $scope.accessToken = response.authResponse.accessToken;

            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                //$scope.closeLogin();
                $scope.modal.hide();
                $state.go('app.profile')

            } 
            else {
                alert('Facebook login failed');
            }
        });
      };
    }
})

.controller('PlaylistsCtrl', function($scope, $state, $cordovaNetwork, $ionicPopup, ngFB, dataServices) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];

  

  document.addEventListener("deviceready", function () {

    var type = $cordovaNetwork.getNetwork();

  });

 /* var getAllUsersNearMe = function(){

     WifiWizard.startScan(function(){
      WifiWizard.getScanResults(function(data){

        $scope.status = JSON.stringify(data);

      }, function(){
        $scope.status="fail in data fetch";
      });
    
    }, function(){

      $scope.status="failed";

    });
  }
  getAllUsersNearMe();*/


  /*ngFB.api({
        path: '/me',
        params: {fields: 'id,name,friends, picture, work, education'}
    }).then(
        function (user) {
            $scope.user = user;
            console.log("user data", $scope.user);


        },
        function (error) {
            //alert('Facebook error: ' + error.error_description);
            $scope.login();
        });*/
})

.controller('PlaylistCtrl', function($scope, $rootScope, $state, $stateParams) {

  $scope.userData =  $rootScope.mainData[$stateParams['playlistId']];
  console.log("----$scope.userData ---", $scope.userData );
  $scope.userWorkData = JSON.parse($scope.userData[3]).work;
  $scope.userEducationData = JSON.parse($scope.userData[3]).education;
})

.controller('ProfileCtrl', function ($scope, $rootScope, $state, ngFB, dataServices) {


    if(!$rootScope.getProfileStatus){

      ngFB.api({
        path: '/me',
        params: {fields: 'id,name, bio, friends, picture, work, education'}
      }).then(
        function (user) {
            $rootScope.userFbData = user;
            console.log("user data", $rootScope.userFbData);
            $rootScope.saveProfile();
        },
        function (error) {
            //alert('Facebook error: ' + error.error_description);
            $scope.login();
        });
    }


})




/*.controller('SearchCtrl', function($scope, $cordovaNetwork){

  document.addEventListener("deviceready", function () {

    var type = $cordovaNetwork.getNetwork()

    var isOnline = $cordovaNetwork.isOnline()

    var isOffline = $cordovaNetwork.isOffline()


    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      var onlineState = networkState;
      console.log("-- onlineState ---", onlineState)
    })

    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      var offlineState = networkState;
      console.log("-- offlineState ---", offlineState)
    })

  }, false);

})*/
