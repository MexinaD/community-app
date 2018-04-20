(function (module) {
    mifosX.controllers = _.extend(module, {
        DisplayLogoController: function (scope, routeParams, resourceFactory, http, API_VERSION, $rootScope) {
            scope.office = [];
	    scope.formData = {};
            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.parentId = data[0].id;
            });

     		resourceFactory.officeResource.get({officeId: routeParams.id}, function (data) {
                scope.office = data;
                if (data.imagePresent) {
                    http({
                        method: 'GET',
                        url: $rootScope.hostUrl + API_VERSION + '/offices/' + routeParams.id + '/images?maxHeight=150'
                    }).then(function (imageData) {
                        scope.image = imageData.data;
                    });
                }
               
                });


		var ViewLargerPicCtrl = function ($scope, $uibModalInstance) {
            var loadImage = function () {
                if (scope.office.imagePresent) {
                    http({
                        method: 'GET',
                        url: $rootScope.hostUrl + API_VERSION + '/offices/' + routeParams.id + '/images?maxWidth=860'
                    }).then(function (imageData) {
                        $scope.largeImage = imageData.data;
                    });
                }
            };
            
        };
           
        }
    });
    mifosX.ng.application.controller('DisplayLogoController', ['$scope', '$routeParams', 'ResourceFactory', '$http', 'API_VERSION', '$rootScope', mifosX.controllers.DisplayLogoController]).run(function ($log) {
        $log.info("DisplayLogoController initialized");
    });
}(mifosX.controllers || {}));
