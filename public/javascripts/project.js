const DEFAULT_VALIDATION_MESASGE_TITLE = 'The following error has been encountered...';

$().ready(function () {
    let validate = [];
    let $table = $('table#vl-results')

    var connectModem = () => {
        let uri = `/sms/connect`;
        let xx = $('#message');

        $.ajax({
            url: uri,
            async:true,
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            data: JSON.stringify(participant),
            success: (result) => {
                // Generate reminder schedules
                // generateMessageSchedules(result);

            },
            error: function (result) {
                validate.push(result.responseText);
                showValidationMessage(DEFAULT_VALIDATION_MESASGE_TITLE);
            },
        });        
    }

    var searchScheduledMessages = (message_type, scheduled_date) => {
        let uri = `/schedules?message_type=${message_type}&scheduled_date=${scheduled_date}`;

        $.ajax({
            url: uri,
            async:true,
            method: "GET",
            dataType: 'json',
            success: (result) => {
                console.log(result);
                $('#send-sms').show();
                $('#send-sms').attr('disabled', true);
                $('#check-modem').show();
                $('#modem-status').show();
                displayScheduledMessages(result);

            },
            error: function (result) {
                validate.push(result.responseText);
                showValidationMessage(DEFAULT_VALIDATION_MESASGE_TITLE);
                $('#send-sms').hide();
                $('#check-modem').hide();
                $('#modem-status').hide();
            },
        });
    }

    var resetDataTable = ($table) => {
        $table.DataTable().clear().draw().destroy(); // Clear existing rows from the table before destroying the DataTable object 
    }

    var scheduled_messages_to_send = [];
    var displayScheduledMessages = (results) => {
        let $table = $('#message-schedules');
        resetDataTable($table);
        scheduled_messages_to_send = [];
        $.each(results,(k, v) => {
            let tr = $('<tr/>') 
            let cb = $('<input/>').attr('type', 'checkbox').attr('checked', true).attr('data', v).val(k);
            tr.append($('<td/>').append(cb));
            tr.append($('<td/>').append(v.study_subject.subject_name + ' (' + v.study_subject.study_id + ')'));
            tr.append($('<td/>').append(v.message.text_en));
            tr.append($('<td/>').append(v.message.text_luo));
            $table.append($('<tbody/>')).append(tr);
            scheduled_messages_to_send.push(v);
        })
        $table.DataTable();
    }

    var saveParticipant = (participant) => {
        let uri = `/api/v1/study_subject`;
        $.ajax({
            url: uri,
            async:true,
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            data: JSON.stringify(participant),
            success: (result) => {
                // Generate reminder schedules
                generateMessageSchedules(result);
            },
            error: function (result) {
                validate.push(result.responseText);
                showValidationMessage(DEFAULT_VALIDATION_MESASGE_TITLE);
            },
        });
    }

    var editParticipant = (participant) => {
        let uri = `/api/v1/study_subjects/${participant.study_subject_id}`;
        $.ajax({
            url: uri,
            async:true,
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            data: JSON.stringify(participant),
            success: (result) => {
                // Generate reminder schedules
                generateMessageSchedules(result);
            },
            error: function (result) {
                console.log(result);
                validate.push(result.responseText);
                showValidationMessage(DEFAULT_VALIDATION_MESASGE_TITLE);
            },
        });
    }

    var showValidationMessage = (title) => {
        $('#message').hide();
        if (validate.length > 0) {
            $('#message .alert').html(`${title} </br>`);
            $.each(validate, (k, v) => {
                $('#message .alert').append(`${v} </br>`);
            });
            $('#message').show();        
        }
    }

    var generateMessageSchedules = (study_subject) => {
        let schedule_uri = '/schedules/save';
        $.ajax({
            url: schedule_uri,
            async:true,
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            data: JSON.stringify({study_subject: study_subject}),
            success: () => {
                window.location = '/view/' + study_subject.study_subject_id;                        
            },
            error: function (result) {
                console.log(result);
                validate.push(result.responseText);
                showValidationMessage(DEFAULT_VALIDATION_MESASGE_TITLE);
            },                
        });
    }

    var updateStudySubjects = (study_subjects) => {
        let ss_uri = '/study_subject/update';
        console.log('updaring study subjects');
        $.ajax({
            url: ss_uri,
            async:true,
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            data: JSON.stringify({study_subjects: study_subjects}),
            success: () => {
                // window.location = '/view/' + study_subject.study_subject_id;                        
            },
            error: function (result) {
                console.log(result);
                validate.push(result.responseText);
                showValidationMessage(DEFAULT_VALIDATION_MESASGE_TITLE);
            },                
        });
    }

    var updateMessageSchedules = (message_schedules) => {
        let ss_uri = '/schedules/update';
        console.log('updateing message schedules');
        $.ajax({
            url: ss_uri,
            async:true,
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            data: JSON.stringify({message_schedules: message_schedules}),
            success: () => {
                window.location = '/sms/';                     
            },
            error: function (result) {
                console.log(result);
                validate.push(result.responseText);
                showValidationMessage(DEFAULT_VALIDATION_MESASGE_TITLE);
            },                
        });
    }

    var updateScheduledMessageStatus = (scheduled_messages) => {
        let one_time_messages = [];
        let adherence_support_messages = [];

        scheduled_messages.forEach((scheduled_message) => {
            switch (scheduled_message.message.message_type_id) {
                case 1:
                    // Adherence reminder*
                    scheduled_message.message_schedule.message_status = 1;
                    adherence_support_messages.push(scheduled_message);

                    break;
                case 2:
                    // Study retention

                    if (scheduled_message.message.intent == 'Study Welcome') {
                        scheduled_message.study_subject.study_welcome_message = 1;
                        one_time_messages.push(scheduled_message.study_subject);                            
                    } else if (scheduled_message.message.intent == 'Study Completion') {
                        scheduled_message.study_subject.study_completion_message = 1;
                        one_time_messages.push(scheduled_message.study_subject);
                    }

                    break;                    
                default:
                    break;
            }  
        });

        updateStudySubjects(one_time_messages);
        updateMessageSchedules(adherence_support_messages);
    }

    var sendSMSViaModem = (sms_logs) => {
        let commport = $('#comm-port').val();
        let modem_uri = '/modem/send/';

        $d = $.Deferred();

        $.ajax({
            url: modem_uri,
            async:true,
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            data: JSON.stringify({commport: commport, sms_logs: sms_logs}),
            success: (result) => {
                console.log(result);
                $d.resolve(result);                
            },
            error: function (result) {
                validate.push(result.responseText);
                showValidationMessage(DEFAULT_VALIDATION_MESASGE_TITLE);
                $('#send-sms').hide();
                $('#check-modem').hide();
                $('#modem-status').hide();
                $d.reject(result);
            },
        });

        return $d.promise();

    };

    var sendSelectedMessages = (sms_logs, scheduled_messages) => {
        sendSMSViaModem(sms_logs).then((sent_sms_logs) => {
            let schedule_uri = '/sms_log/send';
console.log(sent_sms_logs);
            $.ajax({
                url: schedule_uri,
                async:true,
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                data: JSON.stringify({sms_logs: sent_sms_logs}),
                success: (data) => {
                    if (data.result == 'success') {
                        updateScheduledMessageStatus(scheduled_messages);                    
                    }
                },
                error: function (result) {
                    console.log(result);
                    validate.push(result.responseText);
                    showValidationMessage(DEFAULT_VALIDATION_MESASGE_TITLE);
                },                
            });
    
        });
    }

    $('#search-schedule').click(() => {
        let message_type_id = $('#message_type').val();
        let scheduled_date = $('#scheduled_date').val();

        showValidationMessage('');

        validate = []
        if (message_type_id == '') {
            validate.push('Missing message type');
        }

        if (scheduled_date == '') {
            validate.push('Missing date');
        }

        if (validate.length > 0) {
            showValidationMessage("Correct the following errors...");
        } else {
            searchScheduledMessages(message_type_id, scheduled_date);
        }
    });

    $('#save-participant').click(() => {
        let studySubjectId = $('#study_subject_id').val();
        let studyId = $('#study_id').val();
        let name = $('#subject_name').val();
        let gender = $('input[name=gender]:checked').val();
        let enrollmentDate = $('#enrollment_date').val();
        let phoneContact = $('#telephone_contact').val();
        let dob = $('#date_of_birth').val();
        let active = $('input[name=active]:checked').val();

        validate = [];

        if (studyId == '' || studyId == null) {
            validate.push('Missing studyId');
        }

        if (name == '') {
            validate.push('Missing name');
        }

        if (gender == undefined) {
            validate.push('Missing gender');
        }

        if (enrollmentDate == '') {
            validate.push('Missing enrollment date');
        }

        if (phoneContact == '') {
            validate.push('Missing telephone contact');
        }

        if (dob == '') {
            validate.push('Missing Date of birth');
        }

        if (active == undefined) {
            validate.push('Missing status');
        }

        if (validate.length > 0) {
            showValidationMessage("Correct the following errors...");
        } else {
            var participant = {
                "study_id": studyId,
                "subject_name": name,
                "gender": gender,
                "date_of_birth": dob,
                "enrollment_date": enrollmentDate,
                "active": active,
                "telephone_contact": phoneContact
              }
            if (studySubjectId == undefined) {
                saveParticipant(participant);
            } else {
                participant.study_subject_id = studySubjectId;
                editParticipant(participant);
            }
        }

    });

    $('#send-sms').click(() => {
        var selected_messages = $('#message-schedules input[type=checkbox]:checked');
        if (selected_messages.length == 0) {
            alert('Select at least 1 message to send');
            return;
        }

        if (confirm('Are you sure you want to send the selected message(s)')) {
            let sms_logs = [];
            let scheduled_messages = [];
            selected_messages.each((k, cb) => {
                let scheduled_message = scheduled_messages_to_send[$(cb).val()];
                let sms_log_en = {
                    study_subject_id: scheduled_message.study_subject.study_subject_id,
                    message_id:  scheduled_message.message.message_id,
                    sms_text: scheduled_message.message.text_en,
                    contact_sent_to:  scheduled_message.study_subject.telephone_contact
                };
                let sms_log_luo = {
                    study_subject_id: scheduled_message.study_subject.study_subject_id,
                    message_id:  scheduled_message.message.message_id,
                    sms_text: scheduled_message.message.text_luo,
                    contact_sent_to:  scheduled_message.study_subject.telephone_contact
                };
                scheduled_messages.push(scheduled_message);
                sms_logs.push(sms_log_en);
                sms_logs.push(sms_log_luo);
            });
            
            sendSelectedMessages(sms_logs, scheduled_messages);
        }        
    });

    $('#check-modem').click(() => {
        let commport = $('#comm-port').val();
        let modem_uri = '/modem/check_status/';

        $.ajax({
            url: modem_uri,
            async:true,
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            data: JSON.stringify({commport: commport}),
            success: (result) => {
                console.log(result);
                if (result.status == 'success') {
                    $('#modem-status').removeClass('badge-danger').addClass('badge-info').show().html("Connected");
                    $('#send-sms').attr('disabled', false);
                } else {
                    $('#modem-status').removeClass('badge-info').addClass('badge-danger').show().html("Disconnected");
                    $('#send-sms').attr('disabled', true);
                }
            },
            error: function (result) {
                validate.push(result.responseText);
                showValidationMessage(DEFAULT_VALIDATION_MESASGE_TITLE);
                $('#send-sms').hide();
                $('#check-modem').hide();
                $('#modem-status').hide();
            },
        });
    });

    var init = () => {
        $('#scheduled_date, #enrollment_date').val(moment(new Date()).format('YYYY-MM-DD'));
        let study_subjects_table = $('#study_subjects_table');
        if (study_subjects_table != undefined) {
            study_subjects_table.DataTable();
        }
        scheduled_messages_to_send = [];
        $('#send-sms').attr('disabled', true);
        showValidationMessage('');
    }

    init();

});

$(document).ajaxSend(function(){
    $('#spinner').fadeIn(250);
});
$(document).ajaxComplete(function(){
    $('#spinner').fadeOut(250);
});