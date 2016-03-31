<?php

//error_reporting(E_ERROR | E_PARSE);
require_once '../../../php/appUtil.php';
if (!isset($_SESSION['token'])) {
    session_start();
}else{
    header("Location: ../../index.html");
    exit();
}
$userId=$_SESSION['token'];
$hasWrite=appUtil::doesUserHasAccess("Inventory",$userId,"Write");

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


    <!-- END TEMPLATE -->
   
    <!-- END SCRIPTS -->

<div class="row">
    <div class="col-md-12">

        <!-- START SEARCH -->
        <div class="panel panel-default">
            <div class="panel-body">
                <div class="row stacked">
                    <div class="col-md-6">
                        <div class="input-group push-down-10" >
                            <span class="input-group-addon"><span class="fa fa-search"></span></span>
                            <input type="text" class="form-control" placeholder="Keywords..." value="" ng-model="Keywords"/>
                            <div class="input-group-btn">
                                <button class="btn btn-primary" ng-click="searchData(Keywords)">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END SEARCH -->

        <!-- START SEARCH RESULT -->
        <div class="search-results">



            <div class="sr-item">
                <div class="sr-item-title">Suppliers Available</div>


                <div class="table-responsive push-up-10">
                    <table class="table table-actions table-striped">
                        <thead>
                        <tr>
                            <th width="15%">Sr. No</th>
                            <th width="25%">SupplierName</th>
                            <th width="25%">Contact No</th>
                            <th width="35%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr ng-repeat="supplier in suppliers |filter : paginate">
                            <td>{{$index + 1}}</td>
                            <td>{{supplier.suppliername}}</td>
                            <td>{{supplier.contactno}}</td>
                            <td><button data-target="#viewSupplierDetails" ng-click="getSupplier(supplier)" data-toggle="modal" class="btn btn-primary btn-sm"><span class="fa fa-eye"></span> View</button>

                                <button ng-click="getSupplier(supplier)" data-target="#modifySupplierDetails" data-toggle="modal"
                                        class="btn btn-info btn-sm"><span class="fa fa-floppy"></span> Modify</button>

<!--                                <button class="btn btn-danger btn-sm"><span class="fa fa-times"></span> Delete</button></td>-->
                        </tr>


                        </tbody>
                    </table>
                </div>
                <!--  <ul class="list-tags">
                     <li><a href="#"><span class="fa fa-tag"></span> Files</a></li>
                     <li><a href="#"><span class="fa fa-tag"></span> Attachments</a></li>
                 </ul> -->
            </div>


        </div>
        <!-- END SEARCH RESULT -->

        <uib-pagination total-items="totalItems" ng-model="currentPage"
                        max-size="5" boundary-links="true"
                        items-per-page="supplierPerPage" class="pagination-sm">
        </uib-pagination>

    </div>
</div>

