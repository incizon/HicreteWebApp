<?php
require_once 'KLogger.php';
/**
 * Created by IntelliJ IDEA.
 * User: Atul
 * Date: 15-03-2016
 * Time: 00:49
 */
class HicreteLogger
{
    private static $klogger=null;

    const DEBUG 	= 1;	// Most Verbose
    const INFO 		= 2;	// ...
    const WARN 		= 3;	// ...
    const ERROR 	= 4;	// ...
    const FATAL 	= 5;	// Least Verbose
    const OFF 		= 6;	// Nothing at all.


    private static function init(){
        self::$klogger = new KLogger ( "../../logs/log.txt" , KLogger::DEBUG );
    }

    private static function getLogger(){
        if(self::$klogger ==null){
            self::init();
        }
        return self::$klogger;
    }

    public static function LogInfo($line)
    {
        self::getLogger()->LogInfo($line);
    }

    public static function LogDebug($line)
    {
        self::getLogger()->LogDebug($line);
    }
    public static function LogWarn($line)
    {
        self::getLogger()->LogWarn($line);
    }
    public static function LogError($line)
    {
        self::getLogger()->LogError($line);
    }

    public static function LogFatal($line)
    {
        self::getLogger()->LogFatal($line);
    }

    public static function  setPriority($priority){
        if($priority<=6 && $priority >=1){
            self::getLogger()->setPriority($priority);
        }else{
            throw  new Exception("Invalid priority value");
        }

    }

}