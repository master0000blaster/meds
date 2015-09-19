function dataService(){
    var serviceUrl = this.href;
    var instance = this;
    this.isLoading = false;
    
    this.meds = {};

    this.setServiceUrl = function (url){
        serviceUrl = url;
    }
    
    var createRequest = function() {
        return {
            entity : "",
            action : "",
            params : {}
        };
    }

    var callSomethingByMethod = function (url, method, request, onComplete) {
        instance.isLoading = true;
        $.ajax({
            url: url, 
            type: method,
            dataType : 'json',
            data: request,
            success: function (result) {
                instance.isLoading = false;
                if (result.errorMessage) {
                    console.log(result.errorMessage);
                    if (onComplete) {
                        onComplete(result);
                    }
                }
                else {
                    if (onComplete) {
                        var data = result.data ? result.data : result;
                        onComplete(data);
                    }
                }
			
            },
            error: function (e) {
                instance.isLoading = false;
                console.log(e);
                onComplete({ errorMessage : e.message });
            }
        });
    }
    
    var getSomething = function(request, onComplete) {
        getSomethingByURL(serviceUrl, request, onComplete);
    }
    
    var getSomethingByURL = function(url, request, onComplete) {
        var queryString = "";
        for (var prop in request) {
            if (request.hasOwnProperty(prop)) {
                if (queryString != "") {
                    queryString += "&";
                }
                queryString += prop + "=" + request[prop];
            }
        }
        
        if (url.lastIndexOf("?") < 0) {
            url += "?";
        }
        
        callSomethingByMethod(url + queryString, "GET", {}, onComplete);
    }
    
    var postSomething = function(request, onComplete) {
        postSomethingByUrl(serviceUrl, request, onComplete);
    }
    
    var postSomethingByUrl = function(url, request, onComplete) {
        callSomethingByMethod(url, "POST", request, onComplete);
    }
    
    var postToMeds = function (action, payload, onComplete) {
        var request = createRequest();
        request.action = action;
        request.entity = "meds";
        request.params = payload;

        postSomething(request, onComplete)
    };

    this.meds.getMedDosagesByMedId = function (payload, onComplete) {
        postToMeds('getMedDosagesByMedId', payload, onComplete);
    };

    this.meds.updateMedDosage = function (payload, onComplete) {
        postToMeds('updateMedDosage', payload, onComplete);
    };

    this.meds.deleteDosageMedById = function (payload, onComplete) {
        postToMeds('deleteDosageMedById', payload, onComplete);
    };

    this.meds.addMedDosage = function (payload, onComplete) {
        postToMeds('addMedDosage', payload, onComplete);
    };
    
    this.meds.insertMedication = function (payload, onComplete) {
        postToMeds('insertMedication', payload, onComplete);
    };

    this.meds.deleteMedById = function (payload, onComplete) {
        postToMeds('deleteMedById', payload, onComplete);
    };

    this.meds.getAllMeds = function (payload, onComplete) {
        postToMeds('getAllMeds', payload, onComplete);
    };

    this.meds.updateMedById = function (payload, onComplete) {
        postToMeds('updateMedById', payload, onComplete);
    };

    this.getMedSuggestions = function (url, searchTerm, onComplete) {
        getSomethingByURL(url, { "name" : searchTerm }, onComplete);
    };
}