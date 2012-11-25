<?php

include_once('./DBWriter.php');
//include_once('./DBQuery.php');


class Type extends DBWriter {
	
	function __construct($uid=0) {
		$this->table = 'Type';
		parent::__construct();
	}

}


?>