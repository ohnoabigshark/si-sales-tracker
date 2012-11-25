<?php

include_once('./db/config.php');
include_once('./db/init.php');

class DBWriter { 
	//change to DB Object?

	private $db; 
	private $table;
	private $schema;
	private $blacklist; //array of attributes that are immutable
	private $saved; //true if object is recorded to DB

	//get_class() to get class name
	//SELECT column_name,data_type FROM information_schema.columns WHERE table_name =  'units' to get column names and data types
	//need to define all the data types we could be using
	//can just use $this->$column_name.
	//update table_name set column = value where id = itemID //if it doesn't exist, create it
	//save should be triggered by JSON.

	//RANDOM THOUGHT: should have a "planned recipes" page for some time frame where you can put in your menu for the day or some shit and see if you've got the stuff you need
	//should be able to classify recipe's state aka is this a prep ingredient to be used in something else (guac for green meunster) or a final product //good idea, not crucial atm
	//add a shelf life for products? that way you can see what is about to spoil //I think this useful but is not crucial for now.

	//RANDOM THOUGHT: could potentiall use on{X} to be the glue between a bunch of different technologies on the phone. For instance: scan barcode, look up UPC info online, if found, add item to DB. Something like that. Basically a workaround for anything that doesn't have an API we can access directly.

		//foreach($db->query('SELECT * FROM units WHERE uid = '.$this->uid) as $row) {

	function __construct($uid=0) {
		//should change $db to $this->db
		if(!isset($this->table)) {
			$this->table = get_class($this);
		}
		$this->db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); //should $db be static? 
		if(!isset($this->blacklist)) {
			$this->blacklist = array('uid','timestamp');			
		} else {
			array_push($this->blacklist,'uid','timestamp');
		}
		$this->schema = array();
		$this->saved = false;
		$this->load($uid);
	}
	public function __get($property) {
    	if (property_exists($this, $property)) {
    		return $this->$property;
    	} else {
    		return $this->schema[$property];
    	}
  	}

  	public function __set($property, $value) {
  		if (property_exists($this, $property)) {
      		$this->$property = $value;
    	} else {
   			$this->schema[$property] = $value;
    	}	
    	return $this;
  	}
	public function load($id=0) {
		$uid = $id;
		if(isset($uid) && $uid > 0 ) {
			$query = $this->db->query('SELECT * FROM '.$this->table.' WHERE `uid` = '.$uid);
			if( $query->rowCount() == 1 ) {
				$this->saved = true;
				$item = $query->fetch(PDO::FETCH_ASSOC);
			} else {
				echo("Failure in DBWriter.".$uid);
			}
		}
		$query = $this->db->query('SELECT * FROM information_schema.columns WHERE table_name =  "'.$this->table.'"');
		//echo('SELECT * FROM information_schema.columns WHERE table_name =  "'.$this->table.'"');

		foreach ( $query as $row ) {
			$column = $row[COLUMN_NAME];
			if(isset($item)) {
				$this->schema[$column] = $item[$column];
			} else {
				$this->schema[$column] = NULL;
			}
		}
	}

	public function getModifiableAttributes( ) {
		$attributes = array();
		foreach($this->schema as $k=>$v) {
			if(!in_array($k, $this->blacklist)) {
				array_push($attributes,$k);
			}
		}
		return $attributes;
	}

	public function processRequest( ) {
		if($_REQUEST['_method'])
			$method = $_REQUEST['_method'];
		else
			$method = $_SERVER['REQUEST_METHOD'];
		$requestData = json_decode(stripslashes($_REQUEST['model']),true);
		if ( !isset($requestData['uid']) || $requestData['uid'] < 1 )
			$requestData['uid'] = basename($_SERVER['REQUEST_URI']);

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
		if ($this->uid!=null && is_numeric($this->uid)) {
			$this->load($this->uid);
			$this->toJSON();
		}
		else
			$this->queryToJSON($this->query());
	}

	public function query ( $columnName=null, $value=null ) {
		if(isset($columnName) && isset($value) && $columnName != NULL && $value != null ) {
			$query = $this->db->query('SELECT * FROM '.$this->table.' WHERE '.$columnName.' = "'.$value.'"');
		} else {
			$query = $this->db->query('SELECT * FROM '.$this->table.' ORDER BY uid ASC');
		}
		return $query;
	}

	public function queryToJSON($query) {
		$data = array();
		if($query!=null) {
			while($row = $query->fetch(PDO::FETCH_ASSOC)) {
				array_push($data,$row);
			}
		}
		header('Content-type: application/json');
		echo json_encode($data);
	}

	public function updateAttributes($requestData) {
		//$this->validate();
		$this->uid = $requestData['uid'];
		foreach( $this->getModifiableAttributes() as $k=>$attr ) {
			if(isset($requestData[$attr])) {
				$this->$attr = $requestData[$attr];
			}
		}
	}

	public function rawUpdate ($data) {
		foreach ( $data as $attr=>$val ) {
			if(isset($val)) {
				$this->schema[$attr] = $val;
			}
		}
	}

	public function toJSON() {
		header('Content-type: application/json');
		echo json_encode($this->schema);

	}

	public function validate () {
		//validate the object
		return false;
	}

	public function delete() {
		$sql = "DELETE FROM ".$this->table." WHERE uid = ".$this->uid;
		$query = $this->db->prepare($sql);
		return $query->execute();
	}

	public function save() {
		//$this->validate();
		if($this->uid!=null && $this->uid!=0) {
			$str = '';
			foreach($this->schema as $k => $v ) {
				if (!in_array($k, $this->blacklist)) { //should make uid a const
					if(strcmp('CURRENT_TIMESTAMP',$v)==0) {
						$str .= $k."=".$v.",";
					} else {
						$str .= $k."='".$v."',";
					}
				}
			}
			$sql = "UPDATE ".$this->table." SET ".substr($str,0,-1)." WHERE uid = ".$this->uid; //the substr of str should be error checked for cases where schema == 1
			$query = $this->db->prepare($sql);
			$query->execute();
		} else {
			$str = '';
			$val = array();
			foreach($this->schema as $k => $v ) {
					$str .= "'".$k."',";
					if(isset($v)){
						$params .= '?,';
						array_push($val,$v);
					} else if(strcmp('uid',$k)==0) {
						$params .= 'NULL,';
					} else if(strcmp('timestamp',$k)==0 || strcmp('timeCreated',$k)==0) {
						$params .= 'CURRENT_TIMESTAMP,';
					} else {
						$params .= "'',";
					}
			} //(".substr($str,0,-1).")
			$sql = "INSERT INTO ".$this->table." VALUES (".substr($params,0,-1).")";	
			$query = $this->db->prepare($sql);
			$query->execute($val);
			$this->load($this->db->lastInsertId()); //should make uid a const
		}
		//write the object back to the DB
	}

}

?>