

var requestModel = {
    entity : "",
    action: "",
    params : {}
};

function Output(text) {
    $('#divOutput').html($('#divOutput').html() + text + "<br/>");
}

function PostSomething(request) {
    
    $.ajax({
        url: this.href,
        type: 'POST',
        dataType : 'json',
        data: request,
        success: function (data) {
            if (data.errorMessage || data.errorMessage != '') {
                Output('server side error: ' + data.errorMessage);
            }
            else {
                Output('success');
                Output(data);
            }
			
        },
        error: function (e) {
            Output(e.message);
        }
    });
}

$(document).ready(function () {
    $('#btnGo').click(function () {
        
        requestModel.entity = "navigationPoint";
        requestModel.action = "getAll";
        requestModel.params = {};
        
        PostSomething(requestModel);
    });
});