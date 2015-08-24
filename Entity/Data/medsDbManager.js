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
            if (err) {
                var msg = 'Unable to connect to the mongoDB server. Error: ';
                console.log(msg, err);
                var newError = new Error();
                newError.message = msg + err;
                
                throw newError;
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
            medsCollection = medsDB.collection('Medication');
            if (onComplete) {
                onComplete(medsCollection);
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
            medsDosagesCollection = medsDB.collection('MedicationDosage');
            if (onComplete) {
                onComplete(medsDosagesCollection);
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
            admnistrationsCollection = medsDB.collection('Administrations');
            if (onComplete) {
                onComplete(admnistrationsCollection);
            }
        });
    }
    else if (onComplete) {
        onComplete(admnistrationsCollection);
    }
};

