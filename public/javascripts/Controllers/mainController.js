app.controller("mainController", ['$scope', 'configService', 'dataService', function ($scope, configService, dataService) {
        
        
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
        $scope.adminDoseUpdateModeEnabled = {};
        $scope.spellingSuggestions = [];
        $scope.administrations = [];
        $scope.newAdministrationNotes = '';
        $scope.editModeAdministrationsEnabled = {};
        $scope.addAdminDoseEnabled = {};
        
        function Output(text) {
            $scope.outputLines.push(text);
            $scope.$apply();
        }

        function getMedDosagesByMedId(medId) {
            
            dataService.meds.getMedDosagesByMedId({
                medId : medId
            }, function (results) {
                
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
                dataService.getMedSuggestions(configService.nameSuggestonService, text, function (results) {
                    $scope.spellingSuggestions = results.suggestionGroup.suggestionList.suggestion;
                });
            }
            else {
                $scope.spellingSuggestions = [];
            }
        };
        
        $scope.updateMedDosge = function (medDose, medId) {
            if ($scope.medDoseUpdateModeEnabled[medId][medDose.id]) {
                
                dataService.meds.updateMedDosage(medDose, function (result) {
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
                
                dataService.meds.deleteDosageMedById( medDosageId , function (result) {
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
                
                dataService.meds.addMedDosage({ MedicationId: medId, PillDosage : $scope.addMedDosageText[medId] }, function (result) {
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
            
            dataService.meds.insertMedication({ name : $scope.addMedText }, function (data) {
                getAllMeds();
            });
        };
        
        $scope.deleteMed = function (id) {
            if (!$scope.editModeMedicationEnabled[id]) {
                
                dataService.meds.deleteMedById(id, function (results) {
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
            dataService.meds.getAllMeds({}, function (results) {
                $scope.editModeMedicationEnabled = {};
                $scope.addMedDosageShowing = {};
                $scope.medDoseUpdateModeEnabled = {};
                for (var m = 0; m < results.length; m++) {
                    $scope.editModeMedicationEnabled[results[m].id] = false;
                    $scope.addMedDosageShowing[results[m].id] = false;
                }
                
                $scope.meds = results;
                $scope.$apply();
            });
        };
        
        var getAllAdministrations = function () {
            dataService.meds.getAdministrations({}, function (results) {
                $scope.addAdminDoseEnabled = {};
                $scope.editModeAdministrationsEnabled = {};
                $scope.adminDoseUpdateModeEnabled = {};
                for (var a = 0; a < results.length; a++) {
                    $scope.editModeAdministrationsEnabled[results[a].id] = false;
                    $scope.addAdminDoseEnabled[results[a].id] = false;
                }
                
                $scope.administrations = results;
                $scope.$apply();
            });
        };
        
        var updateMed = function (med, onComplete) {            
            dataService.meds.updateMedById(med, function (results) {
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
        
        $scope.addAdministrationDose = function () {

        };
        
        $scope.addAdministration = function () {            
            dataService.meds.addAdministration({ Notes : $scope.newAdministrationNotes }, function (data) {
                getAllAdministrations();
            });
        };
        
        $scope.init = function () {
            dataService.setServiceUrl(configService.serviceUrl);
            
            getAllMeds();
            getAllAdministrations();
        };
        
        $scope.init();

    }]);

