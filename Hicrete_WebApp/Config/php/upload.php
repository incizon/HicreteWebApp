<?php
/**
 * Created by IntelliJ IDEA.
 * User: LENOVO
 * Date: 03/31/16
 * Time: 11:34 PM
 */

    $target_dir = "../../upload/ProfilePictures/";
    $target_file = $target_dir . basename($_FILES["file"]["name"]);
    $file = $_FILES['file'];
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
        echo "The file " . basename($_FILES["file"]["name"]) . " has been uploaded.";
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
?>