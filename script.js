document.addEventListener("DOMContentLoaded", function () {
    // Form 1: Complaint Form (bias selection and organization visibility)
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

    // Form 2: Submission and AI modification page
    const modifyComplaintText = document.getElementById('modify-complaint');
    const modifyComplaintTextInput = document.getElementById('user-complaint');
    const aiComplaintTextInput = document.getElementById('ai-complaint');
    const submitButton = document.querySelector('button[type="submit"]');

    // Simulated data (replace with dynamic data from backend)
    const userComplaint = '{{ user_complaint }}';  // Replace with user's complaint text from backend
    const aiSuggestedText = '{{ ai_complaint }}'; // Replace with AI-suggested complaint text from backend

    // Pre-fill user complaint and AI suggested text
    modifyComplaintTextInput.value = userComplaint;
    aiComplaintTextInput.value = aiSuggestedText;

    // Modify complaint text if user edits the textarea
    modifyComplaintText.value = userComplaint;

    submitButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission for now

        // Collect the selected organizations
        const selectedOrganizations = [];
        const orgCheckboxes = document.querySelectorAll('input[name="organizations[]"]:checked');
        
        orgCheckboxes.forEach(function(checkbox) {
            selectedOrganizations.push(checkbox.value);
        });

        // Get the final complaint text (modified by the user or AI suggestion)
        const finalComplaintText = modifyComplaintText.value;

        // Store the selected organizations and the final complaint text in sessionStorage
        sessionStorage.setItem('finalComplaintText', finalComplaintText);
        sessionStorage.setItem('selectedOrganizations', JSON.stringify(selectedOrganizations));

        // Redirect to the confirmation page
        window.location.href = 'confirmation.html'; // Redirect to the confirmation page
    });

    // Confirmation Page: Display selected organizations from sessionStorage
    if (window.location.href.includes('confirmation.html')) {
        const selectedOrganizations = JSON.parse(sessionStorage.getItem('selectedOrganizations'));

        const orgListElement = document.getElementById('organization-list');
        
        // Add organizations to the list on the confirmation page
        if (selectedOrganizations && selectedOrganizations.length > 0) {
            selectedOrganizations.forEach(function(org) {
                const listItem = document.createElement('li');
                listItem.textContent = org;
                orgListElement.appendChild(listItem);
            });
        } else {
            const noSelectionItem = document.createElement('li');
            noSelectionItem.textContent = 'No organizations selected.';
            orgListElement.appendChild(noSelectionItem);
        }

        // Optionally clear sessionStorage after displaying confirmation
        sessionStorage.removeItem('finalComplaintText');
        sessionStorage.removeItem('selectedOrganizations');
    }
});
