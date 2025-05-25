document.addEventListener("DOMContentLoaded", function () {
    const biasCheckboxes = document.querySelectorAll('input[name="bias[]"]');
    const orgSelectionSection = document.getElementById('org-selection');
    const submitBtn = document.getElementById('submit-btn');

    // Toggle organizations visibility based on selected biases
    biasCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            // Show organization selection if at least one bias is selected
            const anyBiasSelected = Array.from(biasCheckboxes).some(checkbox => checkbox.checked);
            orgSelectionSection.style.display = anyBiasSelected ? 'block' : '
