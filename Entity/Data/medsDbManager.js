var pg = require('pg');
var dbConfig = require('./../../config/dbConfig.js');
var types = require('./Models/types.js');

var getClient = function (onComplete) {
    var connectionString = process.env.DATABASE_URL || dbConfig.address;
    
    var client = new pg.Client(connectionString);
    
    pg.connect(conString, function (err, client, done) {
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
};

exports.getClient = getClient;

exports.insertModel = function (modelBase) {

    getClient(function (client) {
        
        var fields = "";
        var values = "";
        var model = modelBase.model;
        var paramOrdinal = 1;
        var params = [];
        for (var fieldInfo in model) {
            if (model.hasOwnProperty(fieldInfo)) {
                if (!model[fieldInfo].isIdentity) {
                    if (fields != "") {
                        fields += ", ";
                        values += ", ";
                    }
                    
                    fields += fieldInfo;
                    values += "$" + paramOrdinal;
                    params.push(model[fieldInfo].value);

                    paramOrdinal++;
                }
            }
        }
        
        var queryText = 'INSERT INTO ' + model.tableName + ' (' + fields + ') VALUES (' + values + ')';

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

exports.updateById = function (modelBase) {
    getClient(function (client) {
        
        var fields = "";
        var model = modelBase.model;
        var paramOrdinal = 1;
        var params = [];
        var id = "";
        var idFieldName = "";
        for (var fieldInfo in model) {
            if (model.hasOwnProperty(fieldInfo)) {
                if (!model[fieldInfo].isIdentity) {
                    if (fields != "") {
                        fields += ", ";
                        values += ", ";
                    }
                    
                    fields += fieldInfo + " = $" + paramOrdinal;
                    params.push(model[fieldInfo].value);
                    
                    paramOrdinal++;
                }
                else {
                    id = model[fieldInfo].value;
                    idFieldName = fieldInfo;
                }
            }
        }
        
        var queryText = 'UPDATE ' + model.tableName + ' SET ' + fields + ' WHERE ' + idFieldName + ' = $' + paramOrdinal;
        
        params.push(id);
        
        client.query(queryText, params, function (err, result) {
            if (err) {
                if (onComplete) {
                    onComplete({ errorMessage : err.message });
                }
            } else {                
                if (onComplete) {
                    onComplete({ });
                }
            }
            
            client.end();
        });
    });
}
