var express = require('express');
var router = express.Router();
var hilink = require('hilink');

/* GET SMS listing. */
router.get('/', function(req, res, next) {
  res.render('send_sms', {message_schedules: [], ports_list: []});

/*  let uri = '/modem/ports'
  req.get(uri, function (err, httpResponse, body) {
    if ( err ) {
      next(err);
    } else {
      res.render('send_sms', {message_schedules: [], ports_list: body});
    }
  });
*/
});

/* POST SMSs */
router.get('/connect', function(req, res, next) {
  hilink.setIp('192.168.1.1');
  hilink.listOutbox(function( response ){
    console.log( JSON.stringify( response, null, 2 ) );
  });  
  res.send('respond with a resource');
});

/* POST SMSs */
router.post('/send', function(req, res, next) {

  res.send('respond with a resource');
});

module.exports = router;
