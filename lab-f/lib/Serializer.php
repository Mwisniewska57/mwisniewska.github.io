<?php

namespace lib;

use lib\Encoder\CsvEncoder;
use lib\Encoder\JsonEncoder;
use lib\Encoder\YamlEncoder;

class Serializer
{
    private $encoders;

    public function __construct()
    {
        $this->encoders = array(
            new CsvEncoder(),
            new JsonEncoder(),
            new YamlEncoder(),
        );
    }

    public function convert($input, $inFormat, $outFormat)
    {
        $decoder = $this->findEncoder($inFormat);
        $encoder = $this->findEncoder($outFormat);

        if ($decoder instanceof CsvEncoder) {
            $decoder = $decoder->withFormat($inFormat);
        }
        if ($encoder instanceof CsvEncoder) {
            $encoder = $encoder->withFormat($outFormat);
        }

        $data = $decoder->decode($input);
        return $encoder->encode($data);
    }

    private function findEncoder($format)
    {
        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($format)) {
                return $encoder;
            }
        }

        throw new \InvalidArgumentException('Nieobsługiwany format: ' . $format);
    }
}