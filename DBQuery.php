<?php

include_once('../order_inc/config.php');
include_once('../order_inc/init.php');

class DBQuery {

	private $db; 
	private $table;


	function __construct() {
		//should change $db to $this->db
		if(!isset($this->table)) {
			$this->table = get_class($this);
		}
		$this->db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); //should $db be static? 
	}

	public function processRequest( ) {
		$method = $_SERVER['REQUEST_METHOD'];
		switch($method) {
			case 'GET':	$this->processRequestData();
						break;
			default: echo(get_class($this).' BROKE IN PROCESSREQUEST '.$method);
				break;
		}

	}

	private function processRequestData ( ) {
		$columnName = $_REQUEST['columnName'];
		$value = $_REQUEST['value'];
		//presumably there will be some sort of check code here but fuck that for now
		$this->queryToJSON($this->query($columnName,$value));
	}

	private function query ( $columnName, $value ) {
		if(isset($columnName) && isset($value) ) {
			$query = $this->db->query('SELECT * FROM '.$this->table.' WHERE '.$columnName.' = "'.$value.'"');
		} else {
			$query = $this->db->query('SELECT * FROM '.$this->table);
		}
		return $query;
	}

	private function queryToJSON($query) {
		$data = array();
		if($query!=null) {
			while($row = $query->fetch(PDO::FETCH_ASSOC)) {
				array_push($data,$row);
			}
		}
		header('Content-type: application/json');
		echo json_encode($data);
	}
}

?>