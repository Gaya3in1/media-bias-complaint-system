<?php
// process-complaint.php
// This file will handle the backend logic for processing the complaint text, 
// Verifies it's a POST request
// Handles missing data safely
// Uses secure environment for API key
// Uses Open AI and ChatGPT model 4 but falls back to a backup model if the primary one fails
//Returns clear error codes for debugging

header('Content-Type: application/json');

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Only POST requests are allowed.']);
    exit;
}

// Get the complaint text
$complaint_description = trim($_POST['complaint-description'] ?? '');

if (empty($complaint_description)) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Complaint text is missing.']);
    exit;
}

// Load from environment
$api_key       = getenv('OPENAI_API_KEY');
$model         = getenv('OPENAI_MODEL') ?: 'gpt-4';
$backup_model  = getenv('OPENAI_BACKUP_MODEL') ?: 'text-davinci-003';
$openai_url    = 'https://api.openai.com/v1/completions';

// === Functions === //

function generate_payload($model, $prompt) {
    return [
        'model' => $model,
        'prompt' => "Refine the following complaint about media bias. Be clear, concise, and maintain a respectful tone:\n\n" . $prompt,
        'max_tokens' => 500,
        'temperature' => 0.7,
    ];
}

function call_openai($api_key, $payload, $url) {
    $headers = [
        'Content-Type: application/json',
        'Authorization: ' . 'Bearer ' . $api_key,
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $response   = curl_exec($ch);
    $http_code  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);

    return [$response, $http_code, $curl_error];
}

// === Call OpenAI API === //
$payload = generate_payload($model, $complaint_description);
list($response, $http_code, $error) = call_openai($api_key, $payload, $openai_url);

// Try backup model if the first call fails
if ($http_code !== 200 && $backup_model) {
    $payload = generate_payload($backup_model, $complaint_description);
    list($response, $http_code, $error) = call_openai($api_key, $payload, $openai_url);
}

// === Handle Response === //
if ($http_code === 200) {
    $response_data = json_decode($response, true);
    if (!isset($response_data['choices'][0]['text'])) {
        http_response_code(500);
        echo json_encode(['error' => 'Unexpected response from OpenAI.']);
        exit;
    }

    $ai_complaint = trim($response_data['choices'][0]['text']);
    echo json_encode(['ai_complaint' => $ai_complaint]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to connect to OpenAI.', 'details' => $error]);
}
