'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EditorspecialitemCtrl
 * @description
 * # EditorspecialitemCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('EditorSpecialItemCtrl', function ($rootScope,$scope,$state,$stateParams,$q,localStorageService,Models,ucauth,notify,config) {
    var action = $stateParams.action;
    $scope.action = $stateParams.action;

    $scope.scope_type_list = config.data.states.scopeType;
    $scope.rate_type_list = config.data.states.appendRateType;
    $scope.the_item = {};
    $scope.building_data = [];

    // 获取缴费项目信息
    Models.init('Items/id').actions('get',{autoId:$stateParams.itemId}).then(function(ret){
      $scope.the_item = ret.data;
    });


    $scope.onScopeTypeChange = function(val){

    };

    // 切换楼宇事件
    $scope.onBuildingChange = function(val){


      var index = lodash.findIndex($scope.building_list,'code',val);

      $scope.the_scope.unit = undefined;
      $scope.unit_list = [];

      for(var i=1 ;i<=$scope.building_list[index].unit; i++){
        var unit_name = '单元'+i;

        $scope.unit_list.push({name:unit_name,val:i});
      }
      //console.log($scope.the_scope);

    };

    // 切换单元事件
    $scope.onUnitChange = function(val){
      var data = {building:$scope.the_scope.buildingCode,unit:val,autoId:$stateParams.specialId};


      Models.init('ItemConfig/TypeValue/id').actions('get',data).then(function(ret){
        //console.log(ret);
        $scope.$broadcast('create_building',ret.data);
      })
    };



    $scope.selectBuilding = function(building){
      building.isSelect = !building.isSelect;
      $scope.itemsScopeForm.$setDirty();
    };

    $scope.info1 = "分阶计算举例说明：\n" +
      "费率设置为:\n" +
      "0～40(包括40)吨  0.30元／吨\n" +
      "40～80(包括80)吨  0.50元／吨\n" +
      "80以上  0.80元／吨\n\n" +
      "若用水量30吨,则计算公式为：(30-0)*0.30=9元\n" +
      "若用水量50吨,则计算公式为：(40-0)*0.30+(50-40)*0.50=17元\n" +
      "若用水量100吨,则计算公式为：(40-0)*0.30+(80-40)*0.50+(100-80)*0.80=48元\n";

    $scope.info2 = "不分阶计算举例说明：\n" +
      "费率设置为:\n" +
      "0～40(包括40)吨  0.30元／吨\n" +
      "40～80(包括80)吨  0.50元／吨\n" +
      "80以上  0.80元／吨\n\n" +
      "若用水量30吨,则计算公式为:30*0.30=9元\n" +
      "若用水量50吨,则计算公式为:50*0.50=25元\n" +
      "若用水量100吨,则计算公式为:100*0.80=80元\n";


    switch (action){
      case 'add':
        $scope.form_title = '新增特殊项目';
        $scope.the_special = {};

        $scope.the_special.rateType = 0;


        break;
      case 'edit':
        $scope.form_title = '编辑特殊项目';
        $scope.the_scope = {};
        $scope.the_scope.type = 1;

        Models.init('ItemConfig/id').actions('get',{},{'autoId':$stateParams.specialId}).then(
          function(ret){
            //console.log(ret);
            $scope.the_special = ret.data;

            $scope.the_scope.type = $scope.the_special.type;


            Models.init('Buildings').actions('list',{},{community:$scope.the_special.community}).then(function(ret){
              //console.log(ret);
              $scope.building_list = ret.data;

              switch($scope.the_scope.type){
                case 1:

                  var building_code_arr = $scope.the_special.typeValue.split(',');
                  lodash.forEach($scope.building_list,function(building){
                    var index = building_code_arr.indexOf(building.code);
                    if(index > -1){
                      building.isSelect = true;
                    }
                  });

                  break;
                case 2:
                  break;
              }
            });

          }
        );
        break;
    }

    $scope.save_special_item = function(){
      if($scope.itemsForm.$valid){
        switch (action){
          case 'add':
            $scope.the_special.item = $scope.the_item.autoId;
            $scope.the_special.community = $scope.the_item.community;
            //console.log($scope.the_special);

            Models.init('ItemConfig').actions('add',$scope.the_special).then(function(ret){
              console.log(ret);
              if(ret.meta.code !== 200){
                notify({message:ret.meta.error , classes:'alert-danger'});
                $state.go('admin.payment.itemspecial',{itemId:$stateParams.itemId});
              }else{
                notify({message:'添加成功',classes:'alert-success'});
                $state.go('admin.payment.edititemspecial',{itemId:$stateParams.itemId,specialId:ret.data.autoId,action:'edit'});

              }

            });

            break;
          case 'edit':

            Models.init('ItemConfig/id').actions('update',$scope.the_special,{'autoId':$scope.the_special.autoId}).then(
              function(ret){

                if(ret.meta.code == 200){
                  notify({message:'修改成功',classes:'alert-success'});
                  $scope.itemsForm.$setPristine();
                }else{
                  notify({message:ret.meta.error , classes:'alert-danger'});
                }


              }
            );
            break;
        }

      }
    };
    $scope.save_scope = function(){
      switch($scope.the_scope.type){
        case 1:
          var building_code_arr = [];
          lodash.forEach($scope.building_list,function(building){
            if(building.isSelect){
              building_code_arr.push(building.code);
            }
          });
          $scope.the_scope.typeValue = building_code_arr.join(',');

          break;
        case 2:
          var select_room_arr = [];
          lodash.forEach($scope.building_data,function(level){
            lodash.forEach(level.level,function(room){
              if(room.select){
                select_room_arr.push(room.roomCode);
              }
            });
          });
          $scope.the_scope.typeValue = select_room_arr.join(',');
          $scope.the_scope.unitCode = $scope.the_scope.buildingCode + ($scope.the_scope.unit<10? '0'+$scope.the_scope.unit:$scope.the_scope.unit);

          break;
      }

      Models.init('ItemConfig/TypeValue/id').actions('update',$scope.the_scope,{autoId:$scope.the_special.autoId}).then(function(ret){
        if(ret.meta.code == 200){
          notify({message:'修改成功',classes:'alert-success'});
          $scope.itemsScopeForm.$setPristine();
        }else{
          notify({message:ret.meta.error , classes:'alert-danger'});
        }
      });


    };

    $scope.close = function(){
      $state.go('admin.payment.itemspecial',{itemId:$stateParams.itemId});
    };

    $scope.$on('onBuildingDataUpdate',function(e,data){
      //console.log(data);
      $scope.building_data = data;
      $scope.itemsScopeForm.$setDirty();

    });
  });
