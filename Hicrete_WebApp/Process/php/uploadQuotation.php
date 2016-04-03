<?php
/**
 * Created by IntelliJ IDEA.
 * User: LENOVO
 * Date: 03/31/16
 * Time: 11:34 PM
 */
require_once '../../php/appUtil.php';
$target_dir = "../../upload/Quotations/";
$target_file = $target_dir . basename($_FILES["file"]["name"]);
$file = $_FILES['file'];
if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
    echo AppUtil::getReturnStatus("Successful","File Uploaded Successfully");
} else {
    echo AppUtil::getReturnStatus("Unsuccessful","Error Occurred while uploading Quoatation");
}
?>