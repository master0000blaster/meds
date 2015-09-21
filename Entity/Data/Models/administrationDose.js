var fieldInfo = require('./fieldInfo.js');
var types = require('./types.js');
var modelBase = require('./modelBase.js');

function create() {
    return modelBase.create(
        'AdministrationDose',
        {
            id : fieldInfo.create(types.number, true),
            MedicationName : fieldInfo.create(types.string),
            PillDosage : fieldInfo.create(types.number),
            DosageTaken : fieldInfo.create(types.number),
            PillsTaken : fieldInfo.create(types.number),
            TakenAt : fieldInfo.create(types.date),
            DateModified : fieldInfo.create(types.date, false, true),
            Notes : fieldInfo.create(types.string)
        }
    );
}

exports.create = create;