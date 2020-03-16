var express = require('express');
var request = require('request');
var models = require('../models');
var studySubjectModel = require('../models/study_subject');
var visitModel = require('../models/visit');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let uri = 'http://localhost:3000/api/v1/study_subject'
  request.get(uri, function (err, httpResponse, body) {
    if ( err ) {
      next(err);
    } else {
      res.render('index', { study_subjects: JSON.parse(body) });
    }
  });
});

router.get('/:id', function(req, res, next) {
  let subject_id = req.params.id;
  let uri = 'http://localhost:3000/api/v1/study_subjects/' + subject_id;
  request.get(uri, function (err, httpResponse, body) {
    if ( err ) {
      next(err);
    } else {
      res.render('edit_participant', { study_subject: JSON.parse(body) });
    }
  });
});

router.get('/view/:id', function(req, res, next) {
  let id = req.params.id;
  let study_subject = {};
  let message_schedules = [];
  let visits = [];

  //Get Study Participant and associated Visits and message schedules
  models.study_subject.findOne({
    include: [
      {model: models.visit}, 
      {model: models.message_schedule, include: models.message}
    ],
    where: {
      study_subject_id: id
    },
    order: [
      [models.message_schedule, 'scheduled_date', 'ASC']
  ] 
  }).then((data)=>{
    res.render('view_participant', { study_subject: data});        
  });
  
});

module.exports = router;
