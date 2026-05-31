<?php

spl_autoload_register(function ($class) {
    // Map \App\ namespace to lib/ directory
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/lib/';

    if (0 === strpos($class, $prefix)) {
        // Remove namespace prefix and convert to file path
        $relative = substr($class, strlen($prefix));
        $file = $baseDir . str_replace('\\', '/', $relative) . '.php';

        if (file_exists($file)) {
            require $file;
        }
    }

    // Map \Encoder\ namespace to lib/Encoder/ directory
    // All encoders are in CsvEncoder.php
    $prefix = 'Encoder\\';
    if (0 === strpos($class, $prefix)) {
        require $baseDir . 'Encoder/CsvEncoder.php';
        require $baseDir . 'Encoder/JsonEncoder.php';
        require $baseDir . 'Encoder/YamlEncoder.php';
        require $baseDir . 'Encoder/EncoderInterface.php';
        return;
    }
});