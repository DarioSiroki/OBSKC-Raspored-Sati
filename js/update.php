<?php
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");
?>

<?php
$myFile = "B.json";
$fh = fopen($myFile, 'w') or die("can't open file");
$stringData = $_POST["data"];
fwrite($fh, $stringData);
fclose($fh);
?>