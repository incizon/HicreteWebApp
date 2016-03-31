-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 20, 2016 at 04:30 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=50 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=44 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=53 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=68 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=50 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=43 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=40 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=142 ;

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
  `size` varchar(20) NOT NULL,
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=129 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=17 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=118 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=45 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=35 ;

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
  `packagesize` varchar(20) NOT NULL,
  `lchnguserid` varchar(20) NOT NULL,
  `lchngtime` datetime NOT NULL,
  `creuserid` varchar(20) NOT NULL,
  `cretime` datetime NOT NULL,
  PRIMARY KEY (`outwarddtlsid`),
  KEY `outwardid` (`outwardid`),
  KEY `materialid` (`materialid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=39 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=60 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=19 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=127 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=136 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=136 ;

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

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE IF NOT EXISTS `supplier` (
  `supplierid` bigint(20) NOT NULL AUTO_INCREMENT,
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
  `cretime` date NOT NULL,
  PRIMARY KEY (`supplierid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=22 ;

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
