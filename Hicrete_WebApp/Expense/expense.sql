-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Oct 25, 2015 at 10:50 AM
-- Server version: 5.6.20
-- PHP Version: 5.5.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `expense`
--

-- --------------------------------------------------------

--
-- Table structure for table `approavedexpensebills`
--

CREATE TABLE IF NOT EXISTS `approavedexpensebills` (
  `BillId` int(10) NOT NULL,
  `ExpenseDetailsId` int(10) NOT NULL,
  `BillNo` varchar(20) NOT NULL,
  `BillIssueingEntity` varchar(50) NOT NULL,
  `Amount` int(10) NOT NULL,
  `DateOfBill` varchar(10) NOT NULL,
  `ApproavedBy` varchar(20) NOT NULL,
  `ApproavalDate` datetime(6) NOT NULL,
  `CreatedBy` varchar(40) NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `LastModificationDate` datetime(6) NOT NULL,
  `lastModifiedBy` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `budgetdetail`
--

CREATE TABLE IF NOT EXISTS `budgetdetail` (
`budgetId` int(3) NOT NULL,
  `costCenterId` int(11) NOT NULL,
  `BudgetSegId` int(11) NOT NULL,
  `AllocatedBudget` int(10) NOT NULL,
  `AlertLevel` int(10) NOT NULL,
  `CreatedBy` varchar(40) NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `LastModificationDate` datetime(6) NOT NULL,
  `lastModifiedBy` varchar(40) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `budgetdetail`
--

INSERT INTO `budgetdetail` (`budgetId`, `costCenterId`, `BudgetSegId`, `AllocatedBudget`, `AlertLevel`, `CreatedBy`, `CreationDate`, `LastModificationDate`, `lastModifiedBy`) VALUES
(4, 2, 456, 6789, 678987, '', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000', '');

-- --------------------------------------------------------

--
-- Table structure for table `budgetsegment`
--

CREATE TABLE IF NOT EXISTS `budgetsegment` (
`BudgetSegmentId` int(10) NOT NULL,
  `SegmentName` varchar(50) NOT NULL,
  `CreatedBy` varchar(40) NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `LastModificationDate` datetime(6) NOT NULL,
  `lastModifiedBy` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `costcentermaster`
--

CREATE TABLE IF NOT EXISTS `costcentermaster` (
`CostCenterId` int(10) NOT NULL,
  `ProjectId` int(10) NOT NULL,
  `CostCenterName` varchar(30) NOT NULL,
  `CreatedBy` varchar(40) NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `LastModificationDate` datetime(6) NOT NULL,
  `lastModifiedBy` varchar(40) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `costcentermaster`
--

INSERT INTO `costcentermaster` (`CostCenterId`, `ProjectId`, `CostCenterName`, `CreatedBy`, `CreationDate`, `LastModificationDate`, `lastModifiedBy`) VALUES
(2, 11, 'abc', '', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000', ''),
(3, 31232, 'fdjlfs', '', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000', ''),
(4, 0, 'priyanka', '', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000', ''),
(5, 0, '', '', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000', ''),
(6, 0, 'hoih', '', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000', ''),
(7, 4155, '127', '', '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000', '');

-- --------------------------------------------------------

--
-- Table structure for table `expenseapproavalmapping`
--

CREATE TABLE IF NOT EXISTS `expenseapproavalmapping` (
  `CostCenterId` int(10) NOT NULL,
  `EmployeeId` int(10) NOT NULL,
  `CreatedBy` varchar(40) NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `LastModificationDate` datetime(6) NOT NULL,
  `lastModifiedBy` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `expensedetails`
--

CREATE TABLE IF NOT EXISTS `expensedetails` (
  `ExpenseDetailsID` int(10) NOT NULL,
  `CostCenterId` int(10) NOT NULL,
  `BudgetSegmentId` int(10) NOT NULL,
  `Amount` int(10) NOT NULL,
  `Description` varchar(200) NOT NULL,
  `CreatedBy` varchar(40) NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `LastModificationDate` datetime(6) NOT NULL,
  `lastModifiedBy` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
-- Table structure for table `unapproavedexpensebills`
--

CREATE TABLE IF NOT EXISTS `unapproavedexpensebills` (
  `BillId` int(10) NOT NULL,
  `ExpenseDetailsId` int(10) NOT NULL,
  `BillNo` varchar(20) NOT NULL,
  `BillIssueingEntity` varchar(50) NOT NULL,
  `Amount` int(10) NOT NULL,
  `DateOfBill` varchar(10) NOT NULL,
  `CreatedBy` varchar(40) NOT NULL,
  `CreationDate` datetime(6) NOT NULL,
  `LastModificationDate` datetime(6) NOT NULL,
  `lastModifiedBy` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `budgetdetail`
--
ALTER TABLE `budgetdetail`
 ADD PRIMARY KEY (`budgetId`), ADD KEY `costCenterId` (`costCenterId`);

--
-- Indexes for table `budgetsegment`
--
ALTER TABLE `budgetsegment`
 ADD PRIMARY KEY (`BudgetSegmentId`);

--
-- Indexes for table `costcentermaster`
--
ALTER TABLE `costcentermaster`
 ADD PRIMARY KEY (`CostCenterId`);

--
-- Indexes for table `projectlist`
--
ALTER TABLE `projectlist`
 ADD PRIMARY KEY (`ProjectId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `budgetdetail`
--
ALTER TABLE `budgetdetail`
MODIFY `budgetId` int(3) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `budgetsegment`
--
ALTER TABLE `budgetsegment`
MODIFY `BudgetSegmentId` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `costcentermaster`
--
ALTER TABLE `costcentermaster`
MODIFY `CostCenterId` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `projectlist`
--
ALTER TABLE `projectlist`
MODIFY `ProjectId` int(10) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `budgetdetail`
--
ALTER TABLE `budgetdetail`
ADD CONSTRAINT `budgetdetail_ibfk_1` FOREIGN KEY (`costCenterId`) REFERENCES `costcentermaster` (`CostCenterId`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
