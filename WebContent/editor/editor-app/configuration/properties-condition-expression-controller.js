/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Condition expression
 */

angular.module('activitiModeler').controller('KisBpmConditionExpressionCtrl', [ '$scope', '$modal', function($scope, $modal) {

    // Config for the modal window
    var opts = {
        template: 'editor-app/configuration/properties/condition-expression-popup.html?version=' + Date.now(),
        scope: $scope
    };

    // Open the dialog
    _internalCreateModal(opts, $modal, $scope);
}]);

angular.module('activitiModeler').controller('KisBpmConditionExpressionPopupCtrl',
    [ '$rootScope', '$scope', '$http', '$translate','$timeout', 'FormBuilderService', function($rootScope, $scope, $http, $translate,$timeout, FormBuilderService) {
    	
    // Put json representing assignment on scope
    if ($scope.property.value !== undefined && $scope.property.value !== null
        && $scope.property.value.expression !== undefined
        && $scope.property.value.expression !== null) {

        $scope.expression = $scope.property.value.expression;

    } else if ($scope.property.value !== undefined && $scope.property.value !== null && $scope.property.value !== "") {
        $scope.expression = {type: 'static', staticValue: $scope.property.value};
    } else {
    	$scope.expression = {type: 'none', staticValue: ''};
    }
    
    // start update by Asy - init the pop form 
    $scope.popup = {
    	saveDialog : { errorMessage : ""},
    	formFields : undefined,
		conditionObject : {
			type : $scope.expression.type,
			staticValue : $scope.expression.staticValue,
			form : {
				name:'',
				type : 'outcome',
				forms : formArr,
				formMap : formMap,
				button : '',
				field : {
					key : '',
					operator : 'equal' ,
					value : ''
				}
			}
		}
    }
    if($scope.expression.form != undefined && $scope.expression.form != null){
    	$scope.popup.conditionObject.form.name = $scope.expression.form.name;
    	$scope.popup.conditionObject.form.type = $scope.expression.form.type;
    	$scope.popup.conditionObject.form.button = $scope.expression.form.button;
    	$scope.popup.conditionObject.form.field.key = $scope.expression.form.field.key;
    	$scope.popup.conditionObject.form.field.operator = $scope.expression.form.field.operator;
    	$scope.popup.conditionObject.form.field.value = $scope.expression.form.field.value;
    }
    
    // update by Asy - find the nearest userTask
    var curShape = $scope.selectedShape, selTask = "";
    while(curShape.incoming.length > 0){
    	if("UserTask" == curShape.getStencil().idWithoutNs()){
    		selTask = curShape.resourceId;
    		break;
    	}
    	curShape = curShape.incoming[0];
    }
    // start update by Asy - get all defined form in process
    var json = $rootScope.editor.getJSON();
    var formArr = new Array();
    var formMap = {}, formArrMap = {};
    var tmpKey;
    if(json.childShapes != null && json.childShapes.length > 0){
    	for(var i=0 ;i<json.childShapes.length;i++){
    		if("UserTask" == json.childShapes[i].stencil.id && null != json.childShapes[i].properties.formreference && "" != json.childShapes[i].properties.formreference){
    			tmpKey = json.childShapes[i].properties.formreference.key;
    			// set default value
    			if(selTask == json.childShapes[i].resourceId){
    				$scope.popup.conditionObject.form.name = tmpKey;
    			}
    			// show unique form
    			if(formArrMap[tmpKey] == undefined || formArrMap[tmpKey] == ""){
    				formArr.push({
    					key : tmpKey,
    					name : json.childShapes[i].properties.formreference.name
    				});
    				formArrMap[tmpKey] = true;
    			
    				$http.get(ACTIVITI.CONFIG.contextRoot + '/app/rest/form-models/'+json.childShapes[i].properties.formreference.id)
    				.success(
    				function(response) {
    					var fieldArr = new Array(), outcomeArr = new Array();
    					if(response.formDefinition.fields != undefined && response.formDefinition.fields.length > 0){
    						for(var j=0;j<response.formDefinition.fields.length;j++){
    							fieldArr.push({
    								id:response.formDefinition.fields[j].id,
    								name:response.formDefinition.fields[j].name
    							}); 
    						}
    					}
    					if(response.formDefinition.outcomes != undefined && response.formDefinition.outcomes.length > 0){
    						for(var j=0;j<response.formDefinition.outcomes.length;j++){
    							outcomeArr.push(response.formDefinition.outcomes[j].name); 
    						}
    					}
    					formMap[response.key] = {
    						fields : fieldArr,
    						outcomes : outcomeArr
    					};
    					
    				})
    				.error(
					function(data, status, headers, config) {
						$scope.state.loadingSubprocesses = false;
						$scope.state.subprocessError = true;
					});
    			}
    		}
    	}
    	$scope.popup.conditionObject.form.formMap = formMap;
    	$scope.popup.conditionObject.form.forms = formArr;

    }
    
    
    $scope.save = function() {
    	
    	//start update by Asy - add expression selection
    	//$scope.popup.saveDialog.errorMessage = "页面信息有误";
    	$scope.expression.type = $scope.popup.conditionObject.type ;
    	$scope.expression.form = {
    			name:"",
    			type:"",
    			button:"",
    			field:{
    				key:"",
    				operator:"equal",
    				value:""
    			}
    	};
    	if("none" == $scope.popup.conditionObject.type){
    		$scope.expression.staticValue = undefined;
    	}
    	
    	if("static" == $scope.popup.conditionObject.type){
    		if($scope.popup.conditionObject.staticValue == ""){
    			$scope.popup.saveDialog.errorMessage = "请先填写表达式";
    			return;
    		}
    		$scope.expression.staticValue = $scope.popup.conditionObject.staticValue;
    	}
    	
    	if("simple" == $scope.popup.conditionObject.type){
    		if($scope.popup.conditionObject.form.name == undefined || $scope.popup.conditionObject.form.name == ""){
    			$scope.popup.saveDialog.errorMessage = "请选择自定义表单（若无，请先配置）";
    			return;
    		}
    		$scope.expression.form.name = $scope.popup.conditionObject.form.name;
    		$scope.expression.form.type = formType = $scope.popup.conditionObject.form.type;
    		if(formType == "field"){
    			if($scope.popup.conditionObject.form.field.key == undefined || $scope.popup.conditionObject.form.field.key == "" || $scope.popup.conditionObject.form.field.value == ""){
        			$scope.popup.saveDialog.errorMessage = "请选择表单字段（若无，请先配置）并设置匹配值";
        			return;
        		}
    			$scope.expression.form.field = {
    					key:$scope.popup.conditionObject.form.field.key,
        				operator:$scope.popup.conditionObject.form.field.operator,
        				value:$scope.popup.conditionObject.form.field.value
    			};
    			var operator = {equal:"==",grater:">",litter:"<",litterEqual:"<=",graterEqual:">="};
    			if("equal" != $scope.popup.conditionObject.form.field.operator){
    				$scope.expression.staticValue = "${"+$scope.expression.form.field.key+operator[$scope.expression.form.field.operator]+$scope.expression.form.field.value+"}";
    			}else{
    				$scope.expression.staticValue = "${"+$scope.expression.form.field.key+"=='"+$scope.expression.form.field.value+"}";
    			}
    		}else if(formType == "outcome"){
    			if($scope.popup.conditionObject.form.name == undefined || $scope.popup.conditionObject.form.button == ""){
        			$scope.popup.saveDialog.errorMessage = "请选择自定义按钮（若无，请先配置）";
        			return;
        		}
    			$scope.expression.form.button = $scope.popup.conditionObject.form.button;
    			$scope.expression.staticValue = "${form_"+$scope.expression.form.name+"_outcome=='"+$scope.expression.form.button+"'}";
    		}
    	}
    	//end update by Asy
        $scope.property.value = {expression: $scope.expression};
        $scope.updatePropertyInModel($scope.property);
        $scope.close();
    };

    // Close button handler
    $scope.close = function() {
    	$scope.property.mode = 'read';
    	$scope.$hide();
    };

}]);