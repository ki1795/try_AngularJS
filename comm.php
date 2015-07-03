<?php
	$con = mysql_connect("127.0.0.1", "php", "123456");
	if(!$con)
		die('Could not connect: '.mysql_error());
	mysql_query("SET NAMES 'utf8'");  //PHP UTF8
	mysql_select_db("tele_plan", $con);
	
	$content_type_args = explode(';', $_SERVER['CONTENT_TYPE']);
	if ($content_type_args[0] == 'application/json')
		$_POST = json_decode(file_get_contents('php://input'),true);
	
	$req = "INSERT INTO comments(PID, user_name, star, comment) VALUES ('".$_POST['pid']."', '".$_POST['name']."', '".$_POST['star']."', '".$_POST['comment']."')";
	$result = mysql_query($req);
	
	
	mysql_close($con);
?>