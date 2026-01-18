<?php

return [

    'paths' => [
        '*',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5178',
        'http://127.0.0.1:5178',
        'https://demo-go-ship.vercel.app',
    ],

    'allowed_origins_patterns' => [
        '/^https?:\/\/.*\.vercel\.app$/',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];
