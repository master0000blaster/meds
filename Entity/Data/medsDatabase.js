var medsDbManager = require('./medsDbManager.js');
var dateHelper = require('./../Helpers/dateHelper.js');
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
    var medsModel = medication.create();

    medsDbManager.getAll(medsModel, function (result) {
        if (onComplete) {
            onComplete(result);
        }
    });
};

exports.getMedDosagesByMedId = function (args, onComplete) {
    var medDosage = medicationDosage.create();
    medDosage.id = args.medId;
    medsDbManager.getById(medDosage, function (result) {
        if (onComplete) {
            onComplete(result);
        }
    });
};

exports.addMedDosages = function (medDosageFlat, onComplete) {
    var model = medicationDosage.create();
    modelBase.fillFromFlat(model, medDosageFlat);

    medsDbManager.insertModel(model, function (result) {
        if (onComplete) {
            onComplete(result);
        }
    });
};