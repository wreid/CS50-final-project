<?php

    // ensure proper usage
    if (!isset($_GET["path"]))
    {
        htt_response_code(400);
        exit;
    }

    $dir = $_GET["path"];
    $files = scandir($dir);

    $paths = [];
    for ($i = 2, $j = count($files); $i < $j; $i++)
    {
        array_push($paths, $dir . "/" . $files[$i]); //. $file);
    }

    // output paths as JSON
    header("Content-type: application/json");
    print(json_encode($paths, JSON_PRETTY_PRINT));
?>