document.addEventListener("DOMContentLoaded", function () {

    // ----- Part 1: Bias Selection and Organization Visibility -----
    const biasCheckboxes = document.querySelectorAll('input[name="bias[]"]');
    const orgSelectionSection = document.getElementById('org-selection');
    const submitBtn = document.getElementById('submit-btn');

    // Toggle organizations visibility based on selected biases
    biasCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            // Show organization selection if at least one bias is selected
            const anyBiasSelected = Array.from(biasCheckboxes).some(checkbox => checkbox.checked);
            orgSelectionSection.style.display = anyBiasSelected ? 'block' : 'none';
        });
    });

    // ----- Part 2: Review Complaint and Modify -----
    const modifyComplaintText = document.getElementById('modify-complaint');
    const submitButton = document.querySelector('button[type="submit"]');

    // Simulated data (this would come from your backend/API)
    const userComplaint = '{{ user_complaint }}'; // Replace with the user's complaint text
    const aiSuggestedText = '{{ ai_complaint }}'; // Replace with the AI-suggested complaint text

    // Pre-fill user complaint and AI suggested text
    document.getElementById('user-complaint').value = userComplaint;
    document.getElementById('ai-complaint').value = aiSuggestedText;

    // Modify complaint text if user edits the textarea
    modifyComplaintText.value = userComplaint;

    // Submit button click handler
    submitButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission for now

        const selectedOrganizations = [];
        const orgCheckboxes = document.querySelectorAll('input[name="organizations[]"]:checked');
        
        // Collect selected organizations
        orgCheckboxes.forEach(function(checkbox) {
            selectedOrganizations.push(checkbox.value);
        });

        // Get the final complaint text (modified by the user or AI suggestion)
        const finalComplaintText = modifyComplaintText.value;

        // Simulate sending this data to the backend (or process the complaint)
        console.log({
            finalComplaintText: finalComplaintText,
            selectedOrganizations: selectedOrganizations
        });

        // Example: Show confirmation or handle the backend process
        alert("Your complaint has been submitted!");

        // Redirect user or handle submission here
        window.location.href = 'confirmation.html'; // Redirect to a confirmation page
    });

});
