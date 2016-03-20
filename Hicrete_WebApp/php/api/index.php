<?php

require __DIR__ . '/RestServer.php';
require 'ProjectController.php';
require 'CustomerController.php';
require 'QuotationController.php';
require 'InvoiceController.php';
require 'PaymentController.php';
require 'TaskController.php';
require 'UserController.php';
require 'WorkorderController.php';
require 'DocumentController.php';
require 'FollowupController.php';
require 'CompanyController.php';

$server = new \Jacwright\RestServer\RestServer('debug');
$server->addClass('DocumentController');
$server->addClass('ProjectController');
$server->addClass('CustomerController');
$server->addClass('QuotationController');
$server->addClass('InvoiceController');
$server->addClass('PaymentController');
$server->addClass('TaskController');
$server->addClass('UserController');
$server->addClass('WorkorderController');
$server->addClass('FollowupController');
$server->addClass('CompanyController');
$server->handle();
