<?php
require_once '../../php/appUtil.php';
require_once '../../php/Database.php';
require 'Followup.php';

Class Project
{

    public function load($id)
    {
        $object = array();
        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("SELECT * from project_master pm,project_address_details pad where (pm.ProjectId = :id AND pad.ProjectId = :id) AND pm.isDeleted = 0 AND pm.IsClosedProject = 0");
            $stmt->bindParam(':id', $id, PDO::PARAM_STR);

            if ($result = $stmt->execute()) {
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    array_push($object, $row);
                }
            }

        } catch (PDOException $e) {
            echo $e->getMessage();
        }

        $db = null;
        return $object;
        //return "i m in";
    }

    public static function getCompaniesForProject($projId)
    {
        $object = array();

        $db = Database::getInstance();
        $conn = $db->getConnection();
        $stmt = $conn->prepare("SELECT DISTINCT c.companyId,c.companyName FROM companymaster c, companies_involved_in_project cp WHERE cp.CompanyID = c.companyId and cp.ProjectId =:projid;");
        $stmt->bindParam(':projid', $projId, PDO::PARAM_STR);
        if ($result = $stmt->execute()) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($object, $row);
            }

        }
        $db = null;
        return $object;
    }

    public static function getExcludedCompaniesForProject($projId)
    {
        $object = array();

		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT DISTINCT c.companyId,c.companyName FROM companymaster c, companies_involved_in_project cp WHERE cp.CompanyID != c.companyId and cp.ProjectId =:projid;");
		$stmt->bindParam(':projid',$projId,PDO::PARAM_STR);
		if($result = $stmt->execute()){
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
				array_push($object, $row);
			}

		}
		$db = null;
		return $object;
	}


    public function getInvoicesByProject($projid)
    {
        $object = array();
        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("SELECT * FROM invoice i where i.QuotationId = (SELECT q.QuotationId FROM quotation q WHERE q.ProjectId = '$projid'  AND q.isApproved = 1)");
            //$stmt->bindParam(':projId',$projid,PDO::PARAM_STR);
            if ($result = $stmt->execute()) {
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    array_push($object, $row);
                }
                echo AppUtil::getReturnStatus("success", $object);
            } else {
                echo AppUtil::getReturnStatus("unsuccessful", "Error in stmt in getInvoicesByProject");
//						return "Error in stmt in getInvoicesByProject";
					}
		}
		catch(PDOException $e){
			return "In exception in getInvoicesByProject".$e->getMessage();
		}
		$db = null;
		return $object;
	}


	public function loadProjectSiteFollowup($projID){
		$object = array();
		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT `site_tracking_followup_schedule`.`FollowupId`,`FollowupTitle`,`FollowupDate`,`Description`,`ConductDate`,`firstName`,`lastName` FROM `site_tracking_followup_schedule` ,`site_tracking_followup_details`  , usermaster  where `site_tracking_followup_schedule`.FollowupId = `site_tracking_followup_details`.FollowupId AND usermaster.userId = `site_tracking_followup_schedule`.AssignEmployee AND `site_tracking_followup_schedule`.`ProjectId` = :id");
		$stmt->bindParam(':id',$projID,PDO::PARAM_STR);
		if($stmt->execute() === TRUE){
			while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
				array_push($object, $row);
			}
		}
		else{
			return false;
		}
		$db = null;
		return $object;
	}

	public static function loadAll(){
		$object = array();
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$stmt = $conn->prepare("SELECT * from project_master pm ,project_address_details pad , project_point_of_contact_details ppoc WHERE pm.IsClosedProject = 0 AND pm.isDeleted = 0 AND (pm.ProjectId = pad.ProjectId AND ppoc.ProjectId = pm.ProjectId) ");
			if($result = $stmt->execute()) {
				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
					array_push($object, $row);
				}
			}
		} catch (PDOException $e) {
            echo $e->getMessage();
        }
		$db = null;
		return $object;
	}



	public static function loadAllCustomerBySearch() {

		//return "i m in";
	}


    public static function getProjectSearchQuery($searchBy)
    {
        if ($searchBy == 'project_name') {
            return "SELECT pm.*,pad.*,pc.*,cm.`CustomerName` from project_master pm,project_address_details pad,customer_master cm ,`project_point_of_contact_details` pc where (pm.ProjectName LIKE :searchTerm AND pad.ProjectId = pm.ProjectId ) AND pm.isDeleted = 0 AND cm.`CustomerId`=pm.`CustomerId` AND pc.`ProjectId`=pm.`ProjectId` ORDER BY pm.ProjectName,pm.ProjectStatus DESC ";
        } else if ($searchBy == 'project_city') {
            return "SELECT pm.*,pad.*,pc.*,cm.`CustomerName` from project_master pm,project_address_details pad,customer_master cm ,`project_point_of_contact_details` pc where (pad.`City` LIKE :searchTerm AND pad.ProjectId = pm.ProjectId ) AND pm.isDeleted = 0   AND cm.`CustomerId`=pm.`CustomerId` AND pc.`ProjectId`=pm.`ProjectId` ORDER BY pm.ProjectName,pm.ProjectStatus DESC ";
        }else if($searchBy == 'project_customer')
        {
            return "SELECT pm.*,pad.*,pc.*,cm.`CustomerName` from project_master pm,project_address_details pad,customer_master cm ,`project_point_of_contact_details` pc where (cm.`CustomerName` LIKE :searchTerm AND pad.ProjectId = pm.ProjectId ) AND pm.isDeleted = 0   AND cm.`CustomerId`=pm.`CustomerId` AND pc.`ProjectId`=pm.`ProjectId` ORDER BY pm.ProjectName,pm.ProjectStatus DESC ";
        }
    }


    public static function searchProject($searchTerm, $searchBy)
    {

        $object = array();

        $db = Database::getInstance();
        $conn = $db->getConnection();
        $searchTerm = '%' . $searchTerm . '%';
        $searchBy = strtolower($searchBy);
        $queryStmt = self::getProjectSearchQuery($searchBy);

        $stmt = $conn->prepare($queryStmt);

        $stmt->bindParam(':searchTerm', $searchTerm, PDO::PARAM_STR);

        //$stmt->bindParam(':id', $id, PDO::PARAM_STR);

        if ($result = $stmt->execute()) {
            $noOfRows = 0;
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                //get project id from row
                // check costcennter for projeect
                $result_array = array();

                $result_array['ProjectName'] = $row['ProjectName'];
                $result_array['ProjectId'] = $row['ProjectId'];
                $result_array['ProjectStatus'] = $row['ProjectStatus'];
//                $result_array['LastName'] = $row['LastName'];
//                $result_array['FirstName'] = $row['FirstName'];
                $result_array['ProjectId'] = $row['ProjectId'];
                $result_array['Address'] = $row['Address'];
                $result_array['City'] = $row['City'];
                $result_array['State'] = $row['State'];
                $result_array['Country'] = $row['Country'];
                $result_array['PointContactName'] = $row['PointContactName'];
                $result_array['MobileNo'] = $row['MobileNo'];
                $result_array['LandlineNo'] = $row['LandlineNo'];
                $result_array['EmailId'] = $row['EmailId'];
                $result_array['Pincode'] = $row['Pincode'];
                $result_array['CustomerId'] = $row['CustomerId'];
                $result_array['CustomerName'] = $row['CustomerName'];
                $result_array['ProjectManagerId'] = $row['ProjectManagerId'];

                $projectID=$row['ProjectId'];
                $stmtCostCenter=$conn->prepare("SELECT projectid FROM budget_details WHERE projectid=:projectID");
                $stmtCostCenter->bindParam(':projectID', $projectID, PDO::PARAM_STR);
                if($stmtCostCenter->execute()){
                    if($stmtCostCenter->rowCount()>0){
                        $result_array['isCostCenterAvailable'] = "true";
                    }else{
                        $result_array['isCostCenterAvailable'] = "false";
                    }
                }
                array_push($object, $result_array);
                $noOfRows++;
            }

        }

        $db = null;
        return $object;

    }


    public static function saveProject($data, $userId)
    {

        $projnum = AppUtil::generateId();
        $projectBasicDetails = $data->projectDetails;
        $t = time();
        $current = date("Y-m-d", $t);

        $object = array();
        $rollBack = true;

        $db = Database::getInstance();
        $conn = $db->getConnection();
        $conn->beginTransaction();

        $stmt = $conn->prepare("SELECT `ProjectName` FROM `project_master` WHERE `ProjectName`= :projectName");
        $stmt->bindParam(':projectName', $projectBasicDetails->ProjectName, PDO::PARAM_STR);

        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (count($result) > 0) {
            return 2;
        }
        $stmt = $conn->prepare("INSERT INTO project_master (ProjectId, ProjectName, ProjectManagerId, ProjectSource, IsSiteTrackingProject, ProjectStatus, CustomerId, IsClosedProject, isDeleted, CreationDate, CreatedBy, LastModificationDate, LastModifiedBy)
													VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");

        if ($stmt->execute([$projnum, $projectBasicDetails->ProjectName, $projectBasicDetails->ProjectManagerId, $projectBasicDetails->ProjectSource, '0', 'Initiated', $projectBasicDetails->CustomerId, '0', '0', $current, $userId, $current, $userId]) === TRUE) {
            $stmt2 = $conn->prepare("INSERT INTO project_address_details (ProjectId, Address, City, State, Country, Pincode) VALUES (?,?,?,?,?,?)");
            if ($stmt2->execute([$projnum, $projectBasicDetails->Address, $projectBasicDetails->City, $projectBasicDetails->State, $projectBasicDetails->Country, $projectBasicDetails->Pincode]) === TRUE) {
                $stmt3 = $conn->prepare("INSERT INTO project_point_of_contact_details (ProjectId, PointContactName, MobileNo, LandlineNo, EmailId) VALUES (?,?,?,?,?)");
                if ($stmt3->execute([$projnum, $projectBasicDetails->PointContactName, $projectBasicDetails->MobileNo, $projectBasicDetails->LandlineNo, $projectBasicDetails->EmailId]) === TRUE) {
                    $break = false;
                    foreach ($data->companiesInvolved as $company) {
                        $stmt4 = $conn->prepare("INSERT INTO companies_involved_in_project (ProjectID, CompanyID) VALUES (?,?)");
                        if (!$stmt4->execute([$projnum, $company->companyId])) {

                            throw new Exception($stmt4->errorInfo);
                            $break = true;
                            break;
                        }

                    }
                    if (!$break) {
                        $conn->commit();
                        $rollBack = false;
                        if (isset($data->followupData)) {
                            if (Followup::CreateSiteTrackingFollowup($projnum, $data->followupData, $userId)) {
                              //  echo AppUtil::getReturnStatus("Successful", "Conduction Successful");
                            } else {
                              //  echo AppUtil::getReturnStatus("Unsuccessful", "Database Error Occurred");
                            }
                        }
                    }

                } else {
                    throw new Exception($stmt3->errorInfo);
                }
            } else {
                throw new Exception($stmt2->errorInfo);
            }
        } else {
            throw new Exception($stmt->errorInfo);

        }

        if ($rollBack) {
            $conn->rollBack();
            return 0;
        }


        $conn = null;
        return 1;


    }




    public
    static function updateProject($id, $data, $loggedUserId)
    {

        $db = Database::getInstance();
        $conn = $db->getConnection();
        //		echo json_encode($data);

        $conn->beginTransaction();

			$stmt = $conn->prepare("SELECT `ProjectName` FROM `project_master` WHERE ProjectName=:ProjectName AND `ProjectId`!= :projectId");
			$stmt->bindParam(':ProjectName',$data->projectDetails->ProjectName, PDO::PARAM_STR);
			$stmt->bindParam(':projectId',$id, PDO::PARAM_STR);

        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (count($result) > 0) {
            return 2;
        }


        $stmt = $conn->prepare("UPDATE `project_master` SET `ProjectName`=:projectName,`ProjectManagerId`=:projectManagerId,`CustomerId`=:customerId, `LastModificationDate`=now(),`LastModifiedBy`=:lastModifiedBy WHERE `ProjectId`=:projectId");
        $stmt->bindParam(':projectName', $data->projectDetails->ProjectName, PDO::PARAM_STR);
        $stmt->bindParam(':projectManagerId', $data->projectDetails->ProjectManagerId, PDO::PARAM_STR);
        $stmt->bindParam(':customerId', $data->projectDetails->CustomerId, PDO::PARAM_STR);
        $stmt->bindParam(':lastModifiedBy', $loggedUserId, PDO::PARAM_STR);
        $stmt->bindParam(':projectId', $id, PDO::PARAM_STR);
        $stmt2 = $conn->prepare("UPDATE project_address_details SET  Address=:address, City=:city, State=:state, Country=:country, Pincode=:pincode WHERE ProjectId = :id");
        //$stmt->bindParam(':projectName', $data->ProjectName, PDO::PARAM_STR);
        $stmt2->bindParam(':address', $data->projectDetails->Address, PDO::PARAM_STR);
        $stmt2->bindParam(':city', $data->projectDetails->City, PDO::PARAM_STR);
        $stmt2->bindParam(':state', $data->projectDetails->State, PDO::PARAM_STR);
        $stmt2->bindParam(':country', $data->projectDetails->Country, PDO::PARAM_STR);
        $stmt2->bindParam(':pincode', $data->projectDetails->Pincode, PDO::PARAM_STR);
        $stmt2->bindParam(':id', $id, PDO::PARAM_STR);

        /*update project_point_of_contact_details*/
        $stmt1 = $conn->prepare("UPDATE project_point_of_contact_details SET PointContactName = :pointContactName, MobileNo=:mobileNo, LandlineNo=:landlineNo, EmailId=:emailId WHERE ProjectId = :id");
        $stmt1->bindParam(':pointContactName', $data->projectDetails->PointContactName, PDO::PARAM_STR);
        $stmt1->bindParam(':mobileNo', $data->projectDetails->MobileNo, PDO::PARAM_STR);
        $stmt1->bindParam(':landlineNo', $data->projectDetails->LandlineNo, PDO::PARAM_STR);
        $stmt1->bindParam(':emailId', $data->projectDetails->EmailId, PDO::PARAM_STR);
        $stmt1->bindParam(':id', $id, PDO::PARAM_STR);


        if ($stmt->execute() === TRUE && $stmt1->execute() === TRUE && $stmt2->execute() === TRUE) {

            foreach ($data->companiesInvolved as $company) {
                $stmt4 = $conn->prepare("INSERT INTO companies_involved_in_project (ProjectID, CompanyID) VALUES (?,?)");
                if (!$stmt4->execute([$id, $company->companyId])) {
                    $conn->rollBack();
                    return 0;
                }
            }
            $conn->commit();
            return 1;
        } else {
            return 0;
        }

    }


    /*Delete project*/
    public
    function deleteProject($id)
    {
        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $conn->beginTransaction();
            $stmt = $conn->prepare("UPDATE project_master pm SET  pm.IsDeleted =1 WHERE pm.isDeleted = 0 AND pm.ProjectId = :id");
            //$stmt->bindParam(':isDeleted', $data->IsDeleted, PDO::PARAM_STR);
            $stmt->bindParam(':id', $id, PDO::PARAM_STR);
            if ($stmt->execute() === TRUE) {
                $conn->commit();
                return "Project deleted succesfully";
            } else {
                return "Error in project deletion";
            }
        } catch (PDOException $e) {
            return "Exception in deletion of customer " . $e->getMessage();
        }

    }

    public
    function closeProject($projId)
    {
        try {
            $db = Database::getInstance();
            $conn = $db->getConnection();
            $conn->beginTransaction();
            $stmt = $conn->prepare("UPDATE project_master pm SET  pm.IsClosedProject =1,pm.`ProjectStatus`='Closed' WHERE  pm.ProjectId = :id");
            $stmt->bindParam(':id', $projId, PDO::PARAM_STR);
            if ($stmt->execute() === TRUE) {
                $conn->commit();
                return "Project has been closed succesfully";
            } else {
                $conn->rollBack();
                return "Error in project closing";
            }
        } catch (PDOException $e) {
            return "Exception in closeProject " . $e->getMessage();
        }
    }

    public static function getProjectList()
    {
        $object = array();

        $db = Database::getInstance();
        $conn = $db->getConnection();
        $stmt = $conn->prepare("SELECT `ProjectId`,`ProjectName` FROM `project_master` WHERE `isDeleted`='0'");
        if ($result = $stmt->execute()) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($object, $row);
            }
        } else
            return null;

        $db = null;
        return $object;


    }

    public static function getProjectListWithoutCostCenter()
    {
        $object = array();

        $db = Database::getInstance();
        $conn = $db->getConnection();
        $stmt = $conn->prepare("SELECT `ProjectId`,`ProjectName` FROM `project_master` WHERE `ProjectId` NOT IN (SELECT `projectid` FROM `budget_details`)");
        if ($result = $stmt->execute()) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($object, $row);
            }
        } else
            return null;

        $db = null;
        return $object;


    }


    public
    static function getSiteTrackingProjectList()
    {
        $object = array();

        $db = Database::getInstance();
        $conn = $db->getConnection();
        $stmt = $conn->prepare("SELECT `ProjectId`,`ProjectName` FROM `project_master` WHERE `isDeleted`='0' AND `ProjectSource`='Site Tracking'");
        if ($result = $stmt->execute()) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($object, $row);
            }
        } else {
            return null;
        }

        $db = null;
        return $object;


    }


}