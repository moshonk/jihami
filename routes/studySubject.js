var express = require('express');
var request = require('request');
var models = require('../models');
var moment = require('moment');
var _ = require('lodash');

var router = express.Router();
/* Update study subject. */
router.post('/update', function(req, res, next) {
    let study_subjects = req.body.study_subjects;
    console.log(study_subjects);
    models.study_subject.bulkCreate(study_subjects, {updateOnDuplicate: ['study_welcome_message', 'study_completion_message']}).then((response)=>{
        return res.json(response);
    });    
});

module.exports = router;