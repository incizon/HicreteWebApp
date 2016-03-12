<!-- START WIDGETS -->
<?php

error_reporting(E_ERROR | E_PARSE);
require_once '../../php/appUtil.php';
if (!isset($_SESSION['token'])) {
    session_start();
}else{
    header("Location: index.html");
    exit();
}
$userId=$_SESSION['token'];
$hasRead=appUtil::doesUserHasAccess("Payroll",$userId,"Read");
$hasWrite=appUtil::doesUserHasAccess("Payroll",$userId,"Write");

if(!$hasRead && !$hasWrite){
    header("Location: Dashboard.php");
    exit();
}
?>

    <style>
        .panel.panel-default{
            margin-top: 40px;
        }
        #primary_nav_wrap
        {
            margin-top:15px;
            position:fixed;
            width: 100%;
            z-index: 20;
        }
        #primary_nav_wrap ul {
            -moz-border-bottom-colors: none;
            -moz-border-left-colors: none;
            -moz-border-right-colors: none;
            -moz-border-top-colors: none;
            background-color: #fff;
            border-color: #ccc;
            border-image: none;
            border-style: solid none;
            border-width: 1px medium;
            float: left;
            list-style: outside none none;
            margin: 0 0 -14px;
            padding: 0;
            position: relative;
            top: -25px;
            width: 100%;
        }
        #primary_nav_wrap ul a
        {
            display:block;
            color:#333;
            text-decoration:none;
            font-size:12px;
            line-height:32px;
            padding:0 15px;
        }
        #primary_nav_wrap ul li
        {
            position:relative;
            float:left;
            margin:0;
            padding:0;
        }
        #primary_nav_wrap ul li.current-menu-item
        {
            background:#ddd;
        }
        #primary_nav_wrap ul li:hover
        {
            background:#f6f6f6;
            cursor: pointer;
        }
        #primary_nav_wrap ul ul
        {
            display:none;
            position:absolute;
            top:100%;
            left:0;
            background:#fff;
            padding:0;
            width: 200px;
            z-index: 9999;
        }
        #primary_nav_wrap ul ul li
        {
            float:none;
            width:200px;
        }
        #primary_nav_wrap ul ul a
        {
            line-height:120%;
            padding:10px 15px;
        }
        #primary_nav_wrap ul ul ul
        {
            top:0;
            left:100%;
        }
        #primary_nav_wrap ul li:hover > ul
        {
            display:block;
        }
    </style>

    <div>
        <nav id="primary_nav_wrap">
            <ul>
                <li><a ui-sref="Payroll.applyForLeave">Apply For Leaves</a>
                </li>
                <li><a ui-sref="Payroll.showLeaves">Show My Leaves</a>
                </li>
                <?php
                if($hasWrite==1){
                    echo "<li><a>Settings</a>
                <ul>
                    <li><a ui-sref=\"Payroll.createYear\">Start Year</a></li>
                    <li><a ui-sref=\"Payroll.configureHolidays\">Configure Holidays</a></li>
                    <li><a ui-sref=\"Payroll.AddEmployeeToPayRoll\">Add Employee To Payroll</a></li>
                </ul>
                </li>";
                }
                if($hasRead==1){
                    echo "<li><a>Search Leaves</a>
                <ul>
                    <li><a ui-sref=\"Payroll.searchLeavesByDate\">By Date</a></li>
                    <li><a ui-sref=\"Payroll.searchLeavesByEmployee\">By Employee</a></li>

                </ul>
            </li>

            ";
                }

                ?>


            </ul>
        </nav>
    </div>
</div>


<div ui-view></div>
<!-- END WIDGETS -->