<?php

class API {
/*parseURI - chunks up the URI so we can pick apart the pieces
processURIChunk - looks at the chunk of the URI and figures out what it is exactly.
			+xxxxxxxx = phone number
			xxxx = id
			ssss = string = command
			return the data type for the chunk

processRequest
	if $_REQUEST[_method]
		$method = $_method
		$requestData = $_REQUEST[model]
	else if $_REQUEST[method]
		$method = $_REQUEST[method]
		$requestData = $_REQUEST
	else
		fail

	$chunks = $this->parseURI()*/
public function processRequest ( ) {
	$method = $this->getRequestType();
	$requestData = $this->returnRequestData(isset($_REQUEST['_method']));

	switch($method){
		case 'GET': $this->processGET($requestData); break;
		case 'POST': $this->processPOST($requestData); break;
		case 'PUT':; $this->processPUT($requestData); break;
		case 'DELETE': $this->processDELETE($requestData); break;
		default: break;
	}
	echo $method;
	print_r($requestData);
}

private function getRequestType( ) {
	return isset($_REQUEST['_method'])?$_REQUEST['_method']:$_SERVER['REQUEST_METHOD'];
}

private function processGET ( $data ) {
	
}

private function processPOST ( $data ) {
	
}

private function processPUT ( $data ) {
	
}

private function processDELETE ( $data ) {
	
}

private function returnRequestData ( $legacy=false ) {
	if($legacy){
		return json_decode(stripslashes($_REQUEST['model']),true);
	}else {
		return isset($_REQUEST['model'])?json_decode($_REQUEST['model'],true):$_REQUEST;
	}
}

}








$requestDetails = explode('/',$_SERVER['REQUEST_URI']);
if(is_string($requestDetails[3]))
	$verb = $requestDetails[3];
$params = array();
for($i=4; $i < count($requestDetails);$i++) {
	array_push($params,$requestDetails[$i]);
}

$api = new API();
$api->processRequest($verb,$params);

?>