<div class="modal fade" id="viewSupplierDetails" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Product Details</h4>
            </div>
            <div class="modal-body">
                <div class="panel-body">

                    <div class="row"  style="margin-top: 1%;">
                        <div class="form-group">
                            <label class="col-md-4 col-xs-12 control-label">Name of Supplier</label>
                            <div class="col-md-8 col-xs-12">
                                <div class="input-group">
                                    {{selectedSupplier.suppliername}}

                                </div>
                                <!--<span style="color:RED" class="help-block" ng-show="supplierAdd.supplierName.$invalid
                               && supplierAdd.supplierName.$dirty && submitted">Please only characters in Supplier name</span>-->
                                <!-- <span style="color:RED" class="help-block" ng-show="supplierAdd.supplierName.$error.required && supplierAdd.supplierName.$dirty">Supplier Name is compulsary</span> -->
                            </div>
                        </div>
                    </div>

                    <div class="row"  style="margin-top: 1%;">
                        <div class="form-group">
                            <label class="col-md-4 col-xs-12 control-label">Contact No</label>
                            <div class="col-md-8 col-xs-12">
                                <div class="input-group">
                                    {{selectedSupplier.contactno}}

                                </div>
                                <!--  <span style="color:RED" ng-show="supplierAdd.contactNo.$invalid && supplierAdd.contactNo.$dirty " class="help-block">Please insert correct contact no</span> -->
                            </div>
                        </div>
                    </div>

                    <div class="row"  style="margin-top: 1%;">
                        <div class="form-group" >
                            <label class="col-md-4 col-xs-12 control-label">Point of contact</label>
                            <div class="col-md-8 col-xs-12">
                                <div class="input-group">
                                    {{selectedSupplier.pointofcontact}}
                                </div>
                                <!--  <span style="color:RED" ng-show="supplierAdd.contactNo.$invalid && supplierAdd.contactNo.$dirty " class="help-block">Please insert correct contact no</span> -->
                            </div>
                        </div>
                    </div>

                    <div class="row" style="margin-top: 1%;">
                        <div class="form-group">
                            <label class="col-md-4 col-xs-12 control-label">Office Number</label>
                            <div class="col-md-8 col-xs-12">
                                <div class="input-group">
                                    {{selectedSupplier.officeno}}

                                </div>
                                <!--  <span style="color:RED" ng-show="supplierAdd.contactNo.$invalid && supplierAdd.contactNo.$dirty " class="help-block">Please insert correct contact no</span> -->
                            </div>
                        </div>
                    </div>

                    <div class="row"  style="margin-top: 1%;">
                        <div class="form-group">
                            <label class="col-md-4 col-xs-12 control-label">VAT number</label>
                            <div class="col-md-8 col-xs-12">
                                <div class="input-group">
                                    {{selectedSupplier.vatno}}

                                </div>
                                <!--  <span style="color:RED" ng-show="supplierAdd.contactNo.$invalid && supplierAdd.contactNo.$dirty " class="help-block">Please insert correct contact no</span> -->
                            </div>
                        </div>
                    </div>

                    <div class="row"  style="margin-top: 1%;">
                        <div class="form-group">
                            <label class="col-md-4 col-xs-12 control-label">CST number</label>
                            <div class="col-md-8 col-xs-12">
                                <div class="input-group">
                                    {{selectedSupplier.cstno}}

                                </div>
                                <!--  <span style="color:RED" ng-show="supplierAdd.contactNo.$invalid && supplierAdd.contactNo.$dirty " class="help-block">Please insert correct contact no</span> -->
                            </div>
                        </div>
                    </div>

                    <div class="row"  style="margin-top: 1%;">
                        <div class="form-group">
                            <label class="col-md-4 col-xs-12 control-label">Address</label>
                            <div class="col-md-8 col-xs-12">
                                {{selectedSupplier.address}}

                            </div>
                        </div>
                    </div>

                    <div class="row"  style="margin-top: 1%;">
                        <div class="form-group">
                            <label class="col-md-4 col-xs-12 control-label">City</label>
                            <div class="col-md-8 col-xs-12">
                                <div class="input-group">
                                    {{selectedSupplier.city}}

                                </div>
                                <!-- <span class="help-block">This is sample of text field</span>-->
                            </div>
                        </div>
                    </div>

                    <div class="row"  style="margin-top: 1%;">
                        <div class="form-group">
                            <label class="col-md-4 col-xs-12 control-label">Country</label>
                            <div class="col-md-8 col-xs-12">
                                <div class="input-group">
                                    {{selectedSupplier.country}}

                                </div>
                                <!-- <span class="help-block">This is sample of text field</span>-->
                            </div>
                        </div>
                    </div>

                    <div class="row"  style="margin-top: 1%;">
                        <div class="form-group">
                            <label class="col-md-4 col-xs-12 control-label">PinCode</label>
                            <div class="col-md-8 col-xs-12">
                                <div class="input-group">

                                    {{selectedSupplier.pincode}}

                                </div>
                                <!-- <span class="help-block">This is sample of text field</span>-->
                            </div>
                        </div>
                    </div>
                    <!-- <span class="help-block" ng-repeat="msg in messages">{{msg}} </span> -->
                    <!--  <ul>
                             <li ng-repeat="msg in messages"> {{msg}} </li>
                     </ul>  -->
                </div>

                <!--<table id="supplierDetails">

                    <tr>
                        <th>Supplier Name :</th>
                        <td><input type="text" ng-model="selectedSupplier.suppliername"></td>
                    </tr>
                    <tr>
                        <th>Contact No :</th>
                        <td>
                            <input type="text" ng-model="selectedSupplier.contactno">
                        </td>
                    </tr>
                    <tr>
                        <th>Point Of Contact :</th>
                        <td><input type="text" ng-model="selectedSupplier.pointofcontact">
                        </td>
                    </tr>
                    <tr>
                        <th>Office Number :</th>
                        <td><input type="text" ng-model="selectedSupplier.officeno">

                        </td>
                    </tr>

                    <tr>
                        <th>Vat Number :</th>
                        <td><input type="text" ng-model="selectedSupplier.vatno">
                        </td>

                    </tr>
                    <tr>
                        <th>CST Number :</th>
                        <td><input type="text" ng-model="selectedSupplier.cstno">
                        </td>
                    </tr>
                    <tr>
                        <th>Address :</th>
                        <td><input type="text" ng-model="selectedSupplier.address">
                        </td>
                    </tr>
                    <tr>
                        <th>City :</th>
                        <td><input type="text" ng-model="selectedSupplier.city">
                        </td>

                    </tr>

                    <tr>
                        <th>Country :</th>
                        <td><input type="text" ng-model="selectedSupplier.country">
                        </td>
                    </tr>

                    <tr>
                        <th>Pincode :</th>
                        <td><input type="text" ng-model="selectedSupplier.pincode">
                        </td>
                    </tr>




                </table>
