<?php

//error_reporting(E_ERROR | E_PARSE);
require_once '../../php/appUtil.php';
if (!isset($_SESSION['token'])) {
    session_start();
}else{
    header("Location: index.html");
    exit();
}
$userId=$_SESSION['token'];
$hasWrite=appUtil::isSuperUser($userId);

?>

<div class="row">

    <div class="col-md-12">

        <!-- START DATATABLE EXPORT -->
        <div class="panel panel-default">
            <div class="panel-body">
                <div class="form-group col-md-12">
                    <div class="col-md-6 col-xs-12" style="padding-right:0px;">
                        <div class="input-group">
                            <span class="input-group-addon"><span class="fa fa-search"></span></span>
                            <input type="text" class="form-control" ng-model="keywords" placeholder="Enter keyword"/>
                        </div>
                    </div>
                    <div class="col-md-2" style="padding-left:0px;">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">Search</button>
                    </div>
                </div>
                <!--table start-->
                <div class="col-md-12" style="padding-left:0px;">
                    <table id="customers2" class="table datatable">
                        <thead style="text-align: center;">
                        <tr style="text-align: center;">
                            <th width="20%" style="text-align: center;">Sr. No</th>
                            <th width="30%" style="text-align: center;">Segment name</th>
                            <th width="50%" style="text-align: center;">Actions</th>

                        </tr>
                        </thead>
                        <tbody style="text-align: center;">
                        <tr style="text-align: center;" ng-repeat="segment in Segments  |filter:keywords | filter:paginateSegment">
                            <td width="20%">{{$index+1}}</td>
                            <td width="30%">{{segment.name}}</td>
                            <td width="50%">

                                <?php
                                    if($hasWrite==1){
//                                        <button class="btn btn-info btn-sm" data-target="#modify" data-toggle="modal"
//                                        ng-click=""><span class="fa fa-pencil-square-o"></span>Modify
//                                </button>
                                        echo "
                                <button  class=\"btn btn-danger btn-sm\" ng-click=\"deleteSegment(segment.id,\$index)\"><span class=\"fa fa-times\"></span>Delete</button>";
                                    }
                                ?>

                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <uib-pagination total-items="Segments.length" ng-model="currentPage"
                                    boundary-links="true"
                                    items-per-page="ItemsPerPage" class="pagination-sm">

                    </uib-pagination>
                </div>
                <!--table end-->

            </div>
            <!-- END DATATABLE EXPORT -->

        </div>
    </div>
</div>