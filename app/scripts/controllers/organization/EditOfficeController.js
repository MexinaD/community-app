(function (module) {
    mifosX.controllers = _.extend(module, {
        EditOfficeController: function (scope, routeParams, resourceFactory, location, dateFilter, route, http, $uibModal, API_VERSION, $rootScope, Upload) {
            scope.office = [];
	    scope.formData = {};
            scope.first = {};
            scope.restrictDate = new Date();
            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.parentId = data[0].id;
            });

            resourceFactory.officeResource.get({officeId: routeParams.id, template: 'true'}, function (data) {
                scope.offices = data.allowedParents;
                scope.id = data.id;
                if (data.openingDate) {
                    var editDate = dateFilter(data.openingDate, scope.df);
                    scope.first.date = new Date(editDate);
                }
                scope.formData =
                {
                    name: data.name,
                    externalId: data.externalId,
                    parentId: data.parentId
                }
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
		//To upload org logo
            scope.uploadPic = function () {
                $uibModal.open({
                    templateUrl: 'uploadpic.html',
                    controller: UploadPicCtrl
                });
            };
            var UploadPicCtrl = function ($scope, $uibModalInstance) {
                $scope.upload = function (file) {
                    if (file) {
                        Upload.upload({
                            url: $rootScope.hostUrl + API_VERSION + '/offices/' + routeParams.id + '/images',
                            data: {},
                            file: file
                        }).then(function (imageData) {
                            // to fix IE not refreshing the model
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                            $uibModalInstance.close('upload');
                            route.reload();
                        });
                    }
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

		// to delete the org logo
              scope.deletePic = function () {
                $uibModal.open({
                    templateUrl: 'deletePic.html',
                    controller: DeletePicCtrl
                });
            };
            var DeletePicCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    http({
                        method: 'DELETE',
                        url: $rootScope.hostUrl + API_VERSION + '/offices/' + routeParams.id + '/images',
                    }).then(function (imageData) {
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                        $uibModalInstance.close('delete');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };


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
            loadImage();
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        };
            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.openingDate = reqDate;
                resourceFactory.officeResource.update({'officeId': routeParams.id}, this.formData, function (data) {
                    location.path('/viewoffice/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditOfficeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', '$route', '$http', '$uibModal', 'API_VERSION', '$rootScope', 'Upload', mifosX.controllers.EditOfficeController]).run(function ($log) {
        $log.info("EditOfficeController initialized");
    });
}(mifosX.controllers || {}));
