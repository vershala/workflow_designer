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
 
angular.module('activitiModeler').controller('KisBpmFormReferenceDisplayCtrl',
    [ '$scope', '$modal', '$http', function($scope, $modal, $http) {
    
    if ($scope.property && $scope.property.value && $scope.property.value.id) {
   		$http.get(ACTIVITI.CONFIG.contextRoot + '/app/rest/models/' + $scope.property.value.id)
            .success(
                function(response) {
                    $scope.form = {
                    	id: response.id,
                    	name: response.name
                    };
                });
    }
	
}]);

angular.module('activitiModeler').controller('KisBpmFormReferenceCrtl',
    [ '$scope', '$modal', '$http', function($scope, $modal, $http) {
	
     // Config for the modal window
     var opts = {
         template:  'editor-app/configuration/properties/form-reference-popup.html?version=' + Date.now(),
         scope: $scope
     };

     // Open the dialog
     _internalCreateModal(opts, $modal, $scope);
}]);

angular.module('activitiModeler').controller('KisBpmFormReferencePopupCrtl',
    [ '$rootScope', '$scope', '$http', '$location', '$timeout', function($rootScope, $scope, $http, $location, $timeout) {
	 
	$scope.state = {'loadingForms' : true, 'formError' : false};
	
	$scope.popup = {'state' : 'formReference'};
    
    $scope.foldersBreadCrumbs = [];
    
    // update by Asy - change form
    $scope.changeForm = true;
    if($rootScope.modelData.published && $scope.property.value != ""){
    	$scope.changeForm = false;
    }
    
    // Close button handler
    $scope.close = function() {
    	$scope.property.mode = 'read';
        $scope.$hide();
    };
    
    // Selecting/deselecting a subprocess
    $scope.selectForm = function(form, $event) {
   	 	$event.stopPropagation();
   	 	if ($scope.selectedForm && $scope.selectedForm.id && form.id == $scope.selectedForm.id) {
   	 		// un-select the current selection
   	 		$scope.selectedForm = null;
   	 	} else {
   	 		$scope.selectedForm = form;
   	 	}
    };
    
    // Saving the selected value
    $scope.save = function() {
   	 	if ($scope.selectedForm) {
   	 		$scope.property.value = {
   	 			'id' : $scope.selectedForm.id, 
   	 			'name' : $scope.selectedForm.name,
   	 			'key' : $scope.selectedForm.key
   	 		};
   	 		
   	 	} else {
   	 		$scope.property.value = null; 
   	 	}
   	 	$scope.updatePropertyInModel($scope.property);
   	 	$scope.close();
    };
    
    // Open the selected value
    $scope.open = function() {
        if ($scope.selectedForm) {
            $scope.property.value = {
            	'id' : $scope.selectedForm.id, 
            	'name' : $scope.selectedForm.name,
            	'key' : $scope.selectedForm.key
            };
            
            $scope.updatePropertyInModel($scope.property);
            
            var modelMetaData = $scope.editor.getModelMetaData();
            var json = $scope.editor.getJSON();
            json = JSON.stringify(json);

            var params = {
                modeltype: modelMetaData.model.modelType,
                json_xml: json,
                name: modelMetaData.name,
                key: modelMetaData.key,
                description: modelMetaData.description,
                newversion: false,
                lastUpdated: modelMetaData.lastUpdated
            };

            // Update
            $http({ method: 'POST',
                data: params,
                ignoreErrors: true,
                headers: {'Accept': 'application/json',
                          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join("&");
                },
                url: KISBPM.URL.putModel(modelMetaData.modelId)})

                .success(function (data, status, headers, config) {
                    $scope.editor.handleEvents({
                        type: ORYX.CONFIG.EVENT_SAVED
                    });

                    var allSteps = EDITOR.UTIL.collectSortedElementsFromPrecedingElements($scope.selectedShape);

                    $rootScope.editorHistory.push({
                        id: modelMetaData.modelId, 
                        name: modelMetaData.name,
                        key: modelMetaData.key,
                        stepId: $scope.selectedShape.resourceId,
                        allSteps: allSteps,
                        type: 'bpmnmodel'
                    });
                    $location.path('form-editor/' + $scope.selectedForm.id);

                })
                .error(function (data, status, headers, config) {
                    
                });
            
            $scope.close();
        }
    };
    
    $scope.newForm = function() {
        $scope.popup.state = 'newForm';
        
        var modelMetaData = $scope.editor.getModelMetaData();
        
        $scope.model = {
            loading: false,
            form: {
                 name: '',
                 key: '',
                 description: '',
                 modelType: 2
            }
        };
    };
    
    $scope.createForm = function() {
        
        if (!$scope.model.form.name || $scope.model.form.name.length == 0 ||
        	!$scope.model.form.key || $scope.model.form.key.length == 0) {
        	
            return;
        }

        $scope.model.loading = true;

        $http({method: 'POST', url: ACTIVITI.CONFIG.contextRoot + '/app/rest/models', data: $scope.model.form}).
            success(function(data, status, headers, config) {
                
                var newFormId = data.id;
                $scope.property.value = {
                	'id' : newFormId, 
                	'name' : data.name,
                	'key' : data.key
               	};
                $scope.updatePropertyInModel($scope.property);
                
                var modelMetaData = $scope.editor.getModelMetaData();
                var json = $scope.editor.getJSON();
                json = JSON.stringify(json);

                var params = {
                    modeltype: modelMetaData.model.modelType,
                    json_xml: json,
                    name: modelMetaData.name,
                    key: modelMetaData.key,
                    description: modelMetaData.description,
                    newversion: false,
                    lastUpdated: modelMetaData.lastUpdated
                };

                // Update
                $http({ method: 'POST',
                    data: params,
                    ignoreErrors: true,
                    headers: {'Accept': 'application/json',
                              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    },
                    url: KISBPM.URL.putModel(modelMetaData.modelId)})

                    .success(function (data, status, headers, config) {
                        $scope.editor.handleEvents({
                            type: ORYX.CONFIG.EVENT_SAVED
                        });
                        
                        $scope.model.loading = false;
                        $scope.$hide();

                        var allSteps = EDITOR.UTIL.collectSortedElementsFromPrecedingElements($scope.selectedShape);

                        $rootScope.editorHistory.push({
                            id: modelMetaData.modelId, 
                            name: modelMetaData.name, 
                            key: modelMetaData.key, 
                            type: 'bpmnmodel',
                            stepId: $scope.selectedShape.resourceId,
                            allSteps: allSteps,
                        });
                        $location.path('form-editor/' + newFormId);

                    })
                    .error(function (data, status, headers, config) {
                        $scope.model.loading = false;
                        $scope.$hide();
                    });
                
            }).
            error(function(data, status, headers, config) {
                $scope.model.loading = false;
                $scope.model.errorMessage = data.message;
            });
    };
    
    $scope.cancel = function() {
        $scope.close();
    };

    $scope.loadForms = function() {
        // update by Asy - has published,don't load form
        if(!$scope.changeForm){
        	$scope.state.loadingForms = false;
            $scope.state.formError = false;
        	var farr = new Array();
        	farr.push($scope.selectedForm);
        	$scope.forms = farr;
        	return false;
        }
        
        var params = {};
        if($scope.popup.filterText != undefined && $scope.popup.filterText != null){
        	params = {
        		filterText:$scope.popup.filterText
        	};
        }
        $http.get(ACTIVITI.CONFIG.contextRoot + '/app/rest/form-models', {params: params})
            .success(
                function(response) {
                    $scope.state.loadingForms = false;
                    $scope.state.formError = false;
                    $scope.forms = response.data;
                })
            .error(
                function(data, status, headers, config) {
                    $scope.state.loadingForms = false;
                    $scope.state.formError = true;
                });
    };
    
    // update by Asy - add search box
    var timeoutFilter = function() {
	    $scope.popup.isFilterDelayed = true;
	    $timeout(function() {
	        $scope.popup.isFilterDelayed = false;
	        if($scope.popup.isFilterUpdated) {
	          $scope.popup.isFilterUpdated = false;
	          timeoutFilter();
	        } else {
	          $scope.loadForms();
	        }
	    }, 500);
	};

	$scope.filterDelayed = function() {
	    if($scope.popup.isFilterDelayed) {
	      $scope.popup.isFilterUpdated = true;
	    } else {
	      timeoutFilter();
	    }
	};

    if ($scope.property && $scope.property.value && $scope.property.value.id) {
   	     $scope.selectedForm = $scope.property.value;
    }

    $scope.loadForms();
}]);