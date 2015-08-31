var fieldInfo = require('./fieldInfo.js');
var types = require('./types.js');
var modelBase = require('./modelBase.js');

function create() {
    return modelBase.create(
        'Administrations',
        {
            id : fieldInfo.create(types.number, true),
            MedicationId : fieldInfo.create(types.number),
            MedicationDosageId : fieldInfo.create(types.number),
            DosageTaken : fieldInfo.create(types.number),
            TakenAt : fieldInfo.create(types.date),
            DateModified : fieldInfo.create(types.date)
        }
    );
}

exports.create = create;