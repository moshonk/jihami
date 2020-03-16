let serialportgsm = require('serialport-gsm');
var express = require('express');
var request = require('request');

var router = express.Router();

let modem = serialportgsm.Modem();
let modem1 = serialportgsm.Modem();

let sms_logs = [];


router.get('/ports', function(req, res, next) {
    return modem.list();
    //modem1.list().then((lst)=>{
    //    return res.json(lst);
    //});
});

router.post('/check_status', function(req, res, next) {
    let commport = req.body.commport;
    let options = {
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        rtscts: false,
        xon: false,
        xoff: false,
        xany: false,
        autoDeleteOnReceive: true,
        enableConcatenation: true,
        incomingCallIndication: true,
        incomingSMSIndication: true,
        pin: '',
        customInitCommand: '',
        logger: console
    }
    modem.open(commport, options, (data) => {
        console.log(data);
        if  (data == null) {
            modem.close();
            return res.json({status: 'success'})
        } else {
            modem.close();
            return res.json({status: 'fail'});
        }
    
    });
});

router.post('/send', function(req, res, next) {
    let commport = req.body.commport;

    let options = {
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        rtscts: false,
        xon: false,
        xoff: false,
        xany: false,
        autoDeleteOnReceive: true,
        enableConcatenation: true,
        incomingCallIndication: true,
        incomingSMSIndication: true,
        pin: '',
        customInitCommand: '',
        logger: console
    }
    sms_logs = req.body.sms_logs;     
    modem1.open(commport, options, (data)=>{console.log(data)});
    let resp = sendSmsOnebyOne1(sms_logs);
    console.log('response after sending');
    console.log(resp);
    return res.json(resp);
    /*
    sendSms(sms_logs).then((data) => {
        console.log(data);
        return data;
    }).catch((err) => {
        console.log(err);
    });
    */
//    return sendSms(sms_logs);

});

var sendSmsOnebyOne = (sms_logs) => {
    let sent_sms_logs = [];
    let promises = [];
    sms_logs.forEach((sms_log) => {
        sms_logs.send_status = 1;
        sent_sms_logs.push(sms_logs);

        let contact = sms_log.contact_sent_to.replace(/^0/, '+254');
        modem1.on('open', () => {
            modem1.initializeModem((msg, err) => {
                if (err) {
                    console.log(`Error Initializing Modem - ${err}`);
                } else {
                    // console.log(`${msg.data}`);
                }        
            });
            modem1.setModemMode(msg => console.log('set pdu msg:', msg), 'PDU');
            modem1.sendSMS(contact, sms_log.sms_text, false, function (response) {
                console.log('message status', response);
            })
        });
    }); 
    
    return sent_sms_logs;
}

var sendSmsOnebyOne1 = (sms_logs) => {
    let sent_sms_logs = sms_logs.map((sms_log) => {        
        sms_log.send_status = 1;
        return sms_log;
    });

    modem1.on('open', () => {
        modem1.initializeModem((msg, err) => {
            if (err) {
                console.log(`Error Initializing Modem - ${err}`);
              } else {
                // console.log(`${msg.data}`);
            }        
        });
        modem1.setModemMode(msg => console.log('set pdu msg:', msg), 'PDU');

        sms_logs.forEach((sms_log) => {
            let contact = sms_log.contact_sent_to.replace(/^0/, '+254');
            modem1.sendSMS(contact, sms_log.sms_text, false, function (response) {
                 console.log('message status', response);
                if (response.status == 'success') {
                    sms_logs.send_status = 1;
                    console.log('message sent')
                } else {
                    sms_logs.send_status = 0;
                    console.log('message not sent');
                }
                sent_sms_logs.push(sms_logs);
            })
        });
    });

    return sent_sms_logs;

}


var sendSms = (sms_logs) => {
    modem1.on('open', () => {
        modem1.initializeModem((msg, err) => {
            if (err) {
                console.log(`Error Initializing Modem - ${err}`);
              } else {
                // console.log(`${msg.data}`);
            }        
        });
        modem1.setModemMode(msg => console.log('set pdu msg:', msg), 'PDU');

        let sent_sms_logs = [];
        let promises = [];
        sms_logs.forEach((sms_log) => {

            let contact = sms_log.contact_sent_to.replace(/^0/, '+254');
            promises.push(modem1.sendSMS(contact, sms_log.sms_text, false, function (response) {
                 console.log('message status', response);
                if (response.status == 'success') {
                    sms_logs.send_status = 1;
                    console.log('message sent')
                } else {
                    sms_logs.send_status = 0;
                    console.log('message not sent');
                }
                sent_sms_logs.push(sms_logs);
            }))
        });
        return new Promise((resolve, reject) => {    
            Promise.all(promises).then(() => {
                return new Promise((resolve, reject) => {
                    //modem1.close();
                    console.log('Responses after sending sms');
                    console.log(sent_sms_logs);
                    resolve(sent_sms_logs); 
                });
            }).catch((err) => {
                console.log(err);
                return new Promise((resolve, reject) => {
                    //modem1.close();
                    reject(err);
                });
            });    
        });
    });    
}

modem.on('open', () => {
    modem.initializeModem((msg, err) => {
        if (err) {
            console.log(`Error Initializing Modem - ${err}`);
          } else {
            console.log(`${msg.data}`);
        }        
    });
    modem.setModemMode(msg => console.log('set pdu msg:', msg), 'PDU');

});

modem.on('close', msg => console.log('on close msg:' , msg));
    
modem.on('error',  msg => console.log('on error msg:' , msg));

module.exports = router;
  