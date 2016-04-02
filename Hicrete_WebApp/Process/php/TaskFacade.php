<?php
    /**
     * Created by IntelliJ IDEA.
     * User: Ajit
     * Date: 29-03-2016
     *
     */
    require_once '../../php/api/TaskController.php';
    $data = json_decode($_GET['data']);

    if (!isset($_SESSION['token'])) {
        session_start();
    }
    $userId = $_SESSION['token'];

    $opt = array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    );
    //echo json_encode($data);


    switch ($data->operation) {
        case 'saveTask':
            TaskController::saveTask(null, $data->data);
            break;
        case 'getTasks':
            TaskController::getAllTask($data->sortBy,$data->keyword);
            break;
        case 'getNotes':
            TaskController::getNotes($data->taskId);
            break;
        case 'updateTask':
            TaskController::editTask($data->taskId,$data->data);
            break;
        case 'getAllTaskForUser':
            TaskController::getAllTaskForUser($data->includeCompleted);
            break;
        case 'deleteTask':
            TaskController::deleteTask($data->taskId);
            break;


    }


?>