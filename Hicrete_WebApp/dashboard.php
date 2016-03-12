<!DOCTYPE html>
<html lang="en">
<head>
    <!-- META SECTION -->
    <title>Hi-crete Web Solution</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <link rel="icon" href="favicon.ico" type="image/x-icon" />
    <!-- END META SECTION -->

    <!-- CSS INCLUDE -->
    <link rel="stylesheet" type="text/css" id="theme" href="Assets/css/theme-white.css" />
    <link rel="stylesheet" type="text/css" id="theme" href="Assets/css/hicreteApp.css" />
    <!-- EOF CSS INCLUDE -->

    <style>
        .page-container {
            width: 100%;
            float: left;
            min-height: 100%;
            position: relative;
            background: #ffffff;
        }
        .page-content-wrap{
            padding-top: 10px;
        }
        .logoBackground{
            background-color:   #1caf9a !important;
        }
        .hicreteLogo{
            padding: 10px 10px 0px 5px;
        }
        ::-webkit-scrollbar { background: white;width: 5px; height: 5px;}
        ::-webkit-scrollbar-button { display: none;}
        ::-webkit-scrollbar-track { background: transparent;}
        ::-webkit-scrollbar-track-piece { background: transparent;}
        ::-webkit-scrollbar-thumb { background: #9E9E9E; border-radius: 4px;}
        ::-webkit-scrollbar-corner { display: none;}
        ::-webkit-resizer {display: none;}
        /*-----------------------------------CSS FOR DATEPICKER-----------------------------------------------------*/
        ul.dropdown-menu table thead{
            background:#1caf9a !important;
            color:#fff !important;
        }

        ul.dropdown-menu table thead th .btn-default,ul.dropdown-menu table thead th .btn-default:hover, ul.dropdown-menu table thead th .btn-default:focus,
        ul.dropdown-menu table thead th .btn-default:active,ul.dropdown-menu table thead th  .btn-default.active, .open > ul.dropdown-menu table thead th .dropdown-toggle .btn-default {
            background-color: transparent;
            border-color: transparent;
            color:#fff;
            margin-right: 0;
        }

        ul.dropdown-menu:after{
            border-bottom-color: #1caf9a;
        }

        ul.dropdown-menu table tbody td .btn-info:hover,ul.dropdown-menu table tbody td .btn-info:focus,ul.dropdown-menu table tbody td .btn-info:active,ul.dropdown-menu table tbody td .btn-info.active, .open >ul.dropdown-menu table tbody td .dropdown-toggle.btn-info{
            background-color: #f5f5f5;
            border-color: #E5E5E5;
            color:#333;
        }

        ul.dropdown-menu table tbody td .btn.btn-sm,ul.dropdown-menu table tbody td .btn-group-sm > .btn{
            padding: 2px 5px;
        }
        /*--------- Select Box --------*/
        select.btn.dropdown-toggle.selectpicker {
            border: 1px solid #D5D5D5;
            background: #F9F9F9;
            border-radius: 4px;
            height: 30px;
        }
    </style>

    <!-- START SCRIPTS -->

    <script type="text/javascript" src="Assets/js/angular.min.js"></script>
    <script type="text/javascript" src="Assets/js/angular-route.min.js"></script>
    <script type="text/javascript" src="Assets/js/angular-cookies.js"></script>

    <script type="text/javascript" src="Assets/js/angular-ui-router.min.js"></script>
    <script type="text/javascript" src="Assets/js/angular-messages.js"></script>

    <script type="text/javascript" src="Assets/plugins/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="Assets/plugins/bootstrap/bootstrap.min.js"></script>
    <script type="text/javascript" src="Assets/plugins/jquery/jquery-ui.min.js"></script>
    <script type="text/javascript" src="Assets/plugins/mcustomscrollbar/jquery.mCustomScrollbar.min.js"></script>


    <script type="text/javascript" src="Assets/js/plugins.js"></script>
    <script type="text/javascript" src="Assets/js/actions.js"></script>


    <script src="Assets/js/ui-bootstrap-tpls-0.14.3.min.js"></script>

    <script type="text/javascript" src="hicreteApp.js"></script>

    <!-- END SCRIPTS -->

    <!--Controllers and service-->
    <script type="text/javascript" src="Inventory/js/Services/Inventory_Service.js"></script>
    <script type="text/javascript" src="Inventory/js/Controllers/Inventory_Controllers.js"></script>
    <script type="text/javascript" src="Inventory/js/controllers/supplierFetch.js"></script>
    <script type="text/javascript" src="Expense/js/expenseController.js"></script>
    <script type="text/javascript" src="Config/js/configController.js"></script>
    <script type="text/javascript" src="Config/js/configService.js"></script>
    <script type="text/javascript" src="Applicator/js/Controllers/ApplicatorControllers.js"></script>
    <script type="text/javascript" src="Applicator/js/Services/ApplicatorServices.js"></script>
    <script type="text/javascript" src="Process/js/ProcessControllers.js"></script>
    <script type="text/javascript" src="Payroll/js/PayrollControllers.js"></script>

</head>

<?php

error_reporting(E_ERROR | E_PARSE);
require_once 'php/user.php';
if (!isset($_SESSION['token'])) {
    session_start();
}
$userId=$_SESSION['token'];
$userObj=new User();
if(!$userObj->init($userId)){
    session_destroy();
    echo "Something went wrong..Cant find user";
    return;
}

?>

<body ng-app="hicreteApp" ng-controller="dashboardController">
<!-- START PAGE CONTAINER -->
<div class="page-container page-navigation-top-fixed">

    <!-- START PAGE SIDEBAR -->
    <div class="page-sidebar page-sidebar-fixed" ng-controller="TabController as tab">

        <!-- START X-NAVIGATION -->
        <ul class="x-navigation">
            <li class="xn-logo logoBackground">
                <img src="Assets/images/logo/hi-crete-logo-dashboard(white).png" alt="Hi-crete logo" class="hicreteLogo"/>
            </li>
            <li class="xn-profile">
                <a href="#" class="profile-mini">
                    <img src="Assets/images/users/avatar.jpg" alt="John Doe"/>
                </a>
                <div class="profile">
                    <div class="profile-image">
                        <img src="Assets/images/users/avatar.jpg" alt="John Doe"/>
                    </div>
                    <div class="profile-data">

                        <?php

                        echo "<div class=\"profile-data-name\">".$userObj->username."</div>";
                        echo "<div class=\"profile-data-name\">".$userObj->designation."</div>";
                        ?>

                    </div>
                </div>
            </li>
            <li ng-class="{active:tab.isSet(1)}">
                <a ui-sref="MainPage" ng-click="tab.setTab(1)"><span class="fa fa-tachometer"></span> <span class="xn-text">Dashboard</span></a>
            </li>


            <?php

            if($userObj->isInventory){
                echo "<li ng-class=\"{active:tab.isSet(2)}\">
                            <a ng-click=\"tab.setTab(2)\" ui-sref=\"Inventory\"><span class=\"fa fa-industry\"></span> <span class=\"xn-text\">Inventory</span></a>
                    </li>";
            }

            if($userObj->isBusinessProcess){
                echo "<li ng-class=\"{active:tab.isSet(3)}\">
                            <a ng-click=\"tab.setTab(3)\" ui-sref=\"Process\"><span class=\"fa fa-refresh\"></span> <span class=\"xn-text\">Process</span></a>
                    </li>";
            }

            if($userObj->isExpense){
//                echo "<li class=\"\">
//                            <a ui-sref=\"Expense\"><span class=\"fa fa-inr\"></span> <span class=\"xn-text\">Expense</span></a>
//                    </li>";
            }

            if($userObj->isApplicator){
                echo "<li ng-class=\"{active:tab.isSet(4)}\">
                            <a ng-click=\"tab.setTab(4)\" ui-sref=\"Applicator\"><span class=\"fa fa-users\"></span> <span class=\"xn-text\">Applicator</span></a>
                    </li>";
            }

            if($userObj->isApplicator){
                echo "<li ng-class=\"{active:tab.isSet(5)}\">
                            <a ng-click=\"tab.setTab(5)\" href=\"#\"><span class=\"fa fa-money\"></span> <span class=\"xn-text\">Payroll</span></a>
                    </li>";
            }

            if($userObj->isReporting){
                echo "<li ng-class=\"{active:tab.isSet(6)}\">
                            <a ng-click=\"tab.setTab(6)\" href=\"#\"><span class=\"fa fa-line-chart\"></span> <span class=\"xn-text\">Reporting</span></a>
                    </li>";
            }

            if($userObj->isAdmin){
                echo "<li ng-class=\"{active:tab.isSet(7)}\">
                            <a ng-click=\"tab.setTab(7)\" ui-sref=\"Config\"><span class=\"fa fa-cog\"></span> <span class=\"xn-text\">Configuration</span></a>
                    </li>";
            }

            // <li class="">
            //     <a href="#"><span class="fa fa-refresh"></span> <span class="xn-text">Process</span></a>
            // </li>
            // <li class="">
            //     <a ui-sref="Expense"><span class="fa fa-inr"></span> <span class="xn-text">Expense</span></a>
            // </li>
            // <li class="">
            //     <a ui-sref="Applicator"><span class="fa fa-users"></span> <span class="xn-text">Applicator</span></a>
            // </li>
            // <li class="">
            //     <a href="#"><span class="fa fa-money"></span> <span class="xn-text">Payroll</span></a>
            // </li>
            // <li class="">
            //     <a href="#"><span class="fa fa-line-chart"></span> <span class="xn-text">Reporting</span></a>
            // </li>
            // <li class="">
            //     <a ui-sref="Config"><span class="fa fa-cog"></span> <span class="xn-text">Configuration</span></a>
            // </li>
            ?>

        </ul>
        <!-- END X-NAVIGATION -->

    </div>
    <!-- END PAGE SIDEBAR -->

    <!-- PAGE CONTENT -->
    <div class="page-content">

        <!-- START X-NAVIGATION VERTICAL -->
        <ul class="x-navigation x-navigation-horizontal x-navigation-panel">
            <!-- TOGGLE NAVIGATION -->
            <li class="xn-icon-button">
                <a href="#" class="x-navigation-minimize"><span class="fa fa-dedent"></span></a>
            </li>
            <li class="xn-icon-button">
                <a ui-sref="billApproval" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Bill Approval"><span class="fa fa-file-text-o"></span></a>
            </li>
            <li class="xn-icon-button">
                <a ui-sref="accessApproval" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Access Approval"><span class="fa fa-check-square-o"></span></a>
            </li>
            <li class="xn-icon-button">
                <a ui-sref="leaveApproval" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Leave Approval"><span class="fa fa-thumbs-o-up"></span></a>
            </li>
            <!-- END TOGGLE NAVIGATION -->
            <!-- SEARCH -->
<!--            <li class="xn-search">-->
<!--                <form role="form">-->
<!--                    <input type="text" name="search" placeholder="Search..."/>-->
<!--                </form>-->
<!--            </li>-->
            <!-- END SEARCH -->
            <!-- SIGN OUT -->
            <!--            <li class="xn-icon-button pull-right">-->
            <!--            <a ng-click="logout()" class="mb-control" data-box="#mb-signout"><span class="fa fa-sign-out"></span></a>-->
            <!--            </li>-->
            <li class="xn-icon-button pull-right">
                <a ng-click=""><span class="fa fa-sign-out"></span></a>
                <div class="panel panel-primary animated zoomIn xn-drop-left xn-panel-dragging" style="width: 230px;">
                    <div class="panel-body list-group list-group-contacts">
                        <a ui-sref="myProfile" class="list-group-item">
                            <span class="contacts-title">My Profile</span>
                        </a>
                        <a ui-sref="createSuperUser"  class="list-group-item">
                            <span class="contacts-title">Create Super User</span>
                        </a>
                        <a ui-sref="RequestAccess" class="list-group-item">
                            <span class="contacts-title">Request for access</span>
                        </a>
                        <a ui-sref="ChangePassword" class="list-group-item">
                            <span class="contacts-title">Change Password</span>
                        </a>
                        <a href="#" data-ng-click="logout()" class="list-group-item">
                            <span class="contacts-title">Log out</span>
                        </a>


                    </div>
                </div>
            </li>
            <!-- END SIGN OUT -->
            <!-- MESSAGES -->
            <li class="xn-icon-button pull-right">
                <a href="#"><span class="fa fa-bell"></span></a>
                <div class="informer informer-danger">4</div>
                <div class="panel panel-primary animated zoomIn xn-drop-left xn-panel-dragging">
                    <div class="panel-heading">
                        <h3 class="panel-title"><span class="fa fa-comments"></span>Notifications</h3>
                        <div class="pull-right">
                            <span class="label label-danger">4 new</span>
                        </div>
                    </div>
                </div>
            </li>
                    <!-- END SIGN OUT -->


        </ul>
        <!-- END X-NAVIGATION VERTICAL -->



        <!-- PAGE CONTENT WRAPPER -->
        <div class="page-content-wrap">

            <div ui-view>

            </div>

        </div>
        <!-- END PAGE CONTENT WRAPPER -->
    </div>
    <!-- END PAGE CONTENT -->
</div>
<!-- END PAGE CONTAINER -->



</body>
</html>






