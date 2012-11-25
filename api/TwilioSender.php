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
    include_once('./Order.php');
    require('../Twilio/Services/Twilio.php');

    //include_once('./Route.php');
 
 	Class TwilioSender {
 		// Step 2: set our AccountSid and AuthToken from www.twilio.com/user/account
    private $AccountSid = "AC724438d929864945260401022f99d258";
    private $AuthToken = "90219b8db3133e60d363f5d6404911e5";
 
	
	public function processRequest ( ) {
		if($_REQUEST['_method']) {
			$method = $_REQUEST['_method'];
		}
		else {
			$method = $_SERVER['REQUEST_METHOD'];
		}
		$requestData = json_decode(stripslashes($_REQUEST['model']),true);

		// Display a confirmation message on the screen
		switch($method) {
			case 'POST': $this->badSendText($requestData);
				break;
			case 'GET': $this->sendText($requestData);
						break;
			case 'PUT': 
				break;
			case 'DELETE':
				break;
			default: echo(get_class($this).' BROKE IN PROCESSREQUEST');
				break;
		}
	}


	private function badSendText ( $requestData ) {
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
	    $query = $db->prepare("SELECT * FROM  `Orders` WHERE  `phone` =  ? ORDER BY timeCreated DESC");
   	    $query->execute(array($requestData['To']));
   		$order = new Order();
		$text = new Text();
		$client = new Services_Twilio($this->AccountSid, $this->AuthToken);
		$client->application->status_callback = "http://www.haveasweetidea.com/sweetorder/api/twiliostatus";
        if($query->rowCount()>=1){
            $result = $query->fetch(PDO::FETCH_ASSOC);
            $order->rawUpdate($result);
			$text->updateAttributes($requestData);
            $text->userID = $order->assignedTo;
            $text->From = "+19785284097";
            //$text->From = "+14242412825";
            $text->To = $order->phone;
            $text->received = 0;

			$options = array("StatusCallback" => "http://www.haveasweetidea.com/sweetorder/api/statuscallback"); 
		    if(strcmp(substr($order->routePhone,0,1),'+')==0) {
		    	//echo "route phone";
		    	$sms = $client->account->sms_messages->create($text->From,$order->routePhone,$text->Body,$options);
            } else {
            	//echo "do not route phone";
		    	$sms = $client->account->sms_messages->create($text->From,$text->To,$text->Body,$options);           	
            }
		    //$sms = $client->account->sms_messages->create($text->From,$text->To,$text->Body,$options);
	    	$text->SmsMessageSid = $sms->sid;
	    	$text->timestamp = date('Y-m-d H:m:s',mktime(date('H'), date('m'), date('s'), date('m'), date('d'), date('Y')));
	    	$text->toJSON();

        } else {
        	echo "NO ROUTE INFORMATION";
        }

        
	}

	private function sendText ( $requestData ) {
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
	    $query = $db->prepare("SELECT * FROM  `Orders` WHERE  `uid` =  ? ORDER BY timeCreated DESC");
	    $query->execute(array($requestData['orderID']));

   		$order = new Order();
		$text = new Text();
		$client = new Services_Twilio($this->AccountSid, $this->AuthToken);
		$client->application->status_callback = "http://www.haveasweetidea.com/sweetorder/api/twiliostatus";
        if($query->rowCount()>=1){
            $result = $query->fetch(PDO::FETCH_ASSOC);
            $order->rawUpdate($result);
			$text->updateAttributes($requestData);
            $text->userID = $order->assignedTo;
            $text->From = "+19785284097";
            $text->To = $order->phone;
            $text->received = 0;

			$options = array("StatusCallback" => "http://www.haveasweetidea.com/sweetorder/api/statuscallback"); 
		    if(isset($order->routePhone) && $order->routePhone != 0) {
		    	$sms = $client->account->sms_messages->create($text->From,$order->routePhone,$text->Body,$options);
            } else {
		    	$sms = $client->account->sms_messages->create($text->From,$text->To,$text->Body,$options);           	
            }
		    //$sms = $client->account->sms_messages->create($text->From,$text->To,$text->Body,$options);           	

	    	$text->SmsMessageSid = $sms->sid;
	    	$text->timestamp = date('Y-m-d H:m:s',mktime(date('H'), date('m'), date('s'), date('m'), date('d'), date('Y')));
	    	$text->toJSON();

        } else {
        	echo "NO ROUTE INFORMATION";
        }

        
	}


}

    ?>