var fieldInfo = require('./fieldInfo.js');
var types = require('./types.js');
var modelBase = require('./modelBase.js');

function create() {
    return modelBase.create(
        'Medication',
        {
            id : fieldInfo.create(types.number, true),
            Name : fieldInfo.create(types.string),
            DateModified : fieldInfo.create(types.date)
        }
    );
}

exports.create = create;

exports.tableName