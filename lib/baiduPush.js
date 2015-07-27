'use strict';
/*
*   BaiduPush -- A promise version Baidu push service Node.js SDK
*/
var util = require('util');
var request = require('request');
var signKey = require('./sign.js');
var apiConfigs = require('./apiConfig.json');

// default settings
var defaultHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    'User-Agent': 'BCCS_SDK/3.0 (Darwin; Darwin Kernel Version 14.0.0: Fri Sep 19 00:26:44 PDT 2014; root:xnu-2782.1.97~2/RELEASE_X86_64; x86_64) PHP/5.6.3 (Baidu Push Server SDK V3.0.0 and so on..) cli/Unknown ZEND/2.6.0'
};
var defaultMethod = 'POST';

// basic request helper method
function invokeBaidu(opt) {
    // check required parameters
    if (!opt || !opt.uri || !opt.params)
        throw new Error('Lack required parameters');
    //
    var uri = util.format("http://api.tuisong.baidu.com/rest/3.0/%s", opt.uri);
    // build post params
    var params = opt.params;
    params.timestamp = Math.round(Date.now() / 1000);
    params.apikey = opt.apiKey;
    var httpInfo = {
        href: uri,
        method: defaultMethod
    };
    params.sign = signKey(httpInfo, params, opt.secretKey);
    // build post options
    var requestOptions = {
        uri: uri,
        headers: defaultHeaders,
        method: defaultMethod,
        form: params
    };
    // do request
    return new Promise(function(resolve, reject) {
        request(requestOptions, function(err, response, body) {
            if (err)
                reject(err);
            else {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(e);
                }
            }
        });
    });
};

var Baidu = {};
// add REST api method from config
for (var i in apiConfigs) {
    var config = apiConfigs[i];
    Baidu[config.name] = (function(config) {
        return function(params) {
            // check app key
            if (!this.CONFIG || !this.CONFIG.apiKey || !this.CONFIG.secretKey)
                throw new Error('apiKey and secretKey is required');
            // check required params
            for (var i in config.requiredParams) {
                var p = config.requiredParams[i];
                if (!params[p.name])
                    throw new Error(util.format('Required param "%s" is requied', p.name));
            }
            // build request options
            var opts = {
                uri: config.uri,
                params: params,
                apiKey: this.CONFIG.apiKey,
                secretKey: this.CONFIG.secretKey
            };
            return invokeBaidu(opts);
        };
    })(config);
}


module.exports = Baidu;