var myDataService = function () {
    var serviceUrl = this.href;
    var instance = this;
    this.isLoading = false;
    
    this.meds = {};
    
    this.setServiceUrl = function (url) {
        serviceUrl = url;
    }
    
    var createRequest = function () {
        return {
            entity : "",
            action : "",
            params : {}
        };
    }
    
    var httpUitl = function () {
        var instance = this;
        this.callSomethingByMethod = function (url, method, request, onComplete) {
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
        
        this.getSomething = function (request, onComplete) {
            instance.getSomethingByURL(serviceUrl, request, onComplete);
        }
        
        this.getSomethingByURL = function (url, request, onComplete) {
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
            
            instance.callSomethingByMethod(url + queryString, "GET", {}, onComplete);
        }
        
        this.postSomething = function (request, onComplete) {
            instance.postSomethingByUrl(serviceUrl, request, onComplete);
        }
        
        this.postSomethingByUrl = function (url, request, onComplete) {
            instance.callSomethingByMethod(url, "POST", request, onComplete);
        }

        this.postToMeds = function (action, payload, onComplete) {
            var request = createRequest();
            request.action = action;
            request.entity = "meds";
            request.params = payload;
            
            instance.postSomething(request, onComplete)
        };
    };
    
    var httpUtiliy = new httpUitl();
    
    this.meds.getMedDosagesByMedId = function (payload, onComplete) {
        httpUtiliy.postToMeds('getMedDosagesByMedId', payload, onComplete);
    };
    
    this.meds.updateMedDosage = function (payload, onComplete) {
        httpUtiliy.postToMeds('updateMedDosage', payload, onComplete);
    };
    
    this.meds.deleteDosageMedById = function (medDosageId, onComplete) {
        httpUtiliy.postToMeds('deleteDosageMedById', { medDosageId: medDosageId }, onComplete);
    };
    
    this.meds.addMedDosage = function (payload, onComplete) {
        httpUtiliy.postToMeds('addMedDosage', payload, onComplete);
    };
    
    this.meds.insertMedication = function (payload, onComplete) {
        httpUtiliy.postToMeds('insertMedication', payload, onComplete);
    };
    
    this.meds.deleteMedById = function (id, onComplete) {
        httpUtiliy.postToMeds('deleteMedById', {
            medId: id
        }, onComplete);
    };
    
    this.meds.getAllMeds = function (payload, onComplete) {
        httpUtiliy.postToMeds('getAllMeds', payload, onComplete);
    };
    
    this.meds.updateMedById = function (payload, onComplete) {
        httpUtiliy.postToMeds('updateMedById', payload, onComplete);
    };
    
    this.meds.addAdministration = function (payload, onComplete) {
        httpUtiliy.postToMeds('addAdministration', payload, onComplete);
    };
    
    this.meds.updateAdministration = function (payload, onComplete) {
        httpUtiliy.postToMeds('updateAdministration', payload, onComplete);
    };
    
    this.meds.deleteAdministration = function (administrationId, onComplete) {
        httpUtiliy.postToMeds('deleteAdministration', { administrationId: administrationId }, onComplete);
    };
    
    this.meds.getAdministrations = function (payload, onComplete) {
        httpUtiliy.postToMeds('getAdministrations', payload, onComplete);
    };
    
    this.meds.addAdministrationDose = function (payload, onComplete) {
        httpUtiliy.postToMeds('addAdministrationDose', payload, onComplete);
    };
    
    this.meds.updateAdministrationDose = function (payload, onComplete) {
        httpUtiliy.postToMeds('updateAdministrationDose', payload, onComplete);
    };
    
    this.meds.deleteAdministrationDose = function (administrationDoseId, onComplete) {
        httpUtiliy.postToMeds('deleteAdministrationDose', { administrationDoseId : administrationDoseId}, onComplete);
    };
    
    this.meds.getAdministrationDoses = function (payload, onComplete) {
        httpUtiliy.postToMeds('getAdministrationDoses', payload, onComplete);
    };
    
    this.meds.getAdministrationDosesByAdministrationId = function (administrationId, onComplete) {
        httpUtiliy.postToMeds('getAdministrationDosesByAdministrationId', {administrationId: administrationId}, onComplete);
    };
    
    this.getMedSuggestions = function (url, searchTerm, onComplete) {
        httpUtiliy.getSomethingByURL(url, { "name" : searchTerm }, onComplete);
    };
};