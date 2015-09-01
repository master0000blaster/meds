var pg = require('pg');
var dbConfig = require('./../../config/dbConfig.js');
var types = require('./Models/types.js');

var getClient = function (onComplete) {
    
    try {
        var connectionString = process.env.DATABASE_URL || dbConfig.address;
        
        var client = new pg.Client(connectionString);
        
        pg.connect(connectionString, function (err, client, done) {
            var resultInfo = {};
            
            if (err) {
                if (onComplete) {
                    onComplete({ errorMessage : err.message });
                }
            } else {
                //console.log('Connection established to Meds DB');
                
                if (onComplete) {
                    onComplete(client);
                }
            }
        });
    }
    catch (err) {
        if (onComplete) {
            onComplete({ errorMessage : err.message });
        }
    }
};

exports.getClient = getClient;

exports.insertModel = function (modelBase, onComplete) {
    
    getClient(function (client) {
        if (client.errorMessage) {
            if (onComplete) {
                onComplete(client);
            }
            return;
        }
        
        var fields = "";
        var values = "";
        var model = modelBase.model;
        var paramOrdinal = 1;
        var params = [];
        for (var fieldInfo in model) {
            if (model.hasOwnProperty(fieldInfo)) {
                if (!model[fieldInfo].isIdentity && !model[fieldInfo].excludeUpdateInsert) {
                    if (fields != "") {
                        fields += ", ";
                        values += ", ";
                    }
                    
                    fields += '"' + fieldInfo + '"';
                    values += "$" + paramOrdinal;
                    params.push(model[fieldInfo].value);
                    
                    paramOrdinal++;
                }
            }
        }
        
        var queryText = 'INSERT INTO "' + modelBase.tableName + '" (' + fields + ') VALUES (' + values + ') RETURNING id';
        
        client.query(queryText, params, function (err, result) {
            if (err) {
                if (onComplete) {
                    onComplete({ errorMessage : err.message });
                }
            } else {
                if (onComplete) {
                    var newlyCreatedUserId = result.rows[0].id;
                    onComplete({ newId : newlyCreatedUserId });
                }
            }
            
            client.end();
        });
    });
};

exports.updateById = function (modelBase, onComplete) {
    getClient(function (client) {
        
        if (client.errorMessage) {
            if (onComplete) {
                onComplete(client);
            }
            return;
        }

        var fields = "";
        var model = modelBase.model;
        var paramOrdinal = 1;
        var params = [];
        var id = "";
        var idFieldName = "";
        for (var fieldInfo in model) {
            if (model.hasOwnProperty(fieldInfo)) {
                if (!model[fieldInfo].isIdentity) {
                    if (!model[fieldInfo].excludeUpdateInsert) {
                        if (fields != "") {
                            fields += ", ";
                            values += ", ";
                        }
                        
                        fields += '"' + fieldInfo + '"' + " = $" + paramOrdinal;
                        params.push(model[fieldInfo].value);
                        
                        paramOrdinal++;
                    }
                }
                else {
                    id = model[fieldInfo].value;
                    idFieldName = fieldInfo;
                }
            }
        }
        
        var queryText = 'UPDATE "' + modelBase.tableName + '" SET ' + fields + ' WHERE ' + idFieldName + ' = $' + paramOrdinal;
        
        params.push(id);
        
        client.query(queryText, params, function (err, result) {
            if (err) {
                if (onComplete) {
                    onComplete({ errorMessage : err.message });
                }
            } else {
                if (onComplete) {
                    onComplete({});
                }
            }
            
            client.end();
        });
    });
};

exports.getById = function (modelBase, onComplete) {
    var id = null;
    var idFieldName = "";
    var model = modelBase.model;
    
    for (var modelFieldInfo in model) {
        if (model.hasOwnProperty(modelFieldInfo)) {
            if (model[modelFieldInfo].isIdentity) {
                id = model[modelFieldInfo].value;
                idFieldName = modelFieldInfo;
            }
        }
    }
    
    if (!id) {
        if (onComplete) {
            onComplete({errorMessage : "No Id was found on the provided model. Make sure to set the isIdentity property of the appropriate fieldInfo."});
        }
        else {
            return;
        }
    }
    
    getClient(function (client) {
        
        if (client.errorMessage) {
            if (onComplete) {
                onComplete(client);
            }
            return;
        }

        var fields = "";
        
        for (var fieldInfo in model) {
            if (model.hasOwnProperty(fieldInfo)) {
                if (fields != "") {
                    fields += ", ";
                }

                fields += '"' + fieldInfo + '"';
            }
        }

        var queryText = 'SELECT  "' + fields + '" FROM ' + modelBase.tableName + ' WHERE ' + idFieldName + ' = $1';
        var params = [model[idFieldName].value];

        client.query(queryText, params, function (err, result) {
            if (err) {
                if (onComplete) {
                    onComplete({ errorMessage : err.message });
                }
            } else {
                if (onComplete) {
                    onComplete(result);
                }
            }
            
            client.end();
        });
    });
};

exports.getAll = function (modelBase, onComplete) {

    getClient(function (client) {
        
        if (client.errorMessage) {
            if (onComplete) {
                onComplete(client);
            }
            return;
        }

        var fields = "";
        
        var model = modelBase.model;

        for (var fieldInfo in model) {
            if (model.hasOwnProperty(fieldInfo)) {
                if (fields != "") {
                    fields += ", ";
                }
                
                fields += '"' + fieldInfo + '"';
            }
        }

        var queryText = 'SELECT  ' + fields + " FROM " + modelBase.tableName ;
        var params = [];
        
        client.query(queryText, params, function (err, result) {
            if (err) {
                if (onComplete) {
                    onComplete({ errorMessage : err.message });
                }
            } else {
                if (onComplete) {
                    onComplete(result);
                }
            }
            
            client.end();
        });
    });
};
