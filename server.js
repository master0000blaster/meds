#!/bin/env node
var dataSource = require("./Meds/Data/dataSource.js");
var express = require('express');
var bodyParser = require('body-parser');
var dirName = "./Meds/public/";


// set up a simple web server for testing
var app = express();
app.use(express.static(dirName));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(dirName + '/index.html');
    res.send()
});

app.post("/", function (request, res) {
    
    var req = request.body;
    
    var result = 
    {
        errorMessage : "",
        data : {}
    };
    
    var sendingAsync = false;
    
    if (!req || req == '') {
        result.errorMessage = "No Data was recieved by the server.";
    }
    else if (!req.action || req.action == '') {
        result.errorMessage = "No action was set on the request.";
    }
    else {
        var action;
        var entity;
        
        if (dataSource[req.entity]) {
            entity = dataSource[req.entity];
            if (typeof entity[req.action] == "function") {
                action = entity[req.action];
            }
            else {
                result.errorMessage = "No action by that name was found.";
            }
        }
        else {
            result.errorMessage = "No entity by that name was found.";
        }
        
        if (action && entity) {
            var args = [];
            for (var prop in req.params) {
                args.push(req.params[prop]);
            }
            
            args.push(function (data) {
                result.data = data;
                res.send(result);
            });
            
            sendingAsync = true;
            result.data = action.apply(entity, args);
        }
    }
    
    if (!sendingAsync) {
        res.send(result);
    }
});

app.listen(8888);

