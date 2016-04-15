-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 29, 2016 at 09:13 PM
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

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accesspermission`
--
ALTER TABLE `accesspermission`
 ADD PRIMARY KEY (`accessId`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
