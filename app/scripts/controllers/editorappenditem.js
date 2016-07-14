'use strict';

/**
 * @ngdoc function
 * @name propertyAdminApp.controller:EditorappenditemCtrl
 * @description
 * # EditorappenditemCtrl
 * Controller of the propertyAdminApp
 */

  app.controller('EditorAppendItemCtrl', function ($rootScope,$scope,$state,$stateParams,$q,localStorageService,Models,ucauth,notify,config) {

    var action = $stateParams.action;
    $scope.action = $stateParams.action;

    $scope.scope_type_list = config.data.states.scopeType;
    $scope.append_rate_type_list = config.data.states.appendRateType;
    $scope.the_item = {};
    $scope.building_data = [];
    //$scope.the_unit = '';

    Models.init('Items/id').actions('get',{autoId:$stateParams.itemId}).then(function(ret){
      $scope.the_item = ret.data;
    });



    $scope.onScopeTypeChange = function(val){

    };
    $scope.onBuildingChange = function(val){
      var index = lodash.findIndex($scope.building_list,'code',val);
      //console.log($scope.building_list[index]);
      $scope.the_scope.unit = undefined;
      $scope.unit_list = [];

      for(var i=1 ;i<=$scope.building_list[index].unit; i++){
        var unit_name = '单元'+i;

        $scope.unit_list.push({name:unit_name,val:i});
      }

    };
    $scope.onUnitChange = function(val){
      var data = {building:$scope.the_scope.buildingCode,unit:val,autoId:$stateParams.appendId};
      Models.init('ItemAppend/TypeValue/id').actions('get',data).then(function(ret){
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
        $scope.form_title = '新增附加项目';
        $scope.the_append = {};

        $scope.the_append.rateType = 0;


        break;
      case 'edit':
        $scope.form_title = '编辑附加项目';
        $scope.the_scope = {};
        $scope.the_scope.type = 1;

        Models.init('ItemAppend/id').actions('get',{},{'autoId':$stateParams.appendId}).then(
          function(ret){
            //console.log(ret);
            $scope.the_append = ret.data;

            $scope.the_scope.type = $scope.the_append.type;


            Models.init('Buildings').actions('list',{},{community:$scope.the_append.community}).then(function(ret){
              //console.log(ret);
              $scope.building_list = ret.data;

              switch($scope.the_scope.type){
                case 1:

                  var building_code_arr = $scope.the_append.typeValue.split(',');
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

    $scope.save_appenditem = function(){
      if($scope.itemsForm.$valid){
        switch (action){
          case 'add':
            $scope.the_append.item = $scope.the_item.autoId;
            $scope.the_append.community = $scope.the_item.community;
            //console.log($scope.the_append);

            Models.init('ItemAppend').actions('add',$scope.the_append).then(function(ret){
              console.log(ret);
              if(ret.meta.code !== 200){
                notify({message:ret.meta.error , classes:'alert-danger'});
                $state.go('admin.payment.itemappend',{itemId:$stateParams.itemId});
              }else{
                notify({message:'添加成功',classes:'alert-success'});
                $state.go('admin.payment.edititemappend',{itemId:$stateParams.itemId,appendId:ret.data.autoId,action:'edit'});
              }

            });

            break;
          case 'edit':



            Models.init('ItemAppend/id').actions('update',$scope.the_append,{'autoId':$scope.the_append.autoId}).then(
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
          $scope.the_scope.unitCode = $scope.the_scope.buildingCode + ($scope.the_unit<10? '0'+$scope.the_unit:$scope.the_unit);

              break;
      }

      Models.init('ItemAppend/TypeValue/id').actions('update',$scope.the_scope,{autoId:$scope.the_append.autoId}).then(function(ret){
        if(ret.meta.code == 200){
          notify({message:'修改成功',classes:'alert-success'});
          $scope.itemsScopeForm.$setPristine();
        }else{
          notify({message:ret.meta.error , classes:'alert-danger'});
        }
      });


    };

    $scope.close = function(){
      $state.go('admin.payment.itemappend',{itemId:$stateParams.itemId});
    };

    $scope.$on('onBuildingDataUpdate',function(e,data){
      //console.log(data);
      $scope.building_data = data;
      $scope.itemsScopeForm.$setDirty();
    });



  });
