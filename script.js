// The JavaScript file that handles client-side logic for:
// 1.Registers the Bias check box selected to display the relavant organisations
// 2.Refine the user's complaint text using AI  
// 3. Collect all the information needed to submit the complaint
// 4. After the user reviews the complaint, submit the complaint data to a Google Sheet
// 5. After submission, redirect the user to a confirmation page


document.addEventListener("DOMContentLoaded", function () {
    const biasCheckboxes = document.querySelectorAll('input[name="bias[]"]');
    const orgSelectionSection = document.getElementById('org-selection');
    const submitButton = document.querySelector('button[type="submit"]');
    const userComplaint = document.getElementById('user-complaint');
    const aiComplaint = document.getElementById('ai-complaint');

    // 1. Toggle organization visibility based on selected bias checkboxes
    if (biasCheckboxes && orgSelectionSection) {
        biasCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const anyBiasSelected = Array.from(biasCheckboxes).some(cb => cb.checked);
                orgSelectionSection.style.display = anyBiasSelected ? 'block' : 'none';
            });
        });
    }

    // 2. Handle "Next" click – send user complaint to OpenAI and populate AI suggestion
    if (submitButton && userComplaint && aiComplaint) {
        submitButton.addEventListener('click', function (event) {
            event.preventDefault();

            const complaintText = userComplaint.value.trim();
            if (!complaintText) {
                alert("Please enter a complaint before proceeding.");
                return;
            }

            fetch('process-complaint.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `complaint-description=${encodeURIComponent(complaintText)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.ai_complaint) {
                    aiComplaint.value = data.ai_complaint;
                } else {
                    alert("AI suggestion failed. Please try again later.");
                    console.error('AI response error:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching AI suggestion:', error);
                alert("There was an error communicating with the AI. Please try again.");
            });
        });
    }

    // 3. Final submission: capture chosen text + selected organizations
    const finalSubmitButton = document.getElementById('final-submit'); // Use this if you have a separate submit button on review-form.html
    if (finalSubmitButton) {
        finalSubmitButton.addEventListener('click', function (event) {
            event.preventDefault();

            const modifiedComplaint = aiComplaint?.value || userComplaint?.value || '';
            const orgCheckboxes = document.querySelectorAll('input[name="organizations[]"]:checked');
            const selectedOrganizations = Array.from(orgCheckboxes).map(cb => cb.value);

            if (!modifiedComplaint.trim()) {
                alert("Please review and select your complaint text.");
                return;
            }

            if (selectedOrganizations.length === 0) {
                alert("Please select at least one organization to submit to.");
                return;
            }

            // Submit to Google Sheets (or backend system)
            fetch('submit-to-google-sheets.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `complaint-text=${encodeURIComponent(modifiedComplaint)}&organizations=${encodeURIComponent(selectedOrganizations.join(', '))}`
            })
            .then(response => response.json())
            .then(data => {
                console.log("Submission successful:", data);
                // Store selected organizations in localStorage for confirmation page
                localStorage.setItem('submittedOrganizations', JSON.stringify(selectedOrganizations));
                // Redirect to confirmation page
                window.location.href = 'confirmation.html';
            })
            .catch(error => {
                console.error('Error submitting to Google Sheets:', error);
                alert("There was a problem submitting your complaint.");
            });
        });
    }

    // 4. On confirmation page, load submitted organizations
    const confirmationList = document.getElementById('confirmation-organizations');
    if (confirmationList) {
        const orgs = JSON.parse(localStorage.getItem('submittedOrganizations') || '[]');
        if (orgs.length > 0) {
            confirmationList.innerHTML = orgs.map(org => `<li>${org}</li>`).join('');
        } else {
            confirmationList.innerHTML = '<li>No organizations were recorded.</li>';
        }
    }
});
