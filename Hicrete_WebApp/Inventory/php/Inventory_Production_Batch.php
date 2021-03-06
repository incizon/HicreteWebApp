<?php
require_once('ProdBatch.php');
require_once '../../php/Database.php';
require_once '../../php/appUtil.php';
//include('../../Logger/Logger.php');
//Logger::configure('../config.xml');

$db = Database::getInstance();
$dbh = $db->getConnection();
$prodBatchinfo = json_decode($_GET["prodBatchInfo"]);

if (!isset($_SESSION['token'])) {
	session_start();
}
$userId=$_SESSION['token'];

/*echo $userId;
echo $dbh;*/

//$dbh= new PDO("mysql:host=$hostname;dbname=$dbname" , $username ,$password);
$opt = array(
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
);
//error_reporting(E_ERROR | E_PARSE);

if($prodBatchinfo->option=="getQuantity")
{
	//echo "inside\n";
	echo json_encode($prodBatchinfo);
	$stmt2=$dbh->prepare("select totalquantity from inventory where materialid=:material" );
	$stmt2->bindParam(':material',$prodBatchinfo->MtrialFrQty);
	$stmt2->execute();
	$result2=$stmt2->fetchAll();

	$qty=$result2['totalquantity'];

	echo (json_encode($result2));


}
else {

	$prodBatchObj = new ProdBatch($prodBatchinfo);
//$log=Logger::getLogger("Inventory");

//$log->error(" [".$userId."] :"."Production Batch Php start");

	switch ($prodBatchinfo->option) {

		case "Add":
			if ($prodBatchObj->step == '2') {
				if (!$prodBatchObj->checkAvlblBatchNo($dbh)) {
					if ($prodBatchObj->addToProdBatchMaster($dbh, $userId)) {
						//$log->debug(" [".$userId."] :"."Production Batch Initiated successfully");
						$message = "Initial details of Production batch Added successfully";
						$arr = array('msg' => $message, 'error' => '');
						$jsn = json_encode($arr);
						echo($jsn);
					} else {
						//$log->error(" [".$userId."] :"."Problems in initiating Production Batch");
						$message = "Error while Initiating production batch";
						$arr = array('msg' => '', 'error' => $message);
						$jsn = json_encode($arr);
						echo($jsn);

					}

				} else {
					//$log->error(" [".$userId."] :"."Production Batch no already exists");
					$message = "Production Batch no already exists Please Insert new BatchNo";
					$arr = array('msg' => '', 'error' => $message);
					$jsn = json_encode($arr);
					echo($jsn);
				}
			} else if ($prodBatchObj->step == '3') {

				if (!$prodBatchObj->checkAvlblBatchNo($dbh)) {

					if($prodBatchObj->addToProdBatchMaster($dbh, $userId)) {
								if ($prodBatchObj->addToProducedGood($dbh, $userId)) {
									//echo ("Check1");

									//$log->info(" [".$userId."] :"."Production Batch Added successfully");
									$message = "Data inserted successfully";
									//echo json_encode($message);
									$arr = array('msg' => $message, 'error' => "");
									$jsn = json_encode($arr);
									echo($jsn);

								} else {
									//$log->error(" [".$userId."] :"."Error while inserting production batch");
									$message = "Error While adding Produced good Please check incomplete production batch for initialised production batch";
									//echo json_encode($message);
									$arr = array('msg' => '', 'error' => $message);
									$jsn = json_encode($arr);
									echo($jsn);
								}
					}
					else
					{
						$message = "Error while initialising production batch";
						$arr = array('msg' => '', 'error' => $message);
						$jsn = json_encode($arr);
						echo($jsn);

					}

				} else {
					//$log->error(" [".$userId."] :"."Error while inserting production batch");
					$message = "Production Batch no already exists Please Insert new BatchNo";
					$arr = array('msg' => '', 'error' => $message);
					$jsn = json_encode($arr);
					echo($jsn);
				}


			}
			break;

		case "ModifyPart":
			$prodBatchObj->prodMasterId = $prodBatchinfo->productionbatchmasterid;
			// $prodBatchObj->inhouseInwardId=$prodBatchinfo->inhouseinwardid;

			if ($prodBatchObj->modifyPartDetails($dbh, $userId)) {
				//$log->info(" [".$userId."] :"."Production Batch Modified successfully");

				$message = "Production Batch Modified successfully";
				$arr = array('msg' => $message, 'error' => '');
				$jsn = json_encode($arr);
				echo($jsn);

			} else {

				$message = "Error while Modifying production batch";
				$arr = array('msg' => '', 'error' => $message);
				$jsn = json_encode($arr);
				echo($jsn);
			}
			break;

			break;
		case "Modify":
			//echo "m here";
			$prodBatchObj->prodMasterId = $prodBatchinfo->productionbatchmasterid;
			$prodBatchObj->inhouseInwardId = $prodBatchinfo->inhouseinwardid;

			if ($prodBatchObj->modifyDetails($dbh, $userId)) {
				$message = "Production Batch Modified successfully";
				$arr = array('msg' => $message, 'error' => '');
				$jsn = json_encode($arr);
				echo($jsn);

			} else {

				$message = "Error while Modifying production batch";
				$arr = array('msg' => '', 'error' => $message);
				$jsn = json_encode($arr);
				echo($jsn);
			}
			break;

		case "complete":
			$prodBatchObj->prodMasterId = $prodBatchinfo->productionbatchmasterid;

			if ($prodBatchObj->addToProducedGood($dbh, $userId)) {
				$message = "Production Batch completed successfully";
				//echo json_encode($message);
				$arr = array('msg' => $message, 'error' => "");
				$jsn = json_encode($arr);
				echo($jsn);

				//$prodBatchObj->addToInhouseInward($dbh,$userId);
				//$prodBatchObj->addToInhouseTransport($dbh,$userId);
			} else {
				$message = "Error While Completing production Batch ";
				//echo json_encode($message);
				$arr = array('msg' => '', 'error' => $message);
				$jsn = json_encode($arr);
				echo($jsn);
			}


			break;
		case "InquiryAll":
			$keywords="%".$prodBatchinfo->Keywords."%";
			if(AppUtil::isSuperUser($userId)) {
				$stmt1 = $dbh->prepare("SELECT * FROM production_batch_master where batchno like :keywords and productionbatchmasterid IN (select productionbatchmasterid from produced_good)");
				$stmt1->bindParam(':keywords',$keywords , PDO::PARAM_STR,10);
			}
			else {
				$stmt1 = $dbh->prepare("SELECT * FROM production_batch_master where batchno like :keywords and productionbatchmasterid IN (select productionbatchmasterid from produced_good) and creuserid=:userId");
				$stmt1->bindParam(':keywords',$keywords , PDO::PARAM_STR,10);
				$stmt1->bindParam(':userId',$userId , PDO::PARAM_STR,10);
			}

			if ($stmt1->execute()) {

				$json_response = array();
				while ($result1 = $stmt1->fetch(PDO::FETCH_ASSOC)) {
					$result1_array = array();
					$result1_array['productionbatchmasterid'] = $result1['productionbatchmasterid'];
					$result1_array['batchNo'] = $result1['batchno'];
					$result1_array['batchCodeName'] = $result1['batchcodename'];
					$result1_array['dateOfEntry'] = date("d-m-Y", strtotime($result1['dateofentry']));
					$result1_array['startDate'] = date("d-m-Y", strtotime($result1['productionstartdate']));
					$result1_array['endDate'] = date("d-m-Y", strtotime($result1['productionenddate']));
					$result1_array['supervisor'] = $result1['productionsupervisorid'];

					$result1_array['rawMaterial'] = array();
					$productionbatchmasterid = $result1['productionbatchmasterid'];

					$stmt2 = $dbh->prepare("SELECT * FROM production_raw_materials_details WHERE productionbatchmasterid=:productionbatchmasterid ");
					$stmt2->bindParam(':productionbatchmasterid', $productionbatchmasterid);
					$stmt2->execute();
					while ($result2 = $stmt2->fetch(PDO::FETCH_ASSOC)) {
						$stmt3 = $dbh->prepare("select a.productname from product_master a,material b where a.productmasterid=b.productmasterid and b.materialid=:materialid");
						$stmt3->bindParam(':materialid', $result2['materialid']);
						$stmt3->execute();
						$result3 = $stmt3->fetch(PDO::FETCH_ASSOC);
						/*			$stmt4=$dbh->prepare("select totalquantity from inventory where materialid=:materialid");
                                 $stmt4->bindParam(':materialid',$result2['materialid']);
                                 $stmt4->execute();
                                 $result4 =$stmt4->fetch(PDO::FETCH_ASSOC);
                                 if($result4 == "")
                                 {
                                     $result4['totalquantity']="";
                                 }*/
						$result1_array['rawMaterial'][] = array(
								'material' => $result2['materialid'],
								'materialName' => $result3['productname'],
								'prevQuantity' => $result2['quantity'],
								'quantity' => $result2['quantity']

						);

					}

					//$stmt4 = $dbh->prepare("select inhouseinwardid,producedgoodid,warehouseid,companyid,dateofentry,supervisorid from inhouse_inward_entry where productionbatchmasterid=:productionbatchmasterid");
					$stmt4 = $dbh->prepare("select inhouseinwardid,producedgoodid,b.warehouseName,c.companyName,dateofentry,supervisorid from inhouse_inward_entry a,warehousemaster b,companymaster c where productionbatchmasterid=:productionbatchmasterid and b.warehouseId=a.warehouseid and a.companyid=c.companyId");
					$stmt4->bindParam(':productionbatchmasterid', $productionbatchmasterid);
					$stmt4->execute();

					$result4 = $stmt4->fetch(PDO::FETCH_ASSOC);
					$result1_array['inhouseinwardid'] = $result4['inhouseinwardid'];
					$result1_array['wareHouse'] = $result4['warehouseName'];
					$result1_array['company'] = $result4['companyName'];
					$result1_array['dateOfEntryAftrProd'] = date("d-m-Y", strtotime($result4['dateofentry']));
					$result1_array['supervisorid'] = $result4['supervisorid'];

					$stmt5 = $dbh->prepare("select a.productname,c.quantity,c.packagedunits,c.materialproducedid from product_master a,material b,produced_good c where a.productmasterid=b.productmasterid and c.producedgoodid=:producedgoodid and c.materialproducedid=b.materialid");
					$stmt5->bindParam(':producedgoodid', $result4['producedgoodid']);
					$stmt5->execute();
					$result5 = $stmt5->fetch(PDO::FETCH_ASSOC);
					$result1_array['producedgoodid'] = $result5['productname'];
					$result1_array['quantityProdMat'] = $result5['quantity'];
					$result1_array['pckgdUnits'] = $result5['packagedunits'];
					$result1_array['prodcdMaterial'] = $result5['materialproducedid'];


					$stmt6 = $dbh->prepare("select transportationmode,vehicleno,drivername,transportagency,cost from inhouse_transportation_details where inhouseinwardid=:inhouseinwardid");
					$stmt6->bindParam(':inhouseinwardid', $result4['inhouseinwardid']);
					$stmt6->execute();
					$result6 = $stmt6->fetch(PDO::FETCH_ASSOC);
					$result1_array['modeOfTransport'] = $result6['transportationmode'];
					$result1_array['vehicleNo'] = $result6['vehicleno'];
					$result1_array['driver'] = $result6['drivername'];
					$result1_array['TranspAgency'] = $result6['transportagency'];
					$result1_array['cost'] = $result6['cost'];
					if ($result6['transportationmode'] != null) {
						$result1_array['tranReq'] = true;
					}


					array_push($json_response, $result1_array); //push the values in the array
				}
				echo json_encode($json_response);
			}


			break;


		case "Inquiry":
			$keywords="%".$prodBatchinfo->Keywords."%";
			if(AppUtil::isSuperUser($userId)) {
				$stmt1 = $dbh->prepare("SELECT * FROM production_batch_master where batchno like :keywords and productionbatchmasterid IN (select productionbatchmasterid from produced_good)");
				$stmt1->bindParam(':keywords',$keywords , PDO::PARAM_STR,10);
			}
			else {
				$stmt1 = $dbh->prepare("SELECT * FROM production_batch_master where batchno like :keywords and productionbatchmasterid IN (select productionbatchmasterid from produced_good) and creuserid=:userId");
				$stmt1->bindParam(':keywords',$keywords , PDO::PARAM_STR,10);
				$stmt1->bindParam(':userId',$userId , PDO::PARAM_STR,10);
			}
			if ($stmt1->execute()) {

				$json_response = array();
				while ($result1 = $stmt1->fetch(PDO::FETCH_ASSOC)) {
					$result1_array = array();
					$result1_array['productionbatchmasterid'] = $result1['productionbatchmasterid'];
					$result1_array['batchNo'] = $result1['batchno'];
					$result1_array['batchCodeName'] = $result1['batchcodename'];
					//$newDate = date("d-m-Y", strtotime($result1['dateofentry']));
					$result1_array['dateOfEntry'] = date("d-m-Y", strtotime($result1['dateofentry']));

					$result1_array['startDate'] = date("d-m-Y", strtotime($result1['productionstartdate']));
					$result1_array['endDate'] = date("d-m-Y", strtotime($result1['productionenddate']));
					$result1_array['supervisor'] = $result1['productionsupervisorid'];

					$result1_array['rawMaterial'] = array();
					$productionbatchmasterid = $result1['productionbatchmasterid'];

					$stmt2 = $dbh->prepare("SELECT * FROM production_raw_materials_details WHERE productionbatchmasterid=:productionbatchmasterid ");
					$stmt2->bindParam(':productionbatchmasterid', $productionbatchmasterid);
					$stmt2->execute();
					while ($result2 = $stmt2->fetch(PDO::FETCH_ASSOC)) {
						$stmt3 = $dbh->prepare("select a.productname from product_master a,material b where a.productmasterid=b.productmasterid and b.materialid=:materialid");
						$stmt3->bindParam(':materialid', $result2['materialid']);
						$stmt3->execute();


						$result3 = $stmt3->fetch(PDO::FETCH_ASSOC);

						/*	$stmt4=$dbh->prepare("select totalquantity from inventory where materialid=:materialid");
                             $stmt4->bindParam(':materialid',$result2['materialid']);
                             $stmt4->execute();
                             $result4 =$stmt4->fetch(PDO::FETCH_ASSOC);*/
						$result1_array['rawMaterial'][] = array(
								'material' => $result2['materialid'],
								'prevQuantity' => $result2['quantity'],
								'materialId' => $result3['productname'],
								'quantity' => $result2['quantity']


						);

					}
					array_push($json_response, $result1_array); //push the values in the array
				}
				echo json_encode($json_response);
			}


	}
}
?>