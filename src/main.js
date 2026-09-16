// Gatekeeper & Auth State Handlers
const authGateModal = document.getElementById('authGateModal');
const mainWebsiteContent = document.getElementById('mainWebsiteContent');
const gateLoginTab = document.getElementById('gateLoginTab');
const gateRegisterTab = document.getElementById('gateRegisterTab');
const gateLoginForm = document.getElementById('gateLoginForm');
const gateRegisterForm = document.getElementById('gateRegisterForm');

// Navigation Auth Button reference
const openAuthBtn = document.getElementById('openAuthBtn');
const logoutBtn = document.getElementById('logoutBtn');

if (gateLoginTab && gateRegisterTab) {
  gateLoginTab.addEventListener('click', () => {
    gateLoginTab.classList.add('text-gold', 'border-b-2', 'border-gold');
    gateLoginTab.classList.remove('text-gray-400');
    gateRegisterTab.classList.remove('text-gold', 'border-b-2', 'border-gold');
    gateRegisterTab.classList.add('text-gray-400');
    if (gateLoginForm) gateLoginForm.classList.remove('hidden');
    if (gateRegisterForm) gateRegisterForm.classList.add('hidden');
  });

  gateRegisterTab.addEventListener('click', () => {
    gateRegisterTab.classList.add('text-gold', 'border-b-2', 'border-gold');
    gateRegisterTab.classList.remove('text-gray-400');
    gateLoginTab.classList.remove('text-gold', 'border-b-2', 'border-gold');
    gateLoginTab.classList.add('text-gray-400');
    if (gateRegisterForm) gateRegisterForm.classList.remove('hidden');
    if (gateLoginForm) gateLoginForm.classList.add('hidden');
  });
}

// Helper function to handle successful login/registration and save to localStorage
function handleSuccessfulAuth(nameOrEmail) {
  const derivedName = nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail;
  const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

  // Save session state to localStorage
  localStorage.setItem('hotelLoggedInUser', formattedName);
  applyUserAuthState(formattedName);
}

// Applies the user's name to the UI globally and reveals the logout button
function applyUserAuthState(userName) {
  if (openAuthBtn) {
    openAuthBtn.innerText = userName;
    openAuthBtn.classList.remove('text-gray-300');
    openAuthBtn.classList.add('text-gold', 'font-semibold');
    openAuthBtn.style.pointerEvents = 'none'; // Disables click if already logged in
  }

  // Reveal the Log Out button in the header
  if (logoutBtn) {
    logoutBtn.classList.remove('hidden');
  }

  if (authGateModal) authGateModal.classList.add('hidden');
  if (mainWebsiteContent) mainWebsiteContent.classList.remove('hidden');
}

// Check on page load if user was already logged in
window.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem('hotelLoggedInUser');
  if (savedUser) {
    applyUserAuthState(savedUser);
  }
});

if (gateLoginForm) {
  gateLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailVal = gateLoginForm.querySelector('input[type="email"]').value;
    handleSuccessfulAuth(emailVal);
  });
}

if (gateRegisterForm) {
  gateRegisterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameVal = gateRegisterForm.querySelector('input[type="text"]').value;
    handleSuccessfulAuth(nameVal);
  });
}

let currentBookingData = { nights: 0, total: 0, suiteName: '' };

// Helper to manage persistent reservations in localStorage
function getStoredReservations() {
  const data = localStorage.getItem('hotelReservations');
  return data ? JSON.parse(data) : [];
}

