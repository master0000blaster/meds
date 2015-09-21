var medsDbManager = require('./medsDbManager.js');
var medication = require('./Models/medication.js');
var medicationDosage = require('./Models/medicationDosage.js');
var administration = require('./Models/administration.js');
var administrationDose = require('./Models/administrationDose.js')
var modelBase = require('./Models/modelBase.js');

//--------------------------------- actions
exports.insertMedication = function (medicationFlat, onComplete) {
    
    var model = medication.create();
    modelBase.fillFromFlat(model, medicationFlat);

    medsDbManager.insertModel(model, onComplete);
};

exports.getAllMeds = function (onComplete) {
    var model = medication.create();

    medsDbManager.getAll(model, onComplete);
};

exports.getMedDosagesByMedId = function (args, onComplete) {
    var model = medicationDosage.create();
    var whereClause = ' WHERE "MedicationId" = $1';
    var params = [args.medId];
    medsDbManager.getByWhere(model, whereClause, params, onComplete);
};
var deleteMedDosagesByMedId = function (args, onComplete) {
    var model = medicationDosage.create();
    var whereClause = ' WHERE "MedicationId" = $1';
    var params = [args.medId];
    medsDbManager.deleteByWhere(model, whereClause, params, onComplete);
};

exports.deleteMedDosagesByMedId = deleteMedDosagesByMedId;

exports.addMedDosage = function (medDosageFlat, onComplete) {
    var model = medicationDosage.create();
    modelBase.fillFromFlat(model, medDosageFlat);

    medsDbManager.insertModel(model, onComplete);
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
    medsDbManager.deleteById(model, onComplete);
};

exports.updateMedById = function (medFlat, onComplete) {
    var model = medication.create();
    modelBase.fillFromFlat(model, medFlat);

    medsDbManager.updateById(model, onComplete);
};

exports.updateMedDosage = function(medDosageFlat, onComplete) {
    var model = medicationDosage.create();
    modelBase.fillFromFlat(model, medDosageFlat);
    
    medsDbManager.updateById(model, onComplete);
};

exports.addAdministration = function (administrationFlat, onComplete) {
    var model = administration.create();
    modelBase.fillFromFlat(model, administrationFlat);
    medsDbManager.insertModel(model, onComplete);
};

exports.updateAdministration = function (administrationFlat, onComplete) {
    var model = administration.create();
    modelBase.fillFromFlat(model, administrationFlat);
    medsDbManager.updateById(model, onComplete);
};

var deleteAdministrationDosesByAdministrationId = function (args, onComplete) {
    var model = administrationDose.create();
    var whereClause = ' WHERE "AdministrationId" = $1';
    var params = [args.administrationId];
    medsDbManager.deleteByWhere(model, whereClause, params, onComplete);
};

exports.deleteAdministrationDosesByAdministrationId = deleteAdministrationDosesByAdministrationId;

exports.deleteAdministration = function (args, onComplete) {
    var model = administration.create();

    model.model.id.value = args.administrationId;
    deleteAdministrationDosesByAdministrationId(args, function (adminDoseResult) {
        if (!adminDoseResult.errorMessage) {
            
            medsDbManager.deleteById(model, function (result) {
                if (onComplete) {
                    onComplete(result);
                }
            });
        } else {
            if (onComplete) {
                onComplete(adminDoseResult);
            }
        }
    });

};

exports.getAdministrations = function (administrationFlat, onComplete) {
    var model = administration.create();
    modelBase.fillFromFlat(model, administrationFlat);
    medsDbManager.getAll(model, onComplete);
};

exports.addAdministrationDose = function (administrationDoseFlat, onComplete) {
    var model = administrationDose.create();
    modelBase.fillFromFlat(model, administrationDoseFlat);
    medsDbManager.insertModel(model, onComplete);
};

exports.updateAdministrationDose = function (administrationDoseFlat, onComplete) {
    var model = administrationDose.create();
    modelBase.fillFromFlat(model, administrationDoseFlat);
    medsDbManager.updateById(model, onComplete);
};

exports.deleteAdministrationDose = function (administrationDoseFlat, onComplete) {
    var model = administrationDose.create();
    modelBase.fillFromFlat(model, administrationDoseFlat);
    medsDbManager.deleteById(model, onComplete);
};

exports.getAdministrationDoses = function (args, onComplete) {
    var model = administrationDose.create();
    model.model.id.value = args.administrationDoseId;
    medsDbManager.getAll(model, onComplete);
};

exports.getAdministrationDosesByAdministrationId = function (args, onComplete) {
    var model = administrationDose.create();
    var whereClause = ' WHERE "AdministrationId" = $1';
    var params = [args.administrationId];
    medsDbManager.getByWhere(model, whereClause, params, onComplete);
};