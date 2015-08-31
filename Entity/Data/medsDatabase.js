var medsDbManager = require('./medsDbManager.js');
var dateHelper = require('./../Helpers/dateHelper.js');
var medication = require('./Models/medication.js');
var medicationDosage = require('./Models/medicationDosage.js');
var administration = require('./Models/administration.js');

function GetResultInfo() {
    return {
        recordsFound : true,
        errorMessage : "",
        data : {}
    };
}
//--------------------------------- actions
exports.insertMedication = function (medication, onComplete) {

    medication.DateModified = dateHelper.getDateTimeNowString();
    medsDbManager.getMedicationCollection(function (medsCollection) {
        if (medsCollection.errorMessage) {
            onComplete(medsDB);
        }
        else {
            try {
                medsCollection.insert(medication, function (err, result) {
                    var resultInfo = GetResultInfo();
                    if (err) {
                        var msg = 'error in insertMedication. Error: ';
                        console.log(msg);
                        console.log(err);
                        
                        resultInfo.errorMessage = msg + err;
                        
                        if (onComplete) {
                            onComplete(resultInfo);
                        }
                    } else {
                        if (onComplete) {
                            resultInfo.data = result;
                            onComplete(resultInfo);
                        }
                    }
                });
            }
            catch (err) {
                console.log(err);
                if (onComplete) {
                    onComplete({ errorMessage : err.message });
                }
            }
        }
    });
};

exports.getAllMeds = function (onComplete) {
    medsDbManager.getMedicationCollection(function (medsCollection) {
        if (medsCollection.errorMessage) {
            onComplete(medsDB);
        }
        else {
            try {
                medsDbManager.find(medsCollection, {}, "Medications", function (resultInfo) {
                    
                    if (onComplete) {
                        onComplete(resultInfo);
                    }
                });
            }
            catch (err) {
                console.log(err);
                if (onComplete) {
                    onComplete({ errorMessage : err.message });
                }
            }
        }
    });
};

exports.getMedDosagesByMedId = function (args, onComplete) {
    medsDbManager.getMedsDosagesCollection(function (medsDosagesCollection) {
        if (medsDosagesCollection.errorMessage) {
            onComplete(medsDB);
        }
        else {
            try {
                medsDbManager.find(medsDosagesCollection, { MedicationId: args.medId }, "Dosages", function (resultInfo) {
                    if (onComplete) {
                        onComplete(resultInfo);
                    }
                });
            }
            catch (err) {
                console.log(err);
                if (onComplete) {
                    onComplete({ errorMessage : err.message });
                }
            }
        }
    });
};

exports.addMedDosagesByMedId = function (medDosage, onComplete) {
    medsDbManager.getMedsDosagesCollection(function (medsDosagesCollection) {
        if (medsDosagesCollection.errorMessage) {
            onComplete(medsDB);
        }
        else {
            try {

                medDosage.DateModified = dateHelper.getDateTimeNowString();;
                medsDosagesCollection.insert(medDosage, function (err, result) {
                    var resultInfo = GetResultInfo();
                    if (err) {
                        var msg = 'error in addMedDosagesByMedId. Error: ';
                        console.log(msg);
                        console.log(err);
                        
                        resultInfo.errorMessage = msg + err;
                        
                        if (onComplete) {
                            onComplete(resultInfo);
                        }
                    } else {
                        if (onComplete) {
                            resultInfo.data = result;
                            onComplete(resultInfo);
                        }
                    }
                });
            }
            catch (err) {
                console.log(err);
                if (onComplete) {
                    onComplete({ errorMessage : err.message });
                }
            }
        }
    });
};