// Booking Calculator Logic
const calculateBtn = document.getElementById('calculateBtn');
if (calculateBtn) {
  calculateBtn.addEventListener('click', () => {
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
}

// Modal Elements & Handlers
const checkoutModal = document.getElementById('checkoutModal');
const proceedBtn = document.querySelector('#resultArea button');
const closeModalBtn = document.getElementById('closeModal');
const checkoutFormView = document.getElementById('checkoutFormView');
const successReceipt = document.getElementById('successReceipt');

if (proceedBtn) {
  proceedBtn.addEventListener('click', () => {
    document.getElementById('modalSuiteName').innerText = currentBookingData.suiteName;
    document.getElementById('modalNights').innerText = currentBookingData.nights;
    document.getElementById('modalTotalPrice').innerText = `$${currentBookingData.total.toLocaleString()}`;
    
    // Reset views
    checkoutFormView.classList.remove('hidden');
    successReceipt.classList.add('hidden');
    checkoutModal.classList.remove('hidden');
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    checkoutModal.classList.add('hidden');
  });
}

const paymentForm = document.getElementById('paymentForm');
if (paymentForm) {
  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const guestName = document.getElementById('guestName').value;
    const guestEmail = document.getElementById('guestEmail').value;
    const randomRef = 'TSL-' + Math.floor(100000 + Math.random() * 900000);

    // Create reservation object
    const newReservation = {
      ref: randomRef,
      name: guestName,
      email: guestEmail,
      suite: currentBookingData.suiteName,
      nights: currentBookingData.nights,
      total: currentBookingData.total,
      date: new Date().toLocaleDateString()
    };

    // Save to localStorage so it persists across reloads
    const reservations = getStoredReservations();
    reservations.push(newReservation);
    localStorage.setItem('hotelReservations', JSON.stringify(reservations));
    updateAdminReservationsUI();

    // Populate receipt and simulated email notification details
    document.getElementById('receiptName').innerText = guestName;
    document.getElementById('receiptEmailDisplay').innerText = guestEmail;
    document.getElementById('receiptRef').innerText = randomRef;
    document.getElementById('receiptSuite').innerText = currentBookingData.suiteName;
    document.getElementById('receiptAmount').innerText = `$${currentBookingData.total.toLocaleString()}`;

    // Switch modal view to receipt/email pass
    checkoutFormView.classList.add('hidden');
    successReceipt.classList.remove('hidden');
  });
}

const closeReceiptBtn = document.getElementById('closeReceiptBtn');
if (closeReceiptBtn) {
  closeReceiptBtn.addEventListener('click', () => {
    checkoutModal.classList.add('hidden');
    window.location.reload();
  });
}

// Auth Modal Interactivity (Secondary Header Modal)
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const tabLoginBtn = document.getElementById('tabLoginBtn');
const tabRegisterBtn = document.getElementById('tabRegisterBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (openAuthBtn) {
  openAuthBtn.addEventListener('click', () => {
    if (!localStorage.getItem('hotelLoggedInUser')) {
      authModal.classList.remove('hidden');
    }
  });
}

if (closeAuthModal) {
  closeAuthModal.addEventListener('click', () => {
    authModal.classList.add('hidden');
  });
}

if (tabLoginBtn && tabRegisterBtn) {
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
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailVal = loginForm.querySelector('input[type="email"]').value;
    const derivedName = emailVal.split('@')[0];
    const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
    
    localStorage.setItem('hotelLoggedInUser', formattedName);
    applyUserAuthState(formattedName);
    
    alert('Welcome back! You have successfully signed in to Toris Scents Luxe.');
    authModal.classList.add('hidden');
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameVal = registerForm.querySelector('input[type="text"]').value;
    const formattedName = nameVal.charAt(0).toUpperCase() + nameVal.slice(1);

    localStorage.setItem('hotelLoggedInUser', formattedName);
    applyUserAuthState(formattedName);
    
    alert('Account created successfully! Welcome to your elite member portal.');
    authModal.classList.add('hidden');
  });
}

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

if (closeMenuModal) {
  closeMenuModal.addEventListener('click', () => {
    diningMenuModal.classList.add('hidden');
  });
}

