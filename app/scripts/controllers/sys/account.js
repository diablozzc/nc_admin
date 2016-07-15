/**
 * Created by Administrator on 2016/7/14.
 */
app.controller('AccountCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth) {

    $scope.key = 'account';
    $scope.the_search = {};
    $scope.ucauth = ucauth;
    $scope.flag = {};
    $scope.flag.add_activity = false;
    $scope.flag.edit_activity = false;
    $scope.flag.remove_activity = false;
    $scope.flag.entry_activity = false;

    ucauth.hasRole('add_activity',$scope.flag);
    ucauth.hasRole('edit_activity',$scope.flag);
    ucauth.hasRole('remove_activity',$scope.flag);
    ucauth.hasRole('entry_activity',$scope.flag);

    // 获取分页数据
    $scope.getPageList = function(){

        $scope.the_params = angular.extend({
            page: 1,
            count: 10,
            sorting: {
                autoId: 'desc'     // initial sorting
            }
        }, $location.search());

        $scope.tableParams = new ngTableParams($scope.the_params, {
            total: 0,           // length of data
            //counts: [],
            getData: function ($defer, params) {

                $location.search(params.url());

                var the_param = {page: true, pageSize: params.count(), pageIndex: params.page()};

                the_param = angular.extend(the_param,$scope.the_search);

                // 排序
                var the_sorting = params.sorting();
                var keys = lodash.keys(the_sorting);
                var values = lodash.values(the_sorting);
                if(angular.isDefined(keys[0])){
                    var sort_param = keys[0] + ':' + values[0];
                    //the_param = angular.extend(the_param,{sorting:sort_param});
                    the_param.sorting = sort_param;
                }

                $scope.activitiesListPromise = Models.init('Activities').actions('list', the_param).then(function (ret) {
                    if (ret.meta.code == 200) {
                        params.total(ret.data.totalRecord);
                        $defer.resolve(ret.data.data);
                    }
                });
            }
        });

    };

    // 编辑按钮
    $scope.edit = function(item){
        $state.go('admin.activities.edit',{itemId:item.autoId,action:'edit'});
    };
    // 添加按钮
    $scope.add = function(){
        $state.go('admin.activities.add', {action:'add'});
    };
    // 删除按钮
    $scope.del = function(item){
        //if(window.confirm("确定要删除 "+ item.title + " 吗?")){
        Models.init('Activities/id').actions('delete',{},{'autoId':item.autoId}).then(function(ret){
            if(ret.meta.code == 200){
                notify({message:'该活动已删除',classes:'alert-success'});
                $scope.tableParams.reload();
            }else{
                notify({message:ret.meta.error + " " + ret.meta.info , classes:'alert-danger'});
            }
        });
        //}
    };

    // 活动详情
    $scope.entry = function(item){
        $state.go('admin.activities.entry',{itemId:item.autoId,action:'entry'});
    };

    $scope.$on('on_search',function(e,data){
        $scope.the_search = data;
        $scope.getPageList();
    });

    $scope.getPageList();

});

app.controller('ActivitiesSearchCtrl', function ($rootScope, $scope, $state, $stateParams, $location, localStorageService, ngTableParams, Models, notify, ucauth) {
    $scope.the_search = {};
    $scope.search = function(){
        $scope.$broadcast('on_search',$scope.the_search);
    };
});
