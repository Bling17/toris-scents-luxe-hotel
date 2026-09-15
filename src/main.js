document.getElementById('calculateBtn').addEventListener('click', () => {
  const checkinInput = document.getElementById('checkin').value;
  const checkoutInput = document.getElementById('checkout').value;
  const suitePricePerNight = parseInt(document.getElementById('suiteType').value);
  const resultArea = document.getElementById('resultArea');

  if (!checkinInput || !checkoutInput) {
    alert('Please select both check-in and check-out dates.');
    return;
  }

  const checkinDate = new Date(checkinInput);
  const checkoutDate = new Date(checkoutInput);
  const timeDifference = checkoutDate.getTime() - checkinDate.getTime();
  const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));

  if (nights <= 0) {
    alert('Check-out date must be after the check-in date.');
    resultArea.classList.add('hidden');
    return;
  }

  const grandTotal = nights * suitePricePerNight;

  // Display results
  document.getElementById('nightsCount').innerText = nights;
  document.getElementById('totalPrice').innerText = `$${grandTotal.toLocaleString()}`;
  resultArea.classList.remove('hidden');
});

let currentBookingData = { nights: 0, total: 0, suiteName: '' };

document.getElementById('calculateBtn').addEventListener('click', () => {
  const checkinInput = document.getElementById('checkin').value;
  const checkoutInput = document.getElementById('checkout').value;
  const suiteSelect = document.getElementById('suiteType');
  const suitePricePerNight = parseInt(suiteSelect.value);
  const suiteName = suiteSelect.options[suiteSelect.selectedIndex].text.split(' ($')[0];
  const resultArea = document.getElementById('resultArea');

  if (!checkinInput || !checkoutInput) {
    alert('Please select both check-in and check-out dates.');
    return;
  }

  const checkinDate = new Date(checkinInput);
  const checkoutDate = new Date(checkoutInput);
  const timeDifference = checkoutDate.getTime() - checkinDate.getTime();
  const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));

  if (nights <= 0) {
    alert('Check-out date must be after the check-in date.');
    resultArea.classList.add('hidden');
    return;
  }

  const grandTotal = nights * suitePricePerNight;

  // Save for modal
  currentBookingData = { nights, total: grandTotal, suiteName };

  // Display results
  document.getElementById('nightsCount').innerText = nights;
  document.getElementById('totalPrice').innerText = `$${grandTotal.toLocaleString()}`;
  resultArea.classList.remove('hidden');
});

// Modal Elements & Handlers
const checkoutModal = document.getElementById('checkoutModal');
const proceedBtn = document.querySelector('#resultArea button');
const closeModalBtn = document.getElementById('closeModal');

proceedBtn.addEventListener('click', () => {
  document.getElementById('modalSuiteName').innerText = currentBookingData.suiteName;
  document.getElementById('modalNights').innerText = currentBookingData.nights;
  document.getElementById('modalTotalPrice').innerText = `$${currentBookingData.total.toLocaleString()}`;
  checkoutModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
  checkoutModal.classList.add('hidden');
});

document.getElementById('paymentForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Thank you! Your payment has been processed successfully, and your reservation confirmation has been sent to your email.');
  checkoutModal.classList.add('hidden');
  window.location.reload();
});