// Admin Dashboard Interactivity Trigger from Gate
const adminModal = document.getElementById('adminModal');
const openAdminFromGateBtn = document.getElementById('openAdminFromGateBtn');
const closeAdminModal = document.getElementById('closeAdminModal');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminLoginView = document.getElementById('adminLoginView');
const adminDashboardView = document.getElementById('adminDashboardView');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');

const tabSuitesBtn = document.getElementById('tabSuitesBtn');
const tabReservationsBtn = document.getElementById('tabReservationsBtn');
const adminSuitesPanel = document.getElementById('adminSuitesPanel');
const adminReservationsPanel = document.getElementById('adminReservationsPanel');

if (openAdminFromGateBtn) {
  openAdminFromGateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (adminModal) {
      adminModal.classList.remove('hidden');
    }
  });
}

if (closeAdminModal) {
  closeAdminModal.addEventListener('click', () => {
    adminModal.classList.add('hidden');
  });
}

if (adminLogoutBtn) {
  adminLogoutBtn.addEventListener('click', () => {
    adminLoginView.classList.remove('hidden');
    adminDashboardView.classList.add('hidden');
    document.getElementById('adminPasscode').value = '';
  });
}

if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const passcode = document.getElementById('adminPasscode').value;
    if (passcode === 'toris2026' || passcode === 'admin123') {
      adminLoginView.classList.add('hidden');
      adminDashboardView.classList.remove('hidden');
      updateAdminReservationsUI();
    } else {
      alert('Invalid management passcode. Please contact senior administration.');
    }
  });
}

if (tabSuitesBtn && tabReservationsBtn) {
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
    updateAdminReservationsUI();
  });
}

function updateAdminReservationsUI() {
  const container = document.getElementById('reservationsListContainer');
  if (!container) return;

  const reservations = getStoredReservations();

  if (reservations.length === 0) {
    container.innerHTML = `<p class="text-gray-400 italic">No bookings recorded yet. Test a reservation via the checkout widget!</p>`;
    return;
  }

  container.innerHTML = '';
  reservations.forEach(res => {
    container.innerHTML += `
      <div class="bg-neutral-950 border border-white/10 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <span class="text-gold font-mono font-bold">${res.ref}</span>
          <h5 class="text-white font-semibold mt-1">${res.name} <span class="text-gray-400 text-xs font-normal">(${res.email})</span></h5>
          <p class="text-gray-400 text-xs">Suite: <span class="text-white">${res.suite}</span> | Nights: <span class="text-white">${res.nights}</span></p>
        </div>
        <div class="text-left md:text-right">
          <span class="text-gold font-bold text-sm">$${res.total.toLocaleString()}</span>
          <p class="text-gray-500 text-[10px]">${res.date}</p>
        </div>
      </div>
    `;
  });
}

// Dynamic Suite Addition by Management
const addSuiteForm = document.getElementById('addSuiteForm');
if (addSuiteForm) {
  addSuiteForm.addEventListener('submit', (e) => {
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
    addSuiteForm.reset();
  });
}

// Interactive Gallery Lightbox Logic
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightbox = document.getElementById('closeLightbox');
const galleryImages = document.querySelectorAll('.gallery-img');

galleryImages.forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxCaption.innerText = img.alt || 'Toris Scents Luxe Property Experience';
    lightboxModal.classList.remove('hidden');
  });
});

if (closeLightbox) {
  closeLightbox.addEventListener('click', () => {
    lightboxModal.classList.add('hidden');
  });
}

if (lightboxModal) {
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.add('hidden');
    }
  });
}

// Logout Handler
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('hotelLoggedInUser');
    
    if (openAuthBtn) {
      openAuthBtn.innerText = 'Member Sign In';
      openAuthBtn.classList.remove('text-gold', 'font-semibold');
      openAuthBtn.classList.add('text-gray-300');
      openAuthBtn.style.pointerEvents = 'auto';
    }
    
    logoutBtn.classList.add('hidden');
    alert('You have successfully logged out of Toris Scents Luxe.');
    window.location.reload();
  });
}