<?php

//error_reporting(E_ERROR | E_PARSE);
require_once '../../php/appUtil.php';
if (!isset($_SESSION['token'])) {
    session_start();
}else{
    header("Location: ../../index.html");
    exit();
}
$userId=$_SESSION['token'];
$hasRead=appUtil::doesUserHasAccess("Business Process",$userId,"Read");
$hasWrite=appUtil::doesUserHasAccess("Business Process",$userId,"Write");
$hasReadForExpense=appUtil::doesUserHasAccess("Expense",$userId,"Read");
$hasWriteForExpense=appUtil::doesUserHasAccess("Expense",$userId,"Write");

if(!$hasRead && !$hasWrite && !$hasReadForExpense && !$hasWriteForExpense){
    header("Location: ../../Dashboard.php");
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
        z-index: 2;
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
        padding:0
    }
    #primary_nav_wrap ul li.current-menu-item
    {
        background:#ddd
    }
    #primary_nav_wrap ul li:hover
    {
        background:#f6f6f6
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
        width:200px
    }
    #primary_nav_wrap ul ul a
    {
        line-height:120%;
        padding:10px 15px
    }
    #primary_nav_wrap ul ul ul
    {
        top:0;
        left:100%
    }
    #primary_nav_wrap ul li:hover > ul
    {
        display:block
    }
</style>

<div>
    <?php
    echo "<nav id=\"primary_nav_wrap\"> <ul>";

        if($hasRead==1 || $hasWrite==1) {
            if ($hasWrite == 1) {
                echo "<li><a>Create</a>
                    <ul>
                        <li><a ui-sref=\"Process.addCustomer\">Customer</a></li>
                        <li><a ui-sref=\"Process.addProject\">Project</a></li>

                        <li><a ui-sref=\"Process.addQuotation\">Quotation</a></li>

                    </ul>
                </li>";
            }
            if ($hasRead == 1) {
                echo "<li><a>Search</a>
                    <ul>
                        <li><a ui-sref=\"Process.viewCustomers\">Customer</a></li>
                        <li><a ui-sref=\"Process.viewProject\">Project</a></li>

                        </li>
                    </ul>
                </li>";
            }

//            echo "<li><a>Payment</a>
//                    <ul>";
//            if ($hasWrite == 1)
//                echo "<li><a ui-sref=\"Process.addPayment\">Add Payment</a></li>";
//            if ($hasRead == 1)
//                echo "<li><a ui-sref=\"Process.paymentHistory\">Payment History</a></li>";
//
//              echo  "</ul>
//                </li>";


                echo "<li><a>Task</a>
                    <ul>";
                        if($hasWrite==1)
                             echo "<li><a ui-sref=\"Process.assignTask\">Add Task</a></li>";
                        if ($hasRead == 1)
                            echo "<li><a ui-sref=\"Process.searchTask\">Search Task</a></li>";
                echo "</ul>
                </li>";
             if ($hasRead==1){
                echo  "<li><a>Followup History</a>
                    <ul>
                        <li><a ui-sref=\"Process.quotationFollowupHistory\">Quotation Followup History</a></li>
                        <li><a ui-sref=\"Process.paymentFollowupHistory\">Payment Followup</a></li>
                        <li><a ui-sref=\"Process.siteTrackingFollowupHistory\">SiteTracking Followup</a></li>

                    </ul>
                </li>";
            }
        }
           if($hasReadForExpense==1|| $hasWriteForExpense==1){
              echo  "<li><a>Project Expense</a>
                <ul>";
              if($hasWriteForExpense==1){
                  echo "<li><a ui-sref=\"Process.addSegment\">Create Budget Segment</a></li>
                  <li><a ui-sref=\"Process.materialExpense\">Add Material Expenses</a></li>
                  <li><a ui-sref=\"Process.otherExpense\">Add Other Expenses</a></li>";
              }
              if($hasReadForExpense==1){
                  echo "<li><a ui-sref=\"Process.searchSegment\">Search Budget Segment</a></li>";
              }

               echo "</ul>
            </li>";
           }
    echo "</ul>
    </nav>";

    ?>



</div>



<div ui-view></div>
<!-- END WIDGETS -->