// The JavaScript file that handles client-side logic for:
// 1.Registers the Bias check box selected to display the relavant organisations
// 2.Refine the user's complaint text using AI  
// 3. Collect all the information needed to submit the complaint
// 4. After the user reviews the complaint, submit the complaint data to a Google Sheet
// 5. After submission, redirect the user to a confirmation page

sending data, and handling form submissions.

document.addEventListener("DOMContentLoaded", function () {
    const biasCheckboxes = document.querySelectorAll('input[name="bias[]"]');
    const orgSelectionSection = document.getElementById('org-selection');
    const submitButton = document.querySelector('button[type="submit"]');
    const userComplaint = document.getElementById('user-complaint');
    const aiComplaint = document.getElementById('ai-complaint');

    // Toggle organizations visibility based on selected biases
    biasCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            // Show organization selection if at least one bias is selected
            const anyBiasSelected = Array.from(biasCheckboxes).some(checkbox => checkbox.checked);
            orgSelectionSection.style.display = anyBiasSelected ? 'block' : 'none';
        });
    });

    // AI refinement logic
    submitButton.addEventListener('click', function (event) {
        event.preventDefault();

        // Send complaint to backend for AI refinement
        fetch('process-complaint.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `complaint-description=${encodeURIComponent(userComplaint.value)}`
        })
        .then(response => response.json())
        .then(data => {
            aiComplaint.value = data.ai_complaint;
        })
        .catch(error => {
            console.error('Error fetching AI suggestion:', error);
        });
    });

    // Handle form submission and data processing
    submitButton.addEventListener('click', function (event) {
        event.preventDefault();

        // Collect selected organizations
        const selectedOrganizations = [];
        const orgCheckboxes = document.querySelectorAll('input[name="organizations[]"]:checked');
        
        orgCheckboxes.forEach(function(checkbox) {
            selectedOrganizations.push(checkbox.value);
        });

        // Get the final complaint text (modified by the user or AI suggestion)
        const finalComplaintText = aiComplaint.value || userComplaint.value;

        // Simulate sending this data to the backend (or process the complaint)
        console.log({
            finalComplaintText: finalComplaintText,
            selectedOrganizations: selectedOrganizations
        });

        // Send complaint data to Google Sheets or another backend system
        fetch('submit-to-google-sheets.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `complaint-text=${encodeURIComponent(finalComplaintText)}&organizations=${encodeURIComponent(selectedOrganizations.join(', '))}`
        })
        .then(response => response.json())
        .then(data => {
            console.log("Complaint stored successfully", data);
            // Redirect to confirmation page after submission
            window.location.href = 'confirmation.html'; // Redirect to confirmation page
        })
        .catch(error => {
            console.error('Error submitting to Google Sheets:', error);
        });
    });
});
