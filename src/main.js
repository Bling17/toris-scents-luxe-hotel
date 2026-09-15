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