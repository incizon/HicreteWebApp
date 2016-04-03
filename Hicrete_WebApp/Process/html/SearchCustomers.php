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

    <div class="panel panel-default">

        <div class="panel-heading">
            <h3 class="panel-title"><strong>Customers</strong>Details</h3>
        </div>
        <div class="panel-body form-horizontal">

            <div class="row">
                <div class="col-md-4">

                    <select class="form-control select" name="searchBy" ng-model="searchBy"/>
                    <option value="" disabled selected>Search by </option>>
                    <option value="name">Name</option>
                    <option value="city">City</option>
                    <option value="state">State</option>
                    </select>

                </div>
                <div class="col-md-8">
                    <div class="input-group" >
                        <span class="input-group-addon"><span class="fa fa-search"></span></span>

                        <input type="text" class="form-control" placeholder="Keywords..." value="" ng-model="searchKeyword"/>

                        <div class="input-group-btn">
                            <button class="btn btn-primary" ng-click="searchCustomer()">Search</button>
                        </div>
                    </div>
                </div>
            </div><br>
            <div class="table-responsive push-up-10">
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th>Sr.No</th>
                        <th>Customer Name</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Country</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr ng-repeat="customer in customerSearch | filter :paginate | orderBy:name">
                        <td width="5%">{{$index + 1}}</td>
                        <td width="20%">{{customer.name}}</td>
                        <td width="10%">{{customer.city}}</td>
                        <td width="15%">{{customer.state}}</td>
                        <td width="15%">{{customer.country}}</td>
                        <td>
                            <button class="btn btn-info"  data-toggle="modal" data-target="#viewDetails" data-ng-click="showCustomerDetails(customer)">View Other Details</button>
                            <?php
                                if($hasWrite==1){
                                    echo "<a ui-sref=\"Process.modifyCustomer({customerToModify:customer})\"> <button class=\"btn btn-info\"><span class=\"fa fa-pencil-square-o\"></span>Modify</button></a>
                            <button class=\"btn btn-danger\">Delete</button>";
                                }
                            ?>


                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

        </div>


    </div>
    <uib-pagination total-items="customerSearch.length" ng-model="currentPage"
                    max-size="5" boundary-links="true"
                    items-per-page="customerPerPage" class="pagination-sm">
    </uib-pagination>


</div>

<div class="modal fade" id="viewDetails" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Contact Details</h4>
            </div>
            <div class="modal-body">
                <div class="row">

                    <div class="col-md-12">

                        <div class="col-md-3">

                            <label class="control-label">Contact No  :</label>

                        </div>
                        <div class="col-md-9">
                            {{currentCustomer.contactNo}}
                        </div>
                    </div><br>
                    <div class="col-md-12">
                        <div class="col-md-3">

                            <label class="control-label">Mobile No  :</label>

                        </div>
                        <div class="col-md-9">
                            {{currentCustomer.mobileNo}}
                        </div>
                    </div><br>
                    <div class="col-md-12">
                        <div class="col-md-3">

                            <label class="control-label">Fax No  :</label>

                        </div>
                        <div class="col-md-9">
                            {{currentCustomer.faxNo}}
                        </div>
                    </div><br>
                    <div class="col-md-12">
                        <div class="col-md-3">

                            <label class="control-label">Email Id  :</label>

                        </div>
                        <div class="col-md-9">
                            {{currentCustomer.emailId}}
                        </div>

                    </div>

                    <div class="col-md-12">
                        <div class="col-md-3">

                            <label class="control-label">PAN  :</label>

                        </div>
                        <div class="col-md-9">
                            {{currentCustomer.pan}}
                        </div>
                    </div><br>
                    <div class="col-md-12">
                        <div class="col-md-3">

                            <label class="control-label">CST No  :</label>

                        </div>
                        <div class="col-md-9">
                            {{currentCustomer.cstNo}}
                        </div>
                    </div><br>

                    <div class="col-md-12">
                        <div class="col-md-3">

                            <label class="control-label">VAT No  :</label>

                        </div>
                        <div class="col-md-9">
                            {{currentCustomer.vatNo}}
                        </div>

                    </div>

                    <div class="col-md-12">
                        <div class="col-md-3">

                            <label class="control-label">Service Tax No  :</label>

                        </div>
                        <div class="col-md-9">
                            {{currentCustomer.serviceTaxNo}}
                        </div>

                    </div>

                </div>

            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
            <!--End of modal-footer-->
        </div>
        <!--End of Modal Content-->
    </div>
    <!--End of modal dialog-->
</div>

