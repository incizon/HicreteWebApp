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
    <link rel="stylesheet" type="text/css"  href="Assets/plugins/jquery-pines/pnotify.custom.min.css" />

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
        
    </style>

    <!-- START SCRIPTS -->
      
    <script type="text/javascript" src="Assets/js/angular.min.js"></script>
    <script type="text/javascript" src="Assets/js/angular-route.min.js"></script>
    <script type="text/javascript" src="Assets/js/angular-cookies.js"></script>

    <script type="text/javascript" src="Assets/js/angular-ui-router.min.js"></script>
    <script type="text/javascript" src="Assets/js/angular-messages.js"></script>
    <script type="text/javascript" src="Assets/plugins/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="Assets/plugins/jquery/jquery-ui.min.js"></script>
    <script src="Assets/js/ui-bootstrap-tpls-0.14.3.min.js"></script>
    s
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
    <div class="page-sidebar page-sidebar-fixed">

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
            <li class="active">
                <a ui-sref="MainPage"><span class="fa fa-tachometer"></span> <span class="xn-text">Dashboard</span></a>
            </li>
            

            <?php
               
                if($userObj->isInventory){
                    echo "<li class=\"\">
                            <a ui-sref=\"Inventory\"><span class=\"fa fa-industry\"></span> <span class=\"xn-text\">Inventory</span></a>
                    </li>"; 
                }

                if($userObj->isBusinessProcess){
                    echo "<li class=\"\">
                            <a href=\"#\"><span class=\"fa fa-refresh\"></span> <span class=\"xn-text\">Process</span></a>
                    </li>"; 
                }

                if($userObj->isExpense){
                    echo "<li class=\"\">
                            <a ui-sref=\"Expense\"><span class=\"fa fa-inr\"></span> <span class=\"xn-text\">Expense</span></a>
                    </li>"; 
                }

                if($userObj->isApplicator){
                    echo "<li class=\"\">
                            <a ui-sref=\"Applicator\"><span class=\"fa fa-users\"></span> <span class=\"xn-text\">Applicator</span></a>
                    </li>"; 
                }

                if($userObj->isApplicator){
                    echo "<li class=\"\">
                            <a href=\"Payroll\"><span class=\"fa fa-money\"></span> <span class=\"xn-text\">Payroll</span></a>
                    </li>"; 
                }
            
                if($userObj->isReporting){
                    echo "<li class=\"\">
                            <a href=\"#\"><span class=\"fa fa-line-chart\"></span> <span class=\"xn-text\">Reporting</span></a>
                    </li>"; 
                }

                if($userObj->isAdmin){
                    echo "<li class=\"\">
                            <a ui-sref=\"Config\"><span class=\"fa fa-cog\"></span> <span class=\"xn-text\">Configuration</span></a>
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
            <!-- END TOGGLE NAVIGATION -->
            <!-- SEARCH -->
            <li class="xn-search">
                <form role="form">
                    <input type="text" name="search" placeholder="Search..."/>
                </form>
            </li>
            <!-- END SEARCH -->
            <!-- SIGN OUT -->
            <li class="xn-icon-button pull-right">
                <a ng-click="logout()" class="mb-control" data-box="#mb-signout"><span class="fa fa-sign-out"></span></a>
            </li>
            <!-- END SIGN OUT -->
            <!-- MESSAGES -->
            <li class="xn-icon-button pull-right">
                <a href="#"><span class="fa fa-comments"></span></a>
                <div class="informer informer-danger">4</div>
                <div class="panel panel-primary animated zoomIn xn-drop-left xn-panel-dragging">
                    <div class="panel-heading">
                        <h3 class="panel-title"><span class="fa fa-comments"></span> Messages</h3>
                        <div class="pull-right">
                            <span class="label label-danger">4 new</span>
                        </div>
                    </div>
                    <div class="panel-body list-group list-group-contacts scroll" style="height: 200px;">
                        <a href="#" class="list-group-item">
                            <div class="list-group-status status-online"></div>
                            <img src="assets/images/users/user2.jpg" class="pull-left" alt="John Doe"/>
                            <span class="contacts-title">John Doe</span>
                            <p>Praesent placerat tellus id augue condimentum</p>
                        </a>
                        <a href="#" class="list-group-item">
                            <div class="list-group-status status-away"></div>
                            <img src="assets/images/users/user.jpg" class="pull-left" alt="Dmitry Ivaniuk"/>
                            <span class="contacts-title">Dmitry Ivaniuk</span>
                            <p>Donec risus sapien, sagittis et magna quis</p>
                        </a>
                        <a href="#" class="list-group-item">
                            <div class="list-group-status status-away"></div>
                            <img src="assets/images/users/user3.jpg" class="pull-left" alt="Nadia Ali"/>
                            <span class="contacts-title">Nadia Ali</span>
                            <p>Mauris vel eros ut nunc rhoncus cursus sed</p>
                        </a>
                        <a href="#" class="list-group-item">
                            <div class="list-group-status status-offline"></div>
                            <img src="assets/images/users/user6.jpg" class="pull-left" alt="Darth Vader"/>
                            <span class="contacts-title">Darth Vader</span>
                            <p>I want my money back!</p>
                        </a>
                    </div>
                    <div class="panel-footer text-center">
                        <a href="pages-messages.html">Show all messages</a>
                    </div>
                </div>
            </li>
            <!-- END MESSAGES -->
            <!-- TASKS -->
            <li class="xn-icon-button pull-right">
                <a href="#"><span class="fa fa-tasks"></span></a>
                <div class="informer informer-warning">3</div>
                <div class="panel panel-primary animated zoomIn xn-drop-left xn-panel-dragging">
                    <div class="panel-heading">
                        <h3 class="panel-title"><span class="fa fa-tasks"></span> Tasks</h3>
                        <div class="pull-right">
                            <span class="label label-warning">3 active</span>
                        </div>
                    </div>
                    <div class="panel-body list-group scroll" style="height: 200px;">
                        <a class="list-group-item" href="#">
                            <strong>Phasellus augue arcu, elementum</strong>
                            <div class="progress progress-small progress-striped active">
                                <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 50%;">50%</div>
                            </div>
                            <small class="text-muted">John Doe, 25 Sep 2014 / 50%</small>
                        </a>
                        <a class="list-group-item" href="#">
                            <strong>Aenean ac cursus</strong>
                            <div class="progress progress-small progress-striped active">
                                <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%;">80%</div>
                            </div>
                            <small class="text-muted">Dmitry Ivaniuk, 24 Sep 2014 / 80%</small>
                        </a>
                        <a class="list-group-item" href="#">
                            <strong>Lorem ipsum dolor</strong>
                            <div class="progress progress-small progress-striped active">
                                <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100" style="width: 95%;">95%</div>
                            </div>
                            <small class="text-muted">John Doe, 23 Sep 2014 / 95%</small>
                        </a>
                        <a class="list-group-item" href="#">
                            <strong>Cras suscipit ac quam at tincidunt.</strong>
                            <div class="progress progress-small">
                                <div class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%;">100%</div>
                            </div>
                            <small class="text-muted">John Doe, 21 Sep 2014 /</small><small class="text-success"> Done</small>
                        </a>
                    </div>
                    <div class="panel-footer text-center">
                        <a href="pages-tasks.html">Show all tasks</a>
                    </div>
                </div>
            </li>
            <!-- END TASKS -->

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






