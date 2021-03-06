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
<div class="col-lg-12 col-md-12">
<!-- START SEARCH -->
<div class="panel panel-default">
    <div class="panel-body">
        <div class="row stacked">
            <div class="col-lg-3 col-md-3">
                <div class="input-group" >
                    <select class="form-control" ng-model="SearchTerm" value="">
                        <option value="" disabled selected>Search by</option>
                        <option value="productName">Product Name</option>
                        <option value="materialType">Material Type</option>
<!--                        <option value="Warehouse">Warehouse</option>-->
                    </select>
                </div>
            </div>
            <div class="col-lg-9 col-md-9">
                <div class="input-group push-down-10" >
                    <span class="input-group-addon"><span class="fa fa-search"></span></span>
                    <input type="text" class="form-control" placeholder="Keywords..." value="" ng-model="keyword"/>
                    <div class="input-group-btn">
                        <button class="btn btn-primary" ng-click="getProductDetails()">Search</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- END SEARCH -->
<div class="search-results">
    <div class="sr-item">
        <div class="sr-item-title">Products Available</div>


        <div class="table-responsive push-up-10">
            <table class="table table-actions table-striped">
                <thead>
                <tr>
                    <th width="3%">Sr.No</th>
                    <th width="20%">
                        <a ng-click="sortType = 'product.productname'; sortReverse = !sortReverse">Product Name
                            <span ng-show="sortType == 'product.productname' && !sortReverse" class="fa fa-caret-down"></span>
                            <span ng-show="sortType == 'product.productname' && sortReverse" class="fa fa-caret-up"></span>
                        </a>
                       </th>
                    <th width="10%">
                        <a ng-click="sortType = 'product.unitofmeasure'; sortReverse = !sortReverse">Unit of Measure
                            <span ng-show="sortType == 'product.unitofmeasure' && !sortReverse" class="fa fa-caret-down"></span>
                            <span ng-show="sortType == 'product.unitofmeasure' && sortReverse" class="fa fa-caret-up"></span>
                        </a>
                        </th>
                    <th width="10%">
                        <a ng-click="sortType = 'product.color'; sortReverse = !sortReverse">Color
                            <span ng-show="sortType == 'product.color' && !sortReverse" class="fa fa-caret-down"></span>
                            <span ng-show="sortType == 'product.color' && sortReverse" class="fa fa-caret-up"></span>
                        </a>
                        </th>
                    <th width="25%">Description</th>
                    <th width="40%">Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr ng-repeat="product in products | filter :paginate  |orderBy:sortType:sortReverse">
                    <td width="5%">{{$index + 1}}</td>
                    <td width="20%">{{product.productname}}</td>
                    <td width="10%">{{product.unitofmeasure}}</td>
                    <td width="10%">{{product.color}}</td>
                    <td width="25%">{{product.description}}</td>
                    <td width="35%">
                        <button data-target="#viewDetails" data-toggle="modal" ng-click="getProduct(product)" data-toggle="modal"
                                class="btn btn-primary btn-sm"><span class="fa fa-eye"></span>View
                        </button>

                        <?php
                            if($hasWrite==1){
                                echo "<button class=\"btn btn-info btn-sm\" data-target=\"#modifyDetails\" data-toggle=\"modal\"
                                ng-click=\"getProduct(product)\"><span class=\"fa fa-pencil-square-o\"></span>Modify
                        </button>";
                            }
                        ?>


                        <!-- START OF MODIFY MODAL-->
                        <div class="modal fade inventoryDetails" id="modifyDetails" role="dialog">
                            <div class="modal-dialog">
                                <!-- Modal content-->
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                                        <h4 class="modal-title">Product Details</h4>
                                    </div>
                                    <form class="form-horizontal" name="modifyItemSearchForm" novalidate>

                                        <div class="modal-body">
                                            <div class="row">
                                                <div class="col-md-6 padRight">
                                                    <div class="form-group">
                                                        <label class="col-md-4 control-label text-left">Product Name
                                                            :</label>

                                                        <div class="col-md-8">
                                                            <div class="input-group">
                                                                <span class="input-group-addon"><span
                                                                        class="fa fa-pencil"></span></span>
                                                                <input type="text" class="form-control"
                                                                       ng-model="selectedProduct.productname"
                                                                       name="productName" ng-change="setMasterTable()"
                                                                       value="{{selectedProduct.productname}}"
                                                                       required/>
                                                            </div>
                                                            <div class="help-block"
                                                                 ng-messages="modifyItemSearchForm.productName.$error"
                                                                 ng-show="submittedModal">
                                                                <p style="color:red" ng-message="required">Please enter
                                                                    product name.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-md-4 control-label text-left">Unit Of Measure
                                                            :</label>

                                                        <div class="col-md-8">
                                                            <div class="input-group">
                                                                <span class="input-group-addon"><span
                                                                        class="fa fa-pencil"></span></span>
                                                                <input type="text" class="form-control"
                                                                       ng-model="selectedProduct.unitofmeasure"
                                                                       name="unitOfMeasure" ng-change="setMasterTable()"
                                                                       value="{{selectedProduct.unitofmeasure}}"
                                                                       required/>
                                                            </div>
                                                            <div class="help-block"
                                                                 ng-messages="modifyItemSearchForm.unitOfMeasure.$error"
                                                                 ng-show="submittedModal">
                                                                <p style="color:red" ng-message="required">Please enter
                                                                    unit of measure.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-md-4 control-label text-left">Color :</label>

                                                        <div class="col-md-8">
                                                            <div class="input-group">
                                                                <span class="input-group-addon"><span
                                                                        class="fa fa-pencil"></span></span>
                                                                <input type="text" class="form-control"
                                                                       ng-model="selectedProduct.color" name="color"
                                                                       ng-change="setProductDetailsTable()"
                                                                       value="{{selectedProduct.color}}" required/>
                                                            </div>
                                                            <div class="help-block"
                                                                 ng-messages="modifyItemSearchForm.color.$error"
                                                                 ng-show="submittedModal">
                                                                <p style="color:red" ng-message="required">Please enter
                                                                    color.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-md-4 control-label text-left">Description
                                                            :</label>

                                                        <div class="col-md-8">
                                                            <div class="input-group">
                                                                <span class="input-group-addon"><span
                                                                        class="fa fa-pencil"></span></span>
                                                                <input type="text" class="form-control"
                                                                       ng-model="selectedProduct.description"
                                                                       name="description"
                                                                       ng-change="setProductDetailsTable()"
                                                                       value="{{selectedProduct.description}}"
                                                                       required/>
                                                            </div>
                                                            <div class="help-block"
                                                                 ng-messages="modifyItemSearchForm.description.$error"
                                                                 ng-show="submittedModal">
                                                                <p style="color:red" ng-message="required">Please enter
                                                                    description.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label class="col-md-4 control-label text-left">Alert Qty
                                                            :</label>

                                                        <div class="col-md-8">
                                                            <div class="input-group">
                                                                <span class="input-group-addon"><span
                                                                        class="fa fa-pencil"></span></span>
                                                                <input type="text" class="form-control"
                                                                       ng-change="setProductDetailsTable()"
                                                                       ng-model="selectedProduct.alertquantity"
                                                                       name="alertQuantity" value="" required/>
                                                            </div>
                                                            <div class="help-block"
                                                                 ng-messages="modifyItemSearchForm.alertQuantity.$error"
                                                                 ng-show="submittedModal">
                                                                <p style="color:red" ng-message="required">Please enter
                                                                    alert quantity.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-md-4 control-label text-left">Material Type
                                                            :</label>

                                                        <div class="col-md-8">
                                                            <input type="text" class="form-control" name="materialType" ng-model="selectedProduct.materialtype"  uib-typeahead="material as material.materialtype for material in materialNames | filter:$viewValue | limitTo:8" typeahead-on-select="setMasterTable($item,$model,$label)" typeahead-editable="false" typeahead-no-results="noMaterial" required  placeholder="Material name"/>
                                                            <!--<select class="form-control" ng-change="setMasterTable()"
                                                                    ng-model="selectedProduct.materialtypeid"
                                                                    name="materialType" required>
                                                                <option ng-repeat="x in materialNames "
                                                                        value={{x.materialtypeid}}>{{x.materialtype}}
                                                                </option>
                                                            </select>
                                                            -->
                                                            <div class="help-block"
                                                                 ng-messages="modifyItemSearchForm.materialType.$error"
                                                                 ng-show="submittedModal">
                                                                <p style="color:red" ng-message="required">Please select
                                                                    material type.</p>
                                                                <p style="color:red" ng-if="noMaterial">Material does not exist.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-md-4 control-label text-left">Packaging
                                                            :</label>

                                                        <div class="col-md-8">
                                                            <div class="input-group">
                                                                <span class="input-group-addon"><span
                                                                        class="fa fa-pencil"></span></span>
                                                                <input type="text" class="form-control"
                                                                       ng-change="setProductPackagingTable()"
                                                                       ng-model="selectedProduct.packaging"
                                                                       name="packaging" value="" required/>
                                                            </div>
                                                            <div class="help-block"
                                                                 ng-messages="modifyItemSearchForm.packaging.$error"
                                                                 ng-show="submittedModal">
                                                                <p style="color:red" ng-message="required">Please enter
                                                                    packaging.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="col-md-4 control-label text-left">Abbrevation
                                                            :</label>

                                                        <div class="col-md-8">
                                                            <div class="input-group">
                                                                <span class="input-group-addon"><span
                                                                        class="fa fa-pencil"></span></span>
                                                                <input type="text" class="form-control"
                                                                       ng-change="setProductMaterialTable()"
                                                                       ng-model="selectedProduct.abbrevation"
                                                                       name="abbrevation" value=""/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-default"
                                                    data-ng-click="(submitted=false)" data-dismiss="modal">Close
                                            </button>
                                            <button type="button"
                                                    data-ng-click="(submittedModal=true) && modifyItemSearchForm.$valid && updateProductInfo(selectedProduct)"
                                                    class="btn btn-default">Modify
                                            </button>
                                        </div>
                                    </form>
                                    <!--End of modal-footer-->
                                </div>
                                <!--End of Modal Content-->
                            </div>
                            <!--End of modal dialog-->
                        </div>

                        <!-- END OF MODIFY MODAL-->

                        <?php
                        if($hasWrite==1){
//                            echo "<button class=\"btn btn-danger btn-sm\"><span class=\"fa fa-times\"></span>Delete</button>";
                        }
                        ?>

                    </td>
                </tr>


                </tbody>
            </table>
        </div>
    </div>

    <uib-pagination total-items="products.length
    " ng-model="currentPage"
                    max-size="10" boundary-links="true"
                    items-per-page="InventoryItemsPerPage" class="pagination-sm">
    </uib-pagination>

