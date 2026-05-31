<?php

namespace App\Encoder;

class JsonEncoder implements EncoderInterface
{
    public function supports($format)
    {
        return $format === 'JSON';
    }

    public function decode($data)
    {
        $decoded = json_decode(trim($data), true);

        if (!is_array($decoded)) {
            throw new \InvalidArgumentException('Nieprawidłowy format JSON.');
        }

        return $decoded;
    }

    public function encode($data)
    {
        return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}