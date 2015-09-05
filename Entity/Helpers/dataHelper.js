var moment = require('moment');

exports.getDateTimeNowString = function () {
    return moment().format("MM-DD-YYYY hh:mm A");
};

exports.getModelsFromTable = function (modelBase, rows) {
   
    var model = modelBase.model;;
    var models = [];

    for (var r = 0; r < rows.length; r++) {
        var row = rows[r];
        var newModel = {};
        for (var fieldInfo in model) {
            if (model.hasOwnProperty(fieldInfo)) {
                if (row[fieldInfo]) {
                    newModel[fieldInfo] = row[fieldInfo];
                }
            }
        }

        models.push(newModel);
    }
    return models;
};