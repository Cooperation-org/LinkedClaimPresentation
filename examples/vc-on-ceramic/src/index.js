import { ComposeClient } from '@composedb/client';
import { definition } from './trustclaims-with-vc-runtime-composite.js'; // Ensure this file is within the "src" directory

// Initialize ComposeClient
const compose = new ComposeClient({ ceramic: 'http://localhost:7007', definition });

// When the DOM is loaded, add event listeners or other initialization logic
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('claim_form'); // replace with your form's id

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Assuming your form inputs have names, you can collect the data like this
        const formData = new FormData(form);

        // Now you can use formData to interact with ComposeClient or do other tasks
        // Example:
        const claim = formData.get('claim');

        // Interact with the ComposeClient, etc.

        // For debugging:
        console.log('Data received:', Array.from(formData.entries()));
    });
});

