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
$hasWrite=appUtil::doesUserHasAccess("Applicator",$userId,"Write");


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
            <h3 class="panel-title"><strong>Permanent </strong>Applicators</h3>
        </div>

        <div class="panel-body">

            <div class="row">
                <div class="col-md-4">

                    <select class="form-control select" name="searchBy" ng-model="searchExpression"/>
                    <option value="" disabled selected>Search by </option>>
                    <option value="applicator_name">Name</option>
                    <option value="applicator_city">City</option>
                    <option value="applicator_state">State</option>
                    </select>

                </div>
                <div class="col-md-8">
                    <div class="input-group" >
                        <span class="input-group-addon"><span class="fa fa-search"></span></span>

                        <input type="text" class="form-control" placeholder="Keywords..." value="" ng-model="searchKeyword"/>

                        <div class="input-group-btn">
                            <button class="btn btn-primary" ng-click="searchApplicator()">Search</button>
                        </div>
                    </div>
                </div>
            </div><br>

            <div class="table-responsive push-up-10">
                <table class="table table-bordered table-bordered">
                    <thead>
                    <tr>
                        <th width="5%">Sr.No</th>
                        <th width="10%">Applicator Name</th>
                        <th width="10%">Contact No</th>
                        <th width="10%">City</th>
                        <th width="15%">State</th>
                        <th width="40%">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr ng-repeat="applicator in permanentApplicators | filter :paginate">
                        <td width="5%">{{$index + 1}}</td>
                        <td width="20%">{{applicator.applicator_name}}</td>
                        <td width="10%">{{applicator.applicator_contact}}</td>
                        <td width="15%">{{applicator.applicator_city}}</td>
                        <td width="15%">{{applicator.applicator_state}}</td>
                        <td width="35%">

                            <a ui-sref="Applicator.permanentApplicatorDetails({applicator_id:applicator.applicator_master_id})"> <button class="btn btn-default btn-sm"><span class="fa fa-eye"></span>View</button></a>

                            <?php

                              if($hasWrite==1){
                                  echo "<a ui-sref=\"Applicator.modifyPermanentApplicatorDetails({applicator_id:applicator.applicator_master_id})\"> <button class=\"btn btn-default btn-sm\"><span class=\"fa fa-pencil-square-o\"></span>Modify</button></a>
                            ";
//                                  <button class="btn btn-danger btn-sm"><span class="fa fa-times"></span>Delete</button>
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
                    items-per-page="ApplicatorPerPage" class="pagination-sm">
    </uib-pagination>
</div>