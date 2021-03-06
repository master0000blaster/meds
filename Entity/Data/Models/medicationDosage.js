﻿var fieldInfo = require('./fieldInfo.js');
var types = require('./types.js');
var modelBase = require('./modelBase.js');

function create() {
    return modelBase.create(
        'MedicationDosage',
     {
            id : fieldInfo.create(types.number, true),
            PillDosage : fieldInfo.create(types.number),
            MedicationId : fieldInfo.create(types.number),
            DateModified : fieldInfo.create(types.date, false, true),
            Notes : fieldInfo.create(types.string)
        }
    );
}

exports.create = create;