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
    model.model.id.value = args.medId;
    medsDbManager.getById(model, function (result) {
        if (onComplete) {
            onComplete(result);
        }
    });
};

exports.addMedDosages = function (medDosageFlat, onComplete) {
    var model = medicationDosage.create();
    modelBase.fillFromFlat(modelBase, medDosageFlat);

    medsDbManager.insertModel(model, function (result) {
        if (onComplete) {
            onComplete(result);
        }
    });
};

exports.deleteMedById = function (args, onComplete) {
    var model = medication.create();
    model.model.id.value = args.medId;
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