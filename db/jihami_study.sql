/*
SQLyog Community v11.2 (64 bit)
MySQL - 5.6.45-log : Database - jihami_study
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
USE `jihami_study`;

/*Table structure for table `message` */

DROP TABLE IF EXISTS `message`;

CREATE TABLE `message` (
  `message_id` int(11) NOT NULL AUTO_INCREMENT,
  `text_en` varchar(160) DEFAULT NULL,
  `text_luo` varchar(160) DEFAULT NULL,
  `intent` varchar(15) DEFAULT NULL,
  `message_type_id` int(1) DEFAULT NULL COMMENT '1) Adherence Support Messages or 2) Study Retention',
  `date_created` date DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`message_id`),
  KEY `fk_message_user` (`created_by`),
  KEY `fk_message_message_type` (`message_type_id`),
  CONSTRAINT `fk_message_message_type` FOREIGN KEY (`message_type_id`) REFERENCES `message_type` (`message_type_id`),
  CONSTRAINT `fk_message_user` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `message` */

/*Table structure for table `message_rotation` */

DROP TABLE IF EXISTS `message_rotation`;

CREATE TABLE `message_rotation` (
  `message_rotation_id` int(11) NOT NULL AUTO_INCREMENT,
  `message_id` int(11) DEFAULT NULL,
  `week` int(1) DEFAULT NULL,
  `month` int(2) DEFAULT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`message_rotation_id`),
  KEY `fk_message_rotation_message` (`message_id`),
  KEY `fk_message_rotation_user` (`created_by`),
  CONSTRAINT `fk_message_rotation_message` FOREIGN KEY (`message_id`) REFERENCES `message` (`message_id`),
  CONSTRAINT `fk_message_rotation_user` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `message_rotation` */

/*Table structure for table `message_type` */

DROP TABLE IF EXISTS `message_type`;

CREATE TABLE `message_type` (
  `message_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `message_type` varchar(20) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`message_type_id`),
  KEY `fk_message_type_user` (`created_by`),
  CONSTRAINT `fk_message_type_user` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `message_type` */

/*Table structure for table `scheduled_message` */

DROP TABLE IF EXISTS `scheduled_message`;

CREATE TABLE `scheduled_message` (
  `scheduled_message_id` int(11) NOT NULL AUTO_INCREMENT,
  `message_id` int(11) DEFAULT NULL,
  `scheduled_date` date DEFAULT NULL,
  `date_created` date DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`scheduled_message_id`),
  KEY `fk_scheduled_message_message` (`message_id`),
  KEY `fk_scheduled_message_user` (`created_by`),
  CONSTRAINT `fk_scheduled_message_message` FOREIGN KEY (`message_id`) REFERENCES `message` (`message_id`),
  CONSTRAINT `fk_scheduled_message_user` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `scheduled_message` */

/*Table structure for table `sms_log` */

DROP TABLE IF EXISTS `sms_log`;

CREATE TABLE `sms_log` (
  `sms_log_id` int(11) NOT NULL AUTO_INCREMENT,
  `subject_id` int(11) DEFAULT NULL,
  `message_id` int(11) DEFAULT NULL,
  `sms_text` varchar(160) DEFAULT NULL,
  `contact_sent_to` varchar(10) DEFAULT NULL,
  `date_sent` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sent_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`sms_log_id`),
  KEY `fk_sms_log_subject` (`subject_id`),
  KEY `fk_sms_log_message` (`message_id`),
  KEY `fk_sms_log_user` (`sent_by`),
  CONSTRAINT `fk_sms_log_message` FOREIGN KEY (`message_id`) REFERENCES `message` (`message_id`),
  CONSTRAINT `fk_sms_log_subject` FOREIGN KEY (`subject_id`) REFERENCES `study_subject` (`subject_id`),
  CONSTRAINT `fk_sms_log_user` FOREIGN KEY (`sent_by`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `sms_log` */

/*Table structure for table `study_subject` */

DROP TABLE IF EXISTS `study_subject`;

CREATE TABLE `study_subject` (
  `subject_id` int(11) NOT NULL AUTO_INCREMENT,
  `subject_name` varchar(50) CHARACTER SET latin1 DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(1) CHARACTER SET latin1 DEFAULT NULL,
  `enrollment_date` date DEFAULT NULL,
  `telephone_contact` varchar(10) DEFAULT NULL,
  `alt_telephone_contact` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `study_welcome_message` tinyint(1) DEFAULT NULL COMMENT 'Records whether a subject has received the one time study welcome message',
  `study_completion_message` tinyint(1) DEFAULT NULL COMMENT 'Records whetehr a one time message has been sent following completion of stucy procedures',
  `date_created` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `study_subject` */

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(50) CHARACTER SET latin1 DEFAULT NULL,
  `user_name` varchar(15) CHARACTER SET latin1 DEFAULT NULL,
  `password` varchar(50) CHARACTER SET latin1 DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `fk_user_user` (`created_by`),
  CONSTRAINT `fk_user_user` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `user` */

/*Table structure for table `visit` */

DROP TABLE IF EXISTS `visit`;

CREATE TABLE `visit` (
  `visit_id` int(11) NOT NULL AUTO_INCREMENT,
  `subject_id` int(11) DEFAULT NULL,
  `visit_date` date DEFAULT NULL,
  `next_appointment_date` date DEFAULT NULL,
  `date_created` date DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`visit_id`),
  KEY `fk_visit_subject` (`subject_id`),
  KEY `fk_visit_user` (`created_by`),
  CONSTRAINT `fk_visit_subject` FOREIGN KEY (`subject_id`) REFERENCES `study_subject` (`subject_id`),
  CONSTRAINT `fk_visit_user` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `visit` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
