<?php

    // ensure proper usage
    if (!isset($_GET["path"]))
    {
        htt_response_code(400);
        exit;
    }

    $dir = $_GET["path"];
    $files = scandir($dir);


    // output paths as JSON
    header("Content-type: application/json");
    print(json_encode($files, JSON_PRETTY_PRINT));
?>