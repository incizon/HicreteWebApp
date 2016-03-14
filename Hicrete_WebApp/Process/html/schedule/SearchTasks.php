<?php

error_reporting(E_ERROR | E_PARSE);
require_once '../../../php/appUtil.php';
if (!isset($_SESSION['token'])) {
    session_start();
}else{
    header("Location: index.html");
    exit();
}
$userId=$_SESSION['token'];
$hasWrite=appUtil::doesUserHasAccess("Business Process",$userId,"Write");

?>
<div class="col-md-12">

    <div class="panel panel-default">

        <div class="panel-heading">
            <h3 class="panel-title"><strong>Search</strong> Tasks</h3>
        </div>
        <div class="panel-body form-horizontal">

            <div class="row">
                <div class="col-md-4">

                    <select class="form-control select" name="searchBy" ng-model="sortExpression"/>
                    <option value="" disabled selected>Search by </option>>

                    <option value="TaskID">TaskID</option>
                    <option value="TaskName">TaskName</option>
                    <option value="Assign To">Assign To</option>
                    </select>

                </div>
                <div class="col-md-8">
                    <div class="input-group" >
                        <span class="input-group-addon"><span class="fa fa-search"></span></span>

                        <input type="text" class="form-control" placeholder="Keywords..." value="" ng-model="searchKeyword.$"/>

                        <div class="input-group-btn">
                            <button class="btn btn-primary">Search</button>
                        </div>
                    </div>
                </div>
            </div><br>
            <div class="table-responsive push-up-10">
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th>TaskID</th>
                        <th>Task Name</th>
                        <th>Description</th>
                        <th>Completion Percentage</th>
                        <th>Assign To</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr ng-repeat="task in taskList | filter :paginate | orderBy:creationDate">
                        <td width="20%">{{task.taskId}}</td>
                        <td width="10%">{{task.taskName}}</td>
                        <td width="15%">{{task.description}}</td>
                        <td width="15%">{{task.completionPercentage}}</td>
                        <td width="15%">{{task.assignTo}}</td>
                        <td>

                            <a ui-sref="Process.viewTask"> <button class="btn btn-info"><span class="fa fa-pencil-square-o"></span>View</button></a>
                            <?php
                                if($hasWrite==1){
                                    echo "<button class=\"btn btn-danger\">Delete</button>";
                                }
                            ?>

                        </td>
                    </tr>

                    </tbody>
                </table>
            </div>

        </div>


    </div>
    <uib-pagination total-items="totalItems" ng-model="currentPage"
                    max-size="5" boundary-links="true"
                    items-per-page="QuotationHistoryPerPage" class="pagination-sm">
    </uib-pagination>


</div>

