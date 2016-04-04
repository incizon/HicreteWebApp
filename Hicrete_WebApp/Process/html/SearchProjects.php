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
$hasWrite=appUtil::doesUserHasAccess("Business Process",$userId,"Write");

?>

<div class="col-md-12">
<!-- START SEARCH -->

    <div class="panel panel-default">

        <div class="panel-heading">
            <h3 class="panel-title"><strong>Projects</strong>Details</h3>
        </div>

        <div class="panel-body">

            <div class="row">
                <div class="col-md-4">

                    <select class="form-control select" name="searchBy" ng-model="searchBy"/>
                    <option value="" disabled selected>Search by </option>>
                    <option value="project_name">Name</option>
                    <option value="project_city">City</option>
                    </select>

                </div>
                <div class="col-md-6">
                    <div class="input-group" >
                        <span class="input-group-addon"><span class="fa fa-search"></span></span>

                        <input type="text" class="form-control" placeholder="Keywords..." value="" ng-model="searchKeyword"/>
                    </div>
                </div>
                    <div class="col-md-2">
                        <button class="btn btn-primary" ng-click="searchproject()">Search</button>
                    </div>
            </div>
        </div><br>
        <div class="row">

<!--                <div class="col-md-4">-->
<!--                    <input type="checkbox" ng-model="sortByPayment" name="sort" value="true"> Payment-->
<!--                </div>-->
<!--                <div class="col-md-4">-->
<!--                    <input type="checkbox" ng-model="sortByQuotation" name="sort" value="true" >  Quotation-->
<!--                </div>-->
<!--                <div class="col-md-4">-->
<!--                    <input type="checkbox" ng-model="sortByCurrentWorking" name="sort" value="true">  Currently Working-->
<!--                </div>-->
            </div><br>

            <div class="table-responsive push-up-10">
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th>Sr.No</th>
                        <th>Project Name</th>
                        <th>Current Status</th>
                        <th>Project Manager</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr ng-repeat="project  in projectSearch | filter :paginate">
                        <td>{{$index + 1}}</td>
                        <td>{{project.project_name}}</td>
                        <td>{{project.project_status}}</td>
                        <td>{{project.project_manager}}</td>

                        <td>
                            <a ui-sref="Process.ProjectDetails({projectToView:project})">
                                <button class="btn btn-info" title="View project details">
                                    <span class="fa fa-eye"></span>
                                </button>
                            </a>

                            <?php
                                if($hasWrite==1){
                                    echo "<a ui-sref=\"Process.modifyProject({projectToModify:project})\">
                                <button class=\"btn btn-info\" title=\"Modify project details\">
                                    <span class=\"fa fa-pencil-square-o\"></span>
                                </button>
                            </a>";
                                }
                            ?>
<!--                                                   <a href="">-->
<!--                                                       <button class="btn btn-danger" title="Delete">-->
<!--                                                                 <span class="fa fa-times"></span>-->
<!--                                                                    </button>-->
<!--                            </a>-->
                            <a ui-sref="Process.searchExpense({costCenterForProject:project})">
                                <button class="btn btn-primary" title="View cost center">
                                    <span class="fa fa-eye"></span>
                                    Cost center
                                </button>
                            </a>
                            <?php
                                if($hasWrite==1){
                                    echo "<a ui-sref=\"Process.createCostCenter\">
                                <button ng-show='isCostCenterAvailable(project)' class=\"btn btn-primary\" title=\"Add cost center\">
                                    <span class=\"fa fa-plus\"></span>
                                    Cost center
                                </button>
                            </a>";
                                }
                            ?>


                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
    <uib-pagination total-items="projectSearch.length" ng-model="currentPage"
                    max-size="5" boundary-links="true"
                    items-per-page="ProjectPerPage" class="pagination-sm">
    </uib-pagination>
</div>




