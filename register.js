/* =========================================
   PREMIUM REGISTER PAGE LOGIC 
   ========================================= */

// NOTE: Replace this with your Google Apps Script Web App URL
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyY6O54pbxQy7-4jTHLvFjUDuXODGiEOYEh1J8Vxn1tL5m5YyPkh1FKoeELB72cHYOR/exec";

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('standalone-register-form');
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
      // NOTE: Removed "missing URL" error override block as requested.
      // Fetch will automatically jump to catch block if WEBHOOK_URL is invalid/empty.

      console.log("Sending payload to Webhook:", payload);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log("Webhook Response:", result);

      if (result.success === true) {
        document.getElementById('form-card').classList.add('hidden');
        document.getElementById('success-card').classList.remove('hidden');

        // Just show success card continuously as requested
      } else {
        console.error("Webhook rejected submission:", result);
        throw new Error(result.message || "Failed to submit payload.");
      }
    } catch (err) {
      console.error("Webhook Error or Network Failure:", err);
      formError.textContent = "Submission failed. Ensure webhook URL is correctly pasted.";
      formError.classList.remove('hidden');
      btnSubmitMain.disabled = false;
      btnSubmitMain.querySelector('.btn-text').textContent = "Register for IIC Open Trials";
      btnSubmitMain.querySelector('.loader').classList.add('hidden');
    }
  });

});
