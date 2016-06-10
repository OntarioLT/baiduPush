var assert = require('assert');
var BaiduPush = require('baidu_push');


    var baiduPush = new BaiduPush({
        apiKey: "***",
        secretKey: "***"
    });
	
	var baiduPush_IOS = new BaiduPush({
        apiKey: "***",
        secretKey: "***"
    });

		var opt ={
            channel_id: '***',
            msg_type: 1,
			device_type: 3,
            msg: '{"title": "hello", "description" : "Hello 田磊"}'
        };
		debugger
        baiduPush.pushSingle(opt, function (err, data) {
            assert.equal(err, null, 'There should no error');
            assert.equal(typeof data, 'object', 'Data should be a object');
            assert.ok(data.request_id, 'Should have value');
            assert.ok(data.response_params, 'Should have value');
            assert.ok(data.response_params.msg_id, 'Should have value');
            assert.ok(data.response_params.send_time, 'Should have value');
        });
		/*
		var jsonMsg = "{\"aps\": {\"alert\":\"Hello ";
		jsonMsg += "何昌其\"}}";
		var opt = {
            channel_id: '5398054360698382244',
            msg_type: 1,
			device_type: 4,
			deploy_status: 2,
			msg: jsonMsg
		};
		baiduPush_IOS.pushSingle(opt, function (err, data) {
            assert.equal(err, null, 'There should no error');            
        });
		*/
		


    

