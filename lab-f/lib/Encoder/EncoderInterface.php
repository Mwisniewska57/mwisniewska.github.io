<?php

namespace App\Encoder;

interface EncoderInterface
{
    public function supports($format);
    public function decode($data);
    public function encode($data);
}