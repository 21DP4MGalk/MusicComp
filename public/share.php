<?php
include "./api/config.php";
include "./api/global.php";
$shareLink = $_SERVER["QUERY_STRING"];
$shareLink = substr($shareLink, 6);

if(verifyData($shareLink, 20)){
	http_response_code(400);
	exit();
}
$query = "SELECT isPublic, title, file FROM pieces WHERE link = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param("s", $shareLink);
$stmnt->execute();

$result = $stmnt->get_result();

if(!$result->num_rows){
	http_response_code(404);
	echo "Not found! Perhaps it is an old link.";
	exit();
}

$result = $result->fetch_object();
$isPublic = $result->isPublic;

if($connection->error){
	echo $connection->error;
	http_response_code(500);
	exit();
}

if(!$isPublic){
	echo "This work is no longer public!";
	http_response_code(403);
	exit();
}


$filename = $result->title.".musiccomp";

header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="'.$filename.'"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . strlen($result->file));
echo $result->file;
exit;
?>
