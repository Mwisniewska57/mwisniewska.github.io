<?php

namespace App\Encoder;

class YamlEncoder implements EncoderInterface
{
    public function supports($format)
    {
        return $format === 'YAML';
    }

    public function decode($data)
    {
        if (function_exists('yaml_parse')) {
            $decoded = yaml_parse($data);
            if (is_array($decoded)) {
                return $decoded;
            }
            throw new \InvalidArgumentException('Nieprawidłowy format YAML.');
        }

        return $this->parseSimpleYaml($data);
    }

    public function encode($data)
    {
        if (function_exists('yaml_emit')) {
            return yaml_emit($data, YAML_UTF8_ENCODING);
        }

        return $this->encodeSimpleYaml($data);
    }

    private function parseSimpleYaml($data)
    {
        $rows = array();
        $current = null;

        foreach (explode("\n", $data) as $line) {
            if (strpos(ltrim($line), '- ') === 0) {
                if ($current !== null) {
                    $rows[] = $current;
                }
                $current = array();
                $pair = substr(ltrim($line), 2);
                list($key, $value) = $this->splitKeyValue($pair);
                $current[$key] = $value;
            } elseif ($current !== null && strpos($line, ':') !== false) {
                list($key, $value) = $this->splitKeyValue(trim($line));
                $current[$key] = $value;
            }
        }

        if ($current !== null) {
            $rows[] = $current;
        }

        return $rows;
    }

    private function splitKeyValue($line)
    {
        $pos = strpos($line, ':');
        $key = trim(substr($line, 0, $pos));
        $value = trim(substr($line, $pos + 1));
        return array($key, $value);
    }

    private function encodeSimpleYaml($data)
    {
        $lines = array();

        foreach ($data as $row) {
            $first = true;
            foreach ($row as $key => $value) {
                $prefix = $first ? '- ' : '  ';
                $lines[] = $prefix . $key . ': ' . $value;
                $first = false;
            }
        }

        return implode("\n", $lines);
    }
}