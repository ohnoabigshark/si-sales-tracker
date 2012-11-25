<?php

include_once('./DBWriter.php');

class Application extends DBWriter {
	
	function __construct($uid=0) {
		$this->table = 'application';
		parent::__construct();
	}

}



$application = new Application();

$elArray = array("name","email","phone","resume","response");
foreach($elArray as $s) {
	if(isset($_POST[$s]))
		$application->$s = $_POST[$s];	
}

$application->save();

header("Location: http://www.haveasweetidea.com/blog/apply-thanks");


?>