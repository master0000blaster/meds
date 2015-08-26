var moment = require('moment');

exports.getDateTimeNowString = function () {
    return moment().format("MM-DD-YYYY hh:mm A");
};