<?php
	$con = mysql_connect("127.0.0.1", "php", "123456");
	if(!$con)
		die('Could not connect: '.mysql_error());
	mysql_query("SET NAMES 'utf8'");  //PHP UTF8
	mysql_select_db("tele_plan", $con);
	
	$content_type_args = explode(';', $_SERVER['CONTENT_TYPE']);
	if ($content_type_args[0] == 'application/json')
		$_POST = json_decode(file_get_contents('php://input'),true);
	
	$select = " plans.*, companies.*, net_price.*, tele_price.*, AVG(comments.star) AS Star ";
	$from = " plans NATURAL JOIN companies NATURAL JOIN net_price NATURAL JOIN tele_price ";
	$where = "";
	
	if( !( $_POST['companies'] || $_POST['identities'] || $_POST['nets'] || $_POST['teles'] ) ) $where = " null ";
	else{
		if( $_POST['companies'] ){
			$where = $where . $_POST['companies'];
			if( $_POST['identities'] || $_POST['nets'] || $_POST['teles'] ) $where = $where . " AND ";
		}
		if( $_POST['identities'] ){
			$where = $where . $_POST['identities'];
			if( $_POST['nets'] || $_POST['teles'] ) $where = $where . " AND ";
		}
		if( $_POST['nets'] ){
			$where = $where . $_POST['nets'];
			if( $_POST['teles'] ) $where = $where . " AND ";
		}
		if( $_POST['teles'] ){
			$where = $where . $_POST['teles'];
		}
	}

   	
   	if( $_POST['comments'] ) $query="SELECT comments.* FROM ".$from." NATURAL JOIN comments WHERE ".$where;
	else $query="SELECT ".$select." FROM ".$from." LEFT JOIN comments ON plans.PID = comments.PID WHERE ".$where." GROUP BY plans.PID ORDER BY plans.PID;";
	
	$result = mysql_query($query);
	
	$arr = array();
	if( mysql_num_rows($result) == 0) echo false ;
	else{
		while($obj = mysql_fetch_object($result)){
			$arr[] = $obj;
		}
		echo json_encode($arr); 
	}
	
	mysql_close($con);
	
?>