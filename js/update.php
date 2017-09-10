<?php
$myFile = "B.json";
$fh = fopen($myFile, 'w') or die("can't open file");
$stringData = $POST["data"];
fwrite($fh, $stringData);
fclose($fh);
?>