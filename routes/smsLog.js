var express = require('express');
var router = express.Router();
var hilink = require('hilink');
var models = require('../models');

/* GET SMS listing. */
router.get('/', function(req, res, next) {
    models.sms_log.findAll(
      {include: models.study_subject}).then((sms_logs) => {
      return  res.render('sms_log', {sms_logs: sms_logs});
    });  
});

/* POST To */
router.get('/connect', function(req, res, next) {
  hilink.setIp('192.168.1.1');
  hilink.listOutbox(function( response ){
    console.log( JSON.stringify( response, null, 2 ) );
  });  
  res.send('respond with a resource');
});

/* POST to SMS Logs */
router.post('/save', function(req, res, next) {

  res.send('respond with a resource');
});


/* POST SMSs */
router.post('/send', function(req, res, next) {
  let sms_logs = req.body.sms_logs;
  Promise.resolve().then(() => {
    return models.sms_log.bulkCreate(sms_logs);
  }).then((response)=>{
    return res.json({result: 'success', message: response});
  }).catch((err) => {
    return res.json({result: 'fail', message: err});
  });  
});

router.get('/resend', function(req, res, next) {
  let sms_logs = req.query.sms_log_id;

  return res.json({result: 'success', message: "resent"});

  Promise.resolve().then(() => {
    return models.sms_log.bulkCreate(sms_logs);
  }).then((response)=>{
    return res.json({result: 'success', message: response});
  }).catch((err) => {
    return res.json({result: 'fail', message: err});
  });  
});


module.exports = router;
