(function (module) {
    mifosX.controllers = _.extend(module, {
        LoginFormController: function (scope, authenticationService, resourceFactory, httpService, $timeout) {
            scope.loginCredentials = {};
            scope.passwordDetails = {};
            scope.authenticationFailed = false;
            scope.load = false;

            scope.login = function () {
                scope.authenticationFailed = false;
                scope.load = true;
                authenticationService.authenticateWithUsernamePassword(scope.loginCredentials);
               // delete scope.loginCredentials.password;
            };

            scope.$on("UserAuthenticationFailureEvent", function (event, data, status) {
                delete scope.loginCredentials.password;
                scope.authenticationFailed = true;
                if(status != 401) {
                    scope.authenticationErrorMessage = 'error.connection.failed';
                    scope.load = false;
                } else {
                   scope.authenticationErrorMessage = 'error.login.failed';
                   scope.load = false;
                }
            });

            scope.$on("UserAuthenticationSuccessEvent", function (event, data) {
                scope.load = false;
                timer = $timeout(function(){
                    delete scope.loginCredentials.password;
                },2000);
             });

            /*This logic is no longer required as enter button is binded with text field for submit.
            $('#pwd').keypress(function (e) {
                if (e.which == 13) {
                    scope.login();
                }
            });*/

            /*$('#repeatPassword').keypress(function (e) {
                if (e.which == 13) {
                    scope.updatePassword();
                }
            });*/

            scope.text = '<span>Mifos X is designed by the <a href="http://www.openmf.org/">Mifos Initiative</a>.' +
            '<a href="http://mifos.org/resources/community/"> A global community </a> that aims to speed the elimination of poverty by enabling Organizations to more effectively and efficiently deliver responsible financial services to the world’s poor and unbanked </span><br/>' +
            '<span>Sounds interesting?<a href="http://mifos.org/take-action/volunteer/"> Get involved!</a></span>';

            scope.updatePassword = function (){
                resourceFactory.userListResource.update({'userId': scope.loggedInUserId}, scope.passwordDetails, function (data) {
                    //clear the old authorization token
                    httpService.cancelAuthorization();
                    scope.authenticationFailed = false;
                    scope.loginCredentials.password = scope.passwordDetails.password;
                    authenticationService.authenticateWithUsernamePassword(scope.loginCredentials);
                });
            };
        }
    });
    mifosX.ng.application.controller('LoginFormController', ['$scope', 'AuthenticationService', 'ResourceFactory', 'HttpService','$timeout', mifosX.controllers.LoginFormController]).run(function ($log) {
        $log.info("LoginFormController initialized");
    });
}(mifosX.controllers || {}));
