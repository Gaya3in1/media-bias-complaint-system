<?php
// submit-to-google-sheets.php

require_once 'vendor/autoload.php';  // Google Client Library

$client = new Google_Client();
$client->setApplicationName('Complaint System');
$client->setScopes(Google_Service_Sheets::SPREADSHEETS);
$client->setAuthConfig('credentials.json');  // OAuth credentials

$service = new Google_Service_Sheets($client);
$spreadsheetId = 'your-spreadsheet-id';
$range = 'Sheet1!A1:D1';  // Adjust as per your sheet structure

// Get data from the form
$complaintText = $_POST['complaint-text'];
$organizations = $_POST['organizations'];

// Prepare data to be written to the Google Sheet
$values = [
    [$_POST['user-name'], $_POST['user-email'], $complaintText, $organizations]
];

$body = new Google_Service_Sheets_ValueRange([
    'values' => $values
]);

$params = [
    'valueInputOption' => 'RAW'
];

// Insert data into the Google Sheet
$response = $service->spreadsheets_values->append($spreadsheetId, $range, $body, $params);

echo json_encode(['status' => 'success', 'message' => 'Complaint successfully submitted to Google Sheets']);
?>
