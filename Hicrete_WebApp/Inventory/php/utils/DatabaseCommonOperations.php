<?php

    class DatabaseCommonOperations
    {

        public static function getCompanyName($companyId){

            $_host = "localhost";
            $_username = "admin";
            $_password = "admin";
            $_database = "hicrete";
            $connection=null;
            $dbhHicret=null;

            try {
                $connection  = new PDO("mysql:host=$_host;dbname=$_database", $_username, $_password);
                // echo 'Connected to database';
                $conn=$connection;
            } catch (PDOException $e) {

                echo $e->getMessage();
            }

            $stmtCompany=$conn->prepare("SELECT * FROM companymaster WHERE companyId=:companyid");
            $stmtCompany->bindParam(':companyid', $companyId);

            if($stmtCompany->execute()){
                $resultCompany = $stmtCompany->fetch(PDO::FETCH_ASSOC);
               return $resultCompany['companyName'];
            }else{
                return "--";
            }
        }
        public static function getWarehouseName($warehouseId){

            $_host = "localhost";
            $_username = "admin";
            $_password = "admin";
            $_database = "hicrete";
            $connection=null;
            $dbhHicret=null;

            try {
                $connection  = new PDO("mysql:host=$_host;dbname=$_database", $_username, $_password);
                // echo 'Connected to database';
                $conn=$connection;
            } catch (PDOException $e) {

                echo $e->getMessage();
            }

            $stmtWarehouse=$conn->prepare("SELECT wareHouseName FROM warehousemaster WHERE warehouseId=:warehouseId");
            $stmtWarehouse->bindParam(':warehouseId', $warehouseId);
            if($stmtWarehouse->execute()){
                $resultCompany = $stmtWarehouse->fetch(PDO::FETCH_ASSOC);
                return $resultCompany['wareHouseName'];
            }else{
                return "--";
            }
        }
    }
?>