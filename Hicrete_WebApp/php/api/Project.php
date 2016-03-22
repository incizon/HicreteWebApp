<?php
require_once '/../../php/appUtil.php';
require_once '../Database.php';

Class Project {
	
	public static function load($id) {
		$object = array();
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$stmt = $conn->prepare("SELECT * from project_master pm,project_address_details pad where (pm.ProjectId = :id AND pad.ProjectId = :id) AND pm.isDeleted = 0 AND pm.IsClosedProject = 0");
			$stmt->bindParam(':id', $id, PDO::PARAM_STR);
			
			if($result = $stmt->execute()){
				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
					array_push($object, $row);
				}
			}

		 } catch (PDOException $e) {
            echo $e->getMessage();
        }

		$db = null;
		return $object ;
		//return "i m in";
	}

	public function getCompaniesForProject($projId){
			$object = array();
		try{
			$db = Database::getInstance();
			$conn = $db->getConnection();
				$stmt = $conn->prepare("SELECT DISTINCT c.CompanyID,c.CompanyName FROM company_master c, companies_involved_in_project cp WHERE cp.CompanyID = c.CompanyID and cp.ProjectId = :projid;");
				$stmt->bindParam(':projid',$projId,PDO::PARAM_STR);
					if($result = $stmt->execute()){
						while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
							array_push($object, $row);
						}
						//print_r($object);
					}
					else{
						return "Error in stmt in getCompaniesForProject";
					}
					return $object;
		}
		catch(PDOException $e){
			return "In exception in getCompaniesForProject".$e->getMessage();
		}
		$db = null;
		return $object;
	}


	public function getInvoicesByProject($projid){
		$object = array();
		try{
			$db = Database::getInstance();
			$conn = $db->getConnection();
				$stmt = $conn->prepare("SELECT * FROM invoice i where i.QuotationId = (SELECT q.QuotationId FROM quotation q WHERE q.ProjectId = :projId  AND q.isApproved = 1)");
				$stmt->bindParam(':projId',$projid,PDO::PARAM_STR);
					if($result = $stmt->execute()){
						while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
							array_push($object, $row);
						}
					}
					else{
						return "Error in stmt in getInvoicesByProject";
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
			$stmt = $conn->prepare("SELECT * from project_master pm ,project_address_details pad , project_point_of_contact_details ppoc WHERE pm.IsClosedProject = 0 AND pm.isDeleted = 0 AND (pm.ProjectManagerId = u.UserId AND pm.ProjectId = pad.ProjectId AND ppoc.ProjectId = pm.ProjectId) ");
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


	public static function getProjectSearchQuery($searchBy){
		if($searchBy=='project_name'){
			return "SELECT pm.*,pad.*,u.FirstName,u.LastName from project_master pm,project_address_details pad,usermaster u where (pm.ProjectName LIKE :searchTerm AND pad.ProjectId = pm.ProjectId ) AND pm.isDeleted = 0 AND pm.IsClosedProject = 0 AND u.userId=pm.`ProjectManagerId`" ;
		}else if($searchBy=='project_city'){
			return "SELECT pm.*,pad.*,u.FirstName,u.LastName from project_master pm,project_address_details pad,usermaster u where (pad.`City` LIKE :searchTerm AND pad.ProjectId = pm.ProjectId ) AND pm.isDeleted = 0 AND pm.IsClosedProject = 0 AND u.userId=pm.`ProjectManagerId" ;
		}
	}



	public static function searchProject($searchTerm,$searchBy) {

		$object = array();

		$db = Database::getInstance();
		$conn = $db->getConnection();
		$searchTerm='%'.$searchTerm.'%';
		$searchBy=strtolower($searchBy);
		$queryStmt=self::getProjectSearchQuery($searchBy);

		$stmt = $conn->prepare($queryStmt);
		$stmt->bindParam(':searchTerm', $searchTerm, PDO::PARAM_STR);

		//$stmt->bindParam(':id', $id, PDO::PARAM_STR);

		if($result = $stmt->execute()){
			$noOfRows=0;
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
				array_push($object, $row);
				$noOfRows++;
			}

		}

		$db = null;
		return $object ;

	}




	/*public function saveProject($data ,$userId){
		
		$projnum = AppUtil::generateId();
		$projectBasicDetails=$data->projectDetails;	
		

		$object = array();
		$rollBack=true;
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$conn->beginTransaction();
			
			$stmt = $conn->prepare("INSERT INTO project_master (ProjectId, ProjectName, ProjectManagerId, ProjectSource, IsSiteTrackingProject, ProjectStatus, CustomerId, IsClosedProject, CreatedBy, isDeleted ,LastModifiedBy)
														VALUES (?,?,?,?,?,?,?,?,?,?,?)");
			
			if ($stmt->execute([$projnum, $projectBasicDetails->ProjectName,$projectBasicDetails->ProjectManagerId,$projectBasicDetails->ProjectSource,'0','Initiated',$projectBasicDetails->CustomerId,'0',$userId,'0',$userId]) === TRUE) {
				$stmt2 = $conn->prepare("INSERT INTO project_address_details (ProjectId, Address, City, State, Country, Pincode) VALUES (?,?,?,?,?,?)");
				if( $stmt2->execute([$projnum,$projectBasicDetails->Address,$projectBasicDetails->City,$projectBasicDetails->State,$projectBasicDetails->Country,$projectBasicDetails->Pincode])) {
					$stmt3 = $conn->prepare("INSERT INTO project_point_of_contact_details (ProjectId, PointContactName, MobileNo, LandlineNo, EmailId) VALUES (?,?,?,?,?)");
					if( $stmt3->execute([$projnum, $projectBasicDetails->PointContactName, $projectBasicDetails->MobileNo, $projectBasicDetails->LandlineNo, $projectBasicDetails->EmailId])) {
						$break=false;
						foreach ($data->companiesInvolved as $company) {
							$stmt4 = $conn->prepare("INSERT INTO companies_involved_in_project (ProjectID, CompanyID) VALUES (?,?)");
							if(!$stmt4->execute([$projnum, $company->companyId]) ){
								$break=true;
								break;	
							}	
						
						}
						if(!$break){
							$conn->commit();
							$rollBack=false;
						}	
					}
				}
			}
			if($rollBack) {
					//$conn->rollBack();
					return "Error: ";
					
			}
		} catch (PDOException $e) {
            echo "Exception alay";
            echo $e->getMessage();
            $conn->rollBack();
        }
		$conn = null;
	}*/
		/*public function saveProject($data ,$userId){
		
		$projnum = AppUtil::generateId();
		$projectBasicDetails=$data->projectDetails;	
		

		$object = array();
		$rollBack=true;
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$conn->beginTransaction();
			
			$stmt = $conn->prepare("INSERT INTO project_master (ProjectId, ProjectName, ProjectManagerId, ProjectSource, IsSiteTrackingProject, ProjectStatus, CustomerId, IsClosedProject, CreatedBy, isDeleted ,LastModifiedBy)
														VALUES (?,?,?,?,?,?,?,?,?,?,?)");
			
			if ($stmt->execute([$projnum, $projectBasicDetails->ProjectName,$projectBasicDetails->ProjectManagerId,$projectBasicDetails->ProjectSource,'0','Initiated',$projectBasicDetails->CustomerId,'0',$userId,'0',$userId]) === TRUE) {
				$stmt2 = $conn->prepare("INSERT INTO project_address_details (ProjectId, Address, City, State, Country, Pincode) VALUES (?,?,?,?,?,?)");
				if( $stmt2->execute([$projnum,$projectBasicDetails->Address,$projectBasicDetails->City,$projectBasicDetails->State,$projectBasicDetails->Country,$projectBasicDetails->Pincode])) {
					$stmt3 = $conn->prepare("INSERT INTO project_point_of_contact_details (ProjectId, PointContactName, MobileNo, LandlineNo, EmailId) VALUES (?,?,?,?,?)");
					if( $stmt3->execute([$projnum, $projectBasicDetails->PointContactName, $projectBasicDetails->MobileNo, $projectBasicDetails->LandlineNo, $projectBasicDetails->EmailId])) {
						$break=false;
						foreach ($data->companiesInvolved as $company) {
							$stmt4 = $conn->prepare("INSERT INTO companies_involved_in_project (ProjectID, CompanyID) VALUES (?,?)");
							if(!$stmt4->execute([$projnum, $company->companyId]) ){
								$break=true;
								break;	
							}	
						
						}
						if(!$break){
							$conn->commit();
							$rollBack=false;
						}	
					}
				}
			}
			if($rollBack) {
					//$conn->rollBack();
					return "Error: ";
					
			}
		} catch (PDOException $e) {
            echo "Exception alay";
            echo $e->getMessage();
            $conn->rollBack();
        }
		$conn = null;
	}*/

public static function saveProject($data ,$userId){
		
		$projnum = AppUtil::generateId();
		$projectBasicDetails=$data->projectDetails;	
		$t=time();
		$current =date("Y-m-d",$t);

		$object = array();
		$rollBack=true;
		try {
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$conn->beginTransaction();
			
			$stmt = $conn->prepare("INSERT INTO project_master (ProjectId, ProjectName, ProjectManagerId, ProjectSource, IsSiteTrackingProject, ProjectStatus, CustomerId, IsClosedProject, isDeleted, CreationDate, CreatedBy, LastModificationDate, LastModifiedBy)
														VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");

				if($stmt->execute([$projnum, $projectBasicDetails->ProjectName,$projectBasicDetails->ProjectManagerId,$projectBasicDetails->ProjectSource,'0','Initiated',$projectBasicDetails->CustomerId,'0','0',$current,$userId,$current,$userId]) === TRUE){
						$stmt2 = $conn->prepare("INSERT INTO project_address_details (ProjectId, Address, City, State, Country, Pincode) VALUES (?,?,?,?,?,?)");
							if($stmt2->execute([$projnum,$projectBasicDetails->Address,$projectBasicDetails->City,$projectBasicDetails->State,$projectBasicDetails->Country,$projectBasicDetails->Pincode]) === TRUE){
								$stmt3 = $conn->prepare("INSERT INTO project_point_of_contact_details (ProjectId, PointContactName, MobileNo, LandlineNo, EmailId) VALUES (?,?,?,?,?)");
									if($stmt3->execute([$projnum, $projectBasicDetails->PointContactName, $projectBasicDetails->MobileNo, $projectBasicDetails->LandlineNo, $projectBasicDetails->EmailId]) === TRUE){
											$break=false;
										foreach ($data->companiesInvolved as $company) {
											$stmt4 = $conn->prepare("INSERT INTO companies_involved_in_project (ProjectID, CompanyID) VALUES (?,?)");
											if(!$stmt4->execute([$projnum, $company->companyId]) ){

												throw new Exception($stmt4->errorInfo);
												$break=true;
												break;	
											}	
						
										}
											if(!$break){
												$conn->commit();
												$rollBack=false;
											}

									}
									else
									{
										throw new Exception($stmt3->errorInfo);
									}
							}
							else{
								throw new Exception($stmt2->errorInfo);
							}
				}
				else
				{
					throw new Exception($stmt->errorInfo);

				}

			if($rollBack){
				$conn->rollBack();
				return false;
			}
			return true;
		

		} catch (PDOException $e) {
            $conn->rollBack();
			throw new Exception($e->getMessage()) ;
        }
		$conn = null;
	}


/*	public function updateProject($id,$data) {

		$db  = mysqli_connect('localhost','root','root','hicrete');
		if($db == null)
		return "Error..DB not cinnected";
		//$sql = "SELECT * from customer_master ;";

		$sql = "UPDATE table_name SET column1=value, column2=value2 WHERE some_column=some_value "
		
		$result = mysqli_query($db,$sql);
		if(!$result){
			return "error";
		}
		else{

			$object = array();
			if($result = mysqli_query($db,$sql)){
				while ($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){
					array_push($object, $row);
				}
			}
		}
		mysqli_close($db);
		return $object;

	}*/

public function updateProject($id,$data){
		try{
			$db = Database::getInstance();
			$conn = $db->getConnection();
			$conn->beginTransaction();



			$stmt = $conn->prepare("UPDATE project_master SET  ProjectName=:projectName WHERE ProjectId = :id");
			$stmt->bindParam(':projectName' ,$data->ProjectName ,PDO::PARAM_STR);

			$stmt = $conn->prepare("UPDATE project_address_details SET  Address=:address, City=:city, State=:state, Country=:country, Pincode=:pincode WHERE ProjectId = :id");
			//$stmt->bindParam(':projectName', $data->ProjectName, PDO::PARAM_STR);
			$stmt->bindParam(':address', $data->Address, PDO::PARAM_STR);
			$stmt->bindParam(':city', $data->City, PDO::PARAM_STR);
			$stmt->bindParam(':state', $data->State, PDO::PARAM_STR);
			$stmt->bindParam(':country', $data->Country, PDO::PARAM_STR);
			$stmt->bindParam(':pincode', $data->Pincode, PDO::PARAM_STR);
			$stmt->bindParam(':id', $id, PDO::PARAM_STR);
			
			/*update project_point_of_contact_details*/
			$stmt1 = $conn->prepare("UPDATE project_point_of_contact_details SET PointContactName = :pointContactName, MobileNo=:mobileNo, LandlineNo=:landlineNo, EmailId=:emailId WHERE ProjectId = :id");
			$stmt1->bindParam(':pointContactName', $data->PointContactName, PDO::PARAM_STR);
			$stmt1->bindParam(':mobileNo', $data->MobileNo, PDO::PARAM_STR);
			$stmt1->bindParam(':landlineNo', $data->LandlineNo, PDO::PARAM_STR);
			$stmt1->bindParam(':emailId', $data->EmailId, PDO::PARAM_STR);
			$stmt1->bindParam(':id', $id, PDO::PARAM_STR);

			if($stmt->execute() === TRUE && $stmt1->execute() ===TRUE ){
				$conn->commit();
				return "Project updated succesfully";
			}
			else{
				return "Error in updation of Project";
			}
		}
		catch(PDOException $e){
			return "exception in updation ".$e.getMessage();
		}

	}


/*Delete project*/
	public function deleteProject($id) {
		try{
				$db = Database::getInstance();
				$conn = $db->getConnection();
				$conn->beginTransaction();
				$stmt = $conn->prepare("UPDATE project_master pm SET  pm.IsDeleted =1 WHERE pm.isDeleted = 0 AND pm.ProjectId = :id");
				//$stmt->bindParam(':isDeleted', $data->IsDeleted, PDO::PARAM_STR);
				$stmt->bindParam(':id',$id,PDO::PARAM_STR);
				if($stmt->execute() ===TRUE){
					$conn->commit();
					return "Project deleted succesfully";
				}
				else{
					return "Error in project deletion";
				}
		}
		catch(PDOException $e){
				return "Exception in deletion of customer ".$e->getMessage();
		}

	}

	public function closeProject($projId){
		try{
				$db = Database::getInstance();
				$conn = $db->getConnection();
				$conn->beginTransaction();
				$stmt = $conn->prepare("UPDATE project_master pm SET  pm.IsClosedProject =1 WHERE  pm.ProjectId = :id");
				$stmt->bindParam(':id',$projId,PDO::PARAM_STR);
				if($stmt->execute() ===TRUE){
					$conn->commit();
					return "Project has been closed succesfully";
				}
				else{
					$conn->rollBack();
					return "Error in project closing";
				}
		}
		catch(PDOException $e){
			return "Exception in closeProject ".$e->getMessage();
		}
	}

	public static function getProjectList() {
		$object = array();

		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT `ProjectId`,`ProjectName` FROM `project_master` WHERE `isDeleted`='0'");
		if($result = $stmt->execute()) {
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
				array_push($object, $row);
			}
		}else
			return null;

		$db = null;
		return $object;


	}

	public static function getSiteTrackingProjectList() {
		$object = array();

		$db = Database::getInstance();
		$conn = $db->getConnection();
		$stmt = $conn->prepare("SELECT `ProjectId`,`ProjectName` FROM `project_master` WHERE `isDeleted`='0' AND `ProjectSource`='SiteTracking'");
		if($result = $stmt->execute()) {
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
				array_push($object, $row);
			}
		}else{
			return null;
		}

		$db = null;
		return $object;


	}




}