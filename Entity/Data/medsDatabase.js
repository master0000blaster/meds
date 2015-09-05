var medsDbManager = require('./medsDbManager.js');
var medication = require('./Models/medication.js');
var medicationDosage = require('./Models/medicationDosage.js');
var administration = require('./Models/administration.js');
var modelBase = require('./Models/modelBase.js');

//--------------------------------- actions
exports.insertMedication = function (medicationFlat, onComplete) {
    
    var model = medication.create();
    modelBase.fillFromFlat(model, medicationFlat);

    medsDbManager.insertModel(model,function (result) {
        if (onComplete) {
            onComplete(result);
        }
    });
};

exports.getAllMeds = function (onComplete) {
    var model = medication.create();

    medsDbManager.getAll(model, function (result) {
        if (onComplete) {
            onComplete(result);
        }
    });
};

exports.getMedDosagesByMedId = function (args, onComplete) {
    var model = medicationDosage.create();
    var whereClause = ' WHERE "MedicationId" = $1';
    var params = [args.medId];
    medsDbManager.getByWhere(model, whereClause, params,  function (result) {
        if (onComplete) {
            onComplete(result);
        }
    });
};
var deleteMedDosagesByMedId = function (args, onComplete) {
    var model = medicationDosage.create();
    var whereClause = ' WHERE "MedicationId" = $1';
    var params = [args.medId];
    medsDbManager.deleteByWhere(model, whereClause, params, function (result) {
        if (onComplete) {
            onComplete(result);
        }
    });
};

exports.deleteMedDosagesByMedId = deleteMedDosagesByMedId;

exports.addMedDosage = function (medDosageFlat, onComplete) {
    var model = medicationDosage.create();
    modelBase.fillFromFlat(model, medDosageFlat);

    medsDbManager.insertModel(model, function (result) {
        if (onComplete) {
            onComplete(result);
        }
    });
};

exports.deleteMedById = function (args, onComplete) {
    var model = medication.create();
    model.model.id.value = args.medId;
    deleteMedDosagesByMedId(args, function (medDosgaeResult) {
        if (!medDosgaeResult.errorMessage) {

            medsDbManager.deleteById(model, function (result) {
                if (onComplete) {
                    onComplete(result);
                }
            });
        } else {
            if (onComplete) {
                onComplete(medDosgaeResult);
            }
        }
    });
};

exports.deleteDosageMedById = function (args, onComplete) {
    var model = medicationDosage.create();
    model.model.id.value = args.medDosageId;
    medsDbManager.deleteById(model, function (result) {
        if (onComplete) {
            onComplete(result);
        }
    });
};

exports.updateMedById = function (medFlat, onComplete) {
    var model = medication.create();
    modelBase.fillFromFlat(model, medFlat);

    medsDbManager.updateById(model, function (result) {
        if (onComplete) {
            onComplete(result);
        }
    });
};

exports.updateMedDosage = function(medDosageFlat, onComplete) {
    var model = medicationDosage.create();
    modelBase.fillFromFlat(model, medDosageFlat);
    
    medsDbManager.updateById(model, function (result) {
        if (onComplete) {
            onComplete(result);
        }
    });
};