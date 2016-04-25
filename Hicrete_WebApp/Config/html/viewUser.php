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
$isSuper=appUtil::isSuperUser($userId);


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
            <h3 class="panel-title"><strong>User </strong>Details</h3>
        </div>
        <div class="panel-body form-horizontal">

            <div class="row">
                <div class="col-md-4">

                    <select class="form-control select" name="searchBy" ng-model="searchAttribute"/>

                    <option value="" disabled selected>Search by </option>
                    <option value="name">Name</option>
                    <option value="designation">Designation</option>
                    <option value="type">User Type</option>
                    <option value="city">City</option>

                    </select>

                </div>
                <div class="col-md-8">
                    <div class="input-group" >
                        <span class="input-group-addon"><span class="fa fa-search"></span></span>

                        <input type="text" class="form-control" placeholder="Keywords..." value="" ng-model="searchKeyword"/>

                        <div class="input-group-btn">
                            <button class="btn btn-primary" ng-click="getUserData(searchKeyword)">Search</button>
                        </div>
                    </div>
                </div>
            </div><br>
            <div class="table-responsive push-up-10">
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th>Sr.No</th>
                        <th>
                            <a ng-click="sortType = 'user.firstName'; sortReverse = !sortReverse">User Name
                                <span ng-show="sortType == 'user.firstName' && !sortReverse" class="fa fa-caret-down"></span>
                                <span ng-show="sortType == 'user.firstName' && sortReverse" class="fa fa-caret-up"></span>
                            </a>
                            </th>
                        <th>Contact Number</th>
                        <th>
                            <a ng-click="sortType = 'user.designation'; sortReverse = !sortReverse">Designation
                                <span ng-show="sortType == 'user.designation' && !sortReverse" class="fa fa-caret-down"></span>
                                <span ng-show="sortType == 'user.designation' && sortReverse" class="fa fa-caret-up"></span>
                            </a>
                            </th>
                        <th>
                            <a ng-click="sortType = 'user.role'; sortReverse = !sortReverse">Role
                                <span ng-show="sortType == 'user.role' && !sortReverse" class="fa fa-caret-down"></span>
                                <span ng-show="sortType == 'user.role' && sortReverse" class="fa fa-caret-up"></span>
                            </a>
                            </th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr ng-repeat="user in Users | filter :paginate | orderBy:sortType:sortReverse" >
                        <td>{{$index+1}}</td>
                        <td>{{user.firstName}} {{user.lastName}}</td>
                        <td>{{user.mobileNumber}}</td>
                        <td>{{user.designation}}</td>
                        <td>{{user.role}}</td>
                        <td>
                            <button class="btn btn-info"  data-toggle="modal" data-target="#viewDetails" ng-click="selectUser(user)">View Details</button>
                            <a ui-sref="Config.modifyUser({userToModify:user})"> <button class="btn btn-primary">Modify</button></a>
                            <?php
                            if($isSuper){
                                echo "<button class=\"btn btn-danger\" ng-click=\"deleteUser(user)\">Delete</button>";
                            }

                            ?>


                        </td>
                    </tr>



                    </tbody>
                </table>
            </div>

        </div>


    </div>
    <uib-pagination total-items="Users.length" ng-model="currentPage"
                    max-size="10" boundary-links="true"
                    items-per-page="UserPerPage" class="pagination-sm">
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

                            <label class="control-label">First Name:</label>

                        </div>
                        <div class="col-md-9">
                            {{selectedUser.firstName}}
                        </div>
                    </div><br>
                    <div class="col-md-12">
                        <div class="col-md-3">

                            <label class="control-label">Last Name  :</label>

                        </div>
                        <div class="col-md-9">
                            {{selectedUser.lastName}}
                        </div>
                    </div><br>
                    <div class="col-md-12">
                        <div class="col-md-3">

                            <label class="control-label">Mobile No  :</label>

                        </div>
                        <div class="col-md-9">
                            {{selectedUser.mobileNumber}}
                        </div>
                    </div><br>
                    <div class="col-md-12">
                        <div class="col-md-3">

                            <label class="control-label">Date of Birth  :</label>

                        </div>
                        <div class="col-md-9">
                            {{selectedUser.dateOfBirth}}
                        </div>

                    </div>
                    <div class="col-md-12">
                        <div class="col-md-3">

                            <label class="control-label">Designation :</label>

                        </div>
                        <div class="col-md-9">
                            {{selectedUser.designation}}
                        </div>

                    </div>
                    <div class="col-md-12">
                        <div class="col-md-3">

                            <label class="control-label">Role :</label>

                        </div>
                        <div class="col-md-9">
                            {{selectedUser.role}}
                        </div>

                    </div>
                    <div class="col-md-12">
                        <div class="col-md-3">

                            <label class="control-label">Email Id  :</label>

                        </div>
                        <div class="col-md-9">
                            {{selectedUser.emailId}}
                        </div>

                    </div>
                    <div class="col-md-12">
                        <div class="col-md-3">

                            <label class="control-label">City  :</label>

                        </div>
                        <div class="col-md-9">
                            {{selectedUser.city}}
                        </div>

                    </div>
                    <div class="col-md-12">
                        <div class="col-md-3">

                            <label class="control-label">State  :</label>

                        </div>
                        <div class="col-md-9">
                            {{selectedUser.state}}
                        </div>

                    </div>
                    <div class="col-md-12">
                        <div class="col-md-3">

                            <label class="control-label">Country  :</label>

                        </div>
                        <div class="col-md-9">
                            {{selectedUser.country}}
                        </div>

                    </div>
                    <div class="col-md-12">
                        <div class="col-md-3">

                            <label class="control-label">PinCode  :</label>

                        </div>
                        <div class="col-md-9">
                            {{selectedUser.pincode}}
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

