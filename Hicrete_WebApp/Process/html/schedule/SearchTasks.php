<?php

error_reporting(E_ERROR | E_PARSE);
require_once '../../../php/appUtil.php';
if (!isset($_SESSION['token'])) {
    session_start();
} else {
    header("Location: ../../index.html");
    exit();
}
$userId = $_SESSION['token'];
$hasWrite = appUtil::doesUserHasAccess("Business Process", $userId, "Write");

?>

<div>
    <div ng-include="'utils/loader.html'"></div>
</div>
<div>
    <div ng-include="'utils/ErrorMessage.html'"></div>
</div>
<div>
    <div ng-include="'utils/WarningMessage.html'"></div>
</div>
<div class="col-md-12">

    <div class="panel panel-default">

        <div class="panel-heading">
            <h3 class="panel-title"><strong>Search</strong> Tasks</h3>
        </div>
        <div class="panel-body form-horizontal">

            <div class="row">
                <div class="col-md-4">

                    <select class="form-control select" name="searchBy" ng-model="sortBy"/>
                    <option value="" disabled selected>Search by</option>
                    >
                    <option value="TaskName">TaskName</option>
                    <option>CompleteTask</option>
                    </select>

                </div>
                <div class="col-md-8">
                    <div class="input-group">
                        <span class="input-group-addon"><span class="fa fa-search"></span></span>

                        <input type="text" class="form-control" placeholder="Keywords..." value=""
                               ng-model="searchKeyword"/>

                        <div class="input-group-btn">
                            <button class="btn btn-primary" data-ng-click="getAllTasks()">Search</button>
                        </div>
                    </div>
                </div>
            </div>
            <br>

            <div class="table-responsive push-up-10">
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th>
                            <a ng-click="sortType = 'task.TaskID'; sortReverse = !sortReverse">TaskID
                                <span ng-show="sortType == 'task.TaskID' && !sortReverse" class="fa fa-caret-down"></span>
                                <span ng-show="sortType == 'task.TaskID' && sortReverse" class="fa fa-caret-up"></span>
                            </a>
                        </th>
                        <th>
                            <a ng-click="sortType = 'task.TaskName'; sortReverse = !sortReverse">Task Name
                                <span ng-show="sortType == 'task.TaskName' && !sortReverse" class="fa fa-caret-down"></span>
                                <span ng-show="sortType == 'task.TaskName' && sortReverse" class="fa fa-caret-up"></span>
                            </a>
                        </th>
                        <th>Description</th>
                        <th>Task CreationDate</th>
                        <th>Completion Percentage
<!--                            <a ng-click="sortType = 'task.CompletionPercentage'; sortReverse = !sortReverse">Completion Percentage-->
<!--                                <span ng-show="sortType == 'task.CompletionPercentage' && !sortReverse" class="fa fa-caret-down"></span>-->
<!--                                <span ng-show="sortType == 'task.CompletionPercentage' && sortReverse" class="fa fa-caret-up"></span>-->
<!--                            </a>-->
                           </th>
                        <th>Assign To</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr ng-repeat="task in tasks | filter:paginateTasksDetails | orderBy:sortType:sortReverse">
                        <td>{{$index+1}}</td>
                        <td>{{task.TaskName}}</td>
                        <td>{{task.TaskDescripion}}</td>
                        <td>{{task.CreationDate}}</td>
                        <td>{{task.CompletionPercentage}}</td>
                        <td>{{task.UserName}}</td>
                        <td>

                            <a ui-sref="Process.viewTask">
                                <button class="btn btn-info" ng-click="setTask(task)"><span
                                        class="fa fa-pencil-square-o"></span>View
                                </button>
                            </a>
                            <?php
                            //                            if ($hasWrite == 1) {
                            //                                echo "<button class=\"btn btn-danger\" ng-click = \"deleteTask(task.TaskID)\">Delete</button>";
                            //                            }
                            //                            ?>

                        </td>
                    </tr>

                    </tbody>
                </table>
            </div>

        </div>


    </div>
    <uib-pagination total-items="tasks.length" ng-model="currentPage"
                    boundary-links="true"
                    items-per-page="tasksPerPage" class="pagination-sm">
    </uib-pagination>


</div>

