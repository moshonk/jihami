var express = require('express');
var request = require('request');
var models = require('../models');
var moment = require('moment');
var _ = require('lodash');

var router = express.Router();

router.get('/', function(req, res, next) {
    let message_type = parseInt(req.query.message_type);
    let scheduled_date = req.query.scheduled_date;
    console.log(scheduled_date);
    console.log(message_type);
    let schedules = [];

    let message_schedule = {};

    switch (message_type) {
        case 1:
            // Study welcome
            models.study_subject.findAll({
                where: {study_welcome_message: 0, active: 1}
            }).then((study_subjects) => {
                models.message.findOne({
                    where: {intent: "Study Welcome"} 
                }).then((message) => {
                    let scheduled_messages = study_subjects.map((s) => {
                        let scheduled_message = {
                            scheduled_message_id: -1,
                            study_subject: s,
                            message: message}; 
                        return scheduled_message;
                    });    
                    return res.json(scheduled_messages);
                });
            });                    
            
            break;
        case 2:
            // Adherence support
            models.message_schedule.findAll({
                include: [
                    {model: models.study_subject, where: {active: 1} }, 
                    models.message],
                where: {scheduled_date: scheduled_date, message_status: 0}
            }).then((scheduled_messages) => {
                return res.json(scheduled_messages);
            });                    
            break;
        case 3:
            // Visit reminder
    
            break;
        case 4:
            // Missed Visit follow up
    
            break;
        case 5:
            // Study completion
            models.study_subject.findAll({
                where: {study_completion_message: 0, active: 1}
            }).then((study_subjects) => {
                models.message.findOne({
                    where: {intent: "Study Completion"} 
                }).then((message) => {
                    let scheduled_messages = study_subjects.map((s) => {
                        let scheduled_message = {
                            scheduled_message_id: -1,
                            study_subject: s,
                            message: message}; 
                        return scheduled_message;
                    });    
                    return res.json(scheduled_messages);
                });
            });                    
    
            break;
                    
        default:
            break;
    }

    //return res.json([]);
});

/* POST message schedule. */
router.post('/save', function(req, res, next) {
    let id = req.body.study_subject.study_subject_id;
    let gender = req.body.study_subject.gender;
    let enrollment_date = req.body.study_subject.enrollment_date;

    models.message_rotation.findAll({
        where: {gender: [gender, '*']}
    }).then((message_rotations) => {
        models.message_schedule.findAll({
            where: {study_subject_id: id}
        }).then((message_schedules) => {
            message_rotations.forEach(message_rotation => {
                let week = message_rotation.week || 0;
                let month = message_rotation.month || 0;
                let new_message_schedules = [];

                let scheduled_date = moment(enrollment_date).add(month, 'M').add(week, 'w').add(-1, 'd').format('YYYY-MM-DD');
                let message_schedule = _.find(message_schedules, {'study_subject_id': id, 'scheduled_date': scheduled_date, 'message_id': message_rotation.message_id});
                if (message_schedule == undefined) {
                    message_schedule = {
                        study_subject_id: id,
                        message_id: message_rotation.message_id,
                        scheduled_date: scheduled_date,
                        message_rotation_id: message_rotation.message_rotation_id,
                        message_status: 0
                    };
                    new_message_schedules.push(message_schedule);
                }
                //console.log(new_message_schedules);
                models.message_schedule.bulkCreate(new_message_schedules).then((response)=>{
                    return res.json(response);
                });
            });
        });
    });
});

/* Send message SMS log. */
router.post('/update', function(req, res, next) {
    let message_schedules = req.body.message_schedules;
    models.message_schedule.bulkCreate(message_schedules, {updateOnDuplicate: ['message_status']}).then((response)=>{
        return res.json(response);
    });    
});

module.exports = router;