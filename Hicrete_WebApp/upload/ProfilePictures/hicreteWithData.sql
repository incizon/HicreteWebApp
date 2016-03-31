-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 29, 2016 at 09:14 PM
-- Server version: 5.6.20
-- PHP Version: 5.5.15

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
  `accessId` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `accesspermission`
--

CREATE TABLE IF NOT EXISTS `accesspermission` (
  `accessId` varchar(20) NOT NULL,
  `ModuleName` varchar(30) NOT NULL,
  `accessType` varchar(6) NOT NULL
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
`enrollment_id` int(11) NOT NULL,
  `applicator_master_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `payment_package_id` int(11) NOT NULL,
  `payment_status` varchar(8) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `applicator_enrollment`
--

INSERT INTO `applicator_enrollment` (`enrollment_id`, `applicator_master_id`, `company_id`, `payment_package_id`, `payment_status`, `created_by`, `creation_date`) VALUES
(1, 1, 1, 2, 'Yes', '56e87cbeedde77493', '2016-03-25 13:48:03');

-- --------------------------------------------------------

--
-- Table structure for table `applicator_follow_up`
--

CREATE TABLE IF NOT EXISTS `applicator_follow_up` (
`follow_up_id` int(11) NOT NULL,
  `date_of_follow_up` datetime NOT NULL,
  `last_modification_date` datetime NOT NULL,
  `last_modified_by` varchar(30) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  `enrollment_id` int(11) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `applicator_follow_up`
--

INSERT INTO `applicator_follow_up` (`follow_up_id`, `date_of_follow_up`, `last_modification_date`, `last_modified_by`, `created_by`, `creation_date`, `enrollment_id`) VALUES
(1, '2016-03-29 00:00:00', '2016-03-25 13:48:03', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-25 13:48:03', 1);

-- --------------------------------------------------------

--
-- Table structure for table `applicator_master`
--

CREATE TABLE IF NOT EXISTS `applicator_master` (
`applicator_master_id` int(11) NOT NULL,
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
  `creation_date` datetime NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `applicator_master`
--

INSERT INTO `applicator_master` (`applicator_master_id`, `applicator_name`, `applicator_contact`, `applicator_address_line1`, `applicator_address_line2`, `applicator_city`, `applicator_state`, `applicator_country`, `applicator_vat_number`, `applicator_cst_number`, `applicator_stax_number`, `applicator_pan_number`, `applicator_status`, `last_modification_date`, `last_modified_by`, `created_by`, `creation_date`) VALUES
(1, 'asdasd', '12345678', 'zxczasdasdasd', 'asdasdasd', 'asdasdasd', 'Maharasasd', 'India', '12312312111V', '1231232312C', '123123', '123asdasd1', 'permanent', '2016-03-25 13:48:03', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-25 13:48:03');

-- --------------------------------------------------------

--
-- Table structure for table `applicator_payment_follow_up_info`
--

CREATE TABLE IF NOT EXISTS `applicator_payment_follow_up_info` (
`follow_up_info_id` int(11) NOT NULL,
  `remark` varchar(30) NOT NULL,
  `status` varchar(15) NOT NULL,
  `last_modification_date` datetime NOT NULL,
  `last_modified_by` varchar(30) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  `follow_up_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `applicator_payment_info`
--

CREATE TABLE IF NOT EXISTS `applicator_payment_info` (
`payment_id` int(11) NOT NULL,
  `enrollment_id` int(11) NOT NULL,
  `amount_paid` varchar(15) NOT NULL,
  `date_of_payment` datetime NOT NULL,
  `paid_to` varchar(30) NOT NULL,
  `payment_mode` varchar(30) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `applicator_payment_info`
--

INSERT INTO `applicator_payment_info` (`payment_id`, `enrollment_id`, `amount_paid`, `date_of_payment`, `paid_to`, `payment_mode`, `created_by`, `creation_date`) VALUES
(1, 1, '100', '2016-03-25 00:00:00', 'asdasd', 'cheque', '56e87cbeedde77493', '2016-03-25 13:48:03'),
(2, 1, '700', '2016-03-25 08:18:54', 'asdasd', 'cash', '56e87cbeedde77493', '2016-03-25 13:49:23');

-- --------------------------------------------------------

--
-- Table structure for table `applicator_pointof_contact`
--

CREATE TABLE IF NOT EXISTS `applicator_pointof_contact` (
`point_of_contact_id` int(11) NOT NULL,
  `point_of_contact` varchar(30) NOT NULL,
  `point_of_contact_no` varchar(15) NOT NULL,
  `last_modification_date` datetime NOT NULL,
  `last_modified_by` varchar(30) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  `applicator_master_id` int(11) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `applicator_pointof_contact`
--

INSERT INTO `applicator_pointof_contact` (`point_of_contact_id`, `point_of_contact`, `point_of_contact_no`, `last_modification_date`, `last_modified_by`, `created_by`, `creation_date`, `applicator_master_id`) VALUES
(1, 'asdasd', '1231231231', '2016-03-25 13:48:03', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-25 13:48:03', 1);

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
  `lastmodifiedby` varchar(20) CHARACTER SET utf8 NOT NULL
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
  `creation_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `attendance_year`
--

INSERT INTO `attendance_year` (`caption_of_year`, `from_date`, `to_date`, `no_of_paid_leaves`, `weekly_off_day`, `created_by`, `creation_date`) VALUES
('2020', '2016-03-25', '2017-03-25', 10, 'Sunday', '56e87cbeedde77493', '2016-03-25 13:52:43');

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
  `lastModifiedBy` varchar(40) NOT NULL
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
  `lastModifiedBy` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `budget_details`
--

CREATE TABLE IF NOT EXISTS `budget_details` (
  `budgetdetailsid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `projectid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `budgetsegmentid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `allocatedbudget` int(20) NOT NULL,
  `alertlevel` int(20) NOT NULL,
  `createdby` varchar(20) CHARACTER SET utf8 NOT NULL,
  `creationdate` datetime NOT NULL,
  `lastmodificationdate` datetime NOT NULL,
  `lastmodifiedby` varchar(20) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `budget_details`
--

INSERT INTO `budget_details` (`budgetdetailsid`, `projectid`, `budgetsegmentid`, `allocatedbudget`, `alertlevel`, `createdby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`) VALUES
('56f007f10b505', '2', '56f0064cb0ef3', 5456456, 34, 'admin', '2016-03-21 20:10:49', '2016-03-21 20:10:49', 'admin'),
('56fa90c982209', '56f3a77b190f87403', '56f58b0ac538f', 10000, 232, 'admin', '2016-03-29 19:57:21', '2016-03-29 19:57:21', 'admin'),
('56fa90c9c718f', '56f3a77b190f87403', '56fa90a03d321', 3453, 345, 'admin', '2016-03-29 19:57:21', '2016-03-29 19:57:21', 'admin');

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
  `lastmodifiedby` varchar(20) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `budget_segment`
--

INSERT INTO `budget_segment` (`budgetsegmentid`, `segmentname`, `createdby`, `creationdate`, `lastmodifieddate`, `lastmodifiedby`) VALUES
('56f0064cb0ef3', 'segment', 'admin', '2016-03-21 20:03:48', '2016-03-21 20:03:48', 'admin'),
('56f4fb1717ed1', 'sassd', 'admin', '2016-03-25 14:17:19', '2016-03-25 14:17:19', 'admin'),
('56f58b0ab3e33', 'dfsdf', 'admin', '2016-03-26 00:31:30', '2016-03-26 00:31:30', 'admin'),
('56f58b0ac538f', 'sdfsdfsdf', 'admin', '2016-03-26 00:31:30', '2016-03-26 00:31:30', 'admin'),
('56fa90a03d321', 'seg', 'admin', '2016-03-29 19:56:40', '2016-03-29 19:56:40', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `companies_involved_in_project`
--

CREATE TABLE IF NOT EXISTS `companies_involved_in_project` (
`id` int(10) unsigned NOT NULL,
  `ProjectID` varchar(45) NOT NULL,
  `companyId` varchar(45) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `companies_involved_in_project`
--

INSERT INTO `companies_involved_in_project` (`id`, `ProjectID`, `companyId`) VALUES
(1, '56f3a77b190f87403', '56eed65bbf5ef9430'),
(2, '56f4f753434502487', '56eed65bbf5ef9430');

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
  `lastModificationDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `companymaster`
--

INSERT INTO `companymaster` (`companyId`, `companyName`, `companyAbbrevation`, `startDate`, `address`, `city`, `state`, `country`, `pincode`, `emailId`, `phoneNumber`, `createdBy`, `creationDate`, `lastModifiedBy`, `lastModificationDate`) VALUES
('56eed65bbf5ef9430', 'company', 'comp', '2016-03-19', 'dfdf sdgsdg sg', 'pune', 'mj', 'dsf', '34345', 'atul@mail.com', '35345345345', '56e87cbeedde77493', '2016-03-20 22:26:59', '56e87cbeedde77493', '2016-03-20 22:26:59');

-- --------------------------------------------------------

--
-- Table structure for table `company_bank_details`
--

CREATE TABLE IF NOT EXISTS `company_bank_details` (
  `companyId` varchar(20) NOT NULL,
  `BankName` varchar(80) NOT NULL,
  `BankBranch` varchar(20) NOT NULL,
  `AccountName` varchar(80) NOT NULL,
  `AccountNo` varchar(20) NOT NULL,
  `AccountType` varchar(20) NOT NULL,
  `IFSCCode` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `company_master`
--

CREATE TABLE IF NOT EXISTS `company_master` (
  `CompanyID` varchar(20) NOT NULL,
  `CompanyName` varchar(45) NOT NULL,
  `CompanyAbbrevation` varchar(10) NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `CompanyLogo` blob NOT NULL,
  `CompanyFooterImage` blob,
  `CreationDate` datetime NOT NULL,
  `CreatedBy` varchar(20) NOT NULL,
  `LastModifiedDate` datetime NOT NULL,
  `LastModifiedBy` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `company_taxtion_details`
--

CREATE TABLE IF NOT EXISTS `company_taxtion_details` (
  `companyId` varchar(20) NOT NULL,
  `VATNo` varchar(20) NOT NULL,
  `VATEffectiveFrom` date NOT NULL,
  `CSTNo` varchar(20) NOT NULL,
  `CSTEffetiveFrom` date NOT NULL,
  `PAN` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  `lastModifiedBy` varchar(40) NOT NULL
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
  `lastmodifiedby` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cost_center_master`
--

INSERT INTO `cost_center_master` (`costcenterid`, `projectid`, `createdby`, `creationdate`, `lastmodifieddate`, `lastmodifiedby`) VALUES
('56f00746cf00e', '2', 'admin', '2016-03-21 20:07:58', '2016-03-21 20:07:58', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `customer_master`
--

CREATE TABLE IF NOT EXISTS `customer_master` (
  `CustomerId` varchar(20) NOT NULL DEFAULT '',
  `CustomerName` varchar(50) NOT NULL DEFAULT '',
  `Address` varchar(80) NOT NULL DEFAULT '',
  `City` varchar(50) NOT NULL DEFAULT '',
  `State` varchar(50) NOT NULL DEFAULT '',
  `Country` varchar(50) NOT NULL DEFAULT '',
  `Pincode` varchar(50) NOT NULL DEFAULT '',
  `Mobileno` varchar(15) NOT NULL DEFAULT '',
  `Landlineno` varchar(20) DEFAULT NULL,
  `FaxNo` varchar(20) DEFAULT NULL,
  `EmailId` varchar(60) NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `CreationDate` datetime NOT NULL,
  `CreatedBy` varchar(20) NOT NULL,
  `LastModificationDate` datetime NOT NULL,
  `LastModifiedBy` varchar(20) DEFAULT NULL,
  `DeletedBy` varchar(20) DEFAULT NULL,
  `DeletionDate` datetime DEFAULT NULL,
  `VATNo` varchar(20) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `CSTNo` varchar(20) DEFAULT NULL,
  `PAN` varchar(20) DEFAULT NULL,
  `ServiceTaxNo` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_master`
--

INSERT INTO `customer_master` (`CustomerId`, `CustomerName`, `Address`, `City`, `State`, `Country`, `Pincode`, `Mobileno`, `Landlineno`, `FaxNo`, `EmailId`, `isDeleted`, `CreationDate`, `CreatedBy`, `LastModificationDate`, `LastModifiedBy`, `DeletedBy`, `DeletionDate`, `VATNo`, `CSTNo`, `PAN`, `ServiceTaxNo`) VALUES
('56f3a5631f4fe9732', 'customer', 'dsdfsdf', 'Mumbai', 'Delhi', 'America', 'undefined', '67868', '7866786789', '76786798', 'as@as.com', 0, '2016-03-24 00:00:00', '56e87cbeedde77493', '2016-03-24 00:00:00', '56e87cbeedde77493', NULL, NULL, '7678787', '7678787', '7678787', '7678787'),
('56f4d73e24a9a7186', 'asdasdasdas', 'asdasdasd', 'Pune', 'Maharashtra', 'India', 'undefined', '123123123', '123123123', '12312312', 'asd@123.com', 0, '2016-03-25 00:00:00', '56e87cbeedde77493', '2016-03-25 00:00:00', '56e87cbeedde77493', NULL, NULL, '123123V', '123123C', 'asd1231232', '123123123'),
('56f4f6a14ff5a3970', 'Kumar', 'asdasdasd', 'Pune', 'Maharashtra', 'India', 'undefined', '123123123', '1231231', '1231231123', 'ascc@asd.com', 0, '2016-03-25 00:00:00', '56e87cbeedde77493', '2016-03-25 00:00:00', '56e87cbeedde77493', NULL, NULL, '1231231231V', '1123123112C', '12312asd123123', '123123123');

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
  `last_modification_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `employee_on_payroll`
--

INSERT INTO `employee_on_payroll` (`employee_id`, `leave_approver_id`, `created_by`, `creation_date`, `last_modified_by`, `last_modification_date`) VALUES
('56e87cbeedde77493', '56f4e50ef0ec46476', '56e87cbeedde77493', '2016-03-25 13:51:23', '56e87cbeedde77493', '2016-03-25 13:51:23'),
('56f3a735959d29316', '56f4e50ef0ec46476', '56e87cbeedde77493', '2016-03-25 13:51:13', '56e87cbeedde77493', '2016-03-25 13:51:13'),
('56f4e50ef0ec46476', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-26 11:57:49', '56e87cbeedde77493', '2016-03-26 11:57:49');

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
  `lastmodifiedby` varchar(20) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `expense_details`
--

CREATE TABLE IF NOT EXISTS `expense_details` (
  `expensedetailsid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `projectid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `budgetsegmentid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `amount` int(20) NOT NULL,
  `description` text CHARACTER SET utf8 NOT NULL,
  `creadtedby` varchar(20) CHARACTER SET utf8 NOT NULL,
  `creationdate` datetime NOT NULL,
  `lastmodificationdate` datetime NOT NULL,
  `lastmodifiedby` varchar(20) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `expense_details`
--

INSERT INTO `expense_details` (`expensedetailsid`, `projectid`, `budgetsegmentid`, `amount`, `description`, `creadtedby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`) VALUES
('56f00a3e3a050', '2', '56f0064cb0ef3', 3432, 'df dfdf', 'admin', '2016-03-21 20:20:38', '2016-03-21 20:20:38', 'admin'),
('56f4fb62775e9', '1', '56f4fb1717ed1', 10, 'asdasd', 'admin', '2016-03-25 14:18:34', '2016-03-25 14:18:34', 'admin'),
('56f5946f89c92', '56f3a77b190f87403', '56f4fb1717ed1', 434, 'dfgdfgdfg', 'admin', '2016-03-26 01:11:35', '2016-03-26 01:11:35', 'admin'),
('56f69b2be2624', '56f3a77b190f87403', '56f0064cb0ef3', 1000, 'gele kashala tariiii', 'admin', '2016-03-26 19:52:35', '2016-03-26 19:52:35', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `follow_up_employee`
--

CREATE TABLE IF NOT EXISTS `follow_up_employee` (
`follow_up_employee_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `date_of_assignment` datetime NOT NULL,
  `last_modification_date` datetime NOT NULL,
  `last_modified_by` varchar(30) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  `follow_up_id` int(11) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `follow_up_employee`
--

INSERT INTO `follow_up_employee` (`follow_up_employee_id`, `employee_id`, `date_of_assignment`, `last_modification_date`, `last_modified_by`, `created_by`, `creation_date`, `follow_up_id`) VALUES
(1, 0, '2016-03-25 13:48:03', '2016-03-25 13:48:03', '56e87cbeedde77493', '56e87cbeedde77493', '2016-03-25 13:48:03', 1);

-- --------------------------------------------------------

--
-- Table structure for table `holiday_in_year`
--

CREATE TABLE IF NOT EXISTS `holiday_in_year` (
  `caption_of_year` varchar(30) NOT NULL,
  `holiday_date` date NOT NULL,
  `description` varchar(100) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `holiday_in_year`
--

INSERT INTO `holiday_in_year` (`caption_of_year`, `holiday_date`, `description`, `created_by`, `creation_date`) VALUES
('2020', '2016-03-30', 'asdasd', '56e87cbeedde77493', '2016-03-25 13:54:16');

-- --------------------------------------------------------

--
-- Table structure for table `inhouse_inward_entry`
--

CREATE TABLE IF NOT EXISTS `inhouse_inward_entry` (
`inhouseinwardid` bigint(20) NOT NULL,
  `productionbatchmasterid` bigint(20) NOT NULL,
  `producedgoodid` bigint(20) NOT NULL,
  `warehouseid` varchar(20) NOT NULL,
  `companyid` varchar(20) NOT NULL,
  `dateofentry` date NOT NULL,
  `supervisorid` varchar(20) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` date NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` date NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `inhouse_inward_entry`
--

INSERT INTO `inhouse_inward_entry` (`inhouseinwardid`, `productionbatchmasterid`, `producedgoodid`, `warehouseid`, `companyid`, `dateofentry`, `supervisorid`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(1, 1, 1, '56', '56eed65bbf5ef9430', '2016-03-24', 'sadasd', '56e87cbeedde77493', '2016-03-25', '56e87cbeedde77493', '2016-03-25'),
(2, 2, 2, '56', '56eed65bbf5ef9430', '2016-03-24', 'asdasd', '56e87cbeedde77493', '2016-03-25', '56e87cbeedde77493', '2016-03-25'),
(3, 3, 3, '56', '56eed65bbf5ef9430', '2016-03-24', 'aasda', '56e87cbeedde77493', '2016-03-25', '56e87cbeedde77493', '2016-03-25'),
(5, 6, 5, '56', '56eed65bbf5ef9430', '2016-03-24', 'asdasd', '56e87cbeedde77493', '2016-03-25', '56e87cbeedde77493', '2016-03-25');

-- --------------------------------------------------------

--
-- Table structure for table `inhouse_transportation_details`
--

CREATE TABLE IF NOT EXISTS `inhouse_transportation_details` (
`inhousetransportid` bigint(20) NOT NULL,
  `inhouseinwardid` bigint(20) NOT NULL,
  `transportationmode` varchar(25) NOT NULL,
  `vehicleno` varchar(15) NOT NULL,
  `drivername` varchar(40) NOT NULL,
  `transportagency` varchar(40) NOT NULL,
  `cost` int(11) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` date NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` date NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `inhouse_transportation_details`
--

INSERT INTO `inhouse_transportation_details` (`inhousetransportid`, `inhouseinwardid`, `transportationmode`, `vehicleno`, `drivername`, `transportagency`, `cost`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(1, 5, 'road', 'mh12 jh 1234', 'asd', 'asd', 100, '56e87cbeedde77493', '2016-03-25', '56e87cbeedde77493', '2016-03-25');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE IF NOT EXISTS `inventory` (
`inventoryid` bigint(20) NOT NULL,
  `materialid` bigint(20) NOT NULL,
  `warehouseid` varchar(20) DEFAULT 'NONE',
  `companyid` varchar(20) DEFAULT NULL,
  `totalquantity` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=28 ;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`inventoryid`, `materialid`, `warehouseid`, `companyid`, `totalquantity`) VALUES
(23, 115, '56eed65bbf5ef9430', '56eed671666a24508', 5),
(25, 116, '56eed65bbf5ef9430', '56eed671666a24508', 140),
(26, 117, '56eed65bbf5ef9430', '56eed671666a24508', 9),
(27, 117, '56eed65bbf5ef9430', '56eed671666a24508', 999);

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE IF NOT EXISTS `invoice` (
  `InvoiceNo` varchar(20) NOT NULL,
  `QuotationId` varchar(20) NOT NULL,
  `InvoiceDate` date NOT NULL,
  `InvoiceTitle` varchar(20) NOT NULL,
  `TotalAmount` decimal(10,0) NOT NULL,
  `RoundingOffFactor` decimal(10,0) NOT NULL,
  `GrandTotal` decimal(10,0) DEFAULT NULL,
  `InvoiceBLOB` varchar(40) DEFAULT NULL,
  `isPaymentRetention` tinyint(1) NOT NULL,
  `PurchasersVATNo` varchar(20) NOT NULL,
  `PAN` varchar(20) NOT NULL,
  `CreatedBy` varchar(20) NOT NULL,
  `ContactPerson` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`InvoiceNo`, `QuotationId`, `InvoiceDate`, `InvoiceTitle`, `TotalAmount`, `RoundingOffFactor`, `GrandTotal`, `InvoiceBLOB`, `isPaymentRetention`, `PurchasersVATNo`, `PAN`, `CreatedBy`, `ContactPerson`) VALUES
('222333', '56f3b614288bf9618', '2016-03-24', 'Invoice Title', '121100', '0', '121100', ' ', 1, '11', '123456', '56e87cbeedde77493', 'asdasd');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_details`
--

CREATE TABLE IF NOT EXISTS `invoice_details` (
  `DetailID` varchar(20) NOT NULL,
  `InvoiceId` varchar(20) NOT NULL,
  `DetailNo` decimal(10,0) NOT NULL,
  `Title` varchar(40) NOT NULL,
  `Description` varchar(200) NOT NULL,
  `Quantity` decimal(10,0) NOT NULL,
  `UnitRate` decimal(10,0) NOT NULL,
  `Amount` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `invoice_details`
--

INSERT INTO `invoice_details` (`DetailID`, `InvoiceId`, `DetailNo`, `Title`, `Description`, `Quantity`, `UnitRate`, `Amount`) VALUES
('56f3d4b59ec988881', '222333', '1', 'dsfdsf', 'dfgdfg', '100', '1000', '100000');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_tax_applicable_to`
--

CREATE TABLE IF NOT EXISTS `invoice_tax_applicable_to` (
  `TaxId` varchar(20) NOT NULL,
  `DetailsId` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `invoice_tax_applicable_to`
--

INSERT INTO `invoice_tax_applicable_to` (`TaxId`, `DetailsId`) VALUES
('56f3d4b5a17901896', '56f3d4b59ec988881');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_tax_details`
--

CREATE TABLE IF NOT EXISTS `invoice_tax_details` (
  `TaxId` varchar(20) NOT NULL,
  `InvoiceId` varchar(20) NOT NULL,
  `TaxName` varchar(20) NOT NULL,
  `TaxAmount` decimal(10,0) NOT NULL,
  `TaxPercentage` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `invoice_tax_details`
--

INSERT INTO `invoice_tax_details` (`TaxId`, `InvoiceId`, `TaxName`, `TaxAmount`, `TaxPercentage`) VALUES
('56f3d4b5a17901896', '222333', 'dfgdfg', '10000', 10);

-- --------------------------------------------------------

--
-- Table structure for table `inward`
--

CREATE TABLE IF NOT EXISTS `inward` (
`inwardid` bigint(20) NOT NULL,
  `warehouseid` varchar(20) NOT NULL,
  `companyid` varchar(20) NOT NULL,
  `supervisorid` varchar(20) NOT NULL,
  `dateofentry` datetime NOT NULL,
  `inwardno` varchar(20) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=134 ;

--
-- Dumping data for table `inward`
--

INSERT INTO `inward` (`inwardid`, `warehouseid`, `companyid`, `supervisorid`, `dateofentry`, `inwardno`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(130, '56eed671666a24508', '56eed65bbf5ef9430', 'sdfsdf', '2016-03-20 00:00:00', '35345435', '56e87cbeedde77493', '2016-03-20 22:29:18', '56e87cbeedde77493', '2016-03-20 22:29:18'),
(131, '56eed671666a24508', '56eed65bbf5ef9430', 'asdasd', '2016-03-25 00:00:00', 'INW123', '56e87cbeedde77493', '2016-03-25 11:47:08', '56e87cbeedde77493', '2016-03-25 11:47:08'),
(132, '56eed671666a24508', '56eed65bbf5ef9430', 'dasdasda', '2016-03-25 00:00:00', 'INWD1123', '56e87cbeedde77493', '2016-03-25 11:49:41', '56e87cbeedde77493', '2016-03-25 11:49:41'),
(133, '56eed671666a24508', '56eed65bbf5ef9430', 'kasdkjk', '2016-03-25 00:00:00', 'asdkjkk', '56e87cbeedde77493', '2016-03-25 12:58:12', '56e87cbeedde77493', '2016-03-25 12:58:12');

-- --------------------------------------------------------

--
-- Table structure for table `inward_details`
--

CREATE TABLE IF NOT EXISTS `inward_details` (
`inwarddetailsid` bigint(20) NOT NULL,
  `inwardid` bigint(20) NOT NULL,
  `materialid` bigint(20) NOT NULL,
  `supplierid` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `packagedunits` text NOT NULL,
  `size` varchar(20) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=114 ;

--
-- Dumping data for table `inward_details`
--

INSERT INTO `inward_details` (`inwarddetailsid`, `inwardid`, `materialid`, `supplierid`, `quantity`, `packagedunits`, `size`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(109, 130, 115, 21, 20, 'bag', '20', '56e87cbeedde77493', '2016-03-20 22:29:18', '56e87cbeedde77493', '2016-03-20 22:29:18'),
(110, 131, 115, 21, 100, 'kg', '10', '56e87cbeedde77493', '2016-03-25 11:47:08', '56e87cbeedde77493', '2016-03-25 11:47:08'),
(111, 131, 116, 21, 10, 'kg', '16', '56e87cbeedde77493', '2016-03-25 11:47:08', '56e87cbeedde77493', '2016-03-25 11:47:08'),
(112, 132, 117, 21, 10, 'kg', '10', '56e87cbeedde77493', '2016-03-25 11:49:41', '56e87cbeedde77493', '2016-03-25 11:49:41'),
(113, 133, 117, 21, 1000, 'bags', '27.2', '56e87cbeedde77493', '2016-03-25 12:58:12', '56e87cbeedde77493', '2016-03-25 12:58:12');

-- --------------------------------------------------------

--
-- Table structure for table `inward_transportation_details`
--

CREATE TABLE IF NOT EXISTS `inward_transportation_details` (
`inwardtranspid` bigint(20) NOT NULL,
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
  `	inwarddetailsid` bigint(20) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `inward_transportation_details`
--

INSERT INTO `inward_transportation_details` (`inwardtranspid`, `inwardid`, `transportationmode`, `vehicleno`, `drivername`, `transportagency`, `cost`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`, `remark`, `	inwarddetailsid`) VALUES
(1, 133, '3', 'MH12 jh 1232', 'xcvxcb', 'asdasd', 2000, '56e87cbeedde77493', '2016-03-25 12:58:13', '56e87cbeedde77493', '2016-03-25 12:58:13', 'asdas', 0);

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
  `action_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `leave_application_master`
--

INSERT INTO `leave_application_master` (`application_id`, `leave_applied_by`, `from_date`, `to_date`, `type_of_leaves`, `no_of_leaves`, `reason`, `status`, `application_date`, `action_by`, `action_date`) VALUES
('56f4f587b6b144845', '56e87cbeedde77493', '2016-03-24', '2016-03-30', 'Paid', 5, 'asdasd', 'pending', '2016-03-25', 'null', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `logindetails`
--

CREATE TABLE IF NOT EXISTS `logindetails` (
  `userId` varchar(20) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `password` varchar(60) NOT NULL,
  `lastLoginDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `logindetails`
--

INSERT INTO `logindetails` (`userId`, `userName`, `password`, `lastLoginDate`) VALUES
('568bf524ab16f2627', 'super@mail.com', 'a9993e364706816aba3e25717850c26c9cd0d89d', '2016-03-16 01:14:42'),
('56e87cbeedde77493', 'super@mail.com', '14ab51550e69f513a5355e61b8d9330fd6ee37c6', '2016-03-29 19:47:03'),
('56f3a735959d29316', 'atul@mail.com', '9a980f188084b4f4b0665dfcd0c62be7f0fefd9b', '0000-00-00 00:00:00'),
('56f4d6cb1d4c72234', 'asdjh@123.coma', 'd9ee943a55f6e04cb47bc33698ea25d3c2efc844', '0000-00-00 00:00:00'),
('56f4e50ef0ec46476', 'madhuramsheth@gmail.com', 'cefbdb72b661d9d9e050f4f8bb8975303dcf9cab', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `material`
--

CREATE TABLE IF NOT EXISTS `material` (
`materialid` bigint(20) NOT NULL,
  `productmasterid` bigint(20) NOT NULL,
  `productdetailsid` bigint(20) NOT NULL,
  `productpackagingid` bigint(20) NOT NULL,
  `abbrevation` varchar(25) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=119 ;

--
-- Dumping data for table `material`
--

INSERT INTO `material` (`materialid`, `productmasterid`, `productdetailsid`, `productpackagingid`, `abbrevation`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(115, 133, 124, 133, 'pro', '56e87cbeedde77493', '2016-03-20 22:28:47', '56e87cbeedde77493', '2016-03-20 22:28:47'),
(116, 134, 125, 134, 'dfdff', '56e87cbeedde77493', '2016-03-22 20:27:10', '56e87cbeedde77493', '2016-03-22 20:27:10'),
(117, 135, 126, 135, 'asdads', '56e87cbeedde77493', '2016-03-25 11:49:12', '56e87cbeedde77493', '2016-03-25 11:49:12'),
(118, 136, 127, 136, 'ch', '56e87cbeedde77493', '2016-03-25 12:54:56', '56e87cbeedde77493', '2016-03-25 12:54:56');

-- --------------------------------------------------------

--
-- Table structure for table `materialtype`
--

CREATE TABLE IF NOT EXISTS `materialtype` (
`materialtypeid` bigint(20) NOT NULL,
  `materialtype` varchar(30) NOT NULL,
  `delflg` varchar(1) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=48 ;

--
-- Dumping data for table `materialtype`
--

INSERT INTO `materialtype` (`materialtypeid`, `materialtype`, `delflg`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(44, 'Material', 'N', 'Pranav', '2016-03-20 22:28:20', 'Pranav', '2016-03-20 22:28:20'),
(45, 'materialTest12344', 'N', 'Pranav', '2016-03-22 22:02:07', 'Pranav', '2016-03-22 22:02:07'),
(46, 'stampedConcrete', 'N', 'Pranav', '2016-03-25 12:52:47', 'Pranav', '2016-03-25 12:52:47'),
(47, 'epoxyMaterial', 'N', 'Pranav', '2016-03-25 13:14:35', 'Pranav', '2016-03-25 13:14:35');

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

--
-- Dumping data for table `material_expense_bills`
--

INSERT INTO `material_expense_bills` (`billid`, `materialexpensedetailsid`, `billno`, `billissueingentity`, `amount`, `dateofbill`, `createdby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`) VALUES
('56f58d781a772', '56f58d780151a', '5456456', 'issued', 100, '1212-12-12', '56e87cbeedde77493', '2016-03-26 00:41:52', '2016-03-26 00:41:52', '56e87cbeedde77493'),
('56f5936a42334', '56f5936a03f1a', '345345', 'dfgdfg', 324, '1212-12-12', '56e87cbeedde77493', '2016-03-26 01:07:14', '2016-03-26 01:07:14', '56e87cbeedde77493');

-- --------------------------------------------------------

--
-- Table structure for table `material_expense_details`
--

CREATE TABLE IF NOT EXISTS `material_expense_details` (
  `materialexpensedetailsid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `projectid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `materialid` bigint(20) NOT NULL,
  `amount` int(20) NOT NULL,
  `description` text CHARACTER SET utf8 NOT NULL,
  `createdby` varchar(20) CHARACTER SET utf8 NOT NULL,
  `creationdate` datetime NOT NULL,
  `lastmodificationdate` datetime NOT NULL,
  `lastmodifiedby` varchar(20) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `material_expense_details`
--

INSERT INTO `material_expense_details` (`materialexpensedetailsid`, `projectid`, `materialid`, `amount`, `description`, `createdby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`) VALUES
('56f009708eb14', '2', 115, 345, 'dfdsfdsfds dsf ds', '56e87cbeedde77493', '2016-03-21 20:17:12', '2016-03-21 20:17:12', '56e87cbeedde77493'),
('56f4fb42ea450', '1', 117, 100, 'asdasdasd', '56e87cbeedde77493', '2016-03-25 14:18:02', '2016-03-25 14:18:02', '56e87cbeedde77493'),
('56f58d780151a', '56f3a77b190f87403', 117, 100, 'xvxcvxcvcxxcc xc cxv xv', '56e87cbeedde77493', '2016-03-26 00:41:52', '2016-03-26 00:41:52', '56e87cbeedde77493'),
('56f5936a03f1a', '56f3a77b190f87403', 117, 324, 'xcvvxcvcxv', '56e87cbeedde77493', '2016-03-26 01:07:14', '2016-03-26 01:07:14', '56e87cbeedde77493');

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
`outwardid` bigint(20) NOT NULL,
  `warehouseid` varchar(20) NOT NULL,
  `companyid` varchar(20) NOT NULL,
  `supervisorid` varchar(20) NOT NULL,
  `dateofentry` datetime NOT NULL,
  `outwardno` varchar(50) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=32 ;

--
-- Dumping data for table `outward`
--

INSERT INTO `outward` (`outwardid`, `warehouseid`, `companyid`, `supervisorid`, `dateofentry`, `outwardno`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(30, '56eed671666a24508', '56eed65bbf5ef9430', 'dfffdfgdfg', '2016-03-20 00:00:00', '234324', '56e87cbeedde77493', '2016-03-20 22:29:44', '56e87cbeedde77493', '2016-03-20 22:29:44'),
(31, '56eed671666a24508', '56eed65bbf5ef9430', 'kajkasd', '2016-03-25 00:00:00', 'mansdj', '56e87cbeedde77493', '2016-03-25 13:00:19', '56e87cbeedde77493', '2016-03-25 13:00:19');

-- --------------------------------------------------------

--
-- Table structure for table `outward_details`
--

CREATE TABLE IF NOT EXISTS `outward_details` (
`outwarddtlsid` bigint(20) NOT NULL,
  `outwardid` bigint(20) NOT NULL,
  `materialid` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `packagedunits` text NOT NULL,
  `packagesize` varchar(20) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=34 ;

--
-- Dumping data for table `outward_details`
--

INSERT INTO `outward_details` (`outwarddtlsid`, `outwardid`, `materialid`, `quantity`, `packagedunits`, `packagesize`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(32, 30, 115, 10, 'bag', '20', '56e87cbeedde77493', '2016-03-20 22:29:44', '56e87cbeedde77493', '2016-03-20 22:29:44'),
(33, 31, 117, 1, 'bags', '27.2', '56e87cbeedde77493', '2016-03-25 13:00:19', '56e87cbeedde77493', '2016-03-25 13:00:19');

-- --------------------------------------------------------

--
-- Table structure for table `outward_transportation_details`
--

CREATE TABLE IF NOT EXISTS `outward_transportation_details` (
`outwardtranspid` bigint(20) NOT NULL,
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
  `remark` varchar(100) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `outward_transportation_details`
--

INSERT INTO `outward_transportation_details` (`outwardtranspid`, `outwardid`, `transportationmode`, `vehicleno`, `drivername`, `transportagency`, `cost`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`, `remark`) VALUES
(1, 31, '3', 'Mh12 jh 1231', 'asdasd', 'jhjasdh', 100, '56e87cbeedde77493', '2016-03-25 13:00:20', '56e87cbeedde77493', '2016-03-25 13:00:20', 'askdjks');

-- --------------------------------------------------------

--
-- Table structure for table `paymentretention`
--

CREATE TABLE IF NOT EXISTS `paymentretention` (
  `InvoiceNo` varchar(20) NOT NULL,
  `RetentionFactor` decimal(10,0) NOT NULL,
  `RetentioonCompletionDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `payment_mode_details`
--

CREATE TABLE IF NOT EXISTS `payment_mode_details` (
`payment_mode_id` int(11) NOT NULL,
  `instrument_of_payment` varchar(30) NOT NULL,
  `number_of_instrument` varchar(30) NOT NULL,
  `bank_name` varchar(30) NOT NULL,
  `branch_name` varchar(30) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  `payment_id` int(11) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `payment_mode_details`
--

INSERT INTO `payment_mode_details` (`payment_mode_id`, `instrument_of_payment`, `number_of_instrument`, `bank_name`, `branch_name`, `created_by`, `creation_date`, `payment_id`) VALUES
(1, 'cheque', '123123123', 'asdasda', 'asdasdasd', '56e87cbeedde77493', '2016-03-25 13:48:03', 1);

-- --------------------------------------------------------

--
-- Table structure for table `payment_package_details`
--

CREATE TABLE IF NOT EXISTS `payment_package_details` (
`package_details_id` int(11) NOT NULL,
  `package_element_name` varchar(30) NOT NULL,
  `package_element_quantity` varchar(15) NOT NULL,
  `package_element_rate` varchar(15) NOT NULL,
  `package_element_amount` varchar(15) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL,
  `payment_package_id` int(11) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `payment_package_details`
--

INSERT INTO `payment_package_details` (`package_details_id`, `package_element_name`, `package_element_quantity`, `package_element_rate`, `package_element_amount`, `created_by`, `creation_date`, `payment_package_id`) VALUES
(1, 'asd', '10', '20', '200', '56e87cbeedde77493', '2016-03-25 13:44:36', 1),
(2, 'asdasd', '20', '30', '600', '56e87cbeedde77493', '2016-03-25 13:44:36', 1),
(3, 'asd', '10', '20', '200', '56e87cbeedde77493', '2016-03-25 13:48:03', 2),
(4, 'asdasd', '20', '30', '600', '56e87cbeedde77493', '2016-03-25 13:48:03', 2);

-- --------------------------------------------------------

--
-- Table structure for table `payment_package_master`
--

CREATE TABLE IF NOT EXISTS `payment_package_master` (
`payment_package_id` int(11) NOT NULL,
  `package_name` varchar(50) NOT NULL,
  `package_description` varchar(200) NOT NULL,
  `package_dateof_creation` datetime NOT NULL,
  `package_customized` varchar(5) NOT NULL,
  `created_by` varchar(30) NOT NULL,
  `creation_date` datetime NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `payment_package_master`
--

INSERT INTO `payment_package_master` (`payment_package_id`, `package_name`, `package_description`, `package_dateof_creation`, `package_customized`, `created_by`, `creation_date`) VALUES
(1, 'abcd', 'asdasdasdasdasdasdas', '2016-03-25 13:44:36', 'false', '56e87cbeedde77493', '2016-03-25 13:44:36'),
(2, 'abcd', 'asdasdasdasdasdasdas', '2016-03-25 13:48:03', 'true', '56e87cbeedde77493', '2016-03-25 13:48:03');

-- --------------------------------------------------------

--
-- Table structure for table `payment_retention_followup`
--

CREATE TABLE IF NOT EXISTS `payment_retention_followup` (
  `FollowupId` varchar(20) NOT NULL,
  `InvoiceNo` varchar(20) NOT NULL,
  `AssignEmployee` varchar(20) NOT NULL,
  `FolloupDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `payment_retention_followup_details`
--

CREATE TABLE IF NOT EXISTS `payment_retention_followup_details` (
  `FollowupId` varchar(20) NOT NULL,
  `Description` varchar(80) NOT NULL,
  `ConductDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pendingtempaceessrequest`
--

CREATE TABLE IF NOT EXISTS `pendingtempaceessrequest` (
  `requestId` varchar(20) NOT NULL,
  `assignedApproaver` varchar(20) NOT NULL,
  `assignedBy` varchar(20) NOT NULL,
  `assignedDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `po_to_inward`
--

CREATE TABLE IF NOT EXISTS `po_to_inward` (
`potoinwardid` bigint(20) NOT NULL,
  `ponumber` varchar(50) NOT NULL,
  `inwardid` bigint(20) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` date NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `po_to_outward`
--

CREATE TABLE IF NOT EXISTS `po_to_outward` (
`potooutwardid` bigint(20) NOT NULL,
  `ponumber` varchar(50) NOT NULL,
  `outwardid` bigint(20) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` date NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `produced_good`
--

CREATE TABLE IF NOT EXISTS `produced_good` (
`producedgoodid` bigint(20) NOT NULL,
  `productionbatchmasterid` bigint(20) NOT NULL,
  `materialproducedid` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `packagedunits` int(11) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` date NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` date NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `produced_good`
--

INSERT INTO `produced_good` (`producedgoodid`, `productionbatchmasterid`, `materialproducedid`, `quantity`, `packagedunits`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(1, 1, 116, 100, 0, '56e87cbeedde77493', '2016-03-25', '56e87cbeedde77493', '2016-03-25'),
(2, 2, 116, 10, 0, '56e87cbeedde77493', '2016-03-25', '56e87cbeedde77493', '2016-03-25'),
(3, 3, 116, 10, 0, '56e87cbeedde77493', '2016-03-25', '56e87cbeedde77493', '2016-03-25'),
(5, 6, 116, 10, 0, '56e87cbeedde77493', '2016-03-25', '56e87cbeedde77493', '2016-03-25');

-- --------------------------------------------------------

--
-- Table structure for table `production_batch_master`
--

CREATE TABLE IF NOT EXISTS `production_batch_master` (
`productionbatchmasterid` bigint(20) NOT NULL,
  `batchno` varchar(20) NOT NULL,
  `batchcodename` varchar(30) NOT NULL,
  `dateofentry` date NOT NULL,
  `productionstartdate` date NOT NULL,
  `productionenddate` date NOT NULL,
  `productionsupervisorid` varchar(20) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` date NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` date NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `production_batch_master`
--

INSERT INTO `production_batch_master` (`productionbatchmasterid`, `batchno`, `batchcodename`, `dateofentry`, `productionstartdate`, `productionenddate`, `productionsupervisorid`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(1, 'PB678', 'asdasd', '2016-03-24', '2016-03-24', '2016-03-25', 'sadasd', '56e87cbeedde77493', '2016-03-25', '56e87cbeedde77493', '2016-03-25'),
(2, 'PB78289', 'askdjh', '2016-03-24', '2016-03-24', '2016-03-25', 'asdasd', '56e87cbeedde77493', '2016-03-25', '56e87cbeedde77493', '2016-03-25'),
(3, 'asdasd', 'asdasd', '2016-03-24', '2016-03-24', '2016-03-25', 'aasda', '56e87cbeedde77493', '2016-03-25', '56e87cbeedde77493', '2016-03-25'),
(6, 'pasd', 'aasdasd', '2016-03-24', '2016-03-24', '2016-03-25', 'asdasd', '56e87cbeedde77493', '2016-03-25', '56e87cbeedde77493', '2016-03-25');

-- --------------------------------------------------------

--
-- Table structure for table `production_raw_materials_details`
--

CREATE TABLE IF NOT EXISTS `production_raw_materials_details` (
`prodrawmaterialdtlsid` bigint(20) NOT NULL,
  `productionbatchmasterid` bigint(20) NOT NULL,
  `materialid` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` date NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` date NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `production_raw_materials_details`
--

INSERT INTO `production_raw_materials_details` (`prodrawmaterialdtlsid`, `productionbatchmasterid`, `materialid`, `quantity`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(1, 1, 115, 1, '56e87cbeedde77493', '2016-03-25', '56e87cbeedde77493', '2016-03-25'),
(2, 2, 115, 1, '56e87cbeedde77493', '2016-03-25', '56e87cbeedde77493', '2016-03-25'),
(3, 3, 115, 2, '56e87cbeedde77493', '2016-03-25', '56e87cbeedde77493', '2016-03-25'),
(5, 6, 115, 1, '56e87cbeedde77493', '2016-03-25', '56e87cbeedde77493', '2016-03-25');

-- --------------------------------------------------------

--
-- Table structure for table `product_details`
--

CREATE TABLE IF NOT EXISTS `product_details` (
`productdetailsid` bigint(20) NOT NULL,
  `productmasterid` bigint(20) NOT NULL,
  `color` varchar(20) NOT NULL,
  `description` varchar(300) NOT NULL,
  `alertquantity` decimal(10,2) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=128 ;

--
-- Dumping data for table `product_details`
--

INSERT INTO `product_details` (`productdetailsid`, `productmasterid`, `color`, `description`, `alertquantity`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(124, 133, 'phdsgbkjdsf', 'dsf dfgd fgdg', '20.00', '56e87cbeedde77493', '2016-03-20 22:28:47', '56e87cbeedde77493', '2016-03-20 22:28:47'),
(125, 134, 'dfsf', 'sdf sdf dsf dsf', '34.00', '56e87cbeedde77493', '2016-03-22 20:27:10', '56e87cbeedde77493', '2016-03-22 20:27:10'),
(126, 135, 'asdas', 'asdasd', '1000.00', '56e87cbeedde77493', '2016-03-25 11:49:12', '56e87cbeedde77493', '2016-03-25 11:49:12'),
(127, 136, 'Ash', 'chAsh', '1.00', '56e87cbeedde77493', '2016-03-25 12:54:56', '56e87cbeedde77493', '2016-03-25 12:54:56');

-- --------------------------------------------------------

--
-- Table structure for table `product_master`
--

CREATE TABLE IF NOT EXISTS `product_master` (
`productmasterid` bigint(20) NOT NULL,
  `productname` varchar(100) NOT NULL,
  `materialtypeid` bigint(20) NOT NULL,
  `unitofmeasure` varchar(15) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=137 ;

--
-- Dumping data for table `product_master`
--

INSERT INTO `product_master` (`productmasterid`, `productname`, `materialtypeid`, `unitofmeasure`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(133, 'product', 44, 'kg', '56e87cbeedde77493', '2016-03-20 22:28:47', '56e87cbeedde77493', '2016-03-20 22:28:47'),
(134, 'dfgdfgd', 44, 'sdfssssssssssss', '56e87cbeedde77493', '2016-03-22 20:27:10', '56e87cbeedde77493', '2016-03-22 20:27:10'),
(135, 'PDBS', 44, 'kg', '56e87cbeedde77493', '2016-03-25 11:49:12', '56e87cbeedde77493', '2016-03-25 11:49:12'),
(136, 'color hardner', 46, 'bags', '56e87cbeedde77493', '2016-03-25 12:54:56', '56e87cbeedde77493', '2016-03-25 12:54:56');

-- --------------------------------------------------------

--
-- Table structure for table `product_packaging`
--

CREATE TABLE IF NOT EXISTS `product_packaging` (
`productpackagingid` bigint(20) NOT NULL,
  `productmasterid` bigint(20) NOT NULL,
  `packaging` varchar(30) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=137 ;

--
-- Dumping data for table `product_packaging`
--

INSERT INTO `product_packaging` (`productpackagingid`, `productmasterid`, `packaging`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(133, 133, 'bags', '56e87cbeedde77493', '2016-03-20 22:28:47', '56e87cbeedde77493', '2016-03-20 22:28:47'),
(134, 134, 'dsfds', '56e87cbeedde77493', '2016-03-22 20:27:10', '56e87cbeedde77493', '2016-03-22 20:27:10'),
(135, 135, '10kg', '56e87cbeedde77493', '2016-03-25 11:49:12', '56e87cbeedde77493', '2016-03-25 11:49:12'),
(136, 136, '27.2kg', '56e87cbeedde77493', '2016-03-25 12:54:56', '56e87cbeedde77493', '2016-03-25 12:54:56');

-- --------------------------------------------------------

--
-- Table structure for table `projectlist`
--

CREATE TABLE IF NOT EXISTS `projectlist` (
`ProjectId` int(10) NOT NULL,
  `ProjectName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `project_address_details`
--

CREATE TABLE IF NOT EXISTS `project_address_details` (
  `ProjectId` varchar(20) NOT NULL,
  `Address` varchar(45) DEFAULT NULL,
  `City` varchar(45) DEFAULT NULL,
  `State` varchar(45) DEFAULT NULL,
  `Country` varchar(45) DEFAULT NULL,
  `Pincode` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `project_address_details`
--

INSERT INTO `project_address_details` (`ProjectId`, `Address`, `City`, `State`, `Country`, `Pincode`) VALUES
('56f3a77b190f87403', 'sdfsdf', 'pune', 'delhi', 'india', '3454'),
('56f4f753434502487', 'qweqweqweqweqw', 'pune', 'maharashtra', 'india', '3123123');

-- --------------------------------------------------------

--
-- Table structure for table `project_master`
--

CREATE TABLE IF NOT EXISTS `project_master` (
  `ProjectId` varchar(20) NOT NULL,
  `ProjectName` varchar(45) DEFAULT NULL,
  `ProjectManagerId` varchar(20) DEFAULT NULL,
  `ProjectSource` varchar(45) DEFAULT NULL,
  `IsSiteTrackingProject` tinyint(1) DEFAULT NULL,
  `ProjectStatus` varchar(20) DEFAULT NULL,
  `CustomerId` varchar(20) DEFAULT NULL,
  `IsClosedProject` tinyint(1) unsigned zerofill DEFAULT '0',
  `isDeleted` tinyint(1) unsigned zerofill DEFAULT '0',
  `DeletedBy` varchar(20) DEFAULT NULL,
  `DeletionDate` datetime DEFAULT NULL,
  `CreationDate` datetime DEFAULT NULL,
  `CreatedBy` varchar(20) DEFAULT NULL,
  `LastModificationDate` datetime DEFAULT NULL,
  `LastModifiedBy` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `project_master`
--

INSERT INTO `project_master` (`ProjectId`, `ProjectName`, `ProjectManagerId`, `ProjectSource`, `IsSiteTrackingProject`, `ProjectStatus`, `CustomerId`, `IsClosedProject`, `isDeleted`, `DeletedBy`, `DeletionDate`, `CreationDate`, `CreatedBy`, `LastModificationDate`, `LastModifiedBy`) VALUES
('56f3a77b190f87403', 'project', '56f3a735959d29316', 'SiteTracking', 1, 'Initiated', '56f3a5631f4fe9732', 0, 0, NULL, NULL, '2016-03-24 00:00:00', '56e87cbeedde77493', '2016-03-24 00:00:00', '56e87cbeedde77493'),
('56f4f753434502487', 'kumar1', '56f4e50ef0ec46476', 'Email', 0, 'Initiated', '56f4f6a14ff5a3970', 0, 0, NULL, NULL, '2016-03-25 00:00:00', '56e87cbeedde77493', '2016-03-25 00:00:00', '56e87cbeedde77493');

-- --------------------------------------------------------

--
-- Table structure for table `project_payment`
--

CREATE TABLE IF NOT EXISTS `project_payment` (
  `PaymentId` varchar(20) NOT NULL DEFAULT '',
  `InvoiceNo` varchar(20) DEFAULT NULL,
  `AmountPaid` decimal(10,0) DEFAULT NULL,
  `PaymentDate` datetime DEFAULT NULL,
  `IsCashPayment` int(10) unsigned DEFAULT NULL,
  `PaidTo` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `project_payment`
--

INSERT INTO `project_payment` (`PaymentId`, `InvoiceNo`, `AmountPaid`, `PaymentDate`, `IsCashPayment`, `PaidTo`) VALUES
('56f691863b1e85213', '222333', '1000', '2016-03-26 12:00:00', 1, '56e87cbeedde77493'),
('56f6928ccba756608', '222333', '2000', '2016-03-26 12:00:00', 0, '56e87cbeedde77493'),
('56f69330f269a6116', '222333', '3000', '2016-03-26 12:00:00', 0, '56e87cbeedde77493'),
('56f6cbc963d2c6524', '222333', '2000', '2016-03-26 12:00:00', 1, '56e87cbeedde77493'),
('56f6d114d067c9256', '222333', '234', '2016-03-26 12:00:00', 1, '56e87cbeedde77493'),
('56facaf9a14d01905', NULL, NULL, NULL, NULL, NULL),
('56facb2a5d2227932', '222333', '100', '2016-03-30 12:00:00', 1, '56e87cbeedde77493');

-- --------------------------------------------------------

--
-- Table structure for table `project_payment_followup`
--

CREATE TABLE IF NOT EXISTS `project_payment_followup` (
  `FollowupId` varchar(20) NOT NULL,
  `InvoiceId` varchar(20) NOT NULL,
  `AssignEmployee` varchar(20) NOT NULL,
  `FollowupDate` date NOT NULL,
  `FollowupTitle` text NOT NULL,
  `CreationDate` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `CreatedBy` varchar(20) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='InnoDB free: 14336 kB; (`InvoiceId`) REFER `hicrete/invoice`';

-- --------------------------------------------------------

--
-- Table structure for table `project_payment_followup_details`
--

CREATE TABLE IF NOT EXISTS `project_payment_followup_details` (
  `FollowupId` varchar(20) NOT NULL,
  `Description` varchar(80) NOT NULL,
  `ConductDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `project_payment_mode_details`
--

CREATE TABLE IF NOT EXISTS `project_payment_mode_details` (
  `PaymentId` varchar(20) NOT NULL,
  `InstrumentOfPayment` varchar(15) DEFAULT NULL,
  `IDOfInstrument` varchar(40) DEFAULT NULL,
  `BankName` varchar(60) DEFAULT NULL,
  `BranchName` varchar(40) DEFAULT NULL,
  `City` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `project_payment_mode_details`
--

INSERT INTO `project_payment_mode_details` (`PaymentId`, `InstrumentOfPayment`, `IDOfInstrument`, `BankName`, `BranchName`, `City`) VALUES
('56f691863b1e85213', 'cash', '56f691863b1e88851', '', '', ''),
('56f6928ccba756608', 'cheque', '12222', 'Bank', 'Branch', ''),
('56f69330f269a6116', 'cheque', '324234', 'Bank', 'Branch', 'PUNE'),
('56f6cbc963d2c6524', 'cash', '56f6cbc963d2c5140', '', '', ''),
('56f6d114d067c9256', 'cash', '56f6d114d067c8814', '', '', ''),
('56facaf9a14d01905', NULL, NULL, NULL, NULL, NULL),
('56facb2a5d2227932', 'cash', '56facb2a5d2224907', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `project_point_of_contact_details`
--

CREATE TABLE IF NOT EXISTS `project_point_of_contact_details` (
  `ProjectId` varchar(20) NOT NULL DEFAULT '',
  `PointContactName` varchar(30) DEFAULT NULL,
  `MobileNo` varchar(15) DEFAULT NULL,
  `LandlineNo` varchar(20) DEFAULT NULL,
  `EmailId` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `project_point_of_contact_details`
--

INSERT INTO `project_point_of_contact_details` (`ProjectId`, `PointContactName`, `MobileNo`, `LandlineNo`, `EmailId`) VALUES
('56f3a77b190f87403', 'sdfdsf', '345345345345', '456456', 'as@as.co'),
('56f4f753434502487', 'asdasdas', '1231231231', '123123123', 'asdasd@mail.com');

-- --------------------------------------------------------

--
-- Table structure for table `quotation`
--

CREATE TABLE IF NOT EXISTS `quotation` (
  `QuotationId` varchar(20) NOT NULL,
  `QuotationTitle` varchar(60) NOT NULL,
  `RefNo` varchar(60) NOT NULL,
  `DateOfQuotation` date NOT NULL,
  `Subject` varchar(80) NOT NULL,
  `ProjectId` varchar(20) NOT NULL,
  `companyId` varchar(20) NOT NULL,
  `QuotationBlob` varchar(45) DEFAULT NULL,
  `isApproved` int(10) unsigned DEFAULT '0',
  `isDeleted` int(10) unsigned NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `quotation`
--

INSERT INTO `quotation` (`QuotationId`, `QuotationTitle`, `RefNo`, `DateOfQuotation`, `Subject`, `ProjectId`, `companyId`, `QuotationBlob`, `isApproved`, `isDeleted`) VALUES
('56f3b614288bf9618', 'Project Quotation', 'ref001', '2016-03-24', 'Project Quotaion Subject', '56f3a77b190f87403', '56eed65bbf5ef9430', '', 1, 0),
('56f4f8e3aa2532785', 'asdasd', '123123', '2016-03-25', 'asdasd', '56f4f753434502487', '56eed65bbf5ef9430', '', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `quotation_details`
--

CREATE TABLE IF NOT EXISTS `quotation_details` (
  `DetailID` varchar(20) NOT NULL,
  `QuotationId` varchar(20) NOT NULL,
  `Title` varchar(40) NOT NULL,
  `Description` varchar(200) NOT NULL,
  `Quantity` decimal(10,0) NOT NULL,
  `UnitRate` decimal(10,0) NOT NULL,
  `Amount` decimal(10,0) NOT NULL,
  `DetailNo` varchar(20) NOT NULL,
  `Unit` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `quotation_details`
--

INSERT INTO `quotation_details` (`DetailID`, `QuotationId`, `Title`, `Description`, `Quantity`, `UnitRate`, `Amount`, `DetailNo`, `Unit`) VALUES
('56f3b61437af21464', '56f3b614288bf9618', 'Title1', 'titel1Dec', '100', '1000', '100000', '1', 'kg'),
('56f3b6143c52c4941', '56f3b614288bf9618', 'title 2', 'title 2 dec', '100', '200', '20000', '2', 'kg'),
('56f4f8e3b792f1274', '56f4f8e3aa2532785', 'asdasd', 'asdasd', '10', '100', '1000', '1', 'kg'),
('56f4f8e3be2a84292', '56f4f8e3aa2532785', 'asdkjhk', 'aasdjhgj', '20', '200', '4000', '2', 'kg');

-- --------------------------------------------------------

--
-- Table structure for table `quotation_followup`
--

CREATE TABLE IF NOT EXISTS `quotation_followup` (
  `FollowupId` varchar(20) NOT NULL DEFAULT '',
  `QuotationId` varchar(20) DEFAULT NULL,
  `AssignEmployee` varchar(20) DEFAULT NULL,
  `FollowupDate` date DEFAULT NULL,
  `FollowupTitle` text,
  `CreationDate` datetime DEFAULT NULL,
  `CreatedBy` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='InnoDB free: 14336 kB; (`QuotationId`) REFER `hicrete/quotat';

--
-- Dumping data for table `quotation_followup`
--

INSERT INTO `quotation_followup` (`FollowupId`, `QuotationId`, `AssignEmployee`, `FollowupDate`, `FollowupTitle`, `CreationDate`, `CreatedBy`) VALUES
('56f41af2d3d025978', '56f3b614288bf9618', 'sdfsdfdsf', '2016-03-24', 'Quotation followup', '2016-03-24 10:20:58', '1'),
('56f61e5f4c3b32163', '56f3b614288bf9618', 'jgghj', '2016-03-26', 'Quotation followup', '2016-03-26 11:00:07', '1'),
('56f62d42ed1fa5179', '56f3b614288bf9618', '56e87cbeedde77493', '2016-03-26', 'Quotation followup', '2016-03-26 12:03:38', '1'),
('56f672dd202cf9166', '56f3b614288bf9618', '56e87cbeedde77493', '2016-03-26', 'Quotation followup', '2016-03-26 05:00:37', '1'),
('56f67399ae5de3922', '56f3b614288bf9618', '56e87cbeedde77493', '2016-03-26', 'Quotation followup', '2016-03-26 05:03:45', '1'),
('56f6757aa9a444885', '56f3b614288bf9618', '56e87cbeedde77493', '2016-03-26', 'undefined', '2016-03-26 05:11:46', '56e87cbeedde77493'),
('56f675f5818529089', '56f3b614288bf9618', '56e87cbeedde77493', '2016-03-26', 'undefined', '2016-03-26 05:13:49', '56e87cbeedde77493'),
('56f68622829611882', '56f3b614288bf9618', '56e87cbeedde77493', '2016-03-26', 'Titleeee', '2016-03-26 06:22:50', '56e87cbeedde77493');

-- --------------------------------------------------------

--
-- Table structure for table `quotation_followup_details`
--

CREATE TABLE IF NOT EXISTS `quotation_followup_details` (
  `FollowupId` varchar(20) NOT NULL,
  `Description` varchar(80) NOT NULL,
  `ConductDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `quotation_tax_applicable_to`
--

CREATE TABLE IF NOT EXISTS `quotation_tax_applicable_to` (
  `TaxID` varchar(20) NOT NULL,
  `DetailsID` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `quotation_tax_applicable_to`
--

INSERT INTO `quotation_tax_applicable_to` (`TaxID`, `DetailsID`) VALUES
('56f3b6143c9147223', '56f3b61437af21464'),
('56f3b6143c9147223', '56f3b6143c52c4941'),
('56f4f8e3be2a84788', '56f4f8e3b792f1274'),
('56f4f8e3da7cb7662', '56f4f8e3b792f1274'),
('56f4f8e3be2a84788', '56f4f8e3be2a84292'),
('56f4f8e3da7cb7662', '56f4f8e3be2a84292'),
('56f4f8e3ee04c8033', '56f4f8e3be2a84292');

-- --------------------------------------------------------

--
-- Table structure for table `quotation_tax_details`
--

CREATE TABLE IF NOT EXISTS `quotation_tax_details` (
  `TaxID` varchar(20) NOT NULL,
  `QuotationId` varchar(20) NOT NULL,
  `TaxName` varchar(20) NOT NULL,
  `TaxPercentage` float NOT NULL,
  `TaxAmount` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `quotation_tax_details`
--

INSERT INTO `quotation_tax_details` (`TaxID`, `QuotationId`, `TaxName`, `TaxPercentage`, `TaxAmount`) VALUES
('56f3b6143c9147223', '56f3b614288bf9618', 'TaxTitlle', 10, '12000'),
('56f4f8e3be2a84788', '56f4f8e3aa2532785', 'asdb', 14, '700'),
('56f4f8e3da7cb7662', '56f4f8e3aa2532785', 'asdjgj', 0.5, '25'),
('56f4f8e3ee04c8033', '56f4f8e3aa2532785', 'asdasdas', 1, '40');

-- --------------------------------------------------------

--
-- Table structure for table `roleaccesspermission`
--

CREATE TABLE IF NOT EXISTS `roleaccesspermission` (
  `roleAccessId` varchar(20) NOT NULL,
  `roleId` varchar(20) NOT NULL,
  `accessId` varchar(20) NOT NULL,
  `createdBy` varchar(20) NOT NULL,
  `creationDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `roleaccesspermission`
--

INSERT INTO `roleaccesspermission` (`roleAccessId`, `roleId`, `accessId`, `createdBy`, `creationDate`) VALUES
('56f3a6c84cdce4266', '56f3a6c842da47209', '121', '56e87cbeedde77493', '2016-03-24 14:05:20'),
('56f3a6c8562411312', '56f3a6c842da47209', '123', '56e87cbeedde77493', '2016-03-24 14:05:20'),
('56f3a6c8562416386', '56f3a6c842da47209', '211', '56e87cbeedde77493', '2016-03-24 14:05:20'),
('56f3a6c86dd2e6208', '56f3a6c842da47209', '224', '56e87cbeedde77493', '2016-03-24 14:05:20'),
('56f3a6c86e1165068', '56f3a6c842da47209', '226', '56e87cbeedde77493', '2016-03-24 14:05:20'),
('56f3a6c86e1165566', '56f3a6c842da47209', '125', '56e87cbeedde77493', '2016-03-24 14:05:20'),
('56f3a6c86e4fe2705', '56f3a6c842da47209', '127', '56e87cbeedde77493', '2016-03-24 14:05:20'),
('56f3a6c86e4fe4807', '56f3a6c842da47209', '228', '56e87cbeedde77493', '2016-03-24 14:05:20'),
('56f3a6c86e8e63388', '56f3a6c842da47209', '230', '56e87cbeedde77493', '2016-03-24 14:05:20'),
('56f3a6c86e8e64841', '56f3a6c842da47209', '129', '56e87cbeedde77493', '2016-03-24 14:05:20'),
('56f4d7197ae643014', '56f4d7196d7899858', '121', '56e87cbeedde77493', '2016-03-25 11:43:45'),
('56f4d719813f52237', '56f4d7196d7899858', '123', '56e87cbeedde77493', '2016-03-25 11:43:45'),
('56f4d719813f56551', '56f4d7196d7899858', '224', '56e87cbeedde77493', '2016-03-25 11:43:45'),
('56f4d719817de7188', '56f4d7196d7899858', '125', '56e87cbeedde77493', '2016-03-25 11:43:45'),
('56f4d71981bc65650', '56f4d7196d7899858', '226', '56e87cbeedde77493', '2016-03-25 11:43:45'),
('56f4d71a714286628', '56f4d7196d7899858', '230', '56e87cbeedde77493', '2016-03-25 11:43:46'),
('56f4d71a714287986', '56f4d7196d7899858', '127', '56e87cbeedde77493', '2016-03-25 11:43:46'),
('56f4e5baf016a2864', '56f4e4b61d4f78360', '121', '56e87cbeedde77493', '2016-03-25 12:46:10'),
('56f4e5bb00d4a3722', '56f4e4b61d4f78360', '125', '56e87cbeedde77493', '2016-03-25 12:46:11'),
('56f4e5bb00d4a7381', '56f4e4b61d4f78360', '224', '56e87cbeedde77493', '2016-03-25 12:46:11'),
('56f4e5bb00d4a8016', '56f4e4b61d4f78360', '123', '56e87cbeedde77493', '2016-03-25 12:46:11'),
('56f4e5bb00d4a9447', '56f4e4b61d4f78360', '211', '56e87cbeedde77493', '2016-03-25 12:46:11'),
('56f4e5bb0345a2703', '56f4e4b61d4f78360', '127', '56e87cbeedde77493', '2016-03-25 12:46:11'),
('56f4e5bb0345a4060', '56f4e4b61d4f78360', '129', '56e87cbeedde77493', '2016-03-25 12:46:11'),
('56f4e5bb0345a4171', '56f4e4b61d4f78360', '226', '56e87cbeedde77493', '2016-03-25 12:46:11');

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
  `lasModificationDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `rolemaster`
--

INSERT INTO `rolemaster` (`roleId`, `roleName`, `createdBy`, `creationDate`, `lastModifiedBy`, `lasModificationDate`) VALUES
('56f3a6c842da47209', 'Role', '56e87cbeedde77493', '2016-03-24 14:05:20', '', '0000-00-00 00:00:00'),
('56f4d7196d7899858', 'role1', '56e87cbeedde77493', '2016-03-25 11:43:45', '', '0000-00-00 00:00:00'),
('56f4e4b61d4f78360', 'warehouse', '56e87cbeedde77493', '2016-03-25 12:41:50', '56e87cbeedde77493', '2016-03-25 12:46:10');

-- --------------------------------------------------------

--
-- Table structure for table `site_tracking_followup_details`
--

CREATE TABLE IF NOT EXISTS `site_tracking_followup_details` (
  `FollowupId` varchar(20) NOT NULL,
  `Description` varchar(80) NOT NULL,
  `ConductDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `site_tracking_followup_schedule`
--

CREATE TABLE IF NOT EXISTS `site_tracking_followup_schedule` (
  `FollowupId` varchar(20) NOT NULL DEFAULT '',
  `ProjectId` varchar(20) DEFAULT NULL,
  `AssignEmployee` varchar(20) DEFAULT NULL,
  `FollowupDate` date DEFAULT NULL,
  `FollowupTitle` text,
  `CreationDate` datetime DEFAULT NULL,
  `CreatedBy` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  `deletionDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `superuser`
--

INSERT INTO `superuser` (`superUserId`, `designation`, `firstName`, `lastName`, `dateOfBirth`, `address`, `city`, `state`, `country`, `pincode`, `mobileNumber`, `emailId`, `createdBy`, `creationDate`, `lastModifiedBy`, `lastModificationDate`, `isDeleted`, `deletedBy`, `deletionDate`) VALUES
('56e87cbeedde77493', 'sdasd', 'asdasd', 'asdasd', '2016-02-29', 'asdasdsdadsas', 'sdasd', 'asdasd', 'asdasd', 'asdas', 'sdasd', 'super@mail.com', '56e86524b25c48082', '2016-03-16 02:51:02', '56e86524b25c48082', '2016-03-16 02:51:02', 0, '', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE IF NOT EXISTS `supplier` (
`supplierid` bigint(20) NOT NULL,
  `suppliername` varchar(40) NOT NULL,
  `contactno` varchar(15) NOT NULL,
  `pointofcontact` varchar(20) NOT NULL,
  `officeno` varchar(20) NOT NULL,
  `cstno` varchar(20) NOT NULL,
  `vatno` varchar(20) NOT NULL,
  `address` varchar(100) NOT NULL,
  `city` varchar(30) NOT NULL,
  `country` varchar(30) NOT NULL,
  `pincode` varchar(16) NOT NULL,
  `delflg` varchar(5) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` date NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` date NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=22 ;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`supplierid`, `suppliername`, `contactno`, `pointofcontact`, `officeno`, `cstno`, `vatno`, `address`, `city`, `country`, `pincode`, `delflg`, `lchnguserid`, `lchngtime`, `creuserid`, `cretime`) VALUES
(21, 'supplier', '456456546', 'dgdfgfdg', '45654654', '8795345435', '76574534', 'dfd fgd dhghdfhdf', 'dfggfdg', 'dfgdfgdfg', '3456546456546', 'N', '56e87cbeedde77493', '2016-03-20', '56e87cbeedde77493', '2016-03-20');

-- --------------------------------------------------------

--
-- Table structure for table `task_conduction_notes`
--

CREATE TABLE IF NOT EXISTS `task_conduction_notes` (
  `TaskID` varchar(45) DEFAULT NULL,
  `ConductionNote` varchar(45) DEFAULT NULL,
  `NoteAddedBy` varchar(20) DEFAULT NULL,
  `DateAdded` datetime DEFAULT NULL,
`id` int(10) unsigned NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `task_conduction_notes`
--

INSERT INTO `task_conduction_notes` (`TaskID`, `ConductionNote`, `NoteAddedBy`, `DateAdded`, `id`) VALUES
('56f3ab0c8b85f2546', '25% completed', '56e87cbeedde77493', '2016-03-24 02:31:00', 1),
('56f3ab0c8b85f2546', 'completed', '56e87cbeedde77493', '2016-03-24 02:31:26', 2),
('56f4fa76289d03014', 'asdasdasdsads', '56e87cbeedde77493', '2016-03-25 02:15:05', 3),
('56f41a8d27bd07351', 'sdfsdfdsfdsf', '56e87cbeedde77493', '2016-03-29 11:06:51', 4),
('56f4fa76289d03014', 'dfggdfgdfg', '56e87cbeedde77493', '2016-03-29 11:09:02', 5),
('56f4fa76289d03014', 'comppletdasd', '56e87cbeedde77493', '2016-03-29 11:12:50', 6),
('56f3ab0c8b85f2546', 'hkhkjhkjhkjhjkk', '56e87cbeedde77493', '2016-03-29 11:13:51', 7);

-- --------------------------------------------------------

--
-- Table structure for table `task_master`
--

CREATE TABLE IF NOT EXISTS `task_master` (
  `TaskID` varchar(20) NOT NULL DEFAULT '',
  `TaskName` varchar(50) DEFAULT NULL,
  `TaskDescripion` text,
  `ScheduleStartDate` datetime DEFAULT NULL,
  `ScheduleEndDate` datetime DEFAULT NULL,
  `CompletionPercentage` float DEFAULT NULL,
  `TaskAssignedTo` varchar(20) DEFAULT NULL,
  `isCompleted` tinyint(3) unsigned DEFAULT NULL,
  `CreationDate` datetime DEFAULT NULL,
  `CreatedBy` varchar(20) DEFAULT NULL,
  `ActualStartDate` datetime DEFAULT NULL,
  `AcutalEndDate` datetime DEFAULT NULL,
  `isDeleted` tinyint(3) unsigned DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `task_master`
--

INSERT INTO `task_master` (`TaskID`, `TaskName`, `TaskDescripion`, `ScheduleStartDate`, `ScheduleEndDate`, `CompletionPercentage`, `TaskAssignedTo`, `isCompleted`, `CreationDate`, `CreatedBy`, `ActualStartDate`, `AcutalEndDate`, `isDeleted`) VALUES
('56f3ab0c8b85f2546', 'taskTest', 'task test as', '2016-03-24 12:00:00', '2016-03-24 12:00:00', 0, '56e87cbeedde77493', 1, '2016-03-24 02:23:32', '56e87cbeedde77493', '2016-03-29 11:13:34', '2016-03-30 11:13:34', 0),
('56f41a8d27bd07351', 'TAsk 12234', 'dfgds dfgdfg dfgdfgdfg', '2016-03-24 12:00:00', '2016-03-25 12:00:00', 23, '56e87cbeedde77493', 1, '2016-03-24 10:19:17', '56e87cbeedde77493', '2016-03-30 11:06:33', '2016-03-31 11:06:33', 0),
('56f4fa76289d03014', 'asdasdasd', 'asdasdasd', '2016-03-25 12:00:00', '2016-03-30 12:00:00', 100, '56e87cbeedde77493', 1, '2016-03-25 02:14:38', '56e87cbeedde77493', '2016-03-30 11:12:33', '2016-03-31 11:12:33', 0),
('56fab38cbaef58912', 'jhgfderty', 'd dfdfgdfgdfgdf d dfgdfgdf', '2016-03-29 12:00:00', '2016-03-29 12:00:00', 0, '56e87cbeedde77493', 0, '2016-03-29 10:25:40', '56e87cbeedde77493', NULL, NULL, 0),
('56fab515bfb0c5696', 'taskFinalTest', 'asdhasdjaksdjjkj', '2016-03-29 12:00:00', '2016-03-29 12:00:00', 0, '56e87cbeedde77493', 0, '2016-03-29 10:32:13', '56e87cbeedde77493', NULL, NULL, 0),
('56fab57a8e5111155', 'taskssss', 'sds dsfds', '2016-03-29 12:00:00', '2016-03-31 12:00:00', 0, '56e87cbeedde77493', 0, '2016-03-29 10:33:54', '56e87cbeedde77493', NULL, NULL, 0),
('56fab5e2e05713612', 'asdasdad', 'asd asdasdadsasd', '2016-03-29 12:00:00', '2016-03-30 12:00:00', 0, '56e87cbeedde77493', 0, '2016-03-29 10:35:38', '56e87cbeedde77493', NULL, NULL, 0),
('56fab61b84d887567', 'asdasdasd', 'adsadasda', '2016-03-29 12:00:00', '2016-03-29 12:00:00', 0, '56e87cbeedde77493', 0, '2016-03-29 10:36:35', '56e87cbeedde77493', NULL, NULL, 1),
('56fab6596d8a53410', 'asdasdasdas', 'adsadasda', '2016-03-29 12:00:00', '2016-03-29 12:00:00', 0, '56e87cbeedde77493', 0, '2016-03-29 10:37:37', '56e87cbeedde77493', NULL, NULL, 0),
('56fab65ce7e752502', 'asdasdasdas', 'adsadasda', '2016-03-29 12:00:00', '2016-03-29 12:00:00', 0, '56e87cbeedde77493', 0, '2016-03-29 10:37:40', '56e87cbeedde77493', NULL, NULL, 0),
('56fab679f3c8a1913', 'dsfsf', 'sdfsdfsdff dsfsdfsd dfsdf', '2016-03-29 12:00:00', '2016-03-29 12:00:00', 0, '56e87cbeedde77493', 0, '2016-03-29 10:38:09', '56e87cbeedde77493', NULL, NULL, 1),
('56fab6b3d036f2159', 'sdfsdfsdf', 'sd fdsf dsf', '2016-03-29 12:00:00', '2016-03-29 12:00:00', 0, '56e87cbeedde77493', 0, '2016-03-29 10:39:07', '56e87cbeedde77493', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tempaccesspermissions`
--

CREATE TABLE IF NOT EXISTS `tempaccesspermissions` (
  `requestId` varchar(20) NOT NULL,
  `userId` varchar(20) NOT NULL,
  `accessId` varchar(20) NOT NULL,
  `fromDate` datetime NOT NULL,
  `toDate` datetime NOT NULL
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
  `requestDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tempaccessrequestaction`
--

CREATE TABLE IF NOT EXISTS `tempaccessrequestaction` (
  `requestId` varchar(20) NOT NULL,
  `actionBy` varchar(20) NOT NULL,
  `actionDate` datetime NOT NULL,
  `remark` varchar(50) NOT NULL
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
  `lastmodifiedby` varchar(20) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `unapproved_expense_bills`
--

INSERT INTO `unapproved_expense_bills` (`billid`, `expensedetailsid`, `billno`, `billissueingentity`, `amount`, `dateofbill`, `createdby`, `creationdate`, `lastmodificationdate`, `lastmodifiedby`) VALUES
('56f69b2bec264', '56f69b2be2624', '34353', 'fghfghgf', 1000, '1212-12-12', 'admin', '2016-03-26 19:52:35', '2016-03-26 19:52:35', 'admin');

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
  `deletionDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `usermaster`
--

INSERT INTO `usermaster` (`userId`, `firstName`, `lastName`, `dateOfBirth`, `address`, `city`, `state`, `country`, `pincode`, `mobileNumber`, `emailId`, `createdBy`, `creationDate`, `lastModifiedBy`, `lastModificationDate`, `isDeleted`, `deletedBy`, `deletionDate`) VALUES
('56e87cbeedde77493', 'Super', 'Super', '1992-09-17', 'aasdadsasdasdasdasd', 'adasdad', 'sdasda', 'asdasd', '123123123', '8087643764', 'super@mail.com', 'admin', '2016-01-05 22:23:56', 'admin', '2016-01-05 22:23:56', 0, '', '0000-00-00 00:00:00'),
('56f3a735959d29316', 'user', 'dhatrakAsdfr', '2016-03-24', 'dsf sdf dsf dsf sdfdsf', 'sdf', 'sddf', 'asdasd', '34354', '8007755527', 'atul@mail.com', '56e87cbeedde77493', '2016-03-24 14:07:09', '56e87cbeedde77493', '2016-03-24 14:07:09', 0, '', '0000-00-00 00:00:00'),
('56f4d6cb1d4c72234', 'asdnbm', 'asdasd', '2016-03-25', 'asdasdasdasdasdasd', 'PUne', 'maharashtra', 'india', '123123', '1234567890', 'asdjh@123.coma', '56e87cbeedde77493', '2016-03-25 11:42:27', '56e87cbeedde77493', '2016-03-25 11:42:27', 0, '', '0000-00-00 00:00:00'),
('56f4e50ef0ec46476', 'Madhura', 'sheth', '2016-03-25', 'akjsdhaksd', 'Pune', 'Maharashtra', 'India', '123456', '98028731123', 'madhuramsheth@gmail.com', '56e87cbeedde77493', '2016-03-25 12:43:18', '56e87cbeedde77493', '2016-03-25 12:43:18', 0, '', '0000-00-00 00:00:00');

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
  `lastModificationDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `userroleinfo`
--

INSERT INTO `userroleinfo` (`userId`, `designation`, `roleId`, `userType`, `createdBy`, `creationDate`, `lastModifiedBy`, `lastModificationDate`) VALUES
('56f3a735959d29316', 'manager', '56f3a6c842da47209', 'Admin', '56e87cbeedde77493', '2016-03-24 14:07:09', '56e87cbeedde77493', '2016-03-24 14:07:09'),
('56f4d6cb1d4c72234', 'MANAGER', '56f3a6c842da47209', 'Admin', '56e87cbeedde77493', '2016-03-25 11:42:27', '56e87cbeedde77493', '2016-03-25 11:42:27'),
('56f4e50ef0ec46476', 'admin', '56f4e4b61d4f78360', 'Normal', '56e87cbeedde77493', '2016-03-25 12:43:19', '56e87cbeedde77493', '2016-03-25 12:43:19');

-- --------------------------------------------------------

--
-- Table structure for table `userverification`
--

CREATE TABLE IF NOT EXISTS `userverification` (
  `userId` varchar(20) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `verificationValue` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user_master`
--

CREATE TABLE IF NOT EXISTS `user_master` (
  `UserId` varchar(20) NOT NULL,
  `FirstName` varchar(45) NOT NULL,
  `LastName` varchar(45) NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `DeletionDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `warehouse`
--

CREATE TABLE IF NOT EXISTS `warehouse` (
`warehouseid` bigint(20) NOT NULL,
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
  `cretime` date NOT NULL
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
  `lastModificationDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `warehousemaster`
--

INSERT INTO `warehousemaster` (`warehouseId`, `wareHouseName`, `warehouseAbbrevation`, `address`, `city`, `state`, `country`, `pincode`, `phoneNumber`, `createdBy`, `creationDate`, `lastModifiedBy`, `lastModificationDate`) VALUES
('56eed671666a24508', 'warehouse', 'ware', 'dsfs fs fsddsfdsfdsf', 'Pune', 'sdfds', 'sdfsf', '3534534535', '345435354', '56e87cbeedde77493', '2016-03-20 22:27:21', '56e87cbeedde77493', '2016-03-25 12:50:12');

-- --------------------------------------------------------

--
-- Table structure for table `weekly_off_in_year`
--

CREATE TABLE IF NOT EXISTS `weekly_off_in_year` (
  `caption_of_year` varchar(30) NOT NULL,
  `weekly_off_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `weekly_off_in_year`
--

INSERT INTO `weekly_off_in_year` (`caption_of_year`, `weekly_off_date`) VALUES
('2020', '2016-03-27'),
('2020', '2016-04-03'),
('2020', '2016-04-10'),
('2020', '2016-04-17'),
('2020', '2016-04-24'),
('2020', '2016-05-01'),
('2020', '2016-05-08'),
('2020', '2016-05-15'),
('2020', '2016-05-22'),
('2020', '2016-05-29'),
('2020', '2016-06-05'),
('2020', '2016-06-12'),
('2020', '2016-06-19'),
('2020', '2016-06-26'),
('2020', '2016-07-03'),
('2020', '2016-07-10'),
('2020', '2016-07-17'),
('2020', '2016-07-24'),
('2020', '2016-07-31'),
('2020', '2016-08-07'),
('2020', '2016-08-14'),
('2020', '2016-08-21'),
('2020', '2016-08-28'),
('2020', '2016-09-04'),
('2020', '2016-09-11'),
('2020', '2016-09-18'),
('2020', '2016-09-25'),
('2020', '2016-10-02'),
('2020', '2016-10-09'),
('2020', '2016-10-16'),
('2020', '2016-10-23'),
('2020', '2016-10-30'),
('2020', '2016-11-06'),
('2020', '2016-11-13'),
('2020', '2016-11-20'),
('2020', '2016-11-27'),
('2020', '2016-12-04'),
('2020', '2016-12-11'),
('2020', '2016-12-18'),
('2020', '2016-12-25'),
('2020', '2017-01-01'),
('2020', '2017-01-08'),
('2020', '2017-01-15'),
('2020', '2017-01-22'),
('2020', '2017-01-29'),
('2020', '2017-02-05'),
('2020', '2017-02-12'),
('2020', '2017-02-19'),
('2020', '2017-02-26'),
('2020', '2017-03-05'),
('2020', '2017-03-12'),
('2020', '2017-03-19');

-- --------------------------------------------------------

--
-- Table structure for table `work_order`
--

CREATE TABLE IF NOT EXISTS `work_order` (
  `WorkOrderNo` varchar(20) NOT NULL,
  `WorkOrderName` varchar(20) NOT NULL,
  `ReceivedDate` date NOT NULL,
  `WorkOrderBlob` text,
  `ProjectId` varchar(20) NOT NULL,
  `companyId` varchar(20) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  `DeletedBy` varchar(20) DEFAULT NULL,
  `DeletionDate` datetime DEFAULT NULL,
  `CreationDate` datetime DEFAULT NULL,
  `CreatedBy` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `work_order`
--

INSERT INTO `work_order` (`WorkOrderNo`, `WorkOrderName`, `ReceivedDate`, `WorkOrderBlob`, `ProjectId`, `companyId`, `isDeleted`, `DeletedBy`, `DeletionDate`, `CreationDate`, `CreatedBy`) VALUES
('56f3cfe1df98f1298', 'workorder', '0000-00-00', 'upload/Workorders/hicrete (5).sql', '56f3a77b190f87403', '56eed65bbf5ef9430', 0, NULL, NULL, '2016-03-24 00:00:00', '56e87cbeedde77493'),
('56f419e6c9b8f6717', 'work orders', '0000-00-00', 'upload/Workorders/hicrete (4).sql', '56f3a77b190f87403', '56eed65bbf5ef9430', 0, NULL, NULL, '2016-03-24 00:00:00', '56e87cbeedde77493'),
('56f4f9ac7311c2603', 'asdasd', '0000-00-00', 'upload/Workorders/hicrete (5).sql', '56f4f753434502487', '56eed65bbf5ef9430', 0, NULL, NULL, '2016-03-25 00:00:00', '56e87cbeedde77493'),
('56f6c7a14e6c76305', 'orderWork', '0000-00-00', 'upload/Workorders/739730_151850774964567_39177002_o.jpg', '56f3a77b190f87403', '56eed65bbf5ef9430', 0, NULL, NULL, '2016-03-26 00:00:00', '56e87cbeedde77493'),
('56fa8f9b01cb54841', 'dfgdfgfdgdfg', '0000-00-00', 'upload/Workorders/Untitled.png', '56f3a77b190f87403', '56eed65bbf5ef9430', 0, NULL, NULL, '2016-03-29 00:00:00', '56e87cbeedde77493');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accesserequested`
--
ALTER TABLE `accesserequested`
 ADD PRIMARY KEY (`requestId`), ADD KEY `requestId` (`requestId`), ADD KEY `accessId` (`accessId`);

--
-- Indexes for table `accesspermission`
--
ALTER TABLE `accesspermission`
 ADD PRIMARY KEY (`accessId`);

--
-- Indexes for table `applicator_enrollment`
--
ALTER TABLE `applicator_enrollment`
 ADD PRIMARY KEY (`enrollment_id`), ADD UNIQUE KEY `applicator_master_id` (`applicator_master_id`), ADD UNIQUE KEY `applicator_master_id_2` (`applicator_master_id`), ADD KEY `applicator_master_id_3` (`applicator_master_id`), ADD KEY `company_id` (`company_id`), ADD KEY `payment_package_id` (`payment_package_id`);

--
-- Indexes for table `applicator_follow_up`
--
ALTER TABLE `applicator_follow_up`
 ADD PRIMARY KEY (`follow_up_id`), ADD KEY `enrollment_id` (`enrollment_id`);

--
-- Indexes for table `applicator_master`
--
ALTER TABLE `applicator_master`
 ADD PRIMARY KEY (`applicator_master_id`);

--
-- Indexes for table `applicator_payment_follow_up_info`
--
ALTER TABLE `applicator_payment_follow_up_info`
 ADD PRIMARY KEY (`follow_up_info_id`), ADD KEY `follow_up_id` (`follow_up_id`);

--
-- Indexes for table `applicator_payment_info`
--
ALTER TABLE `applicator_payment_info`
 ADD PRIMARY KEY (`payment_id`), ADD KEY `enrollment_id` (`enrollment_id`);

--
-- Indexes for table `applicator_pointof_contact`
--
ALTER TABLE `applicator_pointof_contact`
 ADD PRIMARY KEY (`point_of_contact_id`), ADD KEY `applicator_master_id` (`applicator_master_id`);

--
-- Indexes for table `approved_expense_bills`
--
ALTER TABLE `approved_expense_bills`
 ADD PRIMARY KEY (`billid`), ADD KEY `expensedetailsid` (`expensedetailsid`), ADD KEY `expensedetailsid_2` (`expensedetailsid`);

--
-- Indexes for table `attendance_year`
--
ALTER TABLE `attendance_year`
 ADD PRIMARY KEY (`caption_of_year`), ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `budgetdetail`
--
ALTER TABLE `budgetdetail`
 ADD PRIMARY KEY (`budgetId`), ADD KEY `costCenterId` (`costCenterId`), ADD KEY `BudgetSegId` (`BudgetSegId`);

--
-- Indexes for table `budgetsegment`
--
ALTER TABLE `budgetsegment`
 ADD PRIMARY KEY (`BudgetSegmentId`);

--
-- Indexes for table `budget_details`
--
ALTER TABLE `budget_details`
 ADD PRIMARY KEY (`budgetdetailsid`), ADD KEY `costcenterid` (`projectid`), ADD KEY `costcenterid_2` (`projectid`), ADD KEY `budgetsegmentid` (`budgetsegmentid`);

--
-- Indexes for table `budget_segment`
--
ALTER TABLE `budget_segment`
 ADD PRIMARY KEY (`budgetsegmentid`);

--
-- Indexes for table `companies_involved_in_project`
--
ALTER TABLE `companies_involved_in_project`
 ADD PRIMARY KEY (`id`), ADD KEY `FK_companies_involved_in_project_project_id` (`ProjectID`), ADD KEY `FK_companies_involved_in_project_company_id` (`companyId`);

--
-- Indexes for table `companymaster`
--
ALTER TABLE `companymaster`
 ADD PRIMARY KEY (`companyId`), ADD KEY `createdBy` (`createdBy`), ADD KEY `lastModifiedBy` (`lastModifiedBy`);

--
-- Indexes for table `company_bank_details`
--
ALTER TABLE `company_bank_details`
 ADD PRIMARY KEY (`companyId`);

--
-- Indexes for table `company_master`
--
ALTER TABLE `company_master`
 ADD PRIMARY KEY (`CompanyID`), ADD KEY `FK_company_master_created_by` (`CreatedBy`), ADD KEY `FK_company_master_modified_by` (`LastModifiedBy`);

--
-- Indexes for table `company_taxtion_details`
--
ALTER TABLE `company_taxtion_details`
 ADD PRIMARY KEY (`companyId`);

--
-- Indexes for table `costcentermaster`
--
ALTER TABLE `costcentermaster`
 ADD PRIMARY KEY (`CostCenterId`);

--
-- Indexes for table `cost_center_master`
--
ALTER TABLE `cost_center_master`
 ADD PRIMARY KEY (`costcenterid`), ADD KEY `costcenterid` (`costcenterid`);

--
-- Indexes for table `customer_master`
--
ALTER TABLE `customer_master`
 ADD PRIMARY KEY (`CustomerId`), ADD KEY `FK_customer_master_created_by` (`CreatedBy`), ADD KEY `FK_customer_master_modified_by` (`LastModifiedBy`), ADD KEY `FK_customer_master_deleted_by` (`DeletedBy`);

--
-- Indexes for table `employee_on_payroll`
--
ALTER TABLE `employee_on_payroll`
 ADD PRIMARY KEY (`employee_id`), ADD KEY `created_by` (`created_by`,`last_modified_by`), ADD KEY `employee_id` (`employee_id`), ADD KEY `last_modified_by` (`last_modified_by`);

--
-- Indexes for table `expense_approval_mapping`
--
ALTER TABLE `expense_approval_mapping`
 ADD KEY `costcenterid` (`costcenterid`);

--
-- Indexes for table `expense_details`
--
ALTER TABLE `expense_details`
 ADD PRIMARY KEY (`expensedetailsid`), ADD KEY `costcenterid` (`projectid`), ADD KEY `costcenterid_2` (`projectid`), ADD KEY `costcenterid_3` (`projectid`), ADD KEY `costcenterid_4` (`projectid`), ADD KEY `costcenterid_5` (`projectid`), ADD KEY `budgetsegmentid` (`budgetsegmentid`);

--
-- Indexes for table `follow_up_employee`
--
ALTER TABLE `follow_up_employee`
 ADD PRIMARY KEY (`follow_up_employee_id`), ADD KEY `follow_up_id` (`follow_up_id`);

--
-- Indexes for table `holiday_in_year`
--
ALTER TABLE `holiday_in_year`
 ADD KEY `caption_of_year` (`caption_of_year`,`created_by`), ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `inhouse_inward_entry`
--
ALTER TABLE `inhouse_inward_entry`
 ADD PRIMARY KEY (`inhouseinwardid`), ADD KEY `producedgoodid` (`producedgoodid`), ADD KEY `warehouseid` (`warehouseid`), ADD KEY `companyid` (`companyid`), ADD KEY `productionbatchmasterid` (`productionbatchmasterid`);

--
-- Indexes for table `inhouse_transportation_details`
--
ALTER TABLE `inhouse_transportation_details`
 ADD PRIMARY KEY (`inhousetransportid`), ADD KEY `inhouseinwardid` (`inhouseinwardid`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
 ADD PRIMARY KEY (`inventoryid`), ADD KEY `materialid` (`materialid`), ADD KEY `warehouseid` (`warehouseid`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
 ADD PRIMARY KEY (`InvoiceNo`), ADD KEY `FK_invoice_quotation_id` (`QuotationId`), ADD KEY `FK_invoice_created_by` (`CreatedBy`);

--
-- Indexes for table `invoice_details`
--
ALTER TABLE `invoice_details`
 ADD PRIMARY KEY (`DetailID`), ADD KEY `FK_invoice_details_invoice_id` (`InvoiceId`);

--
-- Indexes for table `invoice_tax_applicable_to`
--
ALTER TABLE `invoice_tax_applicable_to`
 ADD PRIMARY KEY (`TaxId`,`DetailsId`) USING BTREE, ADD KEY `FK_Invoice_Tax_Applicable_to_invoicedetails` (`DetailsId`) USING BTREE, ADD KEY `FK_Invoice_Tax_Applicable_to_invoice_details` (`DetailsId`), ADD KEY `FK_Invoice_Tax_Applicable_to_tax_id` (`TaxId`);

--
-- Indexes for table `invoice_tax_details`
--
ALTER TABLE `invoice_tax_details`
 ADD PRIMARY KEY (`TaxId`), ADD KEY `FK_Invoice_tax_Details_invoice_id` (`InvoiceId`);

--
-- Indexes for table `inward`
--
ALTER TABLE `inward`
 ADD PRIMARY KEY (`inwardid`), ADD KEY `warehouseid` (`warehouseid`);

--
-- Indexes for table `inward_details`
--
ALTER TABLE `inward_details`
 ADD PRIMARY KEY (`inwarddetailsid`), ADD KEY `inwardid` (`inwardid`), ADD KEY `materialid` (`materialid`), ADD KEY `supplierid` (`supplierid`), ADD KEY `inwarddetailsid` (`inwarddetailsid`), ADD KEY `inwarddetailsid_2` (`inwarddetailsid`);

--
-- Indexes for table `inward_transportation_details`
--
ALTER TABLE `inward_transportation_details`
 ADD PRIMARY KEY (`inwardtranspid`), ADD KEY `inwardid` (`inwardid`), ADD KEY `	inwarddetailsid` (`	inwarddetailsid`);

--
-- Indexes for table `leave_application_master`
--
ALTER TABLE `leave_application_master`
 ADD KEY `leave_applied_by` (`leave_applied_by`,`action_by`);

--
-- Indexes for table `logindetails`
--
ALTER TABLE `logindetails`
 ADD PRIMARY KEY (`userId`);

--
-- Indexes for table `material`
--
ALTER TABLE `material`
 ADD PRIMARY KEY (`materialid`), ADD KEY `productmasterid` (`productmasterid`), ADD KEY `productdetailsid` (`productdetailsid`), ADD KEY `productpackagingid` (`productpackagingid`);

--
-- Indexes for table `materialtype`
--
ALTER TABLE `materialtype`
 ADD PRIMARY KEY (`materialtypeid`);

--
-- Indexes for table `material_expense_details`
--
ALTER TABLE `material_expense_details`
 ADD PRIMARY KEY (`materialexpensedetailsid`);

--
-- Indexes for table `outward`
--
ALTER TABLE `outward`
 ADD PRIMARY KEY (`outwardid`), ADD KEY `warehouseid` (`warehouseid`);

--
-- Indexes for table `outward_details`
--
ALTER TABLE `outward_details`
 ADD PRIMARY KEY (`outwarddtlsid`), ADD KEY `outwardid` (`outwardid`), ADD KEY `materialid` (`materialid`);

--
-- Indexes for table `outward_transportation_details`
--
ALTER TABLE `outward_transportation_details`
 ADD PRIMARY KEY (`outwardtranspid`), ADD KEY `outwardid` (`outwardid`);

--
-- Indexes for table `paymentretention`
--
ALTER TABLE `paymentretention`
 ADD PRIMARY KEY (`InvoiceNo`);

--
-- Indexes for table `payment_mode_details`
--
ALTER TABLE `payment_mode_details`
 ADD PRIMARY KEY (`payment_mode_id`), ADD KEY `payment_id` (`payment_id`);

--
-- Indexes for table `payment_package_details`
--
ALTER TABLE `payment_package_details`
 ADD PRIMARY KEY (`package_details_id`), ADD KEY `payment_package_id` (`payment_package_id`);

--
-- Indexes for table `payment_package_master`
--
ALTER TABLE `payment_package_master`
 ADD PRIMARY KEY (`payment_package_id`);

--
-- Indexes for table `payment_retention_followup`
--
ALTER TABLE `payment_retention_followup`
 ADD PRIMARY KEY (`FollowupId`), ADD KEY `FK_payment_retention_followup_invoice_id` (`InvoiceNo`), ADD KEY `FK_payment_retention_followup_user_id` (`AssignEmployee`);

--
-- Indexes for table `payment_retention_followup_details`
--
ALTER TABLE `payment_retention_followup_details`
 ADD PRIMARY KEY (`FollowupId`);

--
-- Indexes for table `pendingtempaceessrequest`
--
ALTER TABLE `pendingtempaceessrequest`
 ADD PRIMARY KEY (`requestId`), ADD KEY `assignedApproaver` (`assignedApproaver`), ADD KEY `assignedBy` (`assignedBy`);

--
-- Indexes for table `po_to_inward`
--
ALTER TABLE `po_to_inward`
 ADD PRIMARY KEY (`potoinwardid`), ADD KEY `inwardid` (`inwardid`);

--
-- Indexes for table `po_to_outward`
--
ALTER TABLE `po_to_outward`
 ADD PRIMARY KEY (`potooutwardid`), ADD KEY `outwardid` (`outwardid`);

--
-- Indexes for table `produced_good`
--
ALTER TABLE `produced_good`
 ADD PRIMARY KEY (`producedgoodid`), ADD KEY `productionbatchmasterid` (`productionbatchmasterid`), ADD KEY `materialproducedid` (`materialproducedid`);

--
-- Indexes for table `production_batch_master`
--
ALTER TABLE `production_batch_master`
 ADD PRIMARY KEY (`productionbatchmasterid`);

--
-- Indexes for table `production_raw_materials_details`
--
ALTER TABLE `production_raw_materials_details`
 ADD PRIMARY KEY (`prodrawmaterialdtlsid`), ADD KEY `productionbatchmasterid` (`productionbatchmasterid`), ADD KEY `materialid` (`materialid`);

--
-- Indexes for table `product_details`
--
ALTER TABLE `product_details`
 ADD PRIMARY KEY (`productdetailsid`), ADD KEY `productmasterid` (`productmasterid`);

--
-- Indexes for table `product_master`
--
ALTER TABLE `product_master`
 ADD PRIMARY KEY (`productmasterid`), ADD KEY `materialtypeid` (`materialtypeid`);

--
-- Indexes for table `product_packaging`
--
ALTER TABLE `product_packaging`
 ADD PRIMARY KEY (`productpackagingid`), ADD KEY `productmasterid` (`productmasterid`);

--
-- Indexes for table `projectlist`
--
ALTER TABLE `projectlist`
 ADD PRIMARY KEY (`ProjectId`);

--
-- Indexes for table `project_address_details`
--
ALTER TABLE `project_address_details`
 ADD PRIMARY KEY (`ProjectId`);

--
-- Indexes for table `project_master`
--
ALTER TABLE `project_master`
 ADD PRIMARY KEY (`ProjectId`), ADD KEY `FK_project_master_manager_id` (`ProjectManagerId`), ADD KEY `FK_project_master_created_by` (`CreatedBy`), ADD KEY `FK_project_master_deleted_by` (`DeletedBy`), ADD KEY `FK_project_master_mod_by` (`LastModifiedBy`);

--
-- Indexes for table `project_payment`
--
ALTER TABLE `project_payment`
 ADD PRIMARY KEY (`PaymentId`), ADD KEY `FK_project_payment_invoice_id` (`InvoiceNo`);

--
-- Indexes for table `project_payment_followup`
--
ALTER TABLE `project_payment_followup`
 ADD PRIMARY KEY (`FollowupId`), ADD KEY `FK_project_payment_followup_invoice_id` (`InvoiceId`), ADD KEY `FK_project_payment_followup_user_id` (`AssignEmployee`);

--
-- Indexes for table `project_payment_followup_details`
--
ALTER TABLE `project_payment_followup_details`
 ADD PRIMARY KEY (`FollowupId`);

--
-- Indexes for table `project_payment_mode_details`
--
ALTER TABLE `project_payment_mode_details`
 ADD PRIMARY KEY (`PaymentId`), ADD UNIQUE KEY `IDOfinstrument` (`IDOfInstrument`);

--
-- Indexes for table `project_point_of_contact_details`
--
ALTER TABLE `project_point_of_contact_details`
 ADD PRIMARY KEY (`ProjectId`);

--
-- Indexes for table `quotation`
--
ALTER TABLE `quotation`
 ADD PRIMARY KEY (`QuotationId`), ADD KEY `FK_quotation_project_id` (`ProjectId`), ADD KEY `FK_quotation_company_id` (`companyId`);

--
-- Indexes for table `quotation_details`
--
ALTER TABLE `quotation_details`
 ADD PRIMARY KEY (`DetailID`), ADD KEY `FK_quotation_details_quotation_id` (`QuotationId`);

--
-- Indexes for table `quotation_followup`
--
ALTER TABLE `quotation_followup`
 ADD PRIMARY KEY (`FollowupId`), ADD KEY `FK_quotationfollowup_quotation_id` (`QuotationId`), ADD KEY `FK_quotationfollowup_user_id` (`AssignEmployee`);

--
-- Indexes for table `quotation_followup_details`
--
ALTER TABLE `quotation_followup_details`
 ADD PRIMARY KEY (`FollowupId`);

--
-- Indexes for table `quotation_tax_applicable_to`
--
ALTER TABLE `quotation_tax_applicable_to`
 ADD PRIMARY KEY (`TaxID`,`DetailsID`), ADD KEY `FK_quotation_tax_applicable_to_quotation_details` (`DetailsID`);

--
-- Indexes for table `quotation_tax_details`
--
ALTER TABLE `quotation_tax_details`
 ADD PRIMARY KEY (`TaxID`), ADD KEY `FK_quotation_tax_details_quotation_id` (`QuotationId`);

--
-- Indexes for table `roleaccesspermission`
--
ALTER TABLE `roleaccesspermission`
 ADD PRIMARY KEY (`roleAccessId`), ADD KEY `roleId` (`roleId`), ADD KEY `accessId` (`accessId`), ADD KEY `createdBy` (`createdBy`);

--
-- Indexes for table `rolemaster`
--
ALTER TABLE `rolemaster`
 ADD PRIMARY KEY (`roleId`), ADD KEY `createdBy` (`createdBy`), ADD KEY `lastModifiedBy` (`lastModifiedBy`);

--
-- Indexes for table `site_tracking_followup_details`
--
ALTER TABLE `site_tracking_followup_details`
 ADD PRIMARY KEY (`FollowupId`);

--
-- Indexes for table `site_tracking_followup_schedule`
--
ALTER TABLE `site_tracking_followup_schedule`
 ADD PRIMARY KEY (`FollowupId`), ADD KEY `FK_site_tracking_followup_schedule_project_id` (`ProjectId`), ADD KEY `FK_site_tracking_followup_schedule_employee_id` (`AssignEmployee`), ADD KEY `FK_site_tracking_followup_schedule_CreatedBy` (`CreatedBy`);

--
-- Indexes for table `superuser`
--
ALTER TABLE `superuser`
 ADD PRIMARY KEY (`superUserId`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
 ADD PRIMARY KEY (`supplierid`);

--
-- Indexes for table `task_conduction_notes`
--
ALTER TABLE `task_conduction_notes`
 ADD PRIMARY KEY (`id`), ADD KEY `FK_task_conduction_notes_user_id` (`NoteAddedBy`);

--
-- Indexes for table `task_master`
--
ALTER TABLE `task_master`
 ADD PRIMARY KEY (`TaskID`), ADD KEY `FK_Task_master_assigned_to` (`TaskAssignedTo`), ADD KEY `FK_Task_master_created_by` (`CreatedBy`);

--
-- Indexes for table `tempaccesspermissions`
--
ALTER TABLE `tempaccesspermissions`
 ADD PRIMARY KEY (`requestId`,`accessId`), ADD KEY `userId` (`userId`), ADD KEY `accessId` (`accessId`);

--
-- Indexes for table `tempaccessrequest`
--
ALTER TABLE `tempaccessrequest`
 ADD PRIMARY KEY (`requestId`), ADD KEY `requestedBy` (`requestedBy`);

--
-- Indexes for table `tempaccessrequestaction`
--
ALTER TABLE `tempaccessrequestaction`
 ADD PRIMARY KEY (`requestId`), ADD KEY `actionBy` (`actionBy`);

--
-- Indexes for table `unapproved_expense_bills`
--
ALTER TABLE `unapproved_expense_bills`
 ADD PRIMARY KEY (`billid`), ADD KEY `expensedetailsid` (`expensedetailsid`);

--
-- Indexes for table `usermaster`
--
ALTER TABLE `usermaster`
 ADD PRIMARY KEY (`userId`);

--
-- Indexes for table `userroleinfo`
--
ALTER TABLE `userroleinfo`
 ADD KEY `userId` (`userId`), ADD KEY `roleId` (`roleId`), ADD KEY `createdBy` (`createdBy`), ADD KEY `lastModifiedBy` (`lastModifiedBy`);

--
-- Indexes for table `userverification`
--
ALTER TABLE `userverification`
 ADD PRIMARY KEY (`userId`);

--
-- Indexes for table `user_master`
--
ALTER TABLE `user_master`
 ADD PRIMARY KEY (`UserId`);

--
-- Indexes for table `warehouse`
--
ALTER TABLE `warehouse`
 ADD PRIMARY KEY (`warehouseid`);

--
-- Indexes for table `warehousemaster`
--
ALTER TABLE `warehousemaster`
 ADD PRIMARY KEY (`warehouseId`), ADD KEY `createdBy` (`createdBy`), ADD KEY `lastModifiedBy` (`lastModifiedBy`);

--
-- Indexes for table `weekly_off_in_year`
--
ALTER TABLE `weekly_off_in_year`
 ADD KEY `caption_of_year` (`caption_of_year`);

--
-- Indexes for table `work_order`
--
ALTER TABLE `work_order`
 ADD PRIMARY KEY (`WorkOrderNo`), ADD KEY `FK_work_order_project_id` (`ProjectId`), ADD KEY `FK_work_order_company_id` (`companyId`), ADD KEY `FK_work_order_deleted_by` (`DeletedBy`), ADD KEY `FK_work_order_created_by` (`CreatedBy`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applicator_enrollment`
--
ALTER TABLE `applicator_enrollment`
MODIFY `enrollment_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `applicator_follow_up`
--
ALTER TABLE `applicator_follow_up`
MODIFY `follow_up_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `applicator_master`
--
ALTER TABLE `applicator_master`
MODIFY `applicator_master_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `applicator_payment_follow_up_info`
--
ALTER TABLE `applicator_payment_follow_up_info`
MODIFY `follow_up_info_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `applicator_payment_info`
--
ALTER TABLE `applicator_payment_info`
MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `applicator_pointof_contact`
--
ALTER TABLE `applicator_pointof_contact`
MODIFY `point_of_contact_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `companies_involved_in_project`
--
ALTER TABLE `companies_involved_in_project`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `follow_up_employee`
--
ALTER TABLE `follow_up_employee`
MODIFY `follow_up_employee_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `inhouse_inward_entry`
--
ALTER TABLE `inhouse_inward_entry`
MODIFY `inhouseinwardid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `inhouse_transportation_details`
--
ALTER TABLE `inhouse_transportation_details`
MODIFY `inhousetransportid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
MODIFY `inventoryid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `inward`
--
ALTER TABLE `inward`
MODIFY `inwardid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=134;
--
-- AUTO_INCREMENT for table `inward_details`
--
ALTER TABLE `inward_details`
MODIFY `inwarddetailsid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=114;
--
-- AUTO_INCREMENT for table `inward_transportation_details`
--
ALTER TABLE `inward_transportation_details`
MODIFY `inwardtranspid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `material`
--
ALTER TABLE `material`
MODIFY `materialid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=119;
--
-- AUTO_INCREMENT for table `materialtype`
--
ALTER TABLE `materialtype`
MODIFY `materialtypeid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=48;
--
-- AUTO_INCREMENT for table `outward`
--
ALTER TABLE `outward`
MODIFY `outwardid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT for table `outward_details`
--
ALTER TABLE `outward_details`
MODIFY `outwarddtlsid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=34;
--
-- AUTO_INCREMENT for table `outward_transportation_details`
--
ALTER TABLE `outward_transportation_details`
MODIFY `outwardtranspid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `payment_mode_details`
--
ALTER TABLE `payment_mode_details`
MODIFY `payment_mode_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `payment_package_details`
--
ALTER TABLE `payment_package_details`
MODIFY `package_details_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `payment_package_master`
--
ALTER TABLE `payment_package_master`
MODIFY `payment_package_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `po_to_inward`
--
ALTER TABLE `po_to_inward`
MODIFY `potoinwardid` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `po_to_outward`
--
ALTER TABLE `po_to_outward`
MODIFY `potooutwardid` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `produced_good`
--
ALTER TABLE `produced_good`
MODIFY `producedgoodid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `production_batch_master`
--
ALTER TABLE `production_batch_master`
MODIFY `productionbatchmasterid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `production_raw_materials_details`
--
ALTER TABLE `production_raw_materials_details`
MODIFY `prodrawmaterialdtlsid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `product_details`
--
ALTER TABLE `product_details`
MODIFY `productdetailsid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=128;
--
-- AUTO_INCREMENT for table `product_master`
--
ALTER TABLE `product_master`
MODIFY `productmasterid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=137;
--
-- AUTO_INCREMENT for table `product_packaging`
--
ALTER TABLE `product_packaging`
MODIFY `productpackagingid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=137;
--
-- AUTO_INCREMENT for table `projectlist`
--
ALTER TABLE `projectlist`
MODIFY `ProjectId` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
MODIFY `supplierid` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT for table `task_conduction_notes`
--
ALTER TABLE `task_conduction_notes`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `warehouse`
--
ALTER TABLE `warehouse`
MODIFY `warehouseid` bigint(20) NOT NULL AUTO_INCREMENT;
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
-- Constraints for table `companies_involved_in_project`
--
ALTER TABLE `companies_involved_in_project`
ADD CONSTRAINT `FK_companies_involved_in_project_company_id` FOREIGN KEY (`companyId`) REFERENCES `companymaster` (`companyId`),
ADD CONSTRAINT `FK_companies_involved_in_project_project_id` FOREIGN KEY (`ProjectID`) REFERENCES `project_master` (`ProjectId`);

--
-- Constraints for table `companymaster`
--
ALTER TABLE `companymaster`
ADD CONSTRAINT `company_ForeignKeyCreatedBy` FOREIGN KEY (`createdBy`) REFERENCES `usermaster` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `company_ForeignKeyModifiedBy` FOREIGN KEY (`lastModifiedBy`) REFERENCES `usermaster` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `company_bank_details`
--
ALTER TABLE `company_bank_details`
ADD CONSTRAINT `FK_Company_bank_details_company_id` FOREIGN KEY (`companyId`) REFERENCES `companymaster` (`companyId`);

--
-- Constraints for table `company_master`
--
ALTER TABLE `company_master`
ADD CONSTRAINT `FK_company_master_created_by` FOREIGN KEY (`CreatedBy`) REFERENCES `user_master` (`UserId`),
ADD CONSTRAINT `FK_company_master_modified_by` FOREIGN KEY (`LastModifiedBy`) REFERENCES `user_master` (`UserId`);

--
-- Constraints for table `company_taxtion_details`
--
ALTER TABLE `company_taxtion_details`
ADD CONSTRAINT `FK_Company_taxtion_details_company_id` FOREIGN KEY (`companyId`) REFERENCES `companymaster` (`companyId`);

--
-- Constraints for table `customer_master`
--
ALTER TABLE `customer_master`
ADD CONSTRAINT `FK_customer_master_created_by` FOREIGN KEY (`CreatedBy`) REFERENCES `usermaster` (`userId`),
ADD CONSTRAINT `FK_customer_master_deleted_by` FOREIGN KEY (`DeletedBy`) REFERENCES `usermaster` (`userId`),
ADD CONSTRAINT `FK_customer_master_modified_by` FOREIGN KEY (`LastModifiedBy`) REFERENCES `usermaster` (`userId`);

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
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
ADD CONSTRAINT `FK_invoice_created_by` FOREIGN KEY (`CreatedBy`) REFERENCES `usermaster` (`userId`),
ADD CONSTRAINT `FK_invoice_quotation_id` FOREIGN KEY (`QuotationId`) REFERENCES `quotation` (`QuotationId`);

--
-- Constraints for table `invoice_details`
--
ALTER TABLE `invoice_details`
ADD CONSTRAINT `FK_invoice_details_invoice_id` FOREIGN KEY (`InvoiceId`) REFERENCES `invoice` (`InvoiceNo`);

--
-- Constraints for table `invoice_tax_applicable_to`
--
ALTER TABLE `invoice_tax_applicable_to`
ADD CONSTRAINT `FK_Invoice_Tax_Applicable_to_invoice_details` FOREIGN KEY (`DetailsId`) REFERENCES `invoice_details` (`DetailID`),
ADD CONSTRAINT `FK_Invoice_Tax_Applicable_to_tax_id` FOREIGN KEY (`TaxId`) REFERENCES `invoice_tax_details` (`TaxId`);

--
-- Constraints for table `invoice_tax_details`
--
ALTER TABLE `invoice_tax_details`
ADD CONSTRAINT `FK_Invoice_tax_Details_invoice_id` FOREIGN KEY (`InvoiceId`) REFERENCES `invoice` (`InvoiceNo`);

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
-- Constraints for table `paymentretention`
--
ALTER TABLE `paymentretention`
ADD CONSTRAINT `FK_paymentretention_invoice_no` FOREIGN KEY (`InvoiceNo`) REFERENCES `invoice` (`InvoiceNo`);

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
-- Constraints for table `payment_retention_followup`
--
ALTER TABLE `payment_retention_followup`
ADD CONSTRAINT `FK_payment_retention_followup_invoice_id` FOREIGN KEY (`InvoiceNo`) REFERENCES `invoice` (`InvoiceNo`),
ADD CONSTRAINT `FK_payment_retention_followup_user_id` FOREIGN KEY (`AssignEmployee`) REFERENCES `usermaster` (`userId`);

--
-- Constraints for table `payment_retention_followup_details`
--
ALTER TABLE `payment_retention_followup_details`
ADD CONSTRAINT `FK_payment_retention_followup_details_followup_id` FOREIGN KEY (`FollowupId`) REFERENCES `payment_retention_followup` (`FollowupId`);

--
-- Constraints for table `pendingtempaceessrequest`
--
ALTER TABLE `pendingtempaceessrequest`
ADD CONSTRAINT `ForeignKey_Approaver_PendingAccessAction` FOREIGN KEY (`assignedApproaver`) REFERENCES `usermaster` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `ForeignKey_RequestId_PendingAccessAction` FOREIGN KEY (`requestId`) REFERENCES `tempaccessrequest` (`requestId`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `ForeignKey_assignedBy_PendingAccessAction` FOREIGN KEY (`assignedBy`) REFERENCES `usermaster` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Constraints for table `project_address_details`
--
ALTER TABLE `project_address_details`
ADD CONSTRAINT `FK_project_address_details_project_id` FOREIGN KEY (`ProjectId`) REFERENCES `project_master` (`ProjectId`);

--
-- Constraints for table `project_master`
--
ALTER TABLE `project_master`
ADD CONSTRAINT `FK_project_master_created_by` FOREIGN KEY (`CreatedBy`) REFERENCES `usermaster` (`userId`),
ADD CONSTRAINT `FK_project_master_deleted_by` FOREIGN KEY (`DeletedBy`) REFERENCES `usermaster` (`userId`),
ADD CONSTRAINT `FK_project_master_manager_id` FOREIGN KEY (`ProjectManagerId`) REFERENCES `usermaster` (`userId`),
ADD CONSTRAINT `FK_project_master_mod_by` FOREIGN KEY (`LastModifiedBy`) REFERENCES `usermaster` (`userId`);

--
-- Constraints for table `project_payment`
--
ALTER TABLE `project_payment`
ADD CONSTRAINT `FK_project_payment_invoice_id` FOREIGN KEY (`InvoiceNo`) REFERENCES `invoice` (`InvoiceNo`);

--
-- Constraints for table `project_payment_followup`
--
ALTER TABLE `project_payment_followup`
ADD CONSTRAINT `FK_project_payment_followup_AssignEmployee` FOREIGN KEY (`AssignEmployee`) REFERENCES `usermaster` (`userId`),
ADD CONSTRAINT `FK_project_payment_followup_user_id` FOREIGN KEY (`AssignEmployee`) REFERENCES `usermaster` (`userId`);

--
-- Constraints for table `project_payment_followup_details`
--
ALTER TABLE `project_payment_followup_details`
ADD CONSTRAINT `FK_project_payment_followup_details_folloeup_id` FOREIGN KEY (`FollowupId`) REFERENCES `project_payment_followup` (`FollowupId`);

--
-- Constraints for table `project_payment_mode_details`
--
ALTER TABLE `project_payment_mode_details`
ADD CONSTRAINT `FK_project_payment_mode_details_payment_id` FOREIGN KEY (`PaymentId`) REFERENCES `project_payment` (`PaymentId`);

--
-- Constraints for table `project_point_of_contact_details`
--
ALTER TABLE `project_point_of_contact_details`
ADD CONSTRAINT `FK_project_point_of_contact_details_project_id` FOREIGN KEY (`ProjectId`) REFERENCES `project_master` (`ProjectId`);

--
-- Constraints for table `quotation`
--
ALTER TABLE `quotation`
ADD CONSTRAINT `FK_quotation_company_id` FOREIGN KEY (`companyId`) REFERENCES `companymaster` (`companyId`),
ADD CONSTRAINT `FK_quotation_project_id` FOREIGN KEY (`ProjectId`) REFERENCES `project_master` (`ProjectId`);

--
-- Constraints for table `quotation_details`
--
ALTER TABLE `quotation_details`
ADD CONSTRAINT `FK_quotation_details_quotation_id` FOREIGN KEY (`QuotationId`) REFERENCES `quotation` (`QuotationId`);

--
-- Constraints for table `quotation_followup`
--
ALTER TABLE `quotation_followup`
ADD CONSTRAINT `FK_quotation_followup_QuotationId` FOREIGN KEY (`QuotationId`) REFERENCES `quotation` (`QuotationId`);

--
-- Constraints for table `quotation_followup_details`
--
ALTER TABLE `quotation_followup_details`
ADD CONSTRAINT `FK_quotation_followup_details_quotatation_id` FOREIGN KEY (`FollowupId`) REFERENCES `quotation_followup` (`FollowupId`);

--
-- Constraints for table `quotation_tax_applicable_to`
--
ALTER TABLE `quotation_tax_applicable_to`
ADD CONSTRAINT `FK_quotation_tax_applicable_to_quotation_details` FOREIGN KEY (`DetailsID`) REFERENCES `quotation_details` (`DetailID`),
ADD CONSTRAINT `FK_quotation_tax_applicable_to_tax_details` FOREIGN KEY (`TaxID`) REFERENCES `quotation_tax_details` (`TaxID`);

--
-- Constraints for table `quotation_tax_details`
--
ALTER TABLE `quotation_tax_details`
ADD CONSTRAINT `FK_quotation_tax_details_quotation_id` FOREIGN KEY (`QuotationId`) REFERENCES `quotation` (`QuotationId`);

--
-- Constraints for table `roleaccesspermission`
--
ALTER TABLE `roleaccesspermission`
ADD CONSTRAINT `roleAccess_ForeignKeyCreatedBy` FOREIGN KEY (`createdBy`) REFERENCES `usermaster` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `roleAccess_ForeignKeyRoleId` FOREIGN KEY (`roleId`) REFERENCES `rolemaster` (`roleId`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `roleAccess_ForeignKeyaccessId` FOREIGN KEY (`accessId`) REFERENCES `accesspermission` (`accessId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `site_tracking_followup_details`
--
ALTER TABLE `site_tracking_followup_details`
ADD CONSTRAINT `FK_site_tracking_followup_details_followup_id` FOREIGN KEY (`FollowupId`) REFERENCES `site_tracking_followup_schedule` (`FollowupId`);

--
-- Constraints for table `site_tracking_followup_schedule`
--
ALTER TABLE `site_tracking_followup_schedule`
ADD CONSTRAINT `FK_site_tracking_followup_schedule_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `usermaster` (`userId`),
ADD CONSTRAINT `FK_site_tracking_followup_schedule_employee_id` FOREIGN KEY (`AssignEmployee`) REFERENCES `usermaster` (`userId`),
ADD CONSTRAINT `FK_site_tracking_followup_schedule_project_id` FOREIGN KEY (`ProjectId`) REFERENCES `project_master` (`ProjectId`);

--
-- Constraints for table `task_conduction_notes`
--
ALTER TABLE `task_conduction_notes`
ADD CONSTRAINT `FK_task_conduction_notes_user_id` FOREIGN KEY (`NoteAddedBy`) REFERENCES `usermaster` (`userId`);

--
-- Constraints for table `task_master`
--
ALTER TABLE `task_master`
ADD CONSTRAINT `FK_Task_master_assigned_to` FOREIGN KEY (`TaskAssignedTo`) REFERENCES `usermaster` (`userId`),
ADD CONSTRAINT `FK_Task_master_created_by` FOREIGN KEY (`CreatedBy`) REFERENCES `usermaster` (`userId`);

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
ADD CONSTRAINT `ForeignKey_RequestId_AccessAction` FOREIGN KEY (`requestId`) REFERENCES `tempaccessrequest` (`requestId`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `ForeignKey_actionBy_AccessAction` FOREIGN KEY (`actionBy`) REFERENCES `usermaster` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `unapproved_expense_bills`
--
ALTER TABLE `unapproved_expense_bills`
ADD CONSTRAINT `FORIEGNKEYEXPENSEDETAILSUNAPPROVED` FOREIGN KEY (`expensedetailsid`) REFERENCES `expense_details` (`expensedetailsid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `work_order`
--
ALTER TABLE `work_order`
ADD CONSTRAINT `FK_work_order_company_id` FOREIGN KEY (`companyId`) REFERENCES `companymaster` (`companyId`),
ADD CONSTRAINT `FK_work_order_created_by` FOREIGN KEY (`CreatedBy`) REFERENCES `usermaster` (`userId`),
ADD CONSTRAINT `FK_work_order_deleted_by` FOREIGN KEY (`DeletedBy`) REFERENCES `usermaster` (`userId`),
ADD CONSTRAINT `FK_work_order_project_id` FOREIGN KEY (`ProjectId`) REFERENCES `project_master` (`ProjectId`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
