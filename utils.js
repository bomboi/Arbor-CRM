const setIfExists = (object, value) => {
    if(value) object = value;
}

const logId = (req) => {
    return req.method + ' ' + req.baseUrl + req.url;
};

exports.logId = logId;

exports.setIfExists = setIfExists; 