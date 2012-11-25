<?php

include_once('./DBWriter.php');
//include_once('./DBQuery.php');


class User extends DBWriter {
	
	function __construct($uid=0) {
		$this->table = 'Users';
		parent::__construct();
	}

}

?>