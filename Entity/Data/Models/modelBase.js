

var fillFromFlat = function (modelBase, flatModel) {

    for (var flatProp in flatModel) {
        
        if (flatModel.hasOwnProperty(flatProp)) {
            
            for (var prop in modelBase.model) {
                
                if (modelBase.model.hasOwnProperty(prop)) {
                    if (prop.toLowerCase() == flatProp.toLowerCase()) {
                        modelBase.model[prop].value = flatModel[flatProp];
                        break;
                    }
                }
            }
        }
    }

};

var create = function (tableName, model) {
    var modelInfo = {
        model : model,
        tableName : tableName

    };

    return modelInfo;
};


exports.create = create;

exports.fillFromFlat = fillFromFlat;