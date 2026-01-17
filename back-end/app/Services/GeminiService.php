<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class GeminiService
{
    protected string $apiKey;
    protected string $base;
    protected string $model;

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY');
        $this->base   = env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta');
        $this->model  = env('GEMINI_MODEL', 'gemini-2.5-flash');

        if (empty($this->apiKey)) {
            throw new RuntimeException('GEMINI_API_KEY is not set.');
        }
    }

    /**
     * Gửi hội thoại đến Gemini API
     *
     * @param array $messages
     * [
     *   ['role' => 'user'|'assistant', 'content' => '...']
     * ]
     *
     * @return string
     */
    public function chat(array $messages): string
    {
        $url = "{$this->base}/models/{$this->model}:generateContent?key={$this->apiKey}";

        // Convert message format sang chuẩn Gemini
        $contents = array_map(function ($m) {
            return [
                'role' => $m['role'] === 'assistant' ? 'model' : 'user',
                'parts' => [
                    ['text' => (string) $m['content']]
                ]
            ];
        }, $messages);

        $body = [
            'contents' => $contents,
            'generationConfig' => [
                // Courier / nghiệp vụ → trả lời chắc, không lan man
                'temperature' => 0.3,
                'topP' => 0.9,
                'maxOutputTokens' => 800,
            ],
        ];

        try {
            $resp = Http::timeout(20)
                ->acceptJson()
                ->post($url, $body);
        } catch (\Throwable $e) {
            Log::error('Gemini HTTP Exception', [
                'message' => $e->getMessage(),
            ]);

            throw new RuntimeException('Không thể kết nối đến Gemini API.');
        }

        if (!$resp->successful()) {
            Log::error('Gemini API Error', [
                'status' => $resp->status(),
                'body'   => $resp->body(),
            ]);

            $errorMessage = $resp->json('error.message') ?? 'Unknown Gemini error';

            throw new RuntimeException("Gemini API error ({$resp->status()}): {$errorMessage}");
        }

        $json = $resp->json();

        // Lấy câu trả lời
        $candidate = $json['candidates'][0] ?? null;
        $reply = $candidate['content']['parts'][0]['text'] ?? null;

        // Safety / Empty fallback
        if (empty($reply)) {
            if (($candidate['finishReason'] ?? '') === 'SAFETY') {
                return 'Xin lỗi, nội dung này không thể trả lời do chính sách an toàn.';
            }

            return 'Xin lỗi, hệ thống AI hiện chưa thể phản hồi câu hỏi này.';
        }

        return trim($reply);
    }
}
