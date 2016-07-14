/**
 * Created by zhangzhichao on 15/10/21.
 */
app.factory('errorReport', function (Models,$q,$state,$window,notify,config) {

  return{
    report: function(error){
      console.log(error);
    }
  }

});
