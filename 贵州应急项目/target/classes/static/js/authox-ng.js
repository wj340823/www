angular.module('authox', []);

angular.module('authox').factory('authoxCache', ['$http', '$q', function($http, $q){
	var cacheObj = {};

	return {
		get: function(realm, resource,op) {

			op = op || 'ACCESS';
			
			var key = realm + '|||' + resource + '|||' + op;
			if(! cacheObj[key]) {

				var deferred = $q.defer();
				cacheObj[key] = deferred;
				var params = {};
				if(realm) {
					params['realm'] = realm;
				}
				params['resource'] = resource;
				params['op'] = op;
				$http.get("rest/authox/check", {params: params})
				  .then(function(result) {
					  var result = result.data;
				  	// result 是一个形如 { allowd: true } 的对象
					if(result.allowed) {
						deferred.resolve();
					} else {
						deferred.reject();
					}
				}).catch(function(){
					// 暂时不考虑网络问题，如果因为网络丢包显示不正常，应当刷新页面
					deferred.reject();
				})
				return deferred.promise;
			} else {
				return cacheObj[key].promise;
			}
		}
	}
}]);

angular.module('authox').directive('authoxResource', ['$compile', 'authoxCache', function($compile, authoxCache) {
	return {
		restrict: 'AC',
		// 优先级比缺省的高（0），但低于 ng-repeat
		priority: 500,	

		link: function(scope, element, attr) {
			scope.$watch(attr.authoxRealm, function() {
				var disabled = attr.ngDisabled;
				// 避免影响 ng-disabled
				if(disabled == 'true') return;
				var temp = attr.authoxResource.split('|');
				var resourceName = temp[0].trim();
				var op = temp[1] ? temp[1].trim() : 'ACCESS';
				element.addClass('hidden');
				authoxCache.get(scope.$eval(attr.authoxRealm), resourceName, op).then(function(){
					element.removeClass('hidden');
				})
			});
		}
	}
}]);

angular.module('authox').directive('authoxUnableResource', ['$compile', 'authoxCache',function($compile,authoxCache) {
	return {
		restrict: 'AC',
		priority: 500,	// ng-repeat = 1000, default = 0

		link: function(scope, element, attr) {
			scope.$watch(attr.authoxRealm, function() {
				var disabled = attr.ngDisabled;
				// 避免影响 ng-disabled//没有权限的时候显示
				if(disabled == 'true') return;
				var temp = attr.authoxUnableResource.split('|');
				var resourceName = temp[0].trim();
				var op = temp[1] ? temp[1].trim() : 'ACCESS';
				element.addClass('hidden');
				authoxCache.get(scope.$eval(attr.authoxRealm), resourceName, op).then(function(){
					
				},function(){
					element.removeClass('hidden');
				})
			});
		}
	}
}]);
