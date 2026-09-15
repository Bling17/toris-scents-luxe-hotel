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
const checkoutFormView = document.getElementById('checkoutFormView');
const successReceipt = document.getElementById('successReceipt');

proceedBtn.addEventListener('click', () => {
  document.getElementById('modalSuiteName').innerText = currentBookingData.suiteName;
  document.getElementById('modalNights').innerText = currentBookingData.nights;
  document.getElementById('modalTotalPrice').innerText = `$${currentBookingData.total.toLocaleString()}`;
  
  // Reset views
  checkoutFormView.classList.remove('hidden');
  successReceipt.classList.add('hidden');
  checkoutModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
  checkoutModal.classList.add('hidden');
});

document.getElementById('paymentForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const guestName = document.getElementById('guestName').value;
  const randomRef = 'TSL-' + Math.floor(100000 + Math.random() * 900000);

  // Populate receipt details
  document.getElementById('receiptName').innerText = guestName;
  document.getElementById('receiptRef').innerText = randomRef;
  document.getElementById('receiptSuite').innerText = currentBookingData.suiteName;
  document.getElementById('receiptAmount').innerText = `$${currentBookingData.total.toLocaleString()}`;

  // Switch modal view to receipt
  checkoutFormView.classList.add('hidden');
  successReceipt.classList.remove('hidden');
});

document.getElementById('closeReceiptBtn').addEventListener('click', () => {
  checkoutModal.classList.add('hidden');
  window.location.reload();
});

// Auth Modal Interactivity
const authModal = document.getElementById('authModal');
const openAuthBtn = document.getElementById('openAuthBtn');
const closeAuthModal = document.getElementById('closeAuthModal');
const tabLoginBtn = document.getElementById('tabLoginBtn');
const tabRegisterBtn = document.getElementById('tabRegisterBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

openAuthBtn.addEventListener('click', () => {
  authModal.classList.remove('hidden');
});

closeAuthModal.addEventListener('click', () => {
  authModal.classList.add('hidden');
});

tabLoginBtn.addEventListener('click', () => {
  tabLoginBtn.classList.add('text-gold', 'border-b-2', 'border-gold');
  tabLoginBtn.classList.remove('text-gray-400');
  tabRegisterBtn.classList.remove('text-gold', 'border-b-2', 'border-gold');
  tabRegisterBtn.classList.add('text-gray-400');
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
});

tabRegisterBtn.addEventListener('click', () => {
  tabRegisterBtn.classList.add('text-gold', 'border-b-2', 'border-gold');
  tabRegisterBtn.classList.remove('text-gray-400');
  tabLoginBtn.classList.remove('text-gold', 'border-b-2', 'border-gold');
  tabLoginBtn.classList.add('text-gray-400');
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Welcome back! You have successfully signed in to Toris Scents Luxe.');
  authModal.classList.add('hidden');
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Account created successfully! Welcome to your elite member portal.');
  authModal.classList.add('hidden');
});