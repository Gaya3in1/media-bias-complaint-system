<?php
// process-complaint.php
//This file will handle the backend logic for processing the complaint text, 
//uses open AI, selects model, handles errors and hides API key security.

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the complaint description from the POST request
    $complaintText = $_POST['complaint-description'] ?? '';

    if (empty($complaintText)) {
        http_response_code(400);
        echo json_encode(['error' => 'Complaint text is missing.']);
        exit;
    }

    // OpenAI API key (store this securely in environment variables in production)
    $apiKey = 'YOUR_OPENAI_API_KEY'; // <- Replace with your actual key

    // Choose model (adjust if needed)
    $model = 'gpt-4'; // or 'text-davinci-003'

    // Build the prompt
    $prompt = "Refine the following complaint about media bias. Be clear, concise, and maintain a respectful tone:\n\n" . $complaintText;

    // Prepare the payload
    $data = [
        'model' => $model,
        'prompt' => $prompt,
        'max_tokens' => 500,
        'temperature' => 0.7
    ];

    // Set headers
    $headers = [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey
    ];

    // Send request to OpenAI
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.openai.com/v1/completions');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    // Handle potential errors
    if ($response === false || $httpCode >= 400) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to connect to OpenAI: ' . $curlError]);
        exit;
    }

    // Decode response
    $responseData = json_decode($response, true);
    if (!isset($responseData['choices'][0]['text'])) {
        http_response_code(500);
        echo json_encode(['error' => 'Unexpected response from OpenAI.']);
        exit;
    }

    // Extract AI-refined complaint
    $aiComplaint = trim($responseData['choices'][0]['text']);

    // Send AI response to frontend
    header('Content-Type: application/json');
    echo json_encode(['ai_complaint' => $aiComplaint]);
}
