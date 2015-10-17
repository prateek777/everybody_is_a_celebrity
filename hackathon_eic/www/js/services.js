'use strict';

angular.module('starter.services', [])
	.factory('dataServices', ['$http', '$log', '$q', '$timeout', function(http, log, q, timeout){

		var dataService = {};
		// var device = {"uuid": 1};

	  	dataService.saveProfileDefer = function(user){

        var defer = q.defer();
        var url = 'http://10.1.8.10:3006/data';
        var data = {}
        data['data'] = {};
        

        data['data']['details'] = JSON.stringify(user);
        data['data']['name'] = 	user.name;
        data['data']['device_id'] = device.uuid;
        data['data']['url'] = "http://graph.facebook.com/"+ user.id + "/picture?width=270&height=270";
        data['action'] = 'insert';
        data['model'] = "User";

        console.log("SAVING ... = ", data);
        data = JSON.stringify(data);
        
        var httpPromise = http.post(url,data)
          .success(function(data, status, headers, config){
              console.log(" ---- user data received --- ");
              defer.resolve(data);
          })
          .error(function(data, status){
              console.log("could not get data some server error");
              defer.reject(status);  
          });
        return defer.promise;
    }

    dataService.getProfileDefer = function(){


        var defer = q.defer();
        var url = 'http://10.1.8.10:3006/data';
        var data = {}

        data['filter'] = "device_id='"+device.uuid+"'";
        data['model'] = "User";
        data['page'] = '0'
        data['size'] = '20'

        // data = JSON.stringify(data);
        
        var httpPromise = http({
        	method: "GET",
        	url: url,
        	params:data
        })
          .success(function(data, status, headers, config){
              console.log(" ---- user data received --- ", data);
              defer.resolve(data);
          })
          .error(function(data, status){
              console.log("could not get data some server error");
              defer.reject(status);  
          });
        return defer.promise;
    }

    dataService.getNearByPeople = function(device_id){

        var defer = q.defer();
        var url = 'http://10.1.8.10:3006/reco';
        var data = {}

        data['id'] = device_id;
       /* data['model'] = "User";
        data['page'] = '0'
        data['size'] = '20'*/

        // data = JSON.stringify(data);
        
        var httpPromise = http({
        	method: "GET",
        	url: url,
        	params:data
        })
          .success(function(data, status, headers, config){
              console.log(" ---- user data received --- ", data);
              defer.resolve(data);
          })
          .error(function(data, status){
              console.log("could not get data some server error");
              defer.reject(status);  
          });
        return defer.promise;
    }



	  	return dataService;
	}]);

	