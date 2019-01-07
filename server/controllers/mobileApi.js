/**
 * author: d-star ☆ ☆
 * 接口的返回值都在ApiData里面维护，保持文件的整洁
 *
 */

var express = require('express');
var router = express.Router();
var base = require("./base");
var logger = require("../helpers/log");

var apiDataPath = __dirname.replace("controllers", "");

/**
 * MOCK local api data
 * API: http://localhost:30000/mobileApi/testGetSuccess
 */
router.post("/testPostSuccess", function (req, res) {
    debugger;
    logger.debug("test post success");

    // get user input parameters.
    var reqBody = req.body;

    var result = {
        code: '10000', // success code. othersize biz code.
        message: 'post success！', // return message to client.
        inputParams: reqBody // capture input paramsters.
    };

    base.apiOkOutput(res, result);
});

router.get("/testGetSuccess.json", function (req, res) {
    logger.debug("test get success");

    // get user input parameters.
    var reqBody = req.body;

    var result = {
        code: '10000', // success code. othersize biz code.
        message: 'get success！', // return message to client.
        inputParams: reqBody // capture input paramsters.
    };

    base.apiOkOutput(res, result);
});

router.post("getSeriesList", function(req, res){
  logger.debug("getSeriesList");
  base.sendApiData(res, apiDataPath + 'ApiData/queryGoodsDiscountAmt.json');
});


module.exports = router;
