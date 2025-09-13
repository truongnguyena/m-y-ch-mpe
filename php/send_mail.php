<?php
// CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	exit(0);
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (!$data) {
	http_response_code(400);
	echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
	exit;
}

$to = getenv('MAIL_TO') ?: 'you@example.com';
$subject = '[kurumianimeshop] Contact from ' . ($data['name'] ?? 'unknown');
$body = "Email: " . ($data['email'] ?? '') . "\n" .
		"Subject: " . ($data['subject'] ?? '') . "\n\n" .
		($data['message'] ?? '');
$headers = 'From: no-reply@kurumianimeshop.local' . "\r\n" . 'Content-Type: text/plain; charset=utf-8';

$result = @mail($to, $subject, $body, $headers);
if (!$result) {
	// Fallback: write to log
	$log = __DIR__ . '/mail.log';
	file_put_contents($log, date('c') . ' ' . $subject . "\n" . $body . "\n---\n", FILE_APPEND);
}

echo json_encode(['ok' => $result ? true : false]);