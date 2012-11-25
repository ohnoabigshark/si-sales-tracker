<?php

include_once('./DBWriter.php');
//include_once('./DBQuery.php');


class Route extends DBWriter {
	
	function __construct($uid=0) {
		$this->table = 'RouteTable';
		parent::__construct();
	}

}

?>