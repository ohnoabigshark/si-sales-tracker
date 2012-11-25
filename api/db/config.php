<?php
$config['db_host'] = 'sweetidea.db.8450654.hostedresource.com';
$config['db_user'] = 'sweetidea';
$config['db_pass'] = 'J4CKsaysgetup!';
$config['db_name'] = 'sweetidea';

foreach ( $config as $k=>$v ) {
	define(strtoupper($k),$v);
}
?>