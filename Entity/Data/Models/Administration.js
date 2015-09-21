var fieldInfo = require('./fieldInfo.js');
var types = require('./types.js');
var modelBase = require('./modelBase.js');

function create() {
    return modelBase.create(
        'Administrations',
        {
            id : fieldInfo.create(types.number, true),
            DateModified : fieldInfo.create(types.date, false, true),
            Notes : fieldInfo.create(types.string)
        }
    );
}

exports.create = create;