'use strict';

/**
 * @ngdoc service
 * @name propertyAdminApp.ucauth
 * @description
 * # ucauth
 * Factory in the propertyAdminApp.
 */

app.factory('ucauth', function (Models, $q, $state, $window, notify, config) {
    // Service logic
    // ...
    var user;

    function init() {

    }

    function getUserToken() {
        return $window.sessionStorage["userToken"];
    }

    function getUser() {
        return JSON.parse($window.sessionStorage['user']);
    }

    function setUser(userinfo) {
        $window.sessionStorage['user'] = JSON.stringify(userinfo);
    }

    function setRole(userrole) {
        $window.sessionStorage['role'] = userrole.join(',');
    }

    function getRole() {
        if (angular.isDefined($window.sessionStorage['role'])) {
            return $window.sessionStorage['role'].split(',');
        }
    }

    function setRoleFromMenus(menus) {
        var roles = [];
        var getRoles = function (menus, roles) {
            angular.forEach(menus, function (item) {
                if (item.roleKey) {
                    angular.forEach(item.roleKey, function (role) {
                        roles.push(role.keyCode);
                    });
                }
                if (item.menus && item.menus.length > 0) {
                    getRoles(item.menus, roles);
                }
            });
        };
        getRoles(menus, roles);
        setRole(roles);
    }

    function _getRoleKey(key) {
        var deferred = $q.defer();
        Models.init('RoleRelations/getByKey/clientKey').actions('get', {clientKey: key}).then(function (ret) {
            deferred.resolve(ret);

        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;


    }

    // 判断是否有某个操作的权限
    function hasRole(key, flag) {
        var deferred = $q.defer();
        if (config.global.check_action_auth) {

            _getRoleKey(key).then(function (ret) {
                if (angular.isDefined(ret.data)) {
                    var the_role_key = ret.data.serverRoleKey;
                    var myRoles = getRole();
                    flag[key] = lodash.indexOf(myRoles, the_role_key) !== -1;
                    return lodash.indexOf(myRoles, the_role_key) !== -1 ? deferred.resolve({data: true}) : deferred.resolve({data: false});
                } else {
                    flag[key] = false;
                    deferred.resolve({data: false});
                }
            });
        } else {
            flag[key] = true;
            deferred.resolve({data: true});
        }
        return deferred.promise;
    }

    function isAccess(option) {
        var key = option.key, func = option.func, param = option.param;

        var the_server = $window.sessionStorage['server'] + '_server';

        // _getRoleKey(key).then(function (ret) {
        //      console.log(ret);
        //     if (angular.isDefined(ret.data)) {
        //         var the_role_key = ret.data.serverRoleKey;
        //          // console.log(config.global.check_action_auth);
        //         if (config.global.check_action_auth) {
        //
        //             Models.init('Roles/isRoleOk', the_server).actions('get', {rolekey: the_role_key}).then(function (ret) {
        //                 //console.log(ret);
        //                 func(param);
        //             }, function (error) {
        //                 notify({message: '无权限访问', classes: 'alert-danger'});
        //             });
        //         } else {
                    func(param);
            //     }
            //
            // } else {
            //     notify({message: '无权限访问', classes: 'alert-danger'});
            // }
        // });

    }


    function isAccessLite(key) {
        var the_server = $window.sessionStorage['server'] + '_server';
        var deferred = $q.defer();
        // _getRoleKey(key).then(function (ret) {
        //     if (angular.isDefined(ret.data)) {
        //         var the_role_key = ret.data.serverRoleKey;
        //
        //         if (config.global.check_action_auth) {
        //             Models.init('Roles/isRoleOk', the_server).actions('get', {rolekey: the_role_key}).then(function (ret) {
        //                 // 有权限
                        deferred.resolve(ret);
        //             }, function (error) {
        //                 notify({message: '无权限访问', classes: 'alert-danger'});
        //                 deferred.reject(error);
        //             });
        //         } else {
        //
        //         }
        //
        //     } else {
        //         notify({message: '无权限访问', classes: 'alert-danger'});
        //         deferred.reject();
        //     }
        // });

        return deferred.promise;

    }


    function _formatUserFrom(token) {
        var info = token.split('_');
        var user_info = {};
        user_info.username = info[0];
        user_info.startTime = info[1] - 0;
        user_info.userSys = info[2];
        return user_info;
    }

    function signIn(username, password) {
        var deferred = $q.defer();
        var the_data = {'username': username, 'password': password};


        Models.init('Users/Username/Login').actions('signin', the_data).then(function (ret) {

            // $window.sessionStorage.tokenSecret = ret.data.tokenSecret;
            $window.sessionStorage.userToken = ret.userToken;

            var user_info = _formatUserFrom(ret.userToken);

            setUser(user_info);

            deferred.resolve(ret);

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function signOut() {

    }

    init();

    // Public API here
    return {
        login: signIn,
        logout: signOut,
        getUserToken: getUserToken,
        getUser: getUser,
        setUser: setUser,
        getRole: getRole,
        setRoleFromMenus: setRoleFromMenus,
        hasRole: hasRole,
        isAccess: isAccess,
        isAccessLite: isAccessLite
    };
});
