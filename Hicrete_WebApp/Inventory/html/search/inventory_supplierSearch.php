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
$hasWrite=appUtil::doesUserHasAccess("Inventory",$userId,"Write");

?>

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
                                                    <button class="btn btn-primary" ng-click="searchData(supplier)">Search</button>
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
                                                <tr ng-repeat="supplier in suppliers | filter:Keywords | orderBy:'suppliername'">
                                                    <td>{{$index + 1}}</td>
                                                    <td>{{supplier.suppliername}}</td>
                                                    <td>{{supplier.contactno}}</td>
                                                    <td><button class="btn btn-primary btn-sm"><span class="fa fa-eye"></span> Preview</button>
                                                        <?php
                                                            if($hasWrite==1)
                                                                echo "<button class=\"btn btn-info btn-sm\"><span class=\"fa fa-floppy\"></span> Modify</button> <button class=\"btn btn-danger btn-sm\"><span class=\"fa fa-times\"></span> Delete</button>";
                                                        ?>
                                                    </td>


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
                            
                            <ul class="pagination pagination-sm pull-right push-down-20">
                                <li class="disabled"><a href="#">«</a></li>
                                <li class="active"><a href="#">1</a></li>
                                <li><a href="#">2</a></li>
                                <li><a href="#">3</a></li>
                                <li><a href="#">4</a></li>                                    
                                <li><a href="#">»</a></li>
                            </ul>                            
                            
                        </div>                        
                    </div>