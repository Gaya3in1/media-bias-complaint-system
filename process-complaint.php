<?php
// process-complaint.php 
//This file will handle the backend logic for processing the complaint text, 
//likely involving AI refinement (via API) and possibly further handling.

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect the complaint text from the form submission
    $complaintText = $_POST['complaint-description'];
    
    // OpenAI API key (securely store this)
    $openaiApiKey = 'your-openai-api-key'; // NEVER expose this key in front-end JS
    
    // OpenAI API endpoint
    $url = 'https://api.openai.com/v1/completions';
    
    // Prepare OpenAI API request payload
    $data = [
        'model' => 'text-davinci-003',  // You can use GPT-4 or any suitable model
        'prompt' => "Refine this complaint text:\n$complaintText",
        'max_tokens' => 500,
        'temperature' => 0.7
    ];
    
    $options = [
        'http' => [
            'header'  => "Content-Type: application/json\r\n" .
                         "Authorization: Bearer $openaiApiKey\r\n",
            'method'  => 'POST',
            'content' => json_encode($data)
        ]
    ];
    
    $context  = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    if ($response === FALSE) {
        die('Error occurred while fetching AI response');
    }

    // Parse AI response
    $responseData = json_decode($response, true);
    $aiSuggestedText = $responseData['choices'][0]['text'];
    
    // Send the AI-suggested text back to the front-end
    echo json_encode(['ai_complaint' => $aiSuggestedText]);
}
?>
