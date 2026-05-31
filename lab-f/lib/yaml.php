<?php
// I:\ptw\lab-f\yaml.php

$data = [
    'name' => 'Martyna Wiśniewska',
    'index' => '57826',
    'date' => date(DATE_ATOM),
];

$yaml = yaml_emit($data);

echo $yaml;
