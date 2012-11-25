<?php

include_once('./DBWriter.php');
//include_once('./DBQuery.php');


class Text extends DBWriter {
	
	function __construct($uid=0) {
		$this->table = 'Texts';
		$this->blacklist = array('userID','received');
		parent::__construct();
	}

	public function processRequest( ) {
		if($_REQUEST['_method'])
			$method = $_REQUEST['_method'];
		else
			$method = $_SERVER['REQUEST_METHOD'];
		$requestData = json_decode(stripslashes($_REQUEST['model']),true);
		if ( !isset($requestData['uid']) || $requestData['uid'] < 1 )
			$requestData['uid'] = basename($_SERVER['REQUEST_URI']);
		
		if(strcmp($requestData['uid'],'texts')==0) {
			unset($requestData['uid']);
		}


		$this->updateAttributes($requestData);
		switch($method) {
			case 'POST': $this->save(); $this->toJSON();
				break;
			case 'GET': 
						if(strcmp(substr($requestData['uid'],0,1),'+')==0) {
							$output = $this->getTexts($requestData['uid']);
						} else if (isset($requestData['uid'])) {
							$this->load($requestData['uid']);
							$output = $this->schema;
						} else {
							$output = $this->query()->fetchAll(PDO::FETCH_ASSOC);
						}
						echo json_encode($output);
						break;
			case 'PUT': $this->save(); $this->toJSON();
				break;
			case 'DELETE': $this->delete();
				break;
			default: echo(get_class($this).' BROKE IN PROCESSREQUEST');
				break;
		}

	}

	public function getTexts ( $phone ) {
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
		/*$query = $db->prepare("SELECT * FROM  `Texts` WHERE (`To` LIKE ? OR `From` LIKE ?) AND `timestamp` > ? ORDER BY TIMESTAMP ASC");
		$time = date('Y-m-d H:m:s',mktime(11, 0, 0, date('m'), date('d')-7, date('Y')));//we want time to be
		$query->execute(array($phone,$phone,$time));*/
		//$query = $db->prepare("SELECT * FROM  `Texts` WHERE (`To` LIKE ? OR `From` LIKE ?) ORDER BY TIMESTAMP DESC LIMIT 25");
		$query = $db->prepare("SELECT * FROM  (SELECT * FROM `Texts` WHERE (`To` LIKE ? OR `From` LIKE ?) ORDER BY TIMESTAMP DESC LIMIT 25) P ORDER BY TIMESTAMP ASC");
		$query->execute(array($phone,$phone));
		$result = $query->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}


}

?>