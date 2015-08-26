var mongodb = require('mongodb');
var dbConfig = require('./../../config/dbConfig.js');

var MongoClient = mongodb.MongoClient;
var medsDB;
var medsCollection;
var medsDosagesCollection;
var admnistrationsCollection;

var getDB = function (onComplete) {
    if (!medsDB) {
        MongoClient.connect(dbConfig.address, function (err, db) {
            var resultInfo = {
                recordsFound : true,
                errorMessage : "",
                data : {}
            };

            if (err) {
                resultInfo.errorMessage = err.message;
                if (onComplete) {
                    onComplete(resultInfo);
                }
            } else {
                console.log('Connection established to', dbConfig.address);
                medsDB = db;
                db.on("close", function (error) {
                    medsDB = null;
                });
                
                if (onComplete) {
                    onComplete(medsDB);
                }
            }
        });
    }
    else if (onComplete) {
        onComplete(medsDB);
    }
};

exports.getDB = getDB;

exports.getMedicationCollection = function (onComplete) {
    if (!medsCollection) {
        getDB(function (medsDB) {
            if (medsDB.errorMessage) {
                onComplete(medsDB);
            }
            else {
                medsCollection = medsDB.collection('Medication');
                if (onComplete) {
                    onComplete(medsCollection);
                }
            }
        });
    }
    else if (onComplete) {
        onComplete(medsCollection);
    }
};

exports.getMedsDosagesCollection = function (onComplete) {
    
    if (!medsDosagesCollection) {
        getDB(function (medsDB) {
            if (medsDB.errorMessage) {
                onComplete(medsDB);
            }
            else {
                medsDosagesCollection = medsDB.collection('MedicationDosage');
                if (onComplete) {
                    onComplete(medsDosagesCollection);
                }
            }
        });
    }
    else if (onComplete) {
        onComplete(medsDosagesCollection);
    }
};

exports.getAdmnistrationsCollection = function (onComplete) {
    
    if (!admnistrationsCollection) {
        getDB(function (medsDB) {
            if (medsDB.errorMessage) {
                onComplete(medsDB);
            }
            else {
                admnistrationsCollection = medsDB.collection('Administrations');
                if (onComplete) {
                    onComplete(admnistrationsCollection);
                }
            }
          
        });
    }
    else if (onComplete) {
        onComplete(admnistrationsCollection);
    }
};

exports.find = function (collection, criteria, entityName, onComplete) {
    if (onComplete) {
        collection.find(criteria).toArray(function (err, result) {
            var resultInfo = {
                recordsFound : true,
                errorMessage : "",
                data : {}
            };
            
            if (err) {
                resultInfo.errorMessage = "Error in getting " + entityName + ": " + err;
                consol.log("Error in " + functionName + ": ");
                console.log(err);
            } 
            else if (result.length) {
                resultInfo.data = result;
            } 
            else {
                resultInfo.recordsFound = false;
                resultInfo.errorMessage = "No " + entityName + " found.";
            }
            
            onComplete(resultInfo);
        
        });
    }
};

