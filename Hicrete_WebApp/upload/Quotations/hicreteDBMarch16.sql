-- phpMyAdmin SQL Dump
-- version 4.0.10.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 16, 2016 at 10:57 AM
-- Server version: 5.5.45-cll-lve
-- PHP Version: 5.4.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `hicrete`
--

-- --------------------------------------------------------

--
-- Table structure for table `accesserequested`
--

CREATE TABLE IF NOT EXISTS `accesserequested` (
  `requestId` varchar(20) NOT NULL,
  `accessId` varchar(20) NOT NULL,
  PRIMARY KEY (`requestId`),
  KEY `requestId` (`requestId`),
  KEY `accessId` (`accessId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `accesspermission`
--

CREATE TABLE IF NOT EXISTS `accesspermission` (
  `accessId` varchar(20) NOT NULL,
  `ModuleName` varchar(30) NOT NULL,
  `accessType` varchar(6) NOT NULL,
  PRIMARY KEY (`accessId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `accesspermission`
--

INSERT INTO `accesspermission` (`accessId`, `ModuleName`, `accessType`) VALUES
('121', 'Inventory', 'Read'),
('123', 'Applicator', 'Read'),
('125', 'Expense', 'Read'),
('127', 'Payroll', 'Read'),
('129', 'Business Process', 'Read'),
('211', 'Inventory', 'Write'),
('224', 'Applicator', 'Write'),
('226', 'Expense', 'Write'),
('228', 'Payroll', 'Write'),
('230', 'Business Process', 'Write');

-- --------------------------------------------------------

--
-- Table structure for table `applicator_enrollment`
--

CREATE TABLE IF NOT EXISTS `applicator_enrollment` (
  `enrollment_id` int(11) NOT NULL AUTO_INCREMENT,
  `applicator_master_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `payment_package_id` int(11) NOT NULL,
  `payment_status` varchar(8) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  PRIMARY KEY (`enrollment_id`),
  UNIQUE KEY `applicator_master_id` (`applicator_master_id`),
  UNIQUE KEY `applicator_master_id_2` (`applicator_master_id`),
  KEY `applicator_master_id_3` (`applicator_master_id`),
  KEY `company_id` (`company_id`),
  KEY `payment_package_id` (`payment_package_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=49 ;

--
-- Dumping data for table `applicator_enrollment`
--

INSERT INTO `applicator_enrollment` (`enrollment_id`, `applicator_master_id`, `company_id`, `payment_package_id`, `payment_status`, `created_by`, `creation_date`) VALUES
(41, 44, 1, 16, 'Yes', '56e87cbeedde77493', '2016-03-15 21:10:40'),
(43, 46, 1, 16, 'No', '56e87cbeedde77493', '2016-03-15 22:22:47'),
(44, 47, 1, 16, 'Yes', '56e87cbeedde77493', '2016-03-15 22:26:21'),
(46, 49, 1, 16, 'Yes', '56e87cbeedde77493', '2016-03-15 22:41:07'),
(47, 50, 1, 16, 'No', '56e87cbeedde77493', '2016-03-15 22:43:53'),
(48, 51, 1, 17, 'No', '56e87cbeedde77493', '2016-03-15 22:46:25');

-- --------------------------------------------------------

--
-- Table structure for table `applicator_follow_up`
--

CREATE TABLE IF NOT EXISTS `applicator_follow_up` (
  `follow_up_id` int(11) NOT NULL AUTO_INCREMENT,
  `date_of_follow_up` datetime NOT NULL,
  `last_modification_date` datetime NOT NULL,
  `last_modified_by` varchar(30) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  `enrollment_id` int(11) NOT NULL,
  PRIMARY KEY (`follow_up_id`),
  KEY `enrollment_id` (`enrollment_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=43 ;

--
-- Dumping data for table `applicator_follow_up`
--

INSERT INTO `applicator_follow_up` (`follow_up_id`, `date_of_follow_up`, `last_modification_date`, `last_modified_by`, `created_by`, `creation_date`, `enrollment_id`) VALUES
(40, '2016-03-17 00:00:00', '2016-03-15 22:22:47', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 22:22:47', 43),
(41, '2016-05-15 00:00:00', '2016-03-15 22:43:53', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 22:43:53', 47),
(42, '2016-04-15 00:00:00', '2016-03-15 22:46:25', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 22:46:25', 48);

-- --------------------------------------------------------

--
-- Table structure for table `applicator_master`
--

CREATE TABLE IF NOT EXISTS `applicator_master` (
  `applicator_master_id` int(11) NOT NULL AUTO_INCREMENT,
  `applicator_name` varchar(50) NOT NULL,
  `applicator_contact` varchar(15) NOT NULL,
  `applicator_address_line1` varchar(50) NOT NULL,
  `applicator_address_line2` varchar(50) NOT NULL,
  `applicator_city` varchar(30) NOT NULL,
  `applicator_state` varchar(30) NOT NULL,
  `applicator_country` varchar(30) NOT NULL,
  `applicator_vat_number` varchar(20) NOT NULL,
  `applicator_cst_number` varchar(20) NOT NULL,
  `applicator_stax_number` varchar(20) NOT NULL,
  `applicator_pan_number` varchar(20) NOT NULL,
  `applicator_status` varchar(10) NOT NULL DEFAULT 'tentative',
  `last_modification_date` datetime NOT NULL,
  `last_modified_by` varchar(30) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  PRIMARY KEY (`applicator_master_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=52 ;

--
-- Dumping data for table `applicator_master`
--

INSERT INTO `applicator_master` (`applicator_master_id`, `applicator_name`, `applicator_contact`, `applicator_address_line1`, `applicator_address_line2`, `applicator_city`, `applicator_state`, `applicator_country`, `applicator_vat_number`, `applicator_cst_number`, `applicator_stax_number`, `applicator_pan_number`, `applicator_status`, `last_modification_date`, `last_modified_by`, `created_by`, `creation_date`) VALUES
(44, 'Namdev Demo', '9090909090', 'Pune', '12345', 'Mumbai', 'Maharashtra', 'South Africa', '12345678901V', '12345678901C', 'ABCDE1234ABC123', 'ABCDE1234A', 'permanent', '2016-03-15 21:10:40', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 21:10:40'),
(46, 'Namdev', '1234567890', 'Demo', 'Demo', 'Pune', 'Delhi', 'India', '12345678910V', '1234567890C', 'ABCDE1234ASC123', 'ABCDE1234A', 'tentative', '2016-03-15 22:22:47', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 22:22:47'),
(47, 'Demo', '1234567890', 'Dmo', 'Demo', 'Pune', 'Maharashtra', 'America', '12345678900V', '12345678900C', 'ABCDE1234ACD123', 'ABCDE1234A', 'permanent', '2016-03-15 22:26:21', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 22:26:21'),
(49, 'Namdev NEw Demo', '1234567890', 'Pandharpur', '413304', 'Pune', 'Delhi', 'India', '12345678900V', '12345678900C', 'ASBCD1234ASC123', 'ASCDE1234A', 'permanent', '2016-03-15 22:41:07', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 22:41:07'),
(50, 'Ajit Demo', '1234567890', 'Pandharpur', '12345', 'Pune', 'Delhi', 'India', '12345678900V', '12345678900C', 'ASCDE1234ASC123', 'ASDEC1234A', 'tentative', '2016-03-15 22:43:53', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 22:43:53'),
(51, 'Demo', '1234567890', 'Demo', 'Pune', 'Pune', 'Delhi', 'India', '12345678900V', '12345678900C', 'ABCDE1234ASE', 'ASSED1234A', 'tentative', '2016-03-15 22:46:25', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 22:46:25');

-- --------------------------------------------------------

--
-- Table structure for table `applicator_payment_follow_up_info`
--

CREATE TABLE IF NOT EXISTS `applicator_payment_follow_up_info` (
  `follow_up_info_id` int(11) NOT NULL AUTO_INCREMENT,
  `remark` varchar(30) NOT NULL,
  `status` varchar(15) NOT NULL,
  `last_modification_date` datetime NOT NULL,
  `last_modified_by` varchar(30) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  `follow_up_id` int(11) NOT NULL,
  PRIMARY KEY (`follow_up_info_id`),
  KEY `follow_up_id` (`follow_up_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `applicator_payment_info`
--

CREATE TABLE IF NOT EXISTS `applicator_payment_info` (
  `payment_id` int(11) NOT NULL AUTO_INCREMENT,
  `enrollment_id` int(11) NOT NULL,
  `amount_paid` varchar(15) NOT NULL,
  `date_of_payment` datetime NOT NULL,
  `paid_to` varchar(30) NOT NULL,
  `payment_mode` varchar(30) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `enrollment_id` (`enrollment_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=67 ;

--
-- Dumping data for table `applicator_payment_info`
--

INSERT INTO `applicator_payment_info` (`payment_id`, `enrollment_id`, `amount_paid`, `date_of_payment`, `paid_to`, `payment_mode`, `created_by`, `creation_date`) VALUES
(60, 41, '1100', '2016-03-17 00:00:00', 'Namdev', 'cash', '56e87cbeedde77493', '2016-03-15 21:10:40'),
(62, 44, '1100', '2016-03-16 00:00:00', 'Namdev', 'cash', '56e87cbeedde77493', '2016-03-15 22:26:21'),
(64, 46, '1100', '2016-03-24 00:00:00', 'Namdev', 'cheque', '56e87cbeedde77493', '2016-03-15 22:41:07'),
(65, 47, '110', '2016-03-16 00:00:00', 'Namdev', 'cheque', '56e87cbeedde77493', '2016-03-15 22:43:53'),
(66, 48, '100', '2016-03-24 00:00:00', 'Namdev', 'cash', '56e87cbeedde77493', '2016-03-15 22:46:25');

-- --------------------------------------------------------

--
-- Table structure for table `applicator_pointof_contact`
--

CREATE TABLE IF NOT EXISTS `applicator_pointof_contact` (
  `point_of_contact_id` int(11) NOT NULL AUTO_INCREMENT,
  `point_of_contact` varchar(30) NOT NULL,
  `point_of_contact_no` varchar(15) NOT NULL,
  `last_modification_date` datetime NOT NULL,
  `last_modified_by` varchar(30) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  `applicator_master_id` int(11) NOT NULL,
  PRIMARY KEY (`point_of_contact_id`),
  KEY `applicator_master_id` (`applicator_master_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=49 ;

--
-- Dumping data for table `applicator_pointof_contact`
--

INSERT INTO `applicator_pointof_contact` (`point_of_contact_id`, `point_of_contact`, `point_of_contact_no`, `last_modification_date`, `last_modified_by`, `created_by`, `creation_date`, `applicator_master_id`) VALUES
(41, 'Namdev Devmare', '1234567890', '2016-03-15 21:10:40', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 21:10:40', 44),
(43, 'Ajit Zagade', '1234567890', '2016-03-15 22:22:47', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 22:22:47', 46),
(44, 'Ajit Zagade', '1234567890', '2016-03-15 22:26:21', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 22:26:21', 47),
(46, 'Ajit Zagade', '1234567890', '2016-03-15 22:41:07', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 22:41:07', 49),
(47, 'Ajit Zagde', '1234567890', '2016-03-15 22:43:53', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 22:43:53', 50),
(48, 'Namdev Devmare', '2345678900', '2016-03-15 22:46:25', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 22:46:25', 51);

-- --------------------------------------------------------

--
-- Table structure for table `approved_expense_bills`
--

CREATE TABLE IF NOT EXISTS `approved_expense_bills` (
  `billid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `expensedetailsid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `billno` varchar(20) CHARACTER SET utf8 NOT NULL,
  `billissueingentity` varchar(50) CHARACTER SET utf8 NOT NULL,
  `amount` int(30) NOT NULL,
  `dateofbill` datetime NOT NULL,
  `approvedby` varchar(20) CHARACTER SET utf8 NOT NULL,
  `approveddate` date NOT NULL,
  `createdby` varchar(20) CHARACTER SET utf8 NOT NULL,
  `creationdate` datetime NOT NULL,
  `lastmodificationdate` datetime NOT NULL,
  `lastmodifiedby` varchar(20) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`billid`),
  KEY `expensedetailsid` (`expensedetailsid`),
  KEY `expensedetailsid_2` (`expensedetailsid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `attendance_year`
--

CREATE TABLE IF NOT EXISTS `attendance_year` (
  `caption_of_year` varchar(30) NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `no_of_paid_leaves` int(11) NOT NULL,
  `weekly_off_day` varchar(20) NOT NULL,
  `created_by` varchar(20) NOT NULL,
  `creation_date` datetime NOT NULL,
  PRIMARY KEY (`caption_of_year`),
  KEY `created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `attendance_year`
--

INSERT INTO `attendance_year` (`caption_of_year`, `from_date`, `to_date`, `no_of_paid_leaves`, `weekly_off_day`, `created_by`, `creation_date`) VALUES
('2016', '2016-03-16', '2016-03-31', 10, 'null', '56e87cbeedde77493', '2016-03-16 01:27:18');

-- --------------------------------------------------------

--
-- Table structure for table `budgetdetail`
--

CREATE TABLE IF NOT EXISTS `budgetdetail` (
  `budgetId` varchar(20) NOT NULL,
  `costCenterId` varchar(20) NOT NULL,
  `BudgetSegId` varchar(20) NOT NULL,
  `AllocatedBudget` int(20) NOT NULL,
  `AlertLevel` float NOT NULL,
  `CreatedBy` varchar(40) NOT NULL,
  `CreationDate` datetime NOT NULL,
  `LastModificationDate` datetime NOT NULL,
  `lastModifiedBy` varchar(40) NOT NULL,
  PRIMARY KEY (`budgetId`),
  KEY `costCenterId` (`costCenterId`),
  KEY `BudgetSegId` (`BudgetSegId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `budgetsegment`
--

CREATE TABLE IF NOT EXISTS `budgetsegment` (
  `BudgetSegmentId` varchar(20) NOT NULL,
  `SegmentName` varchar(50) NOT NULL,
  `CreatedBy` varchar(40) NOT NULL,
  `CreationDate` datetime NOT NULL,
  `LastModificationDate` datetime NOT NULL,
  `lastModifiedBy` varchar(40) NOT NULL,
  PRIMARY KEY (`BudgetSegmentId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `budget_details`
--

CREATE TABLE IF NOT EXISTS `budget_details` (
  `budgetdetailsid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `costcenterid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `budgetsegmentid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `allocatedbudget` int(20) NOT NULL,
  `alertlevel` int(20) NOT NULL,
  `createdby` varchar(20) CHARACTER SET utf8 NOT NULL,
  `creationdate` datetime NOT NULL,
  `lastmodificationdate` datetime NOT NULL,
  `lastmodifiedby` varchar(20) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`budgetdetailsid`),
  KEY `costcenterid` (`costcenterid`),
  KEY `costcenterid_2` (`costcenterid`),
  KEY `budgetsegmentid` (`budgetsegmentid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `budget_segment`
--

CREATE TABLE IF NOT EXISTS `budget_segment` (
  `budgetsegmentid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `segmentname` varchar(50) CHARACTER SET utf8 NOT NULL,
  `createdby` varchar(20) CHARACTER SET utf8 NOT NULL,
  `creationdate` datetime NOT NULL,
  `lastmodifieddate` datetime NOT NULL,
  `lastmodifiedby` varchar(20) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`budgetsegmentid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `companymaster`
--

CREATE TABLE IF NOT EXISTS `companymaster` (
  `companyId` varchar(20) NOT NULL,
  `companyName` varchar(50) NOT NULL,
  `companyAbbrevation` varchar(10) NOT NULL,
  `startDate` date NOT NULL,
  `address` varchar(80) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `pincode` varchar(15) NOT NULL,
  `emailId` varchar(50) NOT NULL,
  `phoneNumber` varchar(15) NOT NULL,
  `createdBy` varchar(20) NOT NULL,
  `creationDate` datetime NOT NULL,
  `lastModifiedBy` varchar(20) NOT NULL,
  `lastModificationDate` datetime NOT NULL,
  PRIMARY KEY (`companyId`),
  KEY `createdBy` (`createdBy`),
  KEY `lastModifiedBy` (`lastModifiedBy`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `companymaster`
--

INSERT INTO `companymaster` (`companyId`, `companyName`, `companyAbbrevation`, `startDate`, `address`, `city`, `state`, `country`, `pincode`, `emailId`, `phoneNumber`, `createdBy`, `creationDate`, `lastModifiedBy`, `lastModificationDate`) VALUES
('56e936e77f6923970', 'asdasd', 'sdasd', '2016-03-08', 'asdsdaasdasds sad asd', 'Pune', 'Maharashtra', 'asd', '4355435345', 'as@as.com', '3243423423', '56e87cbeedde77493', '2016-03-16 03:35:19', '56e87cbeedde77493', '2016-03-16 09:42:17'),
('56e986ebab62a8523', 'HiTech', 'asd', '2016-03-15', 'aasdasdasdasdasd', 'Pune', 'Maharashtra', 'India', '411234', 'abc@mail.com', '1234567890', '56e87cbeedde77493', '2016-03-16 09:16:43', '56e87cbeedde77493', '2016-03-16 09:16:43');

-- --------------------------------------------------------

--
-- Table structure for table `costcentermaster`
--

CREATE TABLE IF NOT EXISTS `costcentermaster` (
  `CostCenterId` varchar(20) NOT NULL,
  `ProjectId` varchar(20) NOT NULL,
  `CostCenterName` varchar(30) NOT NULL,
  `CreatedBy` varchar(40) NOT NULL,
  `CreationDate` datetime NOT NULL,
  `LastModificationDate` datetime NOT NULL,
  `lastModifiedBy` varchar(40) NOT NULL,
  PRIMARY KEY (`CostCenterId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `cost_center_master`
--

CREATE TABLE IF NOT EXISTS `cost_center_master` (
  `costcenterid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `projectid` varchar(20) NOT NULL,
  `createdby` varchar(20) NOT NULL,
  `creationdate` datetime NOT NULL,
  `lastmodifieddate` datetime NOT NULL,
  `lastmodifiedby` varchar(20) NOT NULL,
  PRIMARY KEY (`costcenterid`),
  KEY `costcenterid` (`costcenterid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `employee_on_payroll`
--

CREATE TABLE IF NOT EXISTS `employee_on_payroll` (
  `employee_id` varchar(30) NOT NULL,
  `leave_approver_id` varchar(30) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  `last_modified_by` varchar(30) NOT NULL,
  `last_modification_date` datetime NOT NULL,
  PRIMARY KEY (`employee_id`),
  KEY `created_by` (`created_by`,`last_modified_by`),
  KEY `employee_id` (`employee_id`),
  KEY `last_modified_by` (`last_modified_by`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `expense_approval_mapping`
--

CREATE TABLE IF NOT EXISTS `expense_approval_mapping` (
  `costcenterid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `employeeid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `createdby` varchar(20) CHARACTER SET utf8 NOT NULL,
  `creationdate` datetime NOT NULL,
  `lastmodifieddate` datetime NOT NULL,
  `lastmodifiedby` varchar(20) CHARACTER SET utf8 NOT NULL,
  KEY `costcenterid` (`costcenterid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `expense_details`
--

CREATE TABLE IF NOT EXISTS `expense_details` (
  `expensedetailsid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `costcenterid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `budgetsegmentid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `amount` int(20) NOT NULL,
  `description` text CHARACTER SET utf8 NOT NULL,
  `creadtedby` varchar(20) CHARACTER SET utf8 NOT NULL,
  `creationdate` datetime NOT NULL,
  `lastmodificationdate` datetime NOT NULL,
  `lastmodifiedby` varchar(20) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`expensedetailsid`),
  KEY `costcenterid` (`costcenterid`),
  KEY `costcenterid_2` (`costcenterid`),
  KEY `costcenterid_3` (`costcenterid`),
  KEY `costcenterid_4` (`costcenterid`),
  KEY `costcenterid_5` (`costcenterid`),
  KEY `budgetsegmentid` (`budgetsegmentid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `follow_up_employee`
--

CREATE TABLE IF NOT EXISTS `follow_up_employee` (
  `follow_up_employee_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `date_of_assignment` datetime NOT NULL,
  `last_modification_date` datetime NOT NULL,
  `last_modified_by` varchar(30) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  `follow_up_id` int(11) NOT NULL,
  PRIMARY KEY (`follow_up_employee_id`),
  KEY `follow_up_id` (`follow_up_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=42 ;

--
-- Dumping data for table `follow_up_employee`
--

INSERT INTO `follow_up_employee` (`follow_up_employee_id`, `employee_id`, `date_of_assignment`, `last_modification_date`, `last_modified_by`, `created_by`, `creation_date`, `follow_up_id`) VALUES
(39, 54321, '2016-03-15 22:22:47', '2016-03-15 22:22:47', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 22:22:47', 40),
(40, 111, '2016-03-15 22:43:53', '2016-03-15 22:43:53', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 22:43:53', 41),
(41, 111, '2016-03-15 22:46:25', '2016-03-15 22:46:25', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-15 22:46:25', 42);

-- --------------------------------------------------------

--
-- Table structure for table `holiday_in_year`
--

CREATE TABLE IF NOT EXISTS `holiday_in_year` (
  `caption_of_year` varchar(30) NOT NULL,
  `holiday_date` date NOT NULL,
  `description` varchar(100) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  KEY `caption_of_year` (`caption_of_year`,`created_by`),
  KEY `created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `inhouse_inward_entry`
--

CREATE TABLE IF NOT EXISTS `inhouse_inward_entry` (
  `inhouseinwardid` bigint(20) NOT NULL AUTO_INCREMENT,
  `productionbatchmasterid` bigint(20) NOT NULL,
  `producedgoodid` bigint(20) NOT NULL,
  `warehouseid` bigint(20) NOT NULL,
  `companyid` varchar(20) NOT NULL,
  `dateofentry` date NOT NULL,
  `supervisorid` varchar(20) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` date NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` date NOT NULL,
  PRIMARY KEY (`inhouseinwardid`),
  KEY `producedgoodid` (`producedgoodid`),
  KEY `warehouseid` (`warehouseid`),
  KEY `companyid` (`companyid`),
  KEY `productionbatchmasterid` (`productionbatchmasterid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `inhouse_inward_entry`
--

INSERT INTO `inhouse_inward_entry` (`inhouseinwardid`, `productionbatchmasterid`, `producedgoodid`, `warehouseid`, `companyid`, `dateofentry`, `supervisorid`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(4, 7, 5, 9223372036854775807, '56e936e77f6923970', '2016-03-15', 'asdasd', '56e87cbeedde77493', '2016-03-16', '56e87cbeedde77493', '2016-03-16'),
(5, 8, 6, 9223372036854775807, '56e936e77f6923970', '2016-03-15', 'asd', '56e87cbeedde77493', '2016-03-16', '56e87cbeedde77493', '2016-03-16');

-- --------------------------------------------------------

--
-- Table structure for table `inhouse_transportation_details`
--

CREATE TABLE IF NOT EXISTS `inhouse_transportation_details` (
  `inhousetransportid` bigint(20) NOT NULL AUTO_INCREMENT,
  `inhouseinwardid` bigint(20) NOT NULL,
  `transportationmode` varchar(25) NOT NULL,
  `vehicleno` varchar(15) NOT NULL,
  `drivername` varchar(40) NOT NULL,
  `transportagency` varchar(40) NOT NULL,
  `cost` int(11) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` date NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` date NOT NULL,
  PRIMARY KEY (`inhousetransportid`),
  KEY `inhouseinwardid` (`inhouseinwardid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `inhouse_transportation_details`
--

INSERT INTO `inhouse_transportation_details` (`inhousetransportid`, `inhouseinwardid`, `transportationmode`, `vehicleno`, `drivername`, `transportagency`, `cost`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(4, 4, 'asd', 'asd', 'asd', 'asd', 100, '56e87cbeedde77493', '2016-03-16', '56e87cbeedde77493', '2016-03-16'),
(5, 5, 'asd', 'asd', 'asd', 'asd', 100, '56e87cbeedde77493', '2016-03-16', '56e87cbeedde77493', '2016-03-16');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE IF NOT EXISTS `inventory` (
  `inventoryid` bigint(20) NOT NULL AUTO_INCREMENT,
  `materialid` bigint(20) NOT NULL,
  `warehouseid` varchar(20) DEFAULT 'NONE',
  `companyid` varchar(20) DEFAULT NULL,
  `totalquantity` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`inventoryid`),
  KEY `materialid` (`materialid`),
  KEY `warehouseid` (`warehouseid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=21 ;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`inventoryid`, `materialid`, `warehouseid`, `companyid`, `totalquantity`) VALUES
(20, 111, '56e936e77f6923970', '56e93828d69ff1893', 199);

-- --------------------------------------------------------

--
-- Table structure for table `inward`
--

CREATE TABLE IF NOT EXISTS `inward` (
  `inwardid` bigint(20) NOT NULL AUTO_INCREMENT,
  `warehouseid` varchar(20) NOT NULL,
  `companyid` varchar(20) NOT NULL,
  `supervisorid` varchar(20) NOT NULL,
  `dateofentry` datetime NOT NULL,
  `inwardno` varchar(20) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL,
  PRIMARY KEY (`inwardid`),
  KEY `warehouseid` (`warehouseid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=125 ;

--
-- Dumping data for table `inward`
--

INSERT INTO `inward` (`inwardid`, `warehouseid`, `companyid`, `supervisorid`, `dateofentry`, `inwardno`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(124, '56e93828d69ff1893', '56e936e77f6923970', 'sdfasd', '2016-03-16 00:00:00', 'inward1001', '56e939423098c2739', '2016-03-16 03:58:24', '56e939423098c2739', '2016-03-16 03:58:24');

-- --------------------------------------------------------

--
-- Table structure for table `inward_details`
--

CREATE TABLE IF NOT EXISTS `inward_details` (
  `inwarddetailsid` bigint(20) NOT NULL AUTO_INCREMENT,
  `inwardid` bigint(20) NOT NULL,
  `materialid` bigint(20) NOT NULL,
  `supplierid` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `packagedunits` text NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL,
  PRIMARY KEY (`inwarddetailsid`),
  KEY `inwardid` (`inwardid`),
  KEY `materialid` (`materialid`),
  KEY `supplierid` (`supplierid`),
  KEY `inwarddetailsid` (`inwarddetailsid`),
  KEY `inwarddetailsid_2` (`inwarddetailsid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=103 ;

--
-- Dumping data for table `inward_details`
--

INSERT INTO `inward_details` (`inwarddetailsid`, `inwardid`, `materialid`, `supplierid`, `quantity`, `packagedunits`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(102, 124, 111, 16, 321, 'sdf', '56e939423098c2739', '2016-03-16 03:58:24', '56e939423098c2739', '2016-03-16 03:58:24');

-- --------------------------------------------------------

--
-- Table structure for table `inward_transportation_details`
--

CREATE TABLE IF NOT EXISTS `inward_transportation_details` (
  `inwardtranspid` bigint(20) NOT NULL AUTO_INCREMENT,
  `inwardid` bigint(20) NOT NULL,
  `transportationmode` varchar(25) NOT NULL,
  `vehicleno` varchar(15) NOT NULL,
  `drivername` varchar(40) NOT NULL,
  `transportagency` varchar(40) NOT NULL,
  `cost` int(11) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL,
  `remark` varchar(50) NOT NULL,
  `	inwarddetailsid` bigint(20) NOT NULL,
  PRIMARY KEY (`inwardtranspid`),
  KEY `inwardid` (`inwardid`),
  KEY `	inwarddetailsid` (`	inwarddetailsid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `inward_transportation_details`
--

INSERT INTO `inward_transportation_details` (`inwardtranspid`, `inwardid`, `transportationmode`, `vehicleno`, `drivername`, `transportagency`, `cost`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`, `remark`, `	inwarddetailsid`) VALUES
(14, 124, '2', 'asd324', 'sadsad', '234asd', 324, '56e939423098c2739', '2016-03-16 03:58:24', '56e939423098c2739', '2016-03-16 03:58:24', 'sdasd', 0);

-- --------------------------------------------------------

--
-- Table structure for table `leave_application_master`
--

CREATE TABLE IF NOT EXISTS `leave_application_master` (
  `application_id` varchar(30) NOT NULL,
  `leave_applied_by` varchar(30) NOT NULL,
  `from_date` date NOT NULL,
  `to_date` text NOT NULL,
  `type_of_leaves` varchar(20) NOT NULL,
  `no_of_leaves` int(11) NOT NULL,
  `reason` varchar(100) NOT NULL,
  `status` varchar(15) NOT NULL,
  `application_date` date NOT NULL,
  `action_by` varchar(30) NOT NULL,
  `action_date` datetime NOT NULL,
  KEY `leave_applied_by` (`leave_applied_by`,`action_by`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `logindetails`
--

CREATE TABLE IF NOT EXISTS `logindetails` (
  `userId` varchar(20) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `password` varchar(60) NOT NULL,
  `lastLoginDate` datetime NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `logindetails`
--

INSERT INTO `logindetails` (`userId`, `userName`, `password`, `lastLoginDate`) VALUES
('568aa06f48c053329', 'atul@mail.com', 'aad0b296949328e55b57fdd01fb45e09bf11be80', '2016-01-07 00:14:42'),
('568bf524ab16f2627', 'super@mail.com', 'a9993e364706816aba3e25717850c26c9cd0d89d', '2016-03-16 01:14:42'),
('56bb73a5919161097', 'ads@asd.casd', '41304740adf29396b0974b1fe0e6ece6ba95fb40', '0000-00-00 00:00:00'),
('56bb73ed4e7449147', 'ads@asd.casd', '7879899022ecf71686f4b6646a93a6a3dcc701da', '0000-00-00 00:00:00'),
('56bb7f2c509229316', 'asd@bhn.cbb', 'a1f8dee456913355f2a2a05bbccc7bd6dba8e2ce', '0000-00-00 00:00:00'),
('56bc8d33af8b38799', 'as@gmail.com', '595e8b27278516e6b958a7c61c0c9eaa141e80d3', '0000-00-00 00:00:00'),
('56e510536cc7a5508', 'ajit@inci.com', '7691015840e8cacfbaa4c1e3060aff25c360b717', '2016-03-14 20:43:51'),
('56e8638ecb35c7637', 'super1@mail.com', '75f5b29f3e94a6219a7ad0fab8729194fdb91733', '2016-03-16 01:09:13'),
('56e86524b25c48082', 'super2@mail.com', 'eaec0abbfd45ac23e53d57760500b47105d5f35f', '2016-03-16 01:23:29'),
('56e87cbeedde77493', 'super@mail.com', '14ab51550e69f513a5355e61b8d9330fd6ee37c6', '2016-03-16 09:18:50'),
('56e939423098c2739', 'ajit@incizon.com', '2f6fcba4f8cc8380cd9281ca7be0ccbcb2f9274b', '2016-03-16 03:48:59'),
('56e97c3597d997548', 'try@mail.com', 'ccbbab1b2ecc998c5d321a540060ac7deeb2aacd', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `material`
--

CREATE TABLE IF NOT EXISTS `material` (
  `materialid` bigint(20) NOT NULL AUTO_INCREMENT,
  `productmasterid` bigint(20) NOT NULL,
  `productdetailsid` bigint(20) NOT NULL,
  `productpackagingid` bigint(20) NOT NULL,
  `abbrevation` varchar(25) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL,
  PRIMARY KEY (`materialid`),
  KEY `productmasterid` (`productmasterid`),
  KEY `productdetailsid` (`productdetailsid`),
  KEY `productpackagingid` (`productpackagingid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=112 ;

--
-- Dumping data for table `material`
--

INSERT INTO `material` (`materialid`, `productmasterid`, `productdetailsid`, `productpackagingid`, `abbrevation`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(111, 129, 120, 129, 'product', '56e87cbeedde77493', '2016-03-15 23:53:23', '56e87cbeedde77493', '2016-03-15 23:53:23');

-- --------------------------------------------------------

--
-- Table structure for table `materialtype`
--

CREATE TABLE IF NOT EXISTS `materialtype` (
  `materialtypeid` bigint(20) NOT NULL AUTO_INCREMENT,
  `materialtype` varchar(30) NOT NULL,
  `delflg` varchar(1) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL,
  PRIMARY KEY (`materialtypeid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=42 ;

--
-- Dumping data for table `materialtype`
--

INSERT INTO `materialtype` (`materialtypeid`, `materialtype`, `delflg`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(41, 'addMaterial', 'N', 'Pranav', '2016-03-15 23:03:22', 'Pranav', '2016-03-15 23:03:22');

-- --------------------------------------------------------

--
-- Table structure for table `material_expense_bills`
--

CREATE TABLE IF NOT EXISTS `material_expense_bills` (
  `billid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `materialexpensedetailsid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `billno` varchar(30) CHARACTER SET utf8 NOT NULL,
  `billissueingentity` varchar(50) CHARACTER SET utf8 NOT NULL,
  `amount` int(20) NOT NULL,
  `dateofbill` date NOT NULL,
  `createdby` varchar(20) CHARACTER SET utf8 NOT NULL,
  `creationdate` datetime NOT NULL,
  `lastmodificationdate` datetime NOT NULL,
  `lastmodifiedby` varchar(20) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `material_expense_details`
--

CREATE TABLE IF NOT EXISTS `material_expense_details` (
  `materialexpensedetailsid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `costcenterid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `budgetsegmentid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `materialid` bigint(20) NOT NULL,
  `amount` int(20) NOT NULL,
  `description` text CHARACTER SET utf8 NOT NULL,
  `createdby` varchar(20) CHARACTER SET utf8 NOT NULL,
  `creationdate` datetime NOT NULL,
  `lastmodificationdate` datetime NOT NULL,
  `lastmodifiedby` varchar(20) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `material_segment`
--

CREATE TABLE IF NOT EXISTS `material_segment` (
  `materialsegmentid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `segmentname` varchar(50) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `outward`
--

CREATE TABLE IF NOT EXISTS `outward` (
  `outwardid` bigint(20) NOT NULL AUTO_INCREMENT,
  `warehouseid` varchar(20) NOT NULL,
  `companyid` varchar(20) NOT NULL,
  `supervisorid` varchar(20) NOT NULL,
  `dateofentry` datetime NOT NULL,
  `outwardno` varchar(50) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL,
  PRIMARY KEY (`outwardid`),
  KEY `warehouseid` (`warehouseid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=26 ;

-- --------------------------------------------------------

--
-- Table structure for table `outward_details`
--

CREATE TABLE IF NOT EXISTS `outward_details` (
  `outwarddtlsid` bigint(20) NOT NULL AUTO_INCREMENT,
  `outwardid` bigint(20) NOT NULL,
  `materialid` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `packagedunits` text NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL,
  PRIMARY KEY (`outwarddtlsid`),
  KEY `outwardid` (`outwardid`),
  KEY `materialid` (`materialid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=29 ;

-- --------------------------------------------------------

--
-- Table structure for table `outward_transportation_details`
--

CREATE TABLE IF NOT EXISTS `outward_transportation_details` (
  `outwardtranspid` bigint(20) NOT NULL AUTO_INCREMENT,
  `outwardid` bigint(20) NOT NULL,
  `transportationmode` varchar(25) NOT NULL,
  `vehicleno` varchar(15) NOT NULL,
  `drivername` varchar(40) NOT NULL,
  `transportagency` varchar(40) NOT NULL,
  `cost` int(11) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL,
  `remark` varchar(100) NOT NULL,
  PRIMARY KEY (`outwardtranspid`),
  KEY `outwardid` (`outwardid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

-- --------------------------------------------------------

--
-- Table structure for table `payment_mode_details`
--

CREATE TABLE IF NOT EXISTS `payment_mode_details` (
  `payment_mode_id` int(11) NOT NULL AUTO_INCREMENT,
  `instrument_of_payment` varchar(30) NOT NULL,
  `number_of_instrument` varchar(30) NOT NULL,
  `bank_name` varchar(30) NOT NULL,
  `branch_name` varchar(30) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  `payment_id` int(11) NOT NULL,
  PRIMARY KEY (`payment_mode_id`),
  KEY `payment_id` (`payment_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `payment_mode_details`
--

INSERT INTO `payment_mode_details` (`payment_mode_id`, `instrument_of_payment`, `number_of_instrument`, `bank_name`, `branch_name`, `created_by`, `creation_date`, `payment_id`) VALUES
(11, 'cheque', '12345678', 'CBI', 'Vadgaon', '56e87cbeedde77493', '2016-03-15 22:41:07', 64),
(12, 'cheque', '1221', 'CBI', 'Pune', '56e87cbeedde77493', '2016-03-15 22:43:53', 65);

-- --------------------------------------------------------

--
-- Table structure for table `payment_package_details`
--

CREATE TABLE IF NOT EXISTS `payment_package_details` (
  `package_details_id` int(11) NOT NULL AUTO_INCREMENT,
  `package_element_name` varchar(30) NOT NULL,
  `package_element_quantity` varchar(15) NOT NULL,
  `package_element_rate` varchar(15) NOT NULL,
  `package_element_amount` varchar(15) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  `payment_package_id` int(11) NOT NULL,
  PRIMARY KEY (`package_details_id`),
  KEY `payment_package_id` (`payment_package_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=57 ;

--
-- Dumping data for table `payment_package_details`
--

INSERT INTO `payment_package_details` (`package_details_id`, `package_element_name`, `package_element_quantity`, `package_element_rate`, `package_element_amount`, `created_by`, `creation_date`, `payment_package_id`) VALUES
(51, 'demo1', '10', '10', '100', '56e87cbeedde77493', '2016-03-15 20:56:24', 16),
(52, 'demo2', '100', '10', '1000', '56e87cbeedde77493', '2016-03-15 20:56:24', 16),
(53, 'demo1', '10', '10', '100', '56e87cbeedde77493', '2016-03-15 22:46:25', 17),
(54, 'demo2', '100', '10', '1000', '56e87cbeedde77493', '2016-03-15 22:46:25', 17),
(55, 'demo3', '100', '10', '1000', '56e87cbeedde77493', '2016-03-15 22:46:25', 17),
(56, 'demo4', '10', '10', '100', '56e87cbeedde77493', '2016-03-15 22:46:25', 17);

-- --------------------------------------------------------

--
-- Table structure for table `payment_package_master`
--

CREATE TABLE IF NOT EXISTS `payment_package_master` (
  `payment_package_id` int(11) NOT NULL AUTO_INCREMENT,
  `package_name` varchar(50) NOT NULL,
  `package_description` varchar(200) NOT NULL,
  `package_dateof_creation` datetime NOT NULL,
  `package_customized` varchar(5) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  PRIMARY KEY (`payment_package_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

--
-- Dumping data for table `payment_package_master`
--

INSERT INTO `payment_package_master` (`payment_package_id`, `package_name`, `package_description`, `package_dateof_creation`, `package_customized`, `created_by`, `creation_date`) VALUES
(16, 'Demo Package', 'Test Demo Package created', '2016-03-15 20:56:24', 'false', '56e87cbeedde77493', '2016-03-15 20:56:24'),
(17, 'Demo Package', 'Test Demo Package created', '2016-03-15 22:46:25', 'true', '56e87cbeedde77493', '2016-03-15 22:46:25');

-- --------------------------------------------------------

--
-- Table structure for table `pendingtempaceessrequest`
--

CREATE TABLE IF NOT EXISTS `pendingtempaceessrequest` (
  `requestId` varchar(20) NOT NULL,
  `assignedApproaver` varchar(20) NOT NULL,
  `assignedBy` varchar(20) NOT NULL,
  `assignedDate` datetime NOT NULL,
  PRIMARY KEY (`requestId`),
  KEY `assignedApproaver` (`assignedApproaver`),
  KEY `assignedBy` (`assignedBy`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `po_to_inward`
--

CREATE TABLE IF NOT EXISTS `po_to_inward` (
  `potoinwardid` bigint(20) NOT NULL AUTO_INCREMENT,
  `ponumber` varchar(50) NOT NULL,
  `inwardid` bigint(20) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` date NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` date NOT NULL,
  PRIMARY KEY (`potoinwardid`),
  KEY `inwardid` (`inwardid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `po_to_outward`
--

CREATE TABLE IF NOT EXISTS `po_to_outward` (
  `potooutwardid` bigint(20) NOT NULL AUTO_INCREMENT,
  `ponumber` varchar(50) NOT NULL,
  `outwardid` bigint(20) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` date NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` date NOT NULL,
  PRIMARY KEY (`potooutwardid`),
  KEY `outwardid` (`outwardid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `produced_good`
--

CREATE TABLE IF NOT EXISTS `produced_good` (
  `producedgoodid` bigint(20) NOT NULL AUTO_INCREMENT,
  `productionbatchmasterid` bigint(20) NOT NULL,
  `materialproducedid` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `packagedunits` int(11) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` date NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` date NOT NULL,
  PRIMARY KEY (`producedgoodid`),
  KEY `productionbatchmasterid` (`productionbatchmasterid`),
  KEY `materialproducedid` (`materialproducedid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `produced_good`
--

INSERT INTO `produced_good` (`producedgoodid`, `productionbatchmasterid`, `materialproducedid`, `quantity`, `packagedunits`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(5, 7, 111, 10, 0, '56e87cbeedde77493', '2016-03-16', '56e87cbeedde77493', '2016-03-16'),
(6, 8, 111, 10, 0, '56e87cbeedde77493', '2016-03-16', '56e87cbeedde77493', '2016-03-16');

-- --------------------------------------------------------

--
-- Table structure for table `production_batch_master`
--

CREATE TABLE IF NOT EXISTS `production_batch_master` (
  `productionbatchmasterid` bigint(20) NOT NULL AUTO_INCREMENT,
  `batchno` varchar(20) NOT NULL,
  `batchcodename` varchar(30) NOT NULL,
  `dateofentry` date NOT NULL,
  `productionstartdate` date NOT NULL,
  `productionenddate` date NOT NULL,
  `productionsupervisorid` varchar(20) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` date NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` date NOT NULL,
  PRIMARY KEY (`productionbatchmasterid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `production_batch_master`
--

INSERT INTO `production_batch_master` (`productionbatchmasterid`, `batchno`, `batchcodename`, `dateofentry`, `productionstartdate`, `productionenddate`, `productionsupervisorid`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(7, 'PB100', 'asdp', '2016-03-15', '2016-03-15', '2016-03-16', 'asdasd', '56e87cbeedde77493', '2016-03-16', '56e87cbeedde77493', '2016-03-16'),
(8, 'PB0002', 'abcd', '2016-03-15', '2016-03-15', '2016-03-16', 'asd', '56e87cbeedde77493', '2016-03-16', '56e87cbeedde77493', '2016-03-16'),
(9, '4545345', 'dfdsdf', '2016-03-14', '2016-03-16', '2016-03-18', 'dsfsdfsdf', '56e87cbeedde77493', '2016-03-16', '56e87cbeedde77493', '2016-03-16');

-- --------------------------------------------------------

--
-- Table structure for table `production_raw_materials_details`
--

CREATE TABLE IF NOT EXISTS `production_raw_materials_details` (
  `prodrawmaterialdtlsid` bigint(20) NOT NULL AUTO_INCREMENT,
  `productionbatchmasterid` bigint(20) NOT NULL,
  `materialid` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` date NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` date NOT NULL,
  PRIMARY KEY (`prodrawmaterialdtlsid`),
  KEY `productionbatchmasterid` (`productionbatchmasterid`),
  KEY `materialid` (`materialid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `production_raw_materials_details`
--

INSERT INTO `production_raw_materials_details` (`prodrawmaterialdtlsid`, `productionbatchmasterid`, `materialid`, `quantity`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(9, 7, 111, 10, '56e87cbeedde77493', '2016-03-16', '56e87cbeedde77493', '2016-03-16'),
(10, 8, 111, 100, '56e87cbeedde77493', '2016-03-16', '56e87cbeedde77493', '2016-03-16'),
(11, 9, 111, 32, '56e87cbeedde77493', '2016-03-16', '56e87cbeedde77493', '2016-03-16');

-- --------------------------------------------------------

--
-- Table structure for table `product_details`
--

CREATE TABLE IF NOT EXISTS `product_details` (
  `productdetailsid` bigint(20) NOT NULL AUTO_INCREMENT,
  `productmasterid` bigint(20) NOT NULL,
  `color` varchar(20) NOT NULL,
  `description` varchar(300) NOT NULL,
  `alertquantity` decimal(10,2) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL,
  PRIMARY KEY (`productdetailsid`),
  KEY `productmasterid` (`productmasterid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=121 ;

--
-- Dumping data for table `product_details`
--

INSERT INTO `product_details` (`productdetailsid`, `productmasterid`, `color`, `description`, `alertquantity`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(120, 129, 'Red', 'Red color Product', '234.00', '56e87cbeedde77493', '2016-03-15 23:53:23', '56e87cbeedde77493', '2016-03-15 23:53:23');

-- --------------------------------------------------------

--
-- Table structure for table `product_master`
--

CREATE TABLE IF NOT EXISTS `product_master` (
  `productmasterid` bigint(20) NOT NULL AUTO_INCREMENT,
  `productname` varchar(100) NOT NULL,
  `materialtypeid` bigint(20) NOT NULL,
  `unitofmeasure` varchar(15) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL,
  PRIMARY KEY (`productmasterid`),
  KEY `materialtypeid` (`materialtypeid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=130 ;

--
-- Dumping data for table `product_master`
--

INSERT INTO `product_master` (`productmasterid`, `productname`, `materialtypeid`, `unitofmeasure`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(129, 'addProduct', 41, 'uom', '56e87cbeedde77493', '2016-03-15 23:53:23', '56e87cbeedde77493', '2016-03-15 23:53:23');

-- --------------------------------------------------------

--
-- Table structure for table `product_packaging`
--

CREATE TABLE IF NOT EXISTS `product_packaging` (
  `productpackagingid` bigint(20) NOT NULL AUTO_INCREMENT,
  `productmasterid` bigint(20) NOT NULL,
  `packaging` varchar(30) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL,
  PRIMARY KEY (`productpackagingid`),
  KEY `productmasterid` (`productmasterid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=130 ;

--
-- Dumping data for table `product_packaging`
--

INSERT INTO `product_packaging` (`productpackagingid`, `productmasterid`, `packaging`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(129, 129, 'asd', '56e87cbeedde77493', '2016-03-15 23:53:23', '56e87cbeedde77493', '2016-03-15 23:53:23');

-- --------------------------------------------------------

--
-- Table structure for table `projectlist`
--

CREATE TABLE IF NOT EXISTS `projectlist` (
  `ProjectId` int(10) NOT NULL AUTO_INCREMENT,
  `ProjectName` varchar(50) NOT NULL,
  PRIMARY KEY (`ProjectId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `roleaccesspermission`
--

CREATE TABLE IF NOT EXISTS `roleaccesspermission` (
  `roleAccessId` varchar(20) NOT NULL,
  `roleId` varchar(20) NOT NULL,
  `accessId` varchar(20) NOT NULL,
  `createdBy` varchar(20) NOT NULL,
  `creationDate` datetime NOT NULL,
  PRIMARY KEY (`roleAccessId`),
  KEY `roleId` (`roleId`),
  KEY `accessId` (`accessId`),
  KEY `createdBy` (`createdBy`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `roleaccesspermission`
--

INSERT INTO `roleaccesspermission` (`roleAccessId`, `roleId`, `accessId`, `createdBy`, `creationDate`) VALUES
('56e938f7ce5a16490', '56e938f7ce3e58914', '121', '56e87cbeedde77493', '2016-03-16 03:44:07'),
('56e938f7ce72d3806', '56e938f7ce3e58914', '211', '56e87cbeedde77493', '2016-03-16 03:44:07'),
('56e938f7ce8762155', '56e938f7ce3e58914', '123', '56e87cbeedde77493', '2016-03-16 03:44:07'),
('56e938f7ceab05981', '56e938f7ce3e58914', '224', '56e87cbeedde77493', '2016-03-16 03:44:07'),
('56e938f7cec008786', '56e938f7ce3e58914', '125', '56e87cbeedde77493', '2016-03-16 03:44:07'),
('56e938f7cee369014', '56e938f7ce3e58914', '226', '56e87cbeedde77493', '2016-03-16 03:44:07'),
('56e938f7cefdf9882', '56e938f7ce3e58914', '127', '56e87cbeedde77493', '2016-03-16 03:44:07'),
('56e938f7cf2031425', '56e938f7ce3e58914', '228', '56e87cbeedde77493', '2016-03-16 03:44:07'),
('56e938f7cf3af9775', '56e938f7ce3e58914', '129', '56e87cbeedde77493', '2016-03-16 03:44:07'),
('56e938f7cf5d75518', '56e938f7ce3e58914', '230', '56e87cbeedde77493', '2016-03-16 03:44:07'),
('56e98d6d74a024880', '56e9862e284231472', '121', '56e87cbeedde77493', '2016-03-16 09:44:29'),
('56e98d6d74b7e2886', '56e9862e284231472', '123', '56e87cbeedde77493', '2016-03-16 09:44:29'),
('56e98d6d74ca87577', '56e9862e284231472', '224', '56e87cbeedde77493', '2016-03-16 09:44:29'),
('56e98d6d74dec1977', '56e9862e284231472', '226', '56e87cbeedde77493', '2016-03-16 09:44:29'),
('56e98d6d74ef61904', '56e9862e284231472', '127', '56e87cbeedde77493', '2016-03-16 09:44:29'),
('56e98d6d750169703', '56e9862e284231472', '230', '56e87cbeedde77493', '2016-03-16 09:44:29');

-- --------------------------------------------------------

--
-- Table structure for table `rolemaster`
--

CREATE TABLE IF NOT EXISTS `rolemaster` (
  `roleId` varchar(20) NOT NULL,
  `roleName` varchar(20) NOT NULL,
  `createdBy` varchar(20) NOT NULL,
  `creationDate` datetime NOT NULL,
  `lastModifiedBy` varchar(20) NOT NULL,
  `lasModificationDate` datetime NOT NULL,
  PRIMARY KEY (`roleId`),
  KEY `createdBy` (`createdBy`),
  KEY `lastModifiedBy` (`lastModifiedBy`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `rolemaster`
--

INSERT INTO `rolemaster` (`roleId`, `roleName`, `createdBy`, `creationDate`, `lastModifiedBy`, `lasModificationDate`) VALUES
('56e938f7ce3e58914', 'superRoleCreation', '56e87cbeedde77493', '2016-03-16 03:44:07', '', '0000-00-00 00:00:00'),
('56e9862e284231472', 'newtry', '56e87cbeedde77493', '2016-03-16 09:13:34', '56e87cbeedde77493', '2016-03-16 09:44:29');

-- --------------------------------------------------------

--
-- Table structure for table `superuser`
--

CREATE TABLE IF NOT EXISTS `superuser` (
  `superUserId` varchar(20) NOT NULL,
  `designation` varchar(50) NOT NULL,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `address` text NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `pincode` varchar(15) NOT NULL,
  `mobileNumber` varchar(20) NOT NULL,
  `emailId` varchar(40) NOT NULL,
  `createdBy` varchar(20) NOT NULL,
  `creationDate` datetime NOT NULL,
  `lastModifiedBy` varchar(20) NOT NULL,
  `lastModificationDate` datetime NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedBy` varchar(20) NOT NULL,
  `deletionDate` datetime NOT NULL,
  PRIMARY KEY (`superUserId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `superuser`
--

INSERT INTO `superuser` (`superUserId`, `designation`, `firstName`, `lastName`, `dateOfBirth`, `address`, `city`, `state`, `country`, `pincode`, `mobileNumber`, `emailId`, `createdBy`, `creationDate`, `lastModifiedBy`, `lastModificationDate`, `isDeleted`, `deletedBy`, `deletionDate`) VALUES
('56e3b74bcf6d14761', 'sfhgf', 'Ajit', 'Zagade', '0000-00-00', 'jbfgjhsdjfhsdfjkhjfdjkhsdjfhjdhfjkhjk', 'asdasd', 'adasd', 'asdasd', '123123', '8087643764', 's@gma.co', '56e3b74bcf6d14761', '2016-03-12 11:59:31', '56e3b74bcf6d14761', '2016-03-12 11:59:31', 0, '', '0000-00-00 00:00:00'),
('56e3b7ac036c41083', 'eeetetewr', 'Ajit', 'Zagade', '0000-00-00', 'sdfgsdfsdff dgdfg gdfg gfgfg', 'asdasd', 'adasd', 'asdasd', '123123', '666665756', 's@gma.co', '56e3b7ac036c41083', '2016-03-12 12:01:08', '56e3b7ac036c41083', '2016-03-12 12:01:08', 0, '', '0000-00-00 00:00:00'),
('56e3b83f234113159', 'eeetetewr', 'Ajit', 'Zagade', '0000-00-00', 'jkjkhjhjjkhjhhjkhjklhklhjh jbjljhj', 'jkkhjkhjhj', 'adasd', 'kljhgj', '7657655', '8087643764', 's@gma.co', '56e3b83f234113159', '2016-03-12 12:03:35', '56e3b83f234113159', '2016-03-12 12:03:35', 0, '', '0000-00-00 00:00:00'),
('56e3b9c130c645692', 'eeetetewr', '2015-11-29', 'Ajit', '0000-00-00', 'kljdfjkjk skdjfkjk89sdmnf kdjjlfknsdf..df', 'asdasd', 'adasdGDF', 'asdasd', '123123', '8087643764', 's@gma.co', '56e3b9c130c645692', '2016-03-12 12:10:01', '56e3b9c130c645692', '2016-03-12 12:10:01', 0, '', '0000-00-00 00:00:00'),
('56e3ba4094f7f1983', 'sfhgf', 'jhhhhkjh', 'jhjhjkh', '2016-12-30', 'jhjklklkiomk huihkhkhh h jkh', 'asdasd', 'adasd', 'asdasd', '123123', '8007755527', 's@gma.co', '56e3ba4094f7f1983', '2016-03-12 12:12:08', '56e3ba4094f7f1983', '2016-03-12 12:12:08', 0, '', '0000-00-00 00:00:00'),
('56e408dbd6ff36687', 'sdfdfdfdf', 'dfgdfgf', 'sdfdsf', '2014-10-28', 'jlsdkfhlkshdfklhdklfh', 'jh', 'sdfh', 'ujhsdfjk', '458768', '787878', 'sd@dg.bhg', '56e408dbd6ff36687', '2016-03-12 17:47:32', '56e408dbd6ff36687', '2016-03-12 17:47:32', 0, '', '0000-00-00 00:00:00'),
('56e409b7388576019', 'jhsdsdf', 'kghtft', 'fdgdg', '2015-10-29', 'fhdfgfgfdgfgdfgfdgg', 'jkldfhjkhjhjkghj', 'jhdfjkh', 'dfh', '76786789', '767899878656', 'sd@dg.bhg', '56e409b7388576019', '2016-03-12 17:51:11', '56e409b7388576019', '2016-03-12 17:51:11', 0, '', '0000-00-00 00:00:00'),
('56e40a420f3576182', 'sdfdsfsdf', 'utyututu', 'tuytutu', '2015-10-29', 'hfhfg fgh gfgh ghfhf hfh hhg', 'jkkjj', 'uhkljkh', 'fgdfgdfg', '546546546546', '456464646', 'sd@dg.bhg', '56e40a420f3576182', '2016-03-12 17:53:30', '56e40a420f3576182', '2016-03-12 17:53:30', 0, '', '0000-00-00 00:00:00'),
('56e40acfc33578905', 'dfsdfsdfsdf', 'jhsdkfhkj', 'jhdfjkh', '2016-10-29', 'kl;dfgkjkdfgdgdgdg', 'dfgdfhdfh', 'jkh', 'dfgdfgdgd', '54654654654', 'sdfsfsdfsdf', 'sd@dg.bhg', '56e40acfc33578905', '2016-03-12 17:55:51', '56e40acfc33578905', '2016-03-12 17:55:51', 0, '', '0000-00-00 00:00:00'),
('56e8638ecb35c7637', 'Director', 'ATUL', 'DHATRAK', '1992-03-16', 'Asadasdknaskldnklasd', 'sdasd', 'asdads', 'sadasd', '123123', '8077556457', 'super1@mail.com', '568bf524ab16f2627', '2016-03-16 01:03:34', '568bf524ab16f2627', '2016-03-16 01:03:34', 0, '', '0000-00-00 00:00:00'),
('56e86524b25c48082', 'Director', 'asdasd', 'asdasd', '2016-03-07', 'adasdadasd', 'daadasd', 'sadad', 'sdasd', '123123', '1233213', 'super2@mail.com', '568bf524ab16f2627', '2016-03-16 01:10:20', '568bf524ab16f2627', '2016-03-16 01:10:20', 0, '', '0000-00-00 00:00:00'),
('56e87cbeedde77493', 'sdasd', 'asdasd', 'asdasd', '2016-02-29', 'asdasdsdadsas', 'sdasd', 'asdasd', 'asdasd', 'asdas', 'sdasd', 'super@mail.com', '56e86524b25c48082', '2016-03-16 02:51:02', '56e86524b25c48082', '2016-03-16 02:51:02', 0, '', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE IF NOT EXISTS `supplier` (
  `supplierid` bigint(20) NOT NULL AUTO_INCREMENT,
  `suppliername` varchar(40) NOT NULL,
  `contactno` varchar(15) NOT NULL,
  `POINTOFCONTACT` varchar(20) NOT NULL,
  `OFFICENO` varchar(20) NOT NULL,
  `CSTNO` varchar(20) NOT NULL,
  `VATNO` varchar(20) NOT NULL,
  `address` varchar(100) NOT NULL,
  `city` varchar(30) NOT NULL,
  `country` varchar(30) NOT NULL,
  `pincode` varchar(16) NOT NULL,
  `delflg` varchar(5) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` date NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` date NOT NULL,
  PRIMARY KEY (`supplierid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=17 ;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`supplierid`, `suppliername`, `contactno`, `POINTOFCONTACT`, `OFFICENO`, `CSTNO`, `VATNO`, `address`, `city`, `country`, `pincode`, `delflg`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(16, 'supplierAdd', '8007755527', 'Ajit', '20243777777', '67978879987C', '3567888V', 'jskhsfdkjh asdasd', 'Pune', 'India', '567856', 'N', '56e87cbeedde77493', '2016-03-15', '56e87cbeedde77493', '2016-03-15');

-- --------------------------------------------------------

--
-- Table structure for table `tempaccesspermissions`
--

CREATE TABLE IF NOT EXISTS `tempaccesspermissions` (
  `requestId` varchar(20) NOT NULL,
  `userId` varchar(20) NOT NULL,
  `accessId` varchar(20) NOT NULL,
  `fromDate` datetime NOT NULL,
  `toDate` datetime NOT NULL,
  PRIMARY KEY (`requestId`,`accessId`),
  KEY `userId` (`userId`),
  KEY `accessId` (`accessId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tempaccessrequest`
--

CREATE TABLE IF NOT EXISTS `tempaccessrequest` (
  `requestId` varchar(20) NOT NULL,
  `requestedBy` varchar(20) NOT NULL,
  `fromDate` datetime NOT NULL,
  `toDate` datetime NOT NULL,
  `description` varchar(50) NOT NULL,
  `status` varchar(10) NOT NULL,
  `requestDate` datetime NOT NULL,
  PRIMARY KEY (`requestId`),
  KEY `requestedBy` (`requestedBy`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tempaccessrequestaction`
--

CREATE TABLE IF NOT EXISTS `tempaccessrequestaction` (
  `requestId` varchar(20) NOT NULL,
  `actionBy` varchar(20) NOT NULL,
  `actionDate` datetime NOT NULL,
  `remark` varchar(50) NOT NULL,
  PRIMARY KEY (`requestId`),
  KEY `actionBy` (`actionBy`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

CREATE TABLE IF NOT EXISTS `test` (
  `col1` int(20) NOT NULL,
  `col2` int(20) NOT NULL,
  `col3` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `unapproved_expense_bills`
--

CREATE TABLE IF NOT EXISTS `unapproved_expense_bills` (
  `billid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `expensedetailsid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `billno` varchar(30) CHARACTER SET utf8 NOT NULL,
  `billissueingentity` varchar(50) CHARACTER SET utf8 NOT NULL,
  `amount` int(20) NOT NULL,
  `dateofbill` date NOT NULL,
  `createdby` varchar(20) CHARACTER SET utf8 NOT NULL,
  `creationdate` datetime NOT NULL,
  `lastmodificationdate` datetime NOT NULL,
  `lastmodifiedby` varchar(20) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`billid`),
  KEY `expensedetailsid` (`expensedetailsid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `userlogin`
--

CREATE TABLE IF NOT EXISTS `userlogin` (
  `username` varchar(120) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `password` varchar(120) CHARACTER SET ascii COLLATE ascii_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `usermaster`
--

CREATE TABLE IF NOT EXISTS `usermaster` (
  `userId` varchar(20) NOT NULL,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `address` varchar(100) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `pincode` varchar(15) NOT NULL,
  `mobileNumber` varchar(20) NOT NULL,
  `emailId` varchar(40) NOT NULL,
  `createdBy` varchar(20) NOT NULL,
  `creationDate` datetime NOT NULL,
  `lastModifiedBy` varchar(20) NOT NULL,
  `lastModificationDate` datetime NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedBy` varchar(20) NOT NULL,
  `deletionDate` datetime NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `usermaster`
--

INSERT INTO `usermaster` (`userId`, `firstName`, `lastName`, `dateOfBirth`, `address`, `city`, `state`, `country`, `pincode`, `mobileNumber`, `emailId`, `createdBy`, `creationDate`, `lastModifiedBy`, `lastModificationDate`, `isDeleted`, `deletedBy`, `deletionDate`) VALUES
('568aa06f48c053329', 'atulDatesde', 'dhatrakAsdfr', '1992-09-17', 'adsdasdasdasdasadsadsdsd54', 'asdasdDGHD', 'adasdSDSdd', 'asdasdASDGFDF', '545456', '8007755527', 'atul@mail.com', 'admin', '2016-01-04 22:10:15', '568aa06f48c053329', '2016-03-16 00:55:35', 0, '', '0000-00-00 00:00:00'),
('56bb73a5919161097', 'Atul', 'Dhatrak', '1992-10-10', 'asdasdasdasd', 'pune', 'Maharashtra', 'India', '411045', '1234567890', 'ads@asd.casd', 'admin', '2016-02-10 23:00:13', 'admin', '2016-02-10 23:00:13', 0, '', '0000-00-00 00:00:00'),
('56bb73ed4e7449147', 'Atul', 'Dhatrak', '1992-10-10', 'asdasdasdasd', 'pune', 'Maharashtra', 'India', '411045', '1234567890', 'ads@asd.casd', 'admin', '2016-02-10 23:01:25', 'admin', '2016-02-10 23:01:25', 0, '', '0000-00-00 00:00:00'),
('56bb7f2c509229316', 'asdasdasd', 'asdasd', '2016-10-10', 'sdasdasdasdasd', 'asdasdasd', 'asdasdas', 'asdasdasd', '123456', '1231231231', 'asd@bhn.cbb', 'admin', '2016-02-10 23:49:24', 'admin', '2016-02-10 23:49:24', 0, '', '0000-00-00 00:00:00'),
('56bc8d33af8b38799', 'Ajinkya', 'panse', '1992-12-12', 'fdgdfdgdfd', 'df', 'dffg', 'fgfghfhgh', '414423', '8007755527', 'as@gmail.com', 'admin', '2016-02-11 19:01:31', 'admin', '2016-02-11 19:01:31', 0, '', '0000-00-00 00:00:00'),
('56e510536cc7a5508', 'Ajit', 'zagade', '2016-03-13', 'skdjfklsdjfkjsdfkjkdjfjsdfjskdjfkljsdklfj', 'skjdf', 'kdfhjk', 'sdfhjsdfhj', '76678678', '8007755527', 'ajit@inci.com', '568bf524ab16f2627', '2016-03-13 12:31:39', '568bf524ab16f2627', '2016-03-13 12:31:39', 0, '', '0000-00-00 00:00:00'),
('56e87cbeedde77493', 'Super', 'Super', '1992-09-17', 'aasdadsasdasdasdasd', 'adasdad', 'sdasda', 'asdasd', '123123123', '8087643764', 'super@mail.com', 'admin', '2016-01-05 22:23:56', 'admin', '2016-01-05 22:23:56', 0, '', '0000-00-00 00:00:00'),
('56e939423098c2739', 'Ajit', 'Zagade', '2016-03-16', 'asdasd asd asd sa das d', 'pune', 'mah', 'in', '23423423', '8007755527', 'ajit@incizon.com', '56e87cbeedde77493', '2016-03-16 03:45:22', '56e87cbeedde77493', '2016-03-16 03:45:22', 0, '', '0000-00-00 00:00:00'),
('56e97c3597d997548', 'try', 'try', '2016-03-16', 'A/8 state bank staff shivneri hsg soc shivtirthnagar paud road', 'Pune', 'Maharashtra', 'India', '411038', '08149050480', 'try@mail.com', '56e87cbeedde77493', '2016-03-16 08:31:01', '56e87cbeedde77493', '2016-03-16 08:31:01', 0, '', '0000-00-00 00:00:00'),
('admin', 'asdasd', 'sdsad', '2015-12-01', 'sdasdasdasdasda', 'sdasdasdasdasd', 'asdasdasd', 'sdasda', 'sdadasdads', 'sdasdad', 'sadasdasdasd', 'admin', '2015-12-01 00:00:00', 'admin', '2015-12-01 00:00:00', 0, '', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `userroleinfo`
--

CREATE TABLE IF NOT EXISTS `userroleinfo` (
  `userId` varchar(20) NOT NULL,
  `designation` varchar(30) NOT NULL,
  `roleId` varchar(20) NOT NULL,
  `userType` varchar(8) NOT NULL,
  `createdBy` varchar(20) NOT NULL,
  `creationDate` datetime NOT NULL,
  `lastModifiedBy` varchar(20) NOT NULL,
  `lastModificationDate` datetime NOT NULL,
  KEY `userId` (`userId`),
  KEY `roleId` (`roleId`),
  KEY `createdBy` (`createdBy`),
  KEY `lastModifiedBy` (`lastModifiedBy`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `userroleinfo`
--

INSERT INTO `userroleinfo` (`userId`, `designation`, `roleId`, `userType`, `createdBy`, `creationDate`, `lastModifiedBy`, `lastModificationDate`) VALUES
('56e939423098c2739', 'HR', '56e938f7ce3e58914', 'Admin', '56e87cbeedde77493', '2016-03-16 03:45:22', '56e87cbeedde77493', '2016-03-16 03:45:22'),
('56e97c3597d997548', 'Try', '56e938f7ce3e58914', 'Normal', '56e87cbeedde77493', '2016-03-16 08:31:01', '56e87cbeedde77493', '2016-03-16 08:31:01');

-- --------------------------------------------------------

--
-- Table structure for table `userverification`
--

CREATE TABLE IF NOT EXISTS `userverification` (
  `userId` varchar(20) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `verificationValue` varchar(80) NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `warehouse`
--

CREATE TABLE IF NOT EXISTS `warehouse` (
  `warehouseid` bigint(20) NOT NULL AUTO_INCREMENT,
  `warehousename` varchar(30) NOT NULL,
  `warehouseaddress` varchar(100) NOT NULL,
  `warehousecity` varchar(30) NOT NULL,
  `warehousecountry` varchar(30) NOT NULL,
  `warehousepincode` varchar(16) NOT NULL,
  `warehousecontactno` varchar(15) NOT NULL,
  `abbrevation` varchar(25) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` date NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` date NOT NULL,
  PRIMARY KEY (`warehouseid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `warehousemaster`
--

CREATE TABLE IF NOT EXISTS `warehousemaster` (
  `warehouseId` varchar(20) NOT NULL,
  `wareHouseName` varchar(40) NOT NULL,
  `warehouseAbbrevation` varchar(10) NOT NULL,
  `address` varchar(80) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `pincode` varchar(15) NOT NULL,
  `phoneNumber` varchar(15) NOT NULL,
  `createdBy` varchar(20) NOT NULL,
  `creationDate` datetime NOT NULL,
  `lastModifiedBy` varchar(20) NOT NULL,
  `lastModificationDate` datetime NOT NULL,
  PRIMARY KEY (`warehouseId`),
  KEY `createdBy` (`createdBy`),
  KEY `lastModifiedBy` (`lastModifiedBy`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `warehousemaster`
--

INSERT INTO `warehousemaster` (`warehouseId`, `wareHouseName`, `warehouseAbbrevation`, `address`, `city`, `state`, `country`, `pincode`, `phoneNumber`, `createdBy`, `creationDate`, `lastModifiedBy`, `lastModificationDate`) VALUES
('56e93828d69ff1893', 'warehouseadd', 'asd', 'asdsad asdasdsad asd', 'Pune', 'Maharashtra', 'india', '43534543', '34535345', '56e87cbeedde77493', '2016-03-16 03:40:40', '56e87cbeedde77493', '2016-03-16 09:41:04'),
('56e98723d651d4100', 'Katraj', 'asdasdasd', 'asdasd katraj', 'Pune', 'Maharashtra', 'India', '411045', '1231231231', '56e87cbeedde77493', '2016-03-16 09:17:39', '56e87cbeedde77493', '2016-03-16 09:17:39');

-- --------------------------------------------------------

--
-- Table structure for table `weekly_off_in_year`
--

CREATE TABLE IF NOT EXISTS `weekly_off_in_year` (
  `caption_of_year` varchar(30) NOT NULL,
  `weekly_off_date` date NOT NULL,
  KEY `caption_of_year` (`caption_of_year`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accesserequested`
--
ALTER TABLE `accesserequested`
  ADD CONSTRAINT `accessRequested_ForeignKeyAccessId` FOREIGN KEY (`accessId`) REFERENCES `accesspermission` (`accessId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `accessRequested_ForeignKeyRequestId` FOREIGN KEY (`requestId`) REFERENCES `tempaccessrequest` (`requestId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `applicator_enrollment`
--
ALTER TABLE `applicator_enrollment`
  ADD CONSTRAINT `MASTERAPPLICATOR` FOREIGN KEY (`applicator_master_id`) REFERENCES `applicator_master` (`applicator_master_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `PAYMENTPACKAGE` FOREIGN KEY (`payment_package_id`) REFERENCES `payment_package_master` (`payment_package_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `applicator_follow_up`
--
ALTER TABLE `applicator_follow_up`
  ADD CONSTRAINT `FOLLOWUPENROLLMENTID` FOREIGN KEY (`enrollment_id`) REFERENCES `applicator_enrollment` (`enrollment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `applicator_payment_follow_up_info`
--
ALTER TABLE `applicator_payment_follow_up_info`
  ADD CONSTRAINT `PAYMENTFOLLOWUPINFOID` FOREIGN KEY (`follow_up_id`) REFERENCES `applicator_follow_up` (`follow_up_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `applicator_payment_info`
--
ALTER TABLE `applicator_payment_info`
  ADD CONSTRAINT `ENROLLMENTID` FOREIGN KEY (`enrollment_id`) REFERENCES `applicator_enrollment` (`enrollment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `applicator_pointof_contact`
--
ALTER TABLE `applicator_pointof_contact`
  ADD CONSTRAINT `MASTERAPPLICATORID` FOREIGN KEY (`applicator_master_id`) REFERENCES `applicator_master` (`applicator_master_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `approved_expense_bills`
--
ALTER TABLE `approved_expense_bills`
  ADD CONSTRAINT `FORIEGNKEYEXPENSEDETAILSAPPROVED` FOREIGN KEY (`expensedetailsid`) REFERENCES `expense_details` (`expensedetailsid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `attendance_year`
--
ALTER TABLE `attendance_year`
  ADD CONSTRAINT `AttendanceYearCreatedBy` FOREIGN KEY (`created_by`) REFERENCES `logindetails` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `budgetdetail`
--
ALTER TABLE `budgetdetail`
  ADD CONSTRAINT `budgetdetail_ibfk_1` FOREIGN KEY (`BudgetSegId`) REFERENCES `budgetsegment` (`BudgetSegmentId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `foreignKeyCostCenterMaster` FOREIGN KEY (`costCenterId`) REFERENCES `costcentermaster` (`CostCenterId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `budget_details`
--
ALTER TABLE `budget_details`
  ADD CONSTRAINT `FORIEGNKEYBUDGETSEGMENTID` FOREIGN KEY (`budgetsegmentid`) REFERENCES `budget_segment` (`budgetsegmentid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `companymaster`
--
ALTER TABLE `companymaster`
  ADD CONSTRAINT `company_ForeignKeyCreatedBy` FOREIGN KEY (`createdBy`) REFERENCES `usermaster` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `company_ForeignKeyModifiedBy` FOREIGN KEY (`lastModifiedBy`) REFERENCES `usermaster` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `employee_on_payroll`
--
ALTER TABLE `employee_on_payroll`
  ADD CONSTRAINT `EmployeeId` FOREIGN KEY (`employee_id`) REFERENCES `usermaster` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `EmployeePayrollCreatedBY` FOREIGN KEY (`created_by`) REFERENCES `usermaster` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `EmployeePayrollModifiedBy` FOREIGN KEY (`last_modified_by`) REFERENCES `usermaster` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `expense_approval_mapping`
--
ALTER TABLE `expense_approval_mapping`
  ADD CONSTRAINT `FORIEGNKEYCOSTCENTER` FOREIGN KEY (`costcenterid`) REFERENCES `cost_center_master` (`costcenterid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `expense_details`
--
ALTER TABLE `expense_details`
  ADD CONSTRAINT `FOREIGNKEYCOSTCENTEREXPENSEDETAILS` FOREIGN KEY (`costcenterid`) REFERENCES `cost_center_master` (`costcenterid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FORIEGNKEYBUDGETSEGMENTEXPENSEDETAILS` FOREIGN KEY (`budgetsegmentid`) REFERENCES `budget_segment` (`budgetsegmentid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `follow_up_employee`
--
ALTER TABLE `follow_up_employee`
  ADD CONSTRAINT `EMPLOYEEFOLLOWUPID` FOREIGN KEY (`follow_up_id`) REFERENCES `applicator_follow_up` (`follow_up_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `holiday_in_year`
--
ALTER TABLE `holiday_in_year`
  ADD CONSTRAINT `AttendanceYear` FOREIGN KEY (`caption_of_year`) REFERENCES `attendance_year` (`caption_of_year`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `CreatedBYUser` FOREIGN KEY (`created_by`) REFERENCES `usermaster` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `inhouse_inward_entry`
--
ALTER TABLE `inhouse_inward_entry`
  ADD CONSTRAINT `INHINWARDTOPRODBATCHMASTER` FOREIGN KEY (`productionbatchmasterid`) REFERENCES `production_batch_master` (`productionbatchmasterid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `INHOUSEINWDTOPRODGOOD` FOREIGN KEY (`producedgoodid`) REFERENCES `produced_good` (`producedgoodid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `inhouse_transportation_details`
--
ALTER TABLE `inhouse_transportation_details`
  ADD CONSTRAINT `INHOUSETRANDTLSTOINHOUSEINWD` FOREIGN KEY (`inhouseinwardid`) REFERENCES `inhouse_inward_entry` (`inhouseinwardid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `INVTOMAT` FOREIGN KEY (`materialid`) REFERENCES `material` (`materialid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `inward_details`
--
ALTER TABLE `inward_details`
  ADD CONSTRAINT `INWDDTLSTOINWD` FOREIGN KEY (`inwardid`) REFERENCES `inward` (`inwardid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `INWDDTLSTOMAT` FOREIGN KEY (`materialid`) REFERENCES `material` (`materialid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `INWDDTLSTOSUPP` FOREIGN KEY (`supplierid`) REFERENCES `supplier` (`supplierid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `inward_transportation_details`
--
ALTER TABLE `inward_transportation_details`
  ADD CONSTRAINT `INWDTRANDTLSTOINWD` FOREIGN KEY (`inwardid`) REFERENCES `inward` (`inwardid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `material`
--
ALTER TABLE `material`
  ADD CONSTRAINT `MATTOPRODDTLS` FOREIGN KEY (`productdetailsid`) REFERENCES `product_details` (`productdetailsid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `MATTOPRODMASTER` FOREIGN KEY (`productmasterid`) REFERENCES `product_master` (`productmasterid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `MATTOPRODPCKG` FOREIGN KEY (`productpackagingid`) REFERENCES `product_packaging` (`productpackagingid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `outward_details`
--
ALTER TABLE `outward_details`
  ADD CONSTRAINT `OTWDDTLSTOMAT` FOREIGN KEY (`materialid`) REFERENCES `material` (`materialid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `OTWDDTLSTOOTWD` FOREIGN KEY (`outwardid`) REFERENCES `outward` (`outwardid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `outward_transportation_details`
--
ALTER TABLE `outward_transportation_details`
  ADD CONSTRAINT `OTWDTRANDTLSTOOTWD` FOREIGN KEY (`outwardid`) REFERENCES `outward` (`outwardid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment_mode_details`
--
ALTER TABLE `payment_mode_details`
  ADD CONSTRAINT `PAYMENTINFOID` FOREIGN KEY (`payment_id`) REFERENCES `applicator_payment_info` (`payment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment_package_details`
--
ALTER TABLE `payment_package_details`
  ADD CONSTRAINT `PAYMENTPACKAGEID` FOREIGN KEY (`payment_package_id`) REFERENCES `payment_package_master` (`payment_package_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pendingtempaceessrequest`
--
ALTER TABLE `pendingtempaceessrequest`
  ADD CONSTRAINT `ForeignKey_Approaver_PendingAccessAction` FOREIGN KEY (`assignedApproaver`) REFERENCES `usermaster` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ForeignKey_assignedBy_PendingAccessAction` FOREIGN KEY (`assignedBy`) REFERENCES `usermaster` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ForeignKey_RequestId_PendingAccessAction` FOREIGN KEY (`requestId`) REFERENCES `tempaccessrequest` (`requestId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `po_to_inward`
--
ALTER TABLE `po_to_inward`
  ADD CONSTRAINT `POTOINWD` FOREIGN KEY (`inwardid`) REFERENCES `inward` (`inwardid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `po_to_outward`
--
ALTER TABLE `po_to_outward`
  ADD CONSTRAINT `POTOOTWD` FOREIGN KEY (`outwardid`) REFERENCES `outward` (`outwardid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `produced_good`
--
ALTER TABLE `produced_good`
  ADD CONSTRAINT `PRDGOODTOPRODBTCHMSTER` FOREIGN KEY (`productionbatchmasterid`) REFERENCES `production_batch_master` (`productionbatchmasterid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `PRODGOODTOMAT` FOREIGN KEY (`materialproducedid`) REFERENCES `material` (`materialid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `production_raw_materials_details`
--
ALTER TABLE `production_raw_materials_details`
  ADD CONSTRAINT `PRODRAWTOMAT` FOREIGN KEY (`materialid`) REFERENCES `material` (`materialid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `PRODRAWTOPRODBATCHMASTER` FOREIGN KEY (`productionbatchmasterid`) REFERENCES `production_batch_master` (`productionbatchmasterid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_details`
--
ALTER TABLE `product_details`
  ADD CONSTRAINT `PRODDTLSTOPRODMSTER` FOREIGN KEY (`productmasterid`) REFERENCES `product_master` (`productmasterid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_master`
--
ALTER TABLE `product_master`
  ADD CONSTRAINT `PRODMSTERTOMATTYPE` FOREIGN KEY (`materialtypeid`) REFERENCES `materialtype` (`materialtypeid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_packaging`
--
ALTER TABLE `product_packaging`
  ADD CONSTRAINT `PRODPCKGTOPRODMSTER` FOREIGN KEY (`productmasterid`) REFERENCES `product_master` (`productmasterid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `roleaccesspermission`
--
ALTER TABLE `roleaccesspermission`
  ADD CONSTRAINT `roleAccess_ForeignKeyaccessId` FOREIGN KEY (`accessId`) REFERENCES `accesspermission` (`accessId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `roleAccess_ForeignKeyCreatedBy` FOREIGN KEY (`createdBy`) REFERENCES `usermaster` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `roleAccess_ForeignKeyRoleId` FOREIGN KEY (`roleId`) REFERENCES `rolemaster` (`roleId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tempaccesspermissions`
--
ALTER TABLE `tempaccesspermissions`
  ADD CONSTRAINT `tempAccess_ForeignKey` FOREIGN KEY (`accessId`) REFERENCES `accesspermission` (`accessId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tempAccess_ForeignKeyRequestId` FOREIGN KEY (`requestId`) REFERENCES `tempaccessrequest` (`requestId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tempAccess_ForeignKeyUserId` FOREIGN KEY (`userId`) REFERENCES `usermaster` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tempaccessrequest`
--
ALTER TABLE `tempaccessrequest`
  ADD CONSTRAINT `accessRequest_foreignkeyRequestedBy` FOREIGN KEY (`requestedBy`) REFERENCES `usermaster` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `tempaccessrequestaction`
--
ALTER TABLE `tempaccessrequestaction`
  ADD CONSTRAINT `ForeignKey_actionBy_AccessAction` FOREIGN KEY (`actionBy`) REFERENCES `usermaster` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ForeignKey_RequestId_AccessAction` FOREIGN KEY (`requestId`) REFERENCES `tempaccessrequest` (`requestId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `unapproved_expense_bills`
--
ALTER TABLE `unapproved_expense_bills`
  ADD CONSTRAINT `FORIEGNKEYEXPENSEDETAILSUNAPPROVED` FOREIGN KEY (`expensedetailsid`) REFERENCES `expense_details` (`expensedetailsid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `userroleinfo`
--
ALTER TABLE `userroleinfo`
  ADD CONSTRAINT `foreignKeyUserId` FOREIGN KEY (`userId`) REFERENCES `usermaster` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `roleInfoforeignKeyCreatedBy` FOREIGN KEY (`createdBy`) REFERENCES `usermaster` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `roleInfoForeignKeyModifiedBy` FOREIGN KEY (`lastModifiedBy`) REFERENCES `usermaster` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `roleInfo_ForeignKeyRoleId` FOREIGN KEY (`roleId`) REFERENCES `rolemaster` (`roleId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `userverification`
--
ALTER TABLE `userverification`
  ADD CONSTRAINT `verification_ForeignKeyUserId` FOREIGN KEY (`userId`) REFERENCES `usermaster` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `warehousemaster`
--
ALTER TABLE `warehousemaster`
  ADD CONSTRAINT `warehouse_ForeignKeyCreatedBy` FOREIGN KEY (`createdBy`) REFERENCES `usermaster` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `warehouse_ForeignKeyModifiedBy` FOREIGN KEY (`lastModifiedBy`) REFERENCES `usermaster` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `weekly_off_in_year`
--
ALTER TABLE `weekly_off_in_year`
  ADD CONSTRAINT `CaptionYearForeignKey` FOREIGN KEY (`caption_of_year`) REFERENCES `attendance_year` (`caption_of_year`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
