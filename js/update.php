<?php
$myFile = "js/A.json";
$fh = fopen($myFile, 'w') or die("can't open file");
$stringData = $POST["data"];
fwrite($fh, $stringData);
fclose($fh);
?>