-->            </div>


            <!--<div class="modal-body">
                <table id="supplierDetails">

                    <tr>
                        <th>Supplier Name :</th>
                        <td>{{selectedSupplier.suppliername}}</td>

                    </tr>
                    <tr>
                        <th>Contact No :</th>
                        <td>{{selectedSupplier.contactno}}</td>
                    </tr>
                    <tr>
                        <th>Point Of Contact :</th>
                        <td>{{selectedSupplier.pointofcontact}}
                        </td>
                    </tr>
                    <tr>
                        <th>Office Number :</th>
                        <td>{{selectedSupplier.officeno}}
                        </td>

                    </tr>



                    <tr>                                                 <th>Vat Number :</th>
                        <td>{{selectedSupplier.vatno}}</td>

                    </tr>
                    <tr>                                                 <th>CST Number :</th>
                        <td>{{selectedSupplier.cstno}}</td>

                    </tr>
                    <tr>                                                 <th>Address :</th>
                        <td>{{selectedSupplier.address}}</td>

                    </tr>

                    <tr>                                                 <th>City :</th>
                        <td>{{selectedSupplier.city}}</td>

                    </tr>

                    <tr>                                                 <th>Country :</th>
                        <td>{{selectedSupplier.country}}</td>

                    </tr>

                    <tr>                                                 <th>Pincode :</th>
                        <td>{{selectedSupplier.pincode}}</td>

                    </tr>

                </table>
            </div>-->

            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
            <!--End of modal-footer-->
        </div>
        <!--End of Modal Content-->
    </div>
    <!--End of modal dialog-->
</div>


