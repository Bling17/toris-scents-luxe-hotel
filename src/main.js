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

// Dining Menu Modal Data & Handlers
const diningMenuModal = document.getElementById('diningMenuModal');
const closeMenuModal = document.getElementById('closeMenuModal');

const menuData = {
  restaurant: {
    subtitle: "L'Aurelia Haute Cuisine",
    title: "Tasting & À La Carte Menu",
    description: "Prepared by Executive Chef Jean-Luc. Dietary accommodations available upon request.",
    items: [
      { name: "Pan-Seared Hokkaido Scallops", desc: "Served with saffron cauliflower purée, crispy pancetta, and caviar oil.", price: "$65" },
      { name: "A5 Wagyu Beef Tenderloin", desc: "Truffle potato fondant, glazed baby root vegetables, and 25-year aged balsamic reduction.", price: "$145" },
      { name: "Wild Mushroom & Truffle Risotto", desc: "Carnaroli rice, shaved black winter truffle, aged Parmigiano-Reggiano.", price: "$75" },
      { name: "Valrhona Dark Chocolate Soufflé", desc: "Madagascar vanilla bean crème anglaise and gold leaf crunch.", price: "$35" }
    ]
  },
  bar: {
    subtitle: "The Obsidian Sky Bar",
    title: "Bespoke Cocktails & Rare Vintages",
    description: "Crafted by our master mixologists using premium spirits and house-infused botanicals.",
    items: [
      { name: "The Obsidian Gold Old Fashioned", desc: "Hibiki 21 Japanese Whisky, Okinawa black sugar, angostura bitters, 24k edible gold leaf.", price: "$48" },
      { name: "Midnight Smoked Negroni", desc: "Botanist Islay Gin, Carpano Antica Vermouth, Campari, smoked with rosemary wood.", price: "$32" },
      { name: "Dom Pérignon Vintage Champagne (Glass)", desc: "Crisp notes of white peach, brioche, and vibrant citrus zest.", price: "$95" },
      { name: "Artisanal Truffle & Artisanal Cheese Board", desc: "Selection of 4 imported raw-milk cheeses, honeycomb, fig jam, and toasted brioche.", price: "$55" }
    ]
  }
};

window.openMenuModal = function(type) {
  const data = menuData[type];
  document.getElementById('menuSubtitle').innerText = data.subtitle;
  document.getElementById('menuTitle').innerText = data.title;
  document.getElementById('menuDescription').innerText = data.description;
  
  const listContainer = document.getElementById('menuItemsList');
  listContainer.innerHTML = '';
  
  data.items.forEach(item => {
    listContainer.innerHTML += `
      <div class="flex justify-between items-start border-b border-white/10 pb-4">
        <div>
          <h4 class="text-white font-semibold text-sm mb-1">${item.name}</h4>
          <p class="text-gray-400 text-xs font-light">${item.desc}</p>
        </div>
        <span class="text-gold font-bold text-sm ml-4">${item.price}</span>
      </div>
    `;
  });

  diningMenuModal.classList.remove('hidden');
};

closeMenuModal.addEventListener('click', () => {
  diningMenuModal.classList.add('hidden');
});

// Admin Dashboard Interactivity
const adminModal = document.getElementById('adminModal');
const openAdminBtn = document.getElementById('openAdminBtn');
const closeAdminModal = document.getElementById('closeAdminModal');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminLoginView = document.getElementById('adminLoginView');
const adminDashboardView = document.getElementById('adminDashboardView');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');

const tabSuitesBtn = document.getElementById('tabSuitesBtn');
const tabReservationsBtn = document.getElementById('tabReservationsBtn');
const adminSuitesPanel = document.getElementById('adminSuitesPanel');
const adminReservationsPanel = document.getElementById('adminReservationsPanel');

openAdminBtn.addEventListener('click', () => {
  adminModal.classList.remove('hidden');
});

closeAdminModal.addEventListener('click', () => {
  adminModal.classList.add('hidden');
});

adminLogoutBtn.addEventListener('click', () => {
  adminLoginView.classList.remove('hidden');
  adminDashboardView.classList.add('hidden');
  document.getElementById('adminPasscode').value = '';
});

adminLoginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const passcode = document.getElementById('adminPasscode').value;
  // Simple management passcode for handover (can be changed anytime)
  if (passcode === 'toris2026' || passcode === 'admin123') {
    adminLoginView.classList.add('hidden');
    adminDashboardView.classList.remove('hidden');
  } else {
    alert('Invalid management passcode. Please contact senior administration.');
  }
});

tabSuitesBtn.addEventListener('click', () => {
  tabSuitesBtn.classList.add('text-gold', 'border-b-2', 'border-gold');
  tabSuitesBtn.classList.remove('text-gray-400');
  tabReservationsBtn.classList.remove('text-gold', 'border-b-2', 'border-gold');
  tabReservationsBtn.classList.add('text-gray-400');
  adminSuitesPanel.classList.remove('hidden');
  adminReservationsPanel.classList.add('hidden');
});

tabReservationsBtn.addEventListener('click', () => {
  tabReservationsBtn.classList.add('text-gold', 'border-b-2', 'border-gold');
  tabReservationsBtn.classList.remove('text-gray-400');
  tabSuitesBtn.classList.remove('text-gold', 'border-b-2', 'border-gold');
  tabSuitesBtn.classList.add('text-gray-400');
  adminReservationsPanel.classList.remove('hidden');
  adminSuitesPanel.classList.add('hidden');
});

// Dynamic Suite Addition by Management
document.getElementById('addSuiteForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('newSuiteTitle').value;
  const price = document.getElementById('newSuitePrice').value;
  const img = document.getElementById('newSuiteImg').value;
  const desc = document.getElementById('newSuiteDesc').value;

  const roomsGrid = document.querySelector('#rooms .grid');
  
  const newCard = document.createElement('div');
  newCard.className = "bg-neutral-900 border border-white/10 group overflow-hidden transition duration-300 hover:border-gold/50";
  newCard.innerHTML = `
    <div class="h-64 bg-cover bg-center group-hover:scale-105 transition duration-500" style="background-image: url('${img}');"></div>
    <div class="p-6">
      <div class="flex justify-between items-center mb-3">
        <span class="text-xs uppercase tracking-widest text-gold">New Listing</span>
        <span class="text-xs text-gray-400">Bespoke Guest Suite</span>
      </div>
      <h3 class="text-2xl font-bold mb-2 serif-font">${title}</h3>
      <p class="text-gray-400 text-sm mb-6 font-light">${desc}</p>
      <div class="flex justify-between items-center pt-4 border-t border-white/10">
        <div>
          <span class="text-gold font-bold text-xl serif-font">$${parseInt(price).toLocaleString()}</span>
          <span class="text-xs text-gray-400"> / night</span>
        </div>
        <a href="#book" class="bg-gold text-darkBg px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-white transition">Reserve Suite</a>
      </div>
    </div>
  `;

  roomsGrid.appendChild(newCard);
  alert(`Success! "${title}" has been added live to the hotel accommodations catalog.`);
  adminModal.classList.add('hidden');
  document.getElementById('addSuiteForm').reset();
});