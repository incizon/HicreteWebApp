<div>
    <div ng-include="'utils/loader.html'"></div>
</div>
<div>
    <div ng-include="'utils/ErrorMessage.html'"></div>
</div>
<div>
    <div ng-include="'utils/WarningMessage.html'"></div>
</div>
<div class="row">
    <div class="col-md-12">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title"><strong>Available </strong>Packages</h3>
            </div>
            <div class="panel-body form-horizontal">

                <div class="table-responsive push-up-10">
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th width="5%">Sr.No</th>
                            <th width="15%">Package Name</th>
                            <th width="30%">Package Description</th>
                            <th width="15%">Package Total Amount</th>
                            <th width="35%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr ng-repeat="package in packages">
                            <td width="5%">{{$index + 1}}</td>
                            <td width="15%">{{package.package_name}}</td>
                            <td width="30%">{{package.package_description}}</td>
                            <td width="15%">{{package.package_total_amount}}</td>
                            <td width="35%">
                                <button class="btn btn-info"  data-toggle="modal" data-target="#viewPackageDetails" data-ng-click="showPackageDetails(package)">View Other Details</button>
                                <button class="btn btn-danger"  data-ng-click="deletePackage(package.payment_package_id)">Delete</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <uib-pagination total-items="totalPackages" ng-model="currentPackagePage"
                        max-size="10" boundary-links="true"
                        items-per-page="packagePerPage" class="pagination-sm">
        </uib-pagination>
    </div>

</div>

<div class="modal fade" id="viewPackageDetails" role="dialog">
    <div class="modal-dialog modal-lg ">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Package Details</h4>
            </div>
            <div class="modal-body packageModal">
                <div class="row">
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th width="5%">Sr.No</th>
                        <th width="10%">Element Name</th>
                        <th width="10%">Element Quantity</th>
                        <th width="10%">Element rate</th>
                        <th width="10%">Element Amount</th>

                    </tr>
                    </thead>
                    <tbody>
                    <tr ng-repeat="Element in selectedPackage.elementType">
                        <td width="5%">{{$index + 1}}</td>
                        <td width="10%">{{Element['element_name']}}</td>
                        <td width="10%">{{Element['element_quantity']}}</td>
                        <td width="10%">{{Element['element_rate']}}</td>
                        <td width="10%">{{Element['element_amount']}}</td>

                    </tr>
                    </tbody>
                </table>
                </div>
                <div class="row">
                    <div class="col-md-6">
                    <b>	Package Total Amount :{{selectedPackage.package_total_amount}}</b>
                    </div>
                    <div class="col-md-6">

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
