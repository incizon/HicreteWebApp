<!-- START WIDGETS -->
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
$hasRead=appUtil::doesUserHasAccess("Inventory",$userId,"Read");
$hasWrite=appUtil::doesUserHasAccess("Inventory",$userId,"Write");

if(!$hasRead && !$hasWrite){
    header("Location: ../../Dashboard.php");
    exit();
}
?>

<div class="row" >

<style>
    .panel.panel-default{
        margin-top: 40px;
    }
    #primary_nav_wrap
    {
        margin-top:15px;
        position:fixed;
        width: 100%;
        z-index:2;
    }
    #primary_nav_wrap ul {
        -moz-border-bottom-colors: none;
        -moz-border-left-colors: none;
        -moz-border-right-colors: none;
        -moz-border-top-colors: none;
        background-color: #fff;
        border-color: #ccc;
        border-image: none;
        border-style: solid none;
        border-width: 1px medium;
        float: left;
        list-style: outside none none;
        margin: 0 0 -14px;
        padding: 0;
        position: relative;
        top: -25px;
        width: 100%;
    }
    #primary_nav_wrap ul a
    {
        display:block;
        color:#333;
        text-decoration:none;
        font-size:12px;
        line-height:32px;
        padding:0 15px;
    }
    #primary_nav_wrap ul li
    {
        position:relative;
        float:left;
        margin:0;
        padding:0;
    }
    #primary_nav_wrap ul li.current-menu-item
    {
        background:#ddd;
    }
    #primary_nav_wrap ul li:hover
    {
        background:#f6f6f6;
        cursor: pointer;
    }
    #primary_nav_wrap ul ul
    {
        display:none;
        position:absolute;
        top:100%;
        left:0;
        background:#fff;
        padding:0;
        width: 200px;
        z-index: 9999;
    }
    #primary_nav_wrap ul ul li
    {
        float:none;
        width:200px;
    }
    #primary_nav_wrap ul ul a
    {
        line-height:120%;
        padding:10px 15px;
    }
    #primary_nav_wrap ul ul ul
    {
        top:0;
        left:100%;
    }
    #primary_nav_wrap ul li:hover > ul
    {
        display:block;
    }
</style>

<div>
    <nav id="primary_nav_wrap">
        <ul>
            <?php
            if($hasWrite==1){
                echo "<li><a>Add</a>
                <ul>
                    <li><a ui-sref=\"Inventory.addProduct\">Product</a></li>
                    <li><a ui-sref=\"Inventory.addMaterialType\">Material Type</a></li>
                    <li><a ui-sref=\"Inventory.addSupplier\">Supplier</a></li>
                </ul>
            </li>
            <li><a>Create</a>
                <ul>
                    <li><a ui-sref=\"Inventory.inwardItem\">Inward</a></li>
                    <li><a ui-sref=\"Inventory.outwardItem\">Outward</a></li>
                    <li><a ui-sref=\"Inventory.prodInit\">Production Batch</a></li>
                    </li>
                </ul>
            </li>";
            }
            if($hasRead==1){
                echo "<li><a>Search</a>
                <ul>
                    <li><a ui-sref=\"Inventory.searchProduct\">Product</a></li>
                    <li><a ui-sref=\"Inventory.searchSupplier\">Supplier</a></li>
                    <li><a ui-sref=\"Inventory.searchInward\">Inward</a></li>
                    <li><a ui-sref=\"Inventory.searchOutward\">Outward</a></li>
                    <li><a ui-sref=\"Inventory.prodSearch\">Production Batch</a></li>
                    <li><a ui-sref=\"Inventory.prodInq\">Completed Production Batch</a></li>
                </ul>
            </li>
            <li><a ui-sref=\"Inventory.searchInventory\">Show Inventory</a></li>

            ";
            }

            ?>
<!--            <li><a ui-sref="Inventory.report">Report</a></li>-->

        </ul>
    </nav>
</div>
</div>


<div ui-view></div>
<!-- END WIDGETS -->