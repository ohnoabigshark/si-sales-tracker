<?php
    /* Send an SMS using Twilio. You can run this file 3 different ways:
     *
     * - Save it as sendnotifications.php and at the command line, run 
     *        php sendnotifications.php
     *
     * - Upload it to a web host and load mywebhost.com/sendnotifications.php 
     *   in a web browser.
     * - Download a local server like WAMP, MAMP or XAMPP. Point the web root 
     *   directory to the folder containing this file, and load 
     *   localhost:8888/sendnotifications.php in a web browser.
     */
 
    // Step 1: Download the Twilio-PHP library from twilio.com/docs/libraries, 
    // and move it into the folder containing this file.
    include_once('./Text.php');
    include_once('./Type.php');
    include_once('./Order.php');
    
 
 	Class StatusCallback {
 		// Step 2: set our AccountSid and AuthToken from www.twilio.com/user/account
    private $AccountSid = "AC724438d929864945260401022f99d258";
    private $AuthToken = "90219b8db3133e60d363f5d6404911e5";
 
	
	public function processRequest ( ) {
		if($_REQUEST['_method']) {
			$method = $_REQUEST['_method'];
			$requestData = json_decode(stripslashes($_REQUEST['model']),true);
		}
		else {
			$method = $_SERVER['REQUEST_METHOD'];
			$requestData = $_REQUEST;
		}

		if(strcmp($requestData['SmsStatus'],"sent")==0) {
			//yay we sent it
		} else {
			//didn't get sent
		}

		// Display a confirmation message on the screen
		switch($method) {
			case 'POST': $this->saveText($requestData);
				break;
			case 'GET': break;
			case 'PUT': 
				break;
			case 'DELETE':
				break;
			default: echo(get_class($this).' BROKE IN PROCESSREQUEST');
				break;
		}
	}

	private function saveText( $requestData ) {
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
	    $query = $db->prepare("SELECT * FROM  `Orders` WHERE  `phone` =  ? ORDER BY timeCreated DESC");
	    $query->execute(array($requestData['To']));
        $text = new Text();
        if($query->rowCount()>=1){
            $result = $query->fetch(PDO::FETCH_ASSOC);
            $text->userID = $result['assignedTo'];
        } else { //google voice madness
        	$query = $db->prepare("SELECT * FROM  `Orders` WHERE  `routePhone` =  ? ORDER BY timeCreated DESC");
	    	$query->execute(array($requestData['To']));
	    	if($query->rowCount()>=1){
	            $result = $query->fetch(PDO::FETCH_ASSOC);
	            $text->userID = $result['assignedTo'];
	            $requestData['To'] = $result['phone'];
	        } 
        }
        $text->SmsMessageSid = $requestData['SmsSid'];
        $text->To = $requestData['To'];
        $text->From = $requestData['From'];
        $text->Body = $requestData['Body'];
        $text->received = 0;
        $text->save();
	}

}    
    ?>