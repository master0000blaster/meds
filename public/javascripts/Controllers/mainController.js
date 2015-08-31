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
                        var data = result.data ? result.data : { };
                        onComplete(data);
                    }
                }
			
            },
            error: function (e) {
                console.log(e);
                onComplete({errorMessage : e.message});
            }
        });
    }
    
    function getMedDosagesByMedId(medId)
    {
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
    
    $scope.deleteMed = function (_id) {

    };
    
    var getAllMeds = function () {
        var requestModel = createRequest();
        requestModel.entity = "meds";
        requestModel.action = "getAllMeds";
        requestModel.params = {};
        
        PostSomething(requestModel, function (results) {
            $scope.meds = results.data;
            $scope.$apply();
        });
    };

    $scope.init = function () {
        getAllMeds();
    };

    $scope.init();

});

