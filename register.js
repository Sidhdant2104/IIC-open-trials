/* =========================================
   PREMIUM REGISTER PAGE LOGIC 
   ========================================= */

// NOTE: Replace this with your Google Apps Script Web App URL
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyk-lnkuRBGkyverGRCKzGBjr2jtGsb-kTQg37Y0TozaB0cNtoVgCfdZsy5fw3ILELk/exec";

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
      teams: Array.from(selectedTeams) // script expects array and uses .join(", ")
    };

    try {
      console.log("Sending payload to Webhook:", payload);

      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      console.log("Webhook request completed.");

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
