app.controller("mainController", function ($scope) {
    
    function createRequest() {
        return {
            entity : "",
            action : "",
            params : {}
        };
    }
    
    $scope.outputLines = [];
    $scope.addMedText = "";
    $scope.meds = [];
    $scope.medsDosages = [];
    $scope.addMedDosageShowing = {};
    $scope.medDosageShowing = {};
    $scope.addMedDosageText = {};
    $scope.medDosageLoadingShowing = {};
    $scope.medDosages = {};
    $scope.editModeMedicationEnabled = {};
    
    function Output(text) {
        $scope.outputLines.push(text);
        $scope.$apply();
    }
    
    function PostSomething(request, onComplete) {
        
        $.ajax({
            url: this.href,
            type: 'POST',
            dataType : 'json',
            data: request,
            success: function (result) {
                if (result.errorMessage || result.errorMessage != '') {
                    console.log(result.errorMessage);
                    if (onComplete) {
                        onComplete(result);
                    }
                }
                else {
                    if (onComplete) {
                        var data = result.data ? result.data : {};
                        onComplete(data);
                    }
                }
			
            },
            error: function (e) {
                console.log(e);
                onComplete({ errorMessage : e.message });
            }
        });
    }
    
    function getMedDosagesByMedId(medId) {
        var requestModel = createRequest();
        requestModel.entity = "meds";
        requestModel.action = "getMedDosagesByMedId";
        requestModel.params = {
            medId : medId
        };
        
        PostSomething(requestModel, function (results) {
            
            $scope.medDosageLoadingShowing[medId] = false;
            if (results.errorMessage) {
                $scope.medDosages[medId] = {};
                $scope.medDosages[medId].errorMessage = results.errorMessage;
            }
            else {
                $scope.medDosages[medId] = results.data;
            }
            $scope.$apply();
        });
    }
    
    $scope.showMedDosage = function (medId) {
        if (!$scope.medDosageShowing[medId]) {
            $scope.medDosageShowing[medId] = true;
            $scope.medDosageLoadingShowing[medId] = true;
        }
        else {
            $scope.medDosageShowing[medId] = false;
            $scope.medDosageLoadingShowing[medId] = false;
        }
        
        if ($scope.medDosageLoadingShowing[medId]) {
            getMedDosagesByMedId(medId);
        }
    };
    
    $scope.addMedDosage = function (medId) {
        $scope.addMedDosageShowing[medId] = true;
        $scope.addMedDosageText[medId] = "";
    
    };
    
    $scope.addMedDosageDone = function (medId) {
        $scope.addMedDosageShowing[medId] = false;
        if ($scope.addMedDosageText[medId] != "" && $scope.addMedDosageText[medId] != undefined) {
            var requestModel = createRequest();
            requestModel.entity = "meds";
            requestModel.action = "addMedDosagesByMedId";
            
            requestModel.params = { MedicationId: medId, Dosage : $scope.addMedDosageText[medId] };
            
            PostSomething(requestModel, function (data) {
                getMedDosagesByMedId(medId);
            });
        }
        
        $scope.addMedDosageText[medId] = "";
    
    };
    
    $scope.addMedDosageCancel = function (medId) {
        $scope.addMedDosageShowing[medId] = false;
        $scope.addMedDosageText[medId] = "";
    
    };
    
    $scope.addMed = function () {
        var requestModel = createRequest();
        requestModel.entity = "meds";
        requestModel.action = "insertMedication";
        requestModel.params = { name : $scope.addMedText };
        
        PostSomething(requestModel, function (data) {
            getAllMeds();
        });
    };
    
    $scope.deleteMed = function (id) {
        var requestModel = createRequest();
        requestModel.entity = "meds";
        requestModel.action = "deleteMedById";
        requestModel.params = {
            medId: id
        };
        
        PostSomething(requestModel, function (results) {
            if (!results.errorMessage) {
                getAllMeds();
            }
        });
    };
    
    var getAllMeds = function () {
        var requestModel = createRequest();
        requestModel.entity = "meds";
        requestModel.action = "getAllMeds";
        requestModel.params = {};
        
        PostSomething(requestModel, function (results) {
            $scope.editModeMedicationEnabled = {};
            for (var m = 0; m < results.length; m++) {
                $scope.editModeMedicationEnabled[results[m].id] = false;
            }
            
            $scope.meds = results;
            $scope.$apply();
        });
    };
    
    var updateMed = function (med, onComplete) {
        var requestModel = createRequest();
        requestModel.entity = "meds";
        requestModel.action = "updateMedById";
        requestModel.params = med;
        
        PostSomething(requestModel, function (results) {
            if (results.errorMessage) {
                console.log(results.errorMessage);
            }
            if (onComplete) {
                onComplete(results);
            }
            
            $scope.$apply();
        });
    };
    
    $scope.updateMed = function (med) {
        if ($scope.editModeMedicationEnabled[med.id]) {
            updateMed(med, function (result) {
                if (!result.errorMessage) {
                    $scope.editModeMedicationEnabled[med.id] = false;
                }
            });
        }
        else {
            $scope.editModeMedicationEnabled[med.id] = true;
        }
    };
    
    $scope.init = function () {
        getAllMeds();
    };
    
    $scope.init();

});

