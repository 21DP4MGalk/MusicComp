<?php
function verifyData($str, $len, $optional = false){
	if(strlen($str) > $len || (strlen($str) == 0 || $optional)){
		return 1;
	}
	for($i = 0; $i < strlen($str); $i++){
		if(substr($str, $i, $i) == ";"){
			return 2;
		}
	}
}
?>
