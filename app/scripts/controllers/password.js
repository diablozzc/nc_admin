'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:PasswordCtrl
 * @description
 * # PasswordCtrl
 * Controller of the propertyAdminApp
 */

app.controller('PasswordCtrl', function ($scope, $state, ucauth, Models, notify) {
    $scope.loginPassword = {};
    $scope.tradePassword = {};
    $scope.isSetTradePassword = false;
    $scope.tradePasswordFormTitle = '设置交易密码';

    $scope.user = ucauth.getUser();

    if ($scope.user.userTag === 0) {
        Models.init('Accounts/Trdpwd').actions('get').then(function (ret) {
            if (ret.meta.code == 200) {
                $scope.isSetTradePassword = ret.data;
                $scope.tradePasswordFormTitle = $scope.isSetTradePassword ? '修改交易密码' : '设置交易密码';

            } else {
                notify({message: ret.meta.error, classes: 'alert-danger'});
            }
        });
    }

    $scope.updateLoginPassword = function () {
        // $scope.loginPassword.username = ucauth.getUser().username;
        $scope.loginPassword.oldpwd = md5($scope.loginPassword.oldpwd);
        $scope.loginPassword.newpwd = md5($scope.loginPassword.newpwd);
        Models.init('Passwords/Update').actions('update', $scope.loginPassword, {'username': ucauth.getUser().username}).then(
            function (ret) {
                notify({message: '登录密码修改成功', classes: 'alert-success'});
                $state.go('admin.usercenter.userinfo');
            },
            function (error) {
                notify({message: error.data.info, classes: 'alert-danger'});
                $state.go('admin.usercenter.password');
            })

    };

    $scope.updateTradePassword = function () {
        if ($scope.isSetTradePassword) {

            var data = {};
            data.oldTrdPwd = md5($scope.tradePassword.oldTrdPwd);
            data.newTrdPwd = md5($scope.tradePassword.trdPwd);

            Models.init('Accounts/Trdpwd').actions('reset', data).then(function (ret) {
                if (ret.meta.code == 200) {
                    notify({message: '交易密码修改成功', classes: 'alert-success'});
                } else {
                    notify({message: ret.meta.error, classes: 'alert-danger'});
                }
                $state.go('admin.usercenter.userinfo');
            });

        } else {
            $scope.tradePassword.trdPwd = md5($scope.tradePassword.trdPwd);
            Models.init('Accounts/Trdpwd').actions('set', $scope.tradePassword).then(function (ret) {
                if (ret.meta.code == 200) {
                    notify({message: '交易密码设置成功', classes: 'alert-success'});
                } else {
                    notify({message: ret.meta.error, classes: 'alert-danger'});
                }
                $state.go('admin.usercenter.userinfo');
            });
        }
    };


});
