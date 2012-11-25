<?php

include_once('./DBWriter.php');
//include_once('./DBQuery.php');


class OrderProduct extends DBWriter {
	
	function __construct($uid=0) {
		$this->table = 'OrderProducts';
		parent::__construct();
	}

	public function processRequest( ) {
		if($_REQUEST['_method'])
			$method = $_REQUEST['_method'];
		else
			$method = $_SERVER['REQUEST_METHOD'];
		$requestData = json_decode(stripslashes($_REQUEST['model']),true);
		if ( !isset($requestData['uid']) || $requestData['uid'] < 1 )
			$requestData['orderID'] = basename($_SERVER['REQUEST_URI']);
		
		$this->updateAttributes($requestData);
		switch($method) {
			case 'POST': $this->save(); $this->toJSON();
				break;
			case 'GET': $this->processGet();
						break;
			case 'PUT': $this->save(); $this->toJSON();
				break;
			case 'DELETE': $this->delete();
				break;
			default: echo(get_class($this).' BROKE IN PROCESSREQUEST');
				break;
		}

	}

	public function processGet () {
		if ($this->orderID!=null && is_numeric($this->orderID)) {
			$this->queryToJSON($this->query('orderID',$this->orderID));
		}
		else
			$this->queryToJSON($this->query());
	}

}

	


?>