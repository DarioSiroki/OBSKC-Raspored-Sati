<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
$myFile = "B.json";
$fh = fopen($myFile, 'w') or die("can't open file");
$stringData = $_POST["data"];
fwrite($fh, $stringData);
fclose($fh);
?>