</div>
</div>

<div class="modal fade" id="viewDetails" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Product Details</h4>
            </div>
            <div class="modal-body">
                <table class="table">

                    <tr>
                        <th>Product Name :</th>
                        <td>{{selectedProduct.productname}}</td>

                    </tr>
                    <tr>
                        <th>Unit Of Measure :</th>
                        <td>{{selectedProduct.unitofmeasure}}</td>
                    </tr>
                    <tr>
                        <th>Color :</th>
                        <td>{{selectedProduct.color}}</td>
                    </tr>
                    <tr>
                        <th>Alert Qty :</th>
                        <td>{{selectedProduct.alertquantity}}</td>

                    </tr>
                    <tr>
                        <th>Description :</th>
                        <td>{{selectedProduct.description}}</td>

                    </tr>
                    <tr>
                        <th>Material Type :</th>
                        <td>{{selectedProduct.materialtype}}</td>

                    </tr>
                    <tr>
                        <th>Packaging :</th>
                        <td>{{selectedProduct.packaging}}</td>

                    </tr>
                    <tr>
                        <th>Abbrevations :</th>
                        <td>{{selectedProduct.abbrevation}}</td>

                    </tr>
                </table>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close
                </button>
            </div>
            <!--End of modal-footer-->
        </div>
        <!--End of Modal Content-->
    </div>
    <!--End of modal dialog-->
</div>