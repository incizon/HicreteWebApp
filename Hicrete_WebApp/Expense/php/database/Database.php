<?php
class Database
{
    private $_connection;
    private static $_instance; //The single instance
    private $_host = "localhost";
    private $_username = "super";
    private $_password = "super";
    private $_database = "expense";

    /*
    Get an instance of the Database
    @return Instance
    */
    public static function getInstance()
    {
        /*
         If there is no instance then create instance
         self is used to refer current class
        */
        if (!self::$_instance) { 
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /*
    Constructor create cnonnection
    */ 
    private function __construct()
    {
        try {
            $this->_connection  = new PDO("mysql:host=$this->_host;dbname=$this->_database", $this->_username, $this->_password);
           
           // echo 'Connected to database';
        } catch (PDOException $e) {
           
            echo $e->getMessage();
        }
    }
    // Clone is empty to prevent duplication of connection
    private function __clone()
    {
    }
    // Get mysql pdo connection
    public function getConnection()
    {
        return $this->_connection;
    }
}

?>