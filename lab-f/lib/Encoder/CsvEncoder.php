<?php

namespace Encoder;

class CsvEncoder implements EncoderInterface
{
    public function encode($data): string
    {
        $output = '';
        if (is_array($data) && !empty($data)) {
            if (isset($data[0]) && is_array($data[0])) {
                $output .= implode(',', array_keys($data[0])) . "\n";
                foreach ($data as $row) {
                    $output .= implode(',', array_values($row)) . "\n";
                }
            } else {
                foreach ($data as $key => $value) {
                    $output .= $key . ',' . $value . "\n";
                }
            }
        }
        return $output;
    }
}

class SsvEncoder implements EncoderInterface
{
    public function encode($data): string
    {
        $output = '';
        if (is_array($data) && !empty($data)) {
            if (isset($data[0]) && is_array($data[0])) {
                $output .= implode(' ', array_keys($data[0])) . "\n";
                foreach ($data as $row) {
                    $output .= implode(' ', array_values($row)) . "\n";
                }
            } else {
                foreach ($data as $key => $value) {
                    $output .= $key . ' ' . $value . "\n";
                }
            }
        }
        return $output;
    }
}

class TsvEncoder implements EncoderInterface
{
    public function encode($data): string
    {
        $output = '';
        if (is_array($data) && !empty($data)) {
            if (isset($data[0]) && is_array($data[0])) {
                $output .= implode("\t", array_keys($data[0])) . "\n";
                foreach ($data as $row) {
                    $output .= implode("\t", array_values($row)) . "\n";
                }
            } else {
                foreach ($data as $key => $value) {
                    $output .= $key . "\t" . $value . "\n";
                }
            }
        }
        return $output;
    }
}