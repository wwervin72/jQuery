<?php
	$fileName = $_FILES['file']['name'];
	$type = $_FILES['file']['type'];
	$size = $_FILES['file']['size'];
	$fileAlias = $_FILES["file"]["tmp_name"];

	if($fileAlias){
		move_uploaded_file($_FILES["file"]["tmp_name"],
	    "uploadfile/" . $_FILES["file"]["name"]);
	}
	echo $fileName.'---'.$type.'---'.$size.'---'.$fileAlias;
?>