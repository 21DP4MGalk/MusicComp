<?php
function verifyData($str, $len){
	if(strlen($str) > $len){
		return 1;
	}
	for($i = 0; $i < strlen($str); $i++){
		if(substr($str, $i, $i) == ";"){
			return 2;
		}
	}
}
?>
