document.addEventListener("DOMContentLoaded", () => {
  
  /* ==========================================
     NAVBAR & SCROLL EFFECTS
     ========================================== */
  const header = document.getElementById("main-header");
  const navMenu = document.getElementById("nav-menu");
  const menuToggleBtn = document.getElementById("menu-toggle-btn");
  const navLinks = document.querySelectorAll(".nav-link");
  const backToTopBtn = document.getElementById("btn-back-to-top");
  
  // Scrolled Header Style & Back to Top Visibility
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    if (window.scrollY > 300) {
      backToTopBtn.classList.add("active");
    } else {
      backToTopBtn.classList.remove("active");
    }
    
    // Scroll Spy (Highlight active link)
    let currentSection = "";
    const scrollPos = window.scrollY + 120; // Offset for navbar height
    
    document.querySelectorAll("section").forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id");
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  });

  // Mobile Menu Toggle
  menuToggleBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    const icon = menuToggleBtn.querySelector("i");
    if (navMenu.classList.contains("active")) {
      icon.className = "fa-solid fa-xmark";
    } else {
      icon.className = "fa-solid fa-bars";
    }
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      menuToggleBtn.querySelector("i").className = "fa-solid fa-bars";
    });
  });


  /* ==========================================
     MATERI TABS SYSTEM
     ========================================== */
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      
      btn.classList.add("active");
      document.getElementById(targetTab).classList.add("active");
    });
  });


  /* ==========================================
     INTERACTIVE SWITCH (MAP VS TIMELINE)
     ========================================== */
  const btnShowMap = document.getElementById("btn-show-map");
  const btnShowTimeline = document.getElementById("btn-show-timeline");
  const panelMap = document.getElementById("panel-map");
  const panelTimeline = document.getElementById("panel-timeline");
  
  btnShowMap.addEventListener("click", () => {
    btnShowMap.className = "btn btn-primary";
    btnShowTimeline.className = "btn btn-secondary";
    panelMap.classList.add("active");
    panelTimeline.classList.remove("active");
  });
  
  btnShowTimeline.addEventListener("click", () => {
    btnShowMap.className = "btn btn-secondary";
    btnShowTimeline.className = "btn btn-primary";
    panelMap.classList.remove("active");
    panelTimeline.classList.add("active");
  });


  /* ==========================================
     LEAFLETJS INTERACTIVE MAP
     ========================================== */
  // Locations data
  const locations = [
    {
      id: "jakarta",
      name: "Sekretariat ASEAN",
      city: "Jakarta, Indonesia",
      coords: [-6.2383, 106.8122],
      desc: "Kantor pusat koordinasi kerja sama regional antar 10 negara di Asia Tenggara. Berfungsi mengelola kerja sama politik, ekonomi, dan sosial-budaya di kawasan.",
      icon: "fa-handshake"
    },
    {
      id: "newyork",
      name: "Markas Besar PBB",
      city: "New York, Amerika Serikat",
      coords: [40.7489, -73.9680],
      desc: "Pusat pertemuan diplomasi multilateral terbesar di dunia. Tempat dideklarasikannya perjanjian internasional penting untuk keamanan global dan hak asasi manusia.",
      icon: "fa-globe"
    },
    {
      id: "brussels",
      name: "Pusat Komisi Uni Eropa",
      city: "Brussels, Belgia",
      coords: [50.8436, 4.3828],
      desc: "Jantung kerja sama supranasional terintegrasi di benua Eropa. Mengatur pasar tunggal, kebijakan moneter euro, dan kerja sama perbatasan terbuka bagi anggotanya.",
      icon: "fa-landmark"
    },
    {
      id: "singapore",
      name: "Sekretariat APEC",
      city: "Singapura",
      coords: [1.2986, 103.7820],
      desc: "Kantor pusat Kerja Sama Ekonomi Asia-Pasifik (APEC). Mendorong perdagangan bebas, investasi, dan integrasi ekonomi di lingkar samudera Pasifik.",
      icon: "fa-chart-line"
    },
    {
      id: "geneva",
      name: "Markas WTO & WHO",
      city: "Jenewa, Swiss",
      coords: [46.2238, 6.1462],
      desc: "Pusat pengaturan perdagangan global (WTO) dan koordinasi kesehatan masyarakat dunia (WHO). Hub vital bagi kesejahteraan global.",
      icon: "fa-circle-nodes"
    }
  ];

  // Initialize Map
  let map;
  const markersGroup = [];

  function initMap() {
    map = L.map("leaflet-map", {
      center: [20, 15],
      zoom: 2,
      minZoom: 1.5,
      maxZoom: 10
    });

    // Dark Map Style (CartoDB Positron Dark)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20
    }).addTo(map);

    // Sidebar items container
    const sidebarList = document.getElementById("map-sidebar-list");
    sidebarList.innerHTML = "";

    // Add markers and build sidebar
    locations.forEach((loc, index) => {
      // Create sidebar item
      const mapCard = document.createElement("div");
      mapCard.className = `map-card ${index === 0 ? "active" : ""}`;
      mapCard.id = `sidebar-card-${loc.id}`;
      mapCard.innerHTML = `
        <h4><i class="fa-solid ${loc.icon}"></i> ${loc.name}</h4>
        <p style="color:#fff; font-weight:600; margin-bottom: 3px;">${loc.city}</p>
        <p>${loc.desc.substring(0, 85)}...</p>
      `;
      
      mapCard.addEventListener("click", () => {
        focusOnLocation(loc, mapCard);
      });
      
      sidebarList.appendChild(mapCard);

      // Create Custom Marker Icon style via CSS class
      const customIcon = L.divIcon({
        className: "custom-map-marker",
        html: `<div style="background-color: var(--primary); border: 2.5px solid #fff; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 10px var(--primary);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      // Add Leaflet Marker
      const marker = L.marker(loc.coords, { icon: customIcon }).addTo(map);
      
      // Popup HTML content
      const popupContent = `
        <div style="padding: 5px;">
          <h4 style="margin: 0 0 5px; font-weight:700; color: #fff; font-size:1.05rem;"><i class="fa-solid ${loc.icon}" style="color:var(--primary); margin-right:6px;"></i>${loc.name}</h4>
          <p style="margin: 0 0 8px; color: var(--accent-gold); font-size: 0.8rem; font-weight: 600;">${loc.city}</p>
          <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.45;">${loc.desc}</p>
        </div>
      `;
      
      marker.bindPopup(popupContent, { maxWidth: 260 });
      
      // Handle marker click (sync with sidebar)
      marker.on("click", () => {
        document.querySelectorAll(".map-card").forEach(c => c.classList.remove("active"));
        document.getElementById(`sidebar-card-${loc.id}`).classList.add("active");
        map.setView(loc.coords, 5);
      });

      markersGroup.push({ id: loc.id, marker: marker, coords: loc.coords });
    });

    // Default focus to ASEAN Secretariat
    setTimeout(() => {
      if (locations.length > 0) {
        focusOnLocation(locations[0], document.getElementById(`sidebar-card-${locations[0].id}`), true);
      }
    }, 500);
  }

  function focusOnLocation(loc, cardElement, initialLoad = false) {
    document.querySelectorAll(".map-card").forEach(c => c.classList.remove("active"));
    cardElement.classList.add("active");
    
    // Zoom and pan map
    map.setView(loc.coords, 5);
    
    // Open corresponding marker popup
    const target = markersGroup.find(m => m.id === loc.id);
    if (target) {
      target.marker.openPopup();
    }

    // Scroll sidebar item into view smoothly if not initial load
    if (!initialLoad) {
      cardElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  // Initialize Map immediately
  initMap();


  /* ==========================================
     SIMULATED LOGIN MODAL & WORKFLOW
     ========================================== */
  const loginModalOverlay = document.getElementById("login-modal-overlay");
  const btnOpenLogin = document.getElementById("btn-open-login");
  const btnCloseLogin = document.getElementById("btn-close-login");
  const btnVerifyLogin = document.getElementById("btn-verify-login");
  const studentNameInput = document.getElementById("student-name");
  const studentDobInput = document.getElementById("student-dob");

  // Helper to format date to Indonesian format
  function formatIndonesianDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  }
  
  const modalStageForm = document.getElementById("modal-stage-form");
  const modalStageSuccess = document.getElementById("modal-stage-success");
  const successWelcomeMessage = document.getElementById("success-welcome-message");
  
  const btnGoQuiz = document.getElementById("btn-go-quiz");
  const btnModalBackHome = document.getElementById("btn-modal-back-home");
  const btnModalLogout = document.getElementById("btn-modal-logout");
  const zonaKuis = document.getElementById("zona-kuis");

  // Dropdown Selectors
  const userDropdown = document.getElementById("user-dropdown");
  const dropdownStudentName = document.getElementById("dropdown-student-name");
  const dropdownAvatarContainer = document.getElementById("dropdown-avatar-container");
  const dropdownBtnQuiz = document.getElementById("dropdown-btn-quiz");
  const dropdownBtnLogout = document.getElementById("dropdown-btn-logout");

  // Success Avatar Selector
  const successStudentAvatar = document.getElementById("success-student-avatar");

  // Avatar Selection Option Selectors
  const avatarOptions = document.querySelectorAll(".avatar-option");

  let isLoggedIn = false;
  let currentStudentName = "";

  // Bind Click Events for Avatar Select Options
  avatarOptions.forEach((option) => {
    option.addEventListener("click", () => {
      // Deactivate all options
      avatarOptions.forEach((opt) => opt.classList.remove("active"));
      // Activate clicked option
      option.classList.add("active");
      // Find the radio input inside and check it
      const radioInput = option.querySelector('input[type="radio"]');
      if (radioInput) {
        radioInput.checked = true;
      }
    });
  });

  // Open Modal / Toggle Dropdown
  btnOpenLogin.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isLoggedIn) {
      // Toggle dropdown menu if logged in
      userDropdown.classList.toggle("active");
    } else {
      modalStageForm.classList.add("active");
      modalStageSuccess.classList.remove("active");
      studentNameInput.value = "";
      if (studentDobInput) studentDobInput.value = "";
      
      // Reset avatar selection to male
      avatarOptions.forEach((opt) => opt.classList.remove("active"));
      const maleOpt = document.getElementById("avatar-option-male");
      const maleInput = document.getElementById("avatar-male-input");
      if (maleOpt) maleOpt.classList.add("active");
      if (maleInput) maleInput.checked = true;

      loginModalOverlay.classList.add("active");
      studentNameInput.focus();
    }
  });

  // Close Modal
  btnCloseLogin.addEventListener("click", () => {
    loginModalOverlay.classList.remove("active");
  });

  // Handle Verify Login (Simulated Loading)
  btnVerifyLogin.addEventListener("click", () => {
    const enteredName = studentNameInput.value.trim();
    const enteredDob = studentDobInput ? studentDobInput.value : "";

    if (!enteredName) {
      showToast("Silakan masukkan nama Anda terlebih dahulu.", "error");
      studentNameInput.focus();
      return;
    }

    if (!enteredDob) {
      showToast("Silakan masukkan tanggal lahir Anda terlebih dahulu.", "error");
      if (studentDobInput) studentDobInput.focus();
      return;
    }

    btnVerifyLogin.classList.add("loading");
    btnVerifyLogin.disabled = true;

    // Simulate 1.5 second loading verification
    setTimeout(() => {
      isLoggedIn = true;
      currentStudentName = enteredName;
      btnVerifyLogin.classList.remove("loading");
      btnVerifyLogin.disabled = false;

      // Get selected avatar image source
      const selectedAvatarRadio = document.querySelector('input[name="student-avatar"]:checked');
      const selectedAvatar = selectedAvatarRadio ? selectedAvatarRadio.value : "assets/avatar_male.svg";

      // Format Date of Birth
      const formattedDob = formatIndonesianDate(enteredDob);

      // Update welcome message
      successWelcomeMessage.innerHTML = `Selamat belajar, <strong>${currentStudentName}</strong>!<br><span style="font-size: 0.9rem; color: var(--text-muted); display: block; margin-top: 5px;"><i class="fa-solid fa-cake-candles" style="margin-right: 5px; color: var(--accent-gold);"></i>Lahir: ${formattedDob}</span>`;
      
      // Update Dropdown Details
      dropdownStudentName.innerText = currentStudentName;
      const dropdownStudentDob = document.getElementById("dropdown-student-dob");
      if (dropdownStudentDob) {
        dropdownStudentDob.innerHTML = `<i class="fa-solid fa-cake-candles" style="margin-right: 4px; font-size: 0.7rem;"></i> ${formattedDob}`;
      }

      if (dropdownAvatarContainer) {
        dropdownAvatarContainer.innerHTML = `<img src="${selectedAvatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" alt="Avatar">`;
      }

      // Update Success Modal Avatar
      if (successStudentAvatar) {
        successStudentAvatar.src = selectedAvatar;
      }

      // Update UI Header Login Button
      btnOpenLogin.innerHTML = `<img src="${selectedAvatar}" class="navbar-avatar" alt="Avatar"> <span class="login-text">Hi, ${currentStudentName.split(" ")[0]}</span>`;
      btnOpenLogin.className = "btn btn-secondary btn-login logged-in";

      // Transition modal stage
      modalStageForm.classList.remove("active");
      modalStageSuccess.classList.add("active");

      // Unlock quiz zone
      zonaKuis.classList.add("unlocked");
      initQuiz(); // Initialize quiz questions

      // Show toast welcome message
      showToast(`Login sukses! Selamat datang, ${currentStudentName.split(" ")[0]}.`, "success");
    }, 1500);
  });

  // Modal Back Home button
  btnModalBackHome.addEventListener("click", () => {
    loginModalOverlay.classList.remove("active");
  });

  // Go to Quiz button (inside modal)
  btnGoQuiz.addEventListener("click", () => {
    loginModalOverlay.classList.remove("active");
    zonaKuis.scrollIntoView({ behavior: "smooth" });
  });

  // Close modal when clicking outside card
  loginModalOverlay.addEventListener("click", (e) => {
    if (e.target === loginModalOverlay) {
      loginModalOverlay.classList.remove("active");
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (isLoggedIn && !userDropdown.contains(e.target) && e.target !== btnOpenLogin) {
      userDropdown.classList.remove("active");
    }
  });

  // Dropdown item Quiz click
  dropdownBtnQuiz.addEventListener("click", () => {
    userDropdown.classList.remove("active");
  });

  // Handle Logout Action
  function handleLogout() {
    isLoggedIn = false;
    currentStudentName = "";

    // Close overlays
    loginModalOverlay.classList.remove("active");
    userDropdown.classList.remove("active");

    // Revert UI Login Button
    btnOpenLogin.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> <span class="login-text">Login Siswa</span>`;
    btnOpenLogin.className = "btn btn-secondary btn-login";

    // Reset inputs
    studentNameInput.value = "";
    if (studentDobInput) studentDobInput.value = "";

    // Reset dropdown DOB display
    const dropdownStudentDob = document.getElementById("dropdown-student-dob");
    if (dropdownStudentDob) {
      dropdownStudentDob.innerHTML = `<i class="fa-solid fa-cake-candles" style="margin-right: 4px; font-size: 0.7rem;"></i> Tanggal Lahir`;
    }

    // Reset dropdown avatar
    if (dropdownAvatarContainer) {
      dropdownAvatarContainer.innerHTML = `<i class="fa-solid fa-user"></i>`;
    }

    // Lock Quiz Zone
    zonaKuis.classList.remove("unlocked");

    // Scroll to Home if user is viewing quiz section
    const rect = zonaKuis.getBoundingClientRect();
    const isInQuizView = rect.top < window.innerHeight && rect.bottom >= 0;
    if (isInQuizView) {
      document.getElementById("beranda").scrollIntoView({ behavior: "smooth" });
    }

    // Show toast success
    showToast("Logout berhasil. Sampai jumpa kembali!", "info");
  }

  // Logout Buttons Event Listeners
  dropdownBtnLogout.addEventListener("click", handleLogout);
  btnModalLogout.addEventListener("click", handleLogout);

  /* ==========================================
     TOAST NOTIFICATION SYSTEM
     ========================================== */
  function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let icon = "fa-circle-check";
    if (type === "error") icon = "fa-circle-exclamation";
    else if (type === "info") icon = "fa-circle-info";

    toast.innerHTML = `
      <div class="toast-icon"><i class="fa-solid ${icon}"></i></div>
      <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    // Fade and slide in
    setTimeout(() => {
      toast.classList.add("active");
    }, 10);

    // Auto dismiss after 3.5s
    setTimeout(() => {
      toast.classList.remove("active");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  }

  /* ==========================================
     INTERACTIVE QUIZ LOGIC
     ========================================== */
  const quizQuestions = [
    {
      q: "Apa tujuan utama pendirian regional ASEAN di kawasan Asia Tenggara?",
      options: [
        "A. Melakukan invasi pertahanan militer bersama",
        "B. Menciptakan stabilitas keamanan dan pertumbuhan ekonomi kawasan",
        "C. Menjajah wilayah terluar di Kepulauan Pasifik",
        "D. Menyaingi aliansi militer besar dunia"
      ],
      correctIndex: 1 // Option B
    },
    {
      q: "Kerja sama diplomatik yang diselenggarakan oleh dua negara saja secara terikat disebut kerja sama...",
      options: [
        "A. Multilateral",
        "B. Regional",
        "C. Bilateral",
        "D. Antarbenua"
      ],
      correctIndex: 2 // Option C
    },
    {
      q: "Manakah di bawah ini yang merupakan contoh kerja sama tingkat multilateral?",
      options: [
        "A. Kemitraan strategis impor minyak Indonesia - Arab Saudi",
        "B. Keanggotaan dan keaktifan Indonesia di Perserikatan Bangsa-Bangsa (PBB)",
        "C. Perjanjian tapal batas maritim Selat Malaka",
        "D. Pembangunan infrastruktur jalan tol dalam negeri"
      ],
      correctIndex: 1 // Option B
    },
    {
      q: "Forum utama kerja sama ekonomi internasional yang beranggotakan 20 kekuatan ekonomi utama dunia disebut...",
      options: [
        "A. G20",
        "B. IMF",
        "C. WHO",
        "D. APEC"
      ],
      correctIndex: 0 // Option A
    },
    {
      q: "Statistik data pembangunan dan kerja sama ekonomi daerah di Bandung secara sah dikutip dari lembaga resmi...",
      options: [
        "A. Badan Meteorologi Klimatologi Geofisika (BMKG)",
        "B. Badan Pusat Statistik (BPS) Kota Bandung",
        "C. Pikiran Rakyat Digital Media",
        "D. Google Earth Pro Satellite"
      ],
      correctIndex: 1 // Option B
    }
  ];

  let currentQuestionIndex = 0;
  let quizScore = 0;
  let isAnswered = false;

  const quizQuestionText = document.getElementById("quiz-question-text");
  const quizOptionsContainer = document.getElementById("quiz-options-container");
  const btnNextQuestion = document.getElementById("btn-next-question");
  const quizProgressFill = document.getElementById("quiz-progress-fill");
  const quizBox = document.getElementById("quiz-box");
  const quizResultBox = document.getElementById("quiz-result-box");
  const quizScoreVal = document.getElementById("quiz-score-val");
  const quizResultDesc = document.getElementById("quiz-result-desc");
  const btnRestartQuiz = document.getElementById("btn-restart-quiz");

  // Reward Selectors
  const btnClaimReward = document.getElementById("btn-claim-reward");
  const rewardModalOverlay = document.getElementById("reward-modal-overlay");
  const btnCloseReward = document.getElementById("btn-close-reward");
  const btnRewardBackHome = document.getElementById("btn-reward-back-home");
  const boardingPassCard = document.getElementById("boarding-pass-card");
  
  const rewardStageSelection = document.getElementById("reward-stage-selection");
  const rewardStageTicket = document.getElementById("reward-stage-ticket");
  const btnChangeRegion = document.getElementById("btn-change-region");

  // Data Tiket Penerbangan Hadiah Kuis (Wikimedia Commons)
  const flightTicketsData = [
    {
      country: "Jepang",
      flag: "🇯🇵",
      city: "Tokyo",
      code: "NRT",
      flightNo: "EN-101",
      gate: "G-12",
      imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/080103_Mt_Fuji_from_Shin-Fuji_Station.jpg/640px-080103_Mt_Fuji_from_Shin-Fuji_Station.jpg"
    },
    {
      country: "Korea",
      flag: "🇰🇷",
      city: "Seoul",
      code: "ICN",
      flightNo: "EN-202",
      gate: "F-08",
      imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gyeongbokgung_palace_Gwanghwamun_gate_seoul_korea.jpg/640px-Gyeongbokgung_palace_Gwanghwamun_gate_seoul_korea.jpg"
    },
    {
      country: "Inggris",
      flag: "🇬🇧",
      city: "London",
      code: "LHR",
      flightNo: "EN-303",
      gate: "A-15",
      imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Palace_of_Westminster_House_of_Commons_London_Feb_2007.jpg/640px-Palace_of_Westminster_House_of_Commons_London_Feb_2007.jpg"
    },
    {
      country: "Arab Saudi",
      flag: "🇸🇦",
      city: "Makkah",
      code: "JED",
      flightNo: "EN-404",
      gate: "C-09",
      imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Kaaba_during_Hajj%2C_2008.jpg/640px-Kaaba_during_Hajj%2C_2008.jpg"
    },
    {
      country: "Spanyol",
      flag: "🇪🇸",
      city: "Barcelona",
      code: "BCN",
      flightNo: "EN-505",
      gate: "B-21",
      imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Sagrada_Familia_01.jpg/640px-Sagrada_Familia_01.jpg"
    },
    {
      country: "Kamboja",
      flag: "🇰🇭",
      city: "Siem Reap",
      code: "REP",
      flightNo: "EN-606",
      gate: "D-03",
      imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Angkor_Wat_aerial_view.jpg/640px-Angkor_Wat_aerial_view.jpg"
    }
  ];

  let activeTicket = null;

  function generateRandomTicket() {
    const randomIndex = Math.floor(Math.random() * flightTicketsData.length);
    if (activeTicket && flightTicketsData.length > 1) {
      let nextIndex = randomIndex;
      while (nextIndex === flightTicketsData.indexOf(activeTicket)) {
        nextIndex = Math.floor(Math.random() * flightTicketsData.length);
      }
      activeTicket = flightTicketsData[nextIndex];
    } else {
      activeTicket = flightTicketsData[randomIndex];
    }
    return activeTicket;
  }

  function renderFlightTicket(ticket) {
    if (!boardingPassCard) return;

    // Acak data seat eksekutif
    const seats = ["02A", "05B", "08D", "09F", "11K", "14A", "18C"];
    const randomSeat = seats[Math.floor(Math.random() * seats.length)];
    
    // Format tanggal hari ini
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const todayStr = new Date().toLocaleDateString('id-ID', options);

    const passengerName = currentStudentName || "Siswa Teladan";

    const barcodeLines = Array.from({ length: 35 }, () => {
      const widths = [1, 2, 3, 4];
      const randomWidth = widths[Math.floor(Math.random() * widths.length)];
      return `<div class="barcode-line" style="width: ${randomWidth}px;"></div>`;
    }).join("");

    boardingPassCard.innerHTML = `
      <div class="boarding-pass">
        <!-- Image Background Mask Overlay -->
        <div class="ticket-bg-overlay" style="background-image: url('${ticket.imgUrl}');"></div>
        
        <!-- Main Boarding Pass Portion (Left - 70%) -->
        <div class="ticket-main">
          <div class="ticket-header-row">
            <div class="ticket-brand"><i class="fa-solid fa-earth-asia"></i> <span>Edu</span>Negara Airlines</div>
            <div class="ticket-class-badge">Executive Class</div>
          </div>
          
          <div class="ticket-route-row">
            <div class="route-airport">
              <span class="route-code">CGK</span>
              <span class="route-city">Jakarta (CGK)</span>
            </div>
            <div class="route-plane-icon">
              <i class="fa-solid fa-plane"></i>
            </div>
            <div class="route-airport right-align">
              <span class="route-code">${ticket.code}</span>
              <span class="route-city">${ticket.city} (${ticket.code})</span>
            </div>
          </div>
          
          <div class="ticket-details-grid">
            <div class="ticket-info-item">
              <span class="ticket-info-label">Passenger Name</span>
              <span class="ticket-info-value" title="${passengerName}">${passengerName}</span>
            </div>
            <div class="ticket-info-item">
              <span class="ticket-info-label">Flight No</span>
              <span class="ticket-info-value gold">${ticket.flightNo}</span>
            </div>
            <div class="ticket-info-item">
              <span class="ticket-info-label">Gate</span>
              <span class="ticket-info-value gold">${ticket.gate}</span>
            </div>
            <div class="ticket-info-item">
              <span class="ticket-info-label">Seat</span>
              <span class="ticket-info-value gold">${randomSeat}</span>
            </div>
          </div>
          
          <div class="ticket-barcode-section">
            <div>
              <div class="barcode-graphic">
                ${barcodeLines}
              </div>
              <div class="barcode-number">EDN${Math.floor(100000 + Math.random() * 900000)}</div>
            </div>
            <div class="ticket-qr">
              <i class="fa-solid fa-qrcode"></i>
            </div>
          </div>
        </div>
        
        <!-- Passenger Stub Portion (Right - 30%) -->
        <div class="ticket-stub">
          <div>
            <div class="stub-header">Passenger Stub</div>
            <div class="stub-route">
              <span class="stub-airport-code">CGK</span>
              <span class="stub-arrow"><i class="fa-solid fa-arrow-right"></i></span>
              <span class="stub-airport-code">${ticket.code}</span>
            </div>
            
            <div class="ticket-details-grid">
              <div class="ticket-info-item" style="grid-column: span 2;">
                <span class="ticket-info-label">Passenger</span>
                <span class="ticket-info-value">${passengerName.split(" ")[0]}</span>
              </div>
              <div class="ticket-info-item">
                <span class="ticket-info-label">Seat</span>
                <span class="ticket-info-value gold">${randomSeat}</span>
              </div>
              <div class="ticket-info-item">
                <span class="ticket-info-label">Gate</span>
                <span class="ticket-info-value gold">${ticket.gate}</span>
              </div>
            </div>
          </div>
          
          <div style="border-top: 1px dashed rgba(255, 255, 255, 0.08); padding-top: 0.5rem; text-align: left;">
            <div class="ticket-info-item">
              <span class="ticket-info-label">Destination</span>
              <span class="ticket-info-value" style="color: var(--accent-gold); font-weight: 800;">${ticket.country} ${ticket.flag}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  window.selectFlightCountry = function(countryName) {
    const ticket = flightTicketsData.find(t => t.country === countryName);
    if (!ticket) return;
    
    activeTicket = ticket; // Set active ticket reference
    renderFlightTicket(ticket);
    
    // Switch stages inside modal
    if (rewardStageSelection && rewardStageTicket) {
      rewardStageSelection.classList.remove("active");
      rewardStageSelection.style.display = "none";
      
      rewardStageTicket.style.display = "block";
      setTimeout(() => {
        rewardStageTicket.classList.add("active");
      }, 50);
    }
    
    showToast(`Tiket Kelas Eksekutif ke ${ticket.country} ${ticket.flag} Terbit! ✈️🎟️`, "success");
  };

  function initQuiz() {
    currentQuestionIndex = 0;
    quizScore = 0;
    quizBox.style.display = "block";
    quizResultBox.style.display = "none";
    btnNextQuestion.style.display = "none";
    if (btnClaimReward) {
      btnClaimReward.style.display = "none";
    }
    loadQuestion();
  }

  function loadQuestion() {
    isAnswered = false;
    btnNextQuestion.style.display = "none";
    
    // Update Progress Bar
    const percent = (currentQuestionIndex / quizQuestions.length) * 100;
    quizProgressFill.style.width = `${percent}%`;
    
    const qData = quizQuestions[currentQuestionIndex];
    quizQuestionText.innerHTML = `<span style="color:var(--primary); font-weight:700;">Pertanyaan ${currentQuestionIndex + 1} dari ${quizQuestions.length}:</span><br>${qData.q}`;
    
    // Render options
    quizOptionsContainer.innerHTML = "";
    qData.options.forEach((opt, idx) => {
      const button = document.createElement("button");
      button.className = "quiz-opt";
      button.innerText = opt;
      button.addEventListener("click", () => handleAnswerSelect(idx, button));
      quizOptionsContainer.appendChild(button);
    });
  }

  function handleAnswerSelect(selectedIndex, buttonElement) {
    if (isAnswered) return; // Prevent multiple clicks
    isAnswered = true;

    const qData = quizQuestions[currentQuestionIndex];
    const optionButtons = quizOptionsContainer.querySelectorAll(".quiz-opt");

    if (selectedIndex === qData.correctIndex) {
      // Correct Answer
      buttonElement.classList.add("correct");
      quizScore += 20; // 20 points per correct answer (total 100)
    } else {
      // Incorrect Answer
      buttonElement.classList.add("incorrect");
      // Highlight correct answer in green
      optionButtons[qData.correctIndex].classList.add("correct");
    }

    // Disable all options
    optionButtons.forEach(btn => btn.style.cursor = "default");

    // Show Next or Submit button
    btnNextQuestion.style.display = "inline-flex";
    if (currentQuestionIndex === quizQuestions.length - 1) {
      btnNextQuestion.innerHTML = `Selesaikan Kuis & Lihat Hasil <i class="fa-solid fa-circle-check" style="margin-left:5px;"></i>`;
    } else {
      btnNextQuestion.innerHTML = `Pertanyaan Berikutnya <i class="fa-solid fa-arrow-right" style="margin-left:5px;"></i>`;
    }
  }

  btnNextQuestion.addEventListener("click", () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      currentQuestionIndex++;
      loadQuestion();
    } else {
      // Show Results
      quizProgressFill.style.width = "100%";
      quizBox.style.display = "none";
      btnNextQuestion.style.display = "none";
      quizResultBox.style.display = "block";
      
      // Update score display
      quizScoreVal.innerText = `${quizScore}/100`;
      
      // Custom message based on score
      if (quizScore === 100) {
        quizResultDesc.innerHTML = `Luar biasa, <strong>${currentStudentName}</strong>! Semua jawaban Anda benar. Anda memahami materi Kerja Sama Antar Negara dengan sempurna.`;
      } else if (quizScore >= 60) {
        quizResultDesc.innerHTML = `Kerja bagus, <strong>${currentStudentName}</strong>! Pemahaman Anda tentang materi Kerja Sama Antar Negara sudah cukup baik.`;
      } else {
        quizResultDesc.innerHTML = `Jangan berkecil hati, <strong>${currentStudentName}</strong>. Pelajari kembali materi di atas dan coba lagi kuis ini!`;
      }

      // Evaluasi apakah mendapat hadiah (skor 100 atau 80)
      if (quizScore === 100 || quizScore === 80) {
        if (btnClaimReward) {
          btnClaimReward.style.display = "inline-flex";
        }
        quizResultDesc.innerHTML += `<br><span style="color: var(--accent-gold); font-weight: bold; display: block; margin-top: 0.85rem;"><i class="fa-solid fa-gift animate-bounce"></i> Selamat! Anda telah membuka Hadiah Eksklusif. Klik tombol di bawah ini!</span>`;
      } else {
        if (btnClaimReward) {
          btnClaimReward.style.display = "none";
        }
        quizResultDesc.innerHTML += `<br><span style="color: var(--text-muted); font-size: 0.9rem; display: block; margin-top: 0.5rem;"><i class="fa-solid fa-circle-info"></i> Selesaikan kuis dengan skor minimal 80 untuk membuka Hadiah Spesial!</span>`;
      }
    }
  });

  btnRestartQuiz.addEventListener("click", () => {
    initQuiz();
  });

  // Reward Modal Interactions - Membuka tahap pemilihan region terlebih dahulu
  if (btnClaimReward) {
    btnClaimReward.addEventListener("click", () => {
      // Reset stages to selection stage
      if (rewardStageSelection && rewardStageTicket) {
        rewardStageTicket.classList.remove("active");
        rewardStageTicket.style.display = "none";
        
        rewardStageSelection.style.display = "block";
        rewardStageSelection.classList.add("active");
      }
      
      if (rewardModalOverlay) {
        rewardModalOverlay.classList.add("active");
        showToast("Hadiah Spesial Kuis Dibuka! Silakan pilih destinasi Anda. 🌍", "success");
      }
    });
  }

  // Event listener to change region (back to Stage 1)
  if (btnChangeRegion) {
    btnChangeRegion.addEventListener("click", () => {
      if (rewardStageSelection && rewardStageTicket) {
        // Transition fade out
        rewardStageTicket.classList.remove("active");
        
        setTimeout(() => {
          rewardStageTicket.style.display = "none";
          rewardStageSelection.style.display = "block";
          
          setTimeout(() => {
            rewardStageSelection.classList.add("active");
            showToast("Silakan pilih region destinasi baru Anda! 🗺️", "info");
          }, 50);
        }, 300);
      }
    });
  }

  if (btnCloseReward) {
    btnCloseReward.addEventListener("click", () => {
      if (rewardModalOverlay) {
        rewardModalOverlay.classList.remove("active");
      }
    });
  }

  if (btnRewardBackHome) {
    btnRewardBackHome.addEventListener("click", () => {
      if (rewardModalOverlay) {
        rewardModalOverlay.classList.remove("active");
      }
      document.getElementById("beranda").scrollIntoView({ behavior: "smooth" });
      showToast("Kembali ke Beranda Utama. Selamat belajar!", "info");
    });
  }

  // Close reward modal when clicking outside the card
  if (rewardModalOverlay) {
    rewardModalOverlay.addEventListener("click", (e) => {
      if (e.target === rewardModalOverlay) {
        rewardModalOverlay.classList.remove("active");
      }
    });
  }

});
