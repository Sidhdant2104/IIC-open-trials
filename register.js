/* =========================================
   PREMIUM REGISTER PAGE LOGIC 
   ========================================= */

// Supabase Configuration 
// Assuming table name is "registrations" - change the URL if it's different!
const SUPABASE_URL = "https://xrgxzrgmurjxbhwpjkqk.supabase.co/rest/v1/registrations";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZ3h6cmdtdXJqeGJod3Bqa3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDM2NjAsImV4cCI6MjA5MDUxOTY2MH0.Q5STg_gmxLNEwYkU-xq12oCABJ2ps451CDM2ZsBOO9w";

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('registerForm');
  const btnSubmitMain = document.getElementById('btn-submit-main');
  const formError = document.getElementById('form-error');

  // Interactive Team Selectable Cards
  const teamCards = document.querySelectorAll('.team-selectable-card');
  const selectedTeams = new Set();

  teamCards.forEach(card => {
    card.addEventListener('click', () => {
      const teamName = card.getAttribute('data-team');

      if (selectedTeams.has(teamName)) {
        selectedTeams.delete(teamName);
        card.classList.remove('selected');
      } else {
        selectedTeams.add(teamName);
        card.classList.add('selected');
      }
    });
  });

  // Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (selectedTeams.size === 0) {
      formError.textContent = "Please select at least one team/domain.";
      formError.classList.remove('hidden');
      return;
    }

    const phoneVal = document.getElementById('phone').value.trim();
    if (!/^\d{10}$/.test(phoneVal)) {
      formError.textContent = "Please enter exactly 10 numeric digits for your phone number.";
      formError.classList.remove('hidden');
      return;
    }

    formError.classList.add('hidden');

    // UI state loading
    btnSubmitMain.disabled = true;
    btnSubmitMain.querySelector('.btn-text').textContent = "";
    btnSubmitMain.querySelector('.loader').classList.remove('hidden');

    const payload = {
      name: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      branch: document.getElementById('branch').value,
      year: document.getElementById('year').value,
      division: document.getElementById('division').value,
      dob: document.getElementById('dob').value,
      team: Array.from(selectedTeams).join(", ")
    };

    try {
      console.log("Sending payload to Webhook:", payload);

      const response = await fetch(SUPABASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error("Supabase insert failed:", await response.text());
        throw new Error("Database error");
      }

      console.log("Registration safely secured in Supabase.");

      document.getElementById('form-card').classList.add('hidden');
      document.getElementById('success-card').classList.remove('hidden');
    } catch (err) {
      console.error("Network Failure:", err);
      formError.textContent = "Something went wrong. Please try again later.";
      formError.classList.remove('hidden');
      btnSubmitMain.disabled = false;
      btnSubmitMain.querySelector('.btn-text').textContent = "Register for IIC Open Trials";
      btnSubmitMain.querySelector('.loader').classList.add('hidden');
    }
  });

});
