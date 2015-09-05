app.controller("mainController", function ($scope) {
    
    function createRequest() {
        return {
            entity : "",
            action : "",
            params : {}
        };
    }
    
    var nameSuggestonService = "https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?";
    
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
    $scope.medDoseUpdateModeEnabled = {};
    $scope.spellingSuggestions = [];
    
    function Output(text) {
        $scope.outputLines.push(text);
        $scope.$apply();
    }
    
    function CallSomethingByMethod(url, method, request, onComplete)
    {
        $.ajax({
            url: url, 
            type: method,
            dataType : 'json',
            data: request,
            success: function (result) {
                if (result.errorMessage) {
                    console.log(result.errorMessage);
                    if (onComplete) {
                        onComplete(result);
                    }
                }
                else {
                    if (onComplete) {
                        var data = result.data ? result.data : result;
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
    
    function GetSomething(request, onComplete)
    {
        GetSomethingByURL(this.href, request, onComplete);
    }
    
    function GetSomethingByURL(url, request, onComplete) {
        var queryString = "";
        for (var prop in request) {
            if (request.hasOwnProperty(prop)) {
                if (queryString != "") {
                    queryString += "&";
                }
                queryString += prop + "=" + request[prop];
            }
        }

        if (url.lastIndexOf("?") < 0) {
            url += "?";
        }

        CallSomethingByMethod(url + queryString, "GET", {}, onComplete);
    }
    
    function PostSomething(request, onComplete) {
        PostSomethingByUrl(this.href, request, onComplete);
    }
    
    function PostSomethingByUrl(url, request, onComplete)
    {
        CallSomethingByMethod(url, "POST", request, onComplete);
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
                $scope.medDosages[medId] = results;
                $scope.medDoseUpdateModeEnabled[medId] = {};
                for (var md = 0; md < results.length; md++) {
                    $scope.medDoseUpdateModeEnabled[medId] = {};
                    $scope.medDoseUpdateModeEnabled[medId][results[md].id] = false;
                }
            }
            $scope.$apply();
        });
    }
    
    $scope.getMedSpellingSuggestions = function (text) {
        if (text && text.length > 2) {
            GetSomethingByURL(nameSuggestonService, { "name" : text }, function (results) {
                $scope.spellingSuggestions = results.suggestionGroup.suggestionList.suggestion;
            });
        }
        else {
            $scope.spellingSuggestions = [];
        }
    };
    
    $scope.updateMedDosge = function (medDose, medId) {
        if ($scope.medDoseUpdateModeEnabled[medId][medDose.id]) {
            var requestModel = createRequest();
            requestModel.entity = "meds";
            requestModel.action = "updateMedDosage";
            
            requestModel.params = medDose;
            
            PostSomething(requestModel, function (result) {
                if (result.errorMessage) {
                    console.log(result.errorMessage);
                }
                else {
                    $scope.addMedDosageShowing[medId] = false;
                    $scope.medDoseUpdateModeEnabled[medId][medDose.id] = false;
                    getMedDosagesByMedId(medId);
                }
            });
        }
        else {
            $scope.medDoseUpdateModeEnabled[medId][medDose.id] = true;
        }
    };
    
    $scope.deleteMedDosage = function (medDosageId, medId) {
        if (!$scope.medDoseUpdateModeEnabled[medId][medDosageId]) {
            var requestModel = createRequest();
            requestModel.entity = "meds";
            requestModel.action = "deleteDosageMedById";
            
            requestModel.params = { medDosageId: medDosageId };
            
            PostSomething(requestModel, function (result) {
                if (result.errorMessage) {
                    console.log(result.errorMessage);
                }
                else {
                    $scope.addMedDosageShowing[medId] = false;
                    getMedDosagesByMedId(medId);
                }
            });
        }
        else {
            $scope.medDoseUpdateModeEnabled[medId][medDosageId] = false;
        }
    };
    
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
        if ($scope.addMedDosageText[medId] != "" && $scope.addMedDosageText[medId] != undefined) {
            var requestModel = createRequest();
            requestModel.entity = "meds";
            requestModel.action = "addMedDosage";
            
            requestModel.params = { MedicationId: medId, Dosage : $scope.addMedDosageText[medId] };
            
            PostSomething(requestModel, function (result) {
                if (result.errorMessage) {
                    console.log(result.errorMessage);
                }
                else {
                    $scope.addMedDosageShowing[medId] = false;
                    getMedDosagesByMedId(medId);
                }
            });
        }
        
        $scope.addMedDosageText[medId] = "";
    
    };
    
    $scope.addMedDosageCancel = function (medId) {
        $scope.addMedDosageShowing[medId] = false;
        $scope.addMedDosageText[medId] = "";
    
    };
    
    $scope.addMed = function () {
        $scope.spellingSuggestions = [];
        var requestModel = createRequest();
        requestModel.entity = "meds";
        requestModel.action = "insertMedication";
        requestModel.params = { name : $scope.addMedText };
        
        PostSomething(requestModel, function (data) {
            getAllMeds();
        });
    };
    
    $scope.deleteMed = function (id) {
        if (!$scope.editModeMedicationEnabled[id]) {
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
        }
        else {
            $scope.editModeMedicationEnabled[id] = false;
        }
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