<div class="modal fade" id="modifySupplierDetails" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Supplier Details</h4>
            </div>
            <div class="modal-body">
                <div class="panel-body">

                    <div class="row"  style="margin-top: 1%;">
                        <div class="form-group">
                            <label class="col-md-4 col-xs-12 control-label">Name of Supplier</label>
                            <div class="col-md-8 col-xs-12">
                                <div class="input-group">
                                    <span class="input-group-addon"><span class="fa fa-pencil"></span></span>
                                    <input type="text" required pattern="[a-zA-Z]+" ng-model="selectedSupplier.suppliername" class="form-control"/>
                                </div>
                                <!--<span style="color:RED" class="help-block" ng-show="supplierAdd.supplierName.$invalid
                               && supplierAdd.supplierName.$dirty && submitted">Please only characters in Supplier name</span>-->
                                <!-- <span style="color:RED" class="help-block" ng-show="supplierAdd.supplierName.$error.required && supplierAdd.supplierName.$dirty">Supplier Name is compulsary</span> -->
                            </div>
                        </div>
                    </div>

                    <div class="row"  style="margin-top: 1%;">
                            <div class="form-group">
                                <label class="col-md-4 col-xs-12 control-label">Contact No</label>
                                <div class="col-md-8 col-xs-12">
                                    <div class="input-group">
                                        <span class="input-group-addon"><span class="fa fa-phone"></span></span>
                                        <input type="text" required ng-model="selectedSupplier.contactno" class="form-control"/>
                                    </div>
                                    <!--  <span style="color:RED" ng-show="supplierAdd.contactNo.$invalid && supplierAdd.contactNo.$dirty " class="help-block">Please insert correct contact no</span> -->
                                </div>
                            </div>
                    </div>

                    <div class="row"  style="margin-top: 1%;">
                        <div class="form-group" >
                            <label class="col-md-4 col-xs-12 control-label">Point of contact</label>
                            <div class="col-md-8 col-xs-12">
                                <div class="input-group">
                                    <span class="input-group-addon"><span class="fa fa-pencil"></span></span>
                                    <input type="text" required ng-model="selectedSupplier.pointofcontact" class="form-control"/>
                                </div>
                                <!--  <span style="color:RED" ng-show="supplierAdd.contactNo.$invalid && supplierAdd.contactNo.$dirty " class="help-block">Please insert correct contact no</span> -->
                            </div>
                        </div>
                    </div>

                    <div class="row" style="margin-top: 1%;">
                            <div class="form-group">
                                <label class="col-md-4 col-xs-12 control-label">Office Number</label>
                                <div class="col-md-8 col-xs-12">
                                    <div class="input-group">
                                        <span class="input-group-addon"><span class="fa fa-phone"></span></span>
                                        <input type="text" required ng-model="selectedSupplier.officeno" class="form-control"/>
                                    </div>
                                    <!--  <span style="color:RED" ng-show="supplierAdd.contactNo.$invalid && supplierAdd.contactNo.$dirty " class="help-block">Please insert correct contact no</span> -->
                                </div>
                            </div>
                    </div>

                    <div class="row"  style="margin-top: 1%;">
                            <div class="form-group">
                                <label class="col-md-4 col-xs-12 control-label">VAT number</label>
                                <div class="col-md-8 col-xs-12">
                                    <div class="input-group">
                                        <span class="input-group-addon"><span class="fa fa-pencil"></span></span>
                                        <input type="text" required ng-model="selectedSupplier.vatno" class="form-control"/>
                                    </div>
                                    <!--  <span style="color:RED" ng-show="supplierAdd.contactNo.$invalid && supplierAdd.contactNo.$dirty " class="help-block">Please insert correct contact no</span> -->
                                </div>
                            </div>
                    </div>

                    <div class="row"  style="margin-top: 1%;">
                        <div class="form-group">
                            <label class="col-md-4 col-xs-12 control-label">CST number</label>
                            <div class="col-md-8 col-xs-12">
                                <div class="input-group">
                                    <span class="input-group-addon"><span class="fa fa-pencil"></span></span>
                                    <input type="text" required ng-model="selectedSupplier.cstno" class="form-control"/>
                                </div>
                                <!--  <span style="color:RED" ng-show="supplierAdd.contactNo.$invalid && supplierAdd.contactNo.$dirty " class="help-block">Please insert correct contact no</span> -->
                            </div>
                        </div>
                    </div>

                    <div class="row"  style="margin-top: 1%;">
                        <div class="form-group">
                            <label class="col-md-4 col-xs-12 control-label">Address</label>
                            <div class="col-md-8 col-xs-12">
                                <textarea class="form-control"  ng-model="selectedSupplier.address" rows="5"></textarea>
                                <!--<span class="help-block">Default textarea field</span>-->
                            </div>
                        </div>
                    </div>

                    <div class="row"  style="margin-top: 1%;">
                        <div class="form-group">
                            <label class="col-md-4 col-xs-12 control-label">City</label>
                            <div class="col-md-8 col-xs-12">
                                <div class="input-group">
                                    <span class="input-group-addon"><span class="fa fa-pencil"></span></span>
                                    <input type="text" ng-model="selectedSupplier.city"class="form-control"/>
                                </div>
                                <!-- <span class="help-block">This is sample of text field</span>-->
                            </div>
                        </div>
                    </div>

                    <div class="row"  style="margin-top: 1%;">
                        <div class="form-group">
                            <label class="col-md-4 col-xs-12 control-label">Country</label>
                            <div class="col-md-8 col-xs-12">
                                <div class="input-group">
                                    <span class="input-group-addon"><span class="fa fa-pencil"></span></span>
                                    <input type="text" ng-model="selectedSupplier.country" class="form-control"/>
                                </div>
                                <!-- <span class="help-block">This is sample of text field</span>-->
                            </div>
                        </div>
                    </div>

                    <div class="row"  style="margin-top: 1%;">
                            <div class="form-group">
                                <label class="col-md-4 col-xs-12 control-label">PinCode</label>
                                <div class="col-md-8 col-xs-12">
                                    <div class="input-group">
                                        <span class="input-group-addon"><span class="fa fa-pencil"></span></span>
                                        <input type="text" ng-model="selectedSupplier.pincode" class="form-control"/>
                                    </div>
                                    <!-- <span class="help-block">This is sample of text field</span>-->
                                </div>
                            </div>
                    </div>
                    <!-- <span class="help-block" ng-repeat="msg in messages">{{msg}} </span> -->
                    <!--  <ul>
                             <li ng-repeat="msg in messages"> {{msg}} </li>
                     </ul>  -->
                </div>

                <!--<table id="supplierDetails">

                    <tr>
                        <th>Supplier Name :</th>
                        <td><input type="text" ng-model="selectedSupplier.suppliername"></td>
                    </tr>
                    <tr>
                        <th>Contact No :</th>
                        <td>
                            <input type="text" ng-model="selectedSupplier.contactno">
                        </td>
                    </tr>
                    <tr>
                        <th>Point Of Contact :</th>
                        <td><input type="text" ng-model="selectedSupplier.pointofcontact">
                        </td>
                    </tr>
                    <tr>
                        <th>Office Number :</th>
                        <td><input type="text" ng-model="selectedSupplier.officeno">

                        </td>
                    </tr>

                    <tr>
                        <th>Vat Number :</th>
                        <td><input type="text" ng-model="selectedSupplier.vatno">
                        </td>

                    </tr>
                    <tr>
                        <th>CST Number :</th>
                        <td><input type="text" ng-model="selectedSupplier.cstno">
                        </td>
                    </tr>
                    <tr>
                        <th>Address :</th>
                        <td><input type="text" ng-model="selectedSupplier.address">
                        </td>
                    </tr>
                    <tr>
                        <th>City :</th>
                        <td><input type="text" ng-model="selectedSupplier.city">
                        </td>

                    </tr>

                    <tr>
                        <th>Country :</th>
                        <td><input type="text" ng-model="selectedSupplier.country">
                        </td>
                    </tr>

                    <tr>
                        <th>Pincode :</th>
                        <td><input type="text" ng-model="selectedSupplier.pincode">
                        </td>
                    </tr>




                </table>
-->            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-default" ng-click="modifySupplier()" data-dismiss="modal">Modify</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            </div>
            <!--End of modal-footer-->
        </div>
        <!--End of Modal Content-->
    </div>
    <!--End of modal dialog-->
</div>