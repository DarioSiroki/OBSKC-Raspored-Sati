<?php
header('Access-Control-Allow-Origin: *'); 
?>

<?php
$myFile = "B.json";
$fh = fopen($myFile, 'w') or die("can't open file");
$stringData = $_POST["data"];
fwrite($fh, $stringData);
fclose($fh);
?>