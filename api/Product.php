<?php

include_once('./DBWriter.php');
//include_once('./DBQuery.php');


class Product extends DBWriter {
	
	function __construct($uid=0) {
		$this->table = 'Products';
		parent::__construct();
	}

}


?>