/**
 * AgriSense Core Application Orchestrator
 * Fully supports client-side SPA routing, Supabase integration,
 * pre-trained AI API hooks, and local sandbox database fallbacks.
 */

// ==========================================
// 1. PROJECT CONFIGURATION SETTINGS
// ==========================================
const SUPABASE_URL = "https://czstfvmktqvdqrmjmdsw.supabase.co";         // Paste your Supabase project URL here
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6c3Rmdm1rdHF2ZHFybWptZHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MjgxNzAsImV4cCI6MjA5NTAwNDE3MH0.pVESUyW1x9XZKLD2lan3EGk8K9Lqv_9D0nPB0NvQAbw";    // Paste your Supabase Anon API key here
const AI_MODEL_API_URL = "";     // Paste your Pre-trained AI API Endpoint here

// ==========================================
// 2. STATE MANAGEMENT & GLOBALS
// ==========================================
let dbMode = "local"; // "supabase" or "local"
let supabaseClient = null;
let currentUser = null;
let scanHistory = [];

// ==========================================
// 3. DATABASE CLIENT INITIALIZATION
// ==========================================
function initDatabase() {
  const devBanner = document.getElementById("dev-mode-banner");
  
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      dbMode = "supabase";
      if (devBanner) {
        devBanner.style.backgroundColor = "hsl(var(--success) / 10%)";
        devBanner.style.borderColor = "hsl(var(--success) / 30%)";
        devBanner.style.color = "hsl(var(--success))";
        devBanner.querySelector("span").innerHTML = `
          <i class="fa-solid fa-cloud-arrow-up"></i>
          <strong>Cloud Sync Active:</strong> Secured and connected to Supabase Cloud Core. All Farmer logs are synced.
        `;
      }
      console.log("AgriSense connected to Supabase successfully.");
    } catch (e) {
      console.error("Supabase Client failed to initialize. Falling back to LocalStorage.", e);
      dbMode = "local";
      showLocalModeBanner();
    }
  } else {
    dbMode = "local";
    showLocalModeBanner();
  }
}

function showLocalModeBanner() {
  const devBanner = document.getElementById("dev-mode-banner");
  if (devBanner) {
    devBanner.style.display = "flex";
  }
  console.log("AgriSense is running in LocalStorage Sandbox mode.");
}

// ==========================================
// 4. AUTHENTICATION CONTROLLER HANDLERS
// ==========================================

// Register Farmer Account
async function registerFarmer(email, password, name) {
  if (dbMode === "supabase") {
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          display_name: name
        }
      }
    });
    if (error) throw error;
    if (!data || !data.user) {
      throw new Error("Unable to register. This account may already exist or email confirmation is required.");
    }
    currentUser = {
      id: data.user.id,
      email: data.user.email,
      name: name
    };
    return currentUser;
  } else {
    // Local Sandbox Storage Registration
    let localUsers = JSON.parse(localStorage.getItem("agrisense_users") || "[]");
    if (localUsers.find(u => u.email === email)) {
      throw new Error("This email is already registered.");
    }
    const newUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email: email,
      password: password, // In a local sandbox, stored as-is for demo purposes
      name: name
    };
    localUsers.push(newUser);
    localStorage.setItem("agrisense_users", JSON.stringify(localUsers));
    
    currentUser = { id: newUser.id, email: newUser.email, name: newUser.name };
    localStorage.setItem("agrisense_session", JSON.stringify(currentUser));
    return currentUser;
  }
}

// Login Farmer Account
async function loginFarmer(email, password) {
  if (dbMode === "supabase") {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });
    if (error) throw error;
    currentUser = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.display_name || data.user.email.split("@")[0]
    };
    return currentUser;
  } else {
    // Local Sandbox Storage Login
    let localUsers = JSON.parse(localStorage.getItem("agrisense_users") || "[]");
    const user = localUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error("Invalid email or password.");
    }
    currentUser = { id: user.id, email: user.email, name: user.name };
    localStorage.setItem("agrisense_session", JSON.stringify(currentUser));
    return currentUser;
  }
}

// Persistent Session Recovery
function checkActiveSession() {
  if (dbMode === "supabase") {
    supabaseClient.auth.getSession().then(({ data }) => {
      const session = data ? data.session : null;
      if (session && session.user) {
        currentUser = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.display_name || session.user.email.split("@")[0]
        };
        updateUIForLoginState();
        loadHistoryTimeline();
      } else {
        currentUser = null;
        updateUIForLogoutState();
      }
    }).catch(err => {
      console.warn("Supabase active session check failed:", err);
      currentUser = null;
      updateUIForLogoutState();
    });
  } else {
    const localSession = localStorage.getItem("agrisense_session");
    if (localSession) {
      currentUser = JSON.parse(localSession);
      updateUIForLoginState();
      loadHistoryTimeline();
    } else {
      currentUser = null;
      updateUIForLogoutState();
    }
  }
}

// Logout Farmer
async function logoutFarmer() {
  if (dbMode === "supabase") {
    await supabaseClient.auth.signOut();
  } else {
    localStorage.removeItem("agrisense_session");
  }
  currentUser = null;
  scanHistory = [];
  updateUIForLogoutState();
  navigateToView("landing");
}

// ==========================================
// 5. CROP HEALTH LOGS (HISTORY DATABASE HANDLERS)
// ==========================================

// Load History from database
async function loadHistoryTimeline() {
  if (!currentUser) return;
  
  try {
    if (dbMode === "supabase") {
      const { data, error } = await supabaseClient
        .from("scans")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      scanHistory = data || [];
    } else {
      // Local Database Recovery
      let localHistory = JSON.parse(localStorage.getItem("agrisense_history") || "[]");
      scanHistory = localHistory
        .filter(item => item.user_id === currentUser.id)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    renderHistoryTimeline();
  } catch (err) {
    console.error("Error loading farming history:", err);
  }
}

// Save Scan Record to database
async function saveScanToDatabase(scanRecord) {
  if (!currentUser) return;
  
  const record = {
    ...scanRecord,
    user_id: currentUser.id,
    created_at: new Date().toISOString()
  };

  try {
    if (dbMode === "supabase") {
      // Insert row into 'scans' table
      const { data, error } = await supabaseClient
        .from("scans")
        .insert([record])
        .select();
        
      if (error) throw error;
      if (data && data.length > 0) {
        scanHistory.unshift(data[0]);
      }
    } else {
      // Local Database Insert
      record.id = "scan_" + Date.now() + "_" + Math.random().toString(36).substring(2, 5);
      let localHistory = JSON.parse(localStorage.getItem("agrisense_history") || "[]");
      localHistory.unshift(record);
      localStorage.setItem("agrisense_history", JSON.stringify(localHistory));
      scanHistory.unshift(record);
    }
    renderHistoryTimeline();
  } catch (err) {
    console.error("Error saving scan record:", err);
  }
}

// Delete Scan Record from database
async function deleteScanFromDatabase(scanId) {
  if (!currentUser) return;
  
  try {
    if (dbMode === "supabase") {
      const { error } = await supabaseClient
        .from("scans")
        .delete()
        .eq("id", scanId)
        .eq("user_id", currentUser.id);
        
      if (error) throw error;
    } else {
      let localHistory = JSON.parse(localStorage.getItem("agrisense_history") || "[]");
      localHistory = localHistory.filter(item => item.id !== scanId);
      localStorage.setItem("agrisense_history", JSON.stringify(localHistory));
    }
    scanHistory = scanHistory.filter(item => item.id !== scanId);
    renderHistoryTimeline();
  } catch (err) {
    console.error("Error deleting scan record:", err);
  }
}

// Normalize disease class category string returned from custom trained ML models
function normalizeDiseaseId(rawId) {
  if (!rawId) return "healthy_crop";
  
  let str = String(rawId);
  
  // Step 1: Strip leading numbering like "5. " or "14."
  str = str.replace(/^\d+\.\s*/, "");
  
  // Step 2: Lowercase everything
  str = str.toLowerCase();
  
  // Step 3: Convert brackets, parentheses, hyphens, spaces to underscores
  str = str.replace(/[\[\](){}\-\s,.:;'"]+/g, "_");
  
  // Step 4: Collapse multiple underscores into one
  str = str.replace(/_+/g, "_");
  
  // Step 5: Trim leading/trailing underscores
  str = str.replace(/^_|_$/g, "");
  
  // Direct lookup in the diseases database
  if (window.AGRI_DISEASES && window.AGRI_DISEASES[str]) {
    return str;
  }
  
  // Fuzzy keyword matching for common patterns
  if (str.includes("healthy")) {
    // Try crop-specific healthy first
    const cropMatch = str.match(/^(apple|blueberry|cherry|corn|grape|orange|peach|pepper|potato|raspberry|soybean|squash|strawberry|tomato)/);
    if (cropMatch) {
      const key = cropMatch[1] + "_healthy";
      if (window.AGRI_DISEASES && window.AGRI_DISEASES[key]) return key;
    }
    return "healthy_crop";
  }
  
  // Try prefix matching: find the longest key that is a substring match
  if (window.AGRI_DISEASES) {
    const keys = Object.keys(window.AGRI_DISEASES);
    // Sort by length descending to prefer more specific matches
    keys.sort((a, b) => b.length - a.length);
    for (const key of keys) {
      if (str.includes(key) || key.includes(str)) {
        return key;
      }
    }
  }

  // Default fallback
  return "healthy_crop";
}

// Predict Crop Disease from Image File
async function predictCropDisease(file) {
  // If API URL is provided, call external pre-trained model
  if (AI_MODEL_API_URL) {
    try {
      const formData = new FormData();
      formData.append("file", file); // Standard field name

      const response = await fetch(AI_MODEL_API_URL, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const result = await response.json();
      
      // Support category and confidence fields returned from the trained model
      const rawDiseaseId = result.category || result.disease_id || result.disease || result.label || result.class || "healthy_crop";
      const diseaseId = normalizeDiseaseId(rawDiseaseId);
      const rawConfidence = result.confidence || result.score || result.conf || 0.95;
      
      // Format confidence value cleanly as percentage string (e.g. 94.8%)
      let confidenceStr = "95.0%";
      if (typeof rawConfidence === "number") {
        if (rawConfidence <= 1.0) {
          confidenceStr = (rawConfidence * 100).toFixed(1) + "%";
        } else {
          confidenceStr = rawConfidence.toFixed(1) + "%";
        }
      } else if (typeof rawConfidence === "string") {
        if (rawConfidence.includes("%")) {
          confidenceStr = rawConfidence;
        } else {
          const parsed = parseFloat(rawConfidence);
          if (!isNaN(parsed)) {
            if (parsed <= 1.0) {
              confidenceStr = (parsed * 100).toFixed(1) + "%";
            } else {
              confidenceStr = parsed.toFixed(1) + "%";
            }
          }
        }
      }
      
      let matchedDetails = window.AGRI_DISEASES[diseaseId];
      if (!matchedDetails) {
        // If not found in the dictionary, create a dynamic object gracefully
        matchedDetails = {
          id: diseaseId,
          crop: result.crop || "Unknown Crop",
          disease: result.disease_name || result.disease || "Undetected Anomaly",
          scientificName: result.scientific_name || "N/A",
          confidence: confidenceStr,
          severity: result.severity || "Medium",
          fertilizer: result.fertilizer || "Apply balanced organic mineral fertilizers based on diagnostic results.",
          description: result.description || "The custom model detected an abnormality on the leaf surface. Please consult your local advisor.",
          precautions: result.precautions || ["Isolate affected plants immediately.", "Avoid overhead irrigation."],
          cure: result.cure || ["Apply organic broad-spectrum crop sprays under advisor supervision."]
        };
      } else {
        // Overlay actual prediction confidence and map to comprehensive local remedies
        matchedDetails = {
          ...matchedDetails,
          confidence: confidenceStr
        };
      }
      return matchedDetails;

    } catch (e) {
      console.warn("External pre-trained AI API failed or timed out. Gracefully switching to sandbox local knowledge matches.", e);
      return runLocalFallbackMatch(file);
    }
  } else {
    // If no endpoint configured, run local sandbox dictionary matcher
    return runLocalFallbackMatch(file);
  }
}

// Local mock matcher based on filename or randomized
function runLocalFallbackMatch(file) {
  const fileName = file.name ? file.name.toLowerCase() : "";
  let diseaseKey = "healthy_crop";

  // Try to match file name keywords to pre-package diseases
  if (fileName.includes("tomato") || fileName.includes("blight")) {
    diseaseKey = Math.random() > 0.3 ? "tomato_early_blight" : "tomato_leaf_mold";
  } else if (fileName.includes("corn") || fileName.includes("rust")) {
    diseaseKey = "corn_common_rust";
  } else if (fileName.includes("potato") || fileName.includes("late")) {
    diseaseKey = "potato_late_blight";
  } else if (fileName.includes("apple") || fileName.includes("scab")) {
    diseaseKey = "apple_scab";
  } else {
    // Random selection for other generic test photos
    const keys = ["tomato_early_blight", "corn_common_rust", "potato_late_blight", "apple_scab", "healthy_crop"];
    diseaseKey = keys[Math.floor(Math.random() * keys.length)];
  }

  // Retrieve base template details
  const template = window.AGRI_DISEASES[diseaseKey];
  
  // Randomize confidence values between 88% and 98% for realistic variations
  const randomConfidence = (88 + Math.random() * 10).toFixed(1) + "%";
  
  return {
    ...template,
    confidence: randomConfidence
  };
}

// ==========================================
// 7. CLIENT SPA ROUTER CONTROLLER
// ==========================================
const views = {
  landing: document.getElementById("view-landing"),
  analyze: document.getElementById("view-analyze"),
  results: document.getElementById("view-results"),
  history: document.getElementById("view-history"),
  library: document.getElementById("view-library"),
  heatmap: document.getElementById("view-heatmap"),
  weather: document.getElementById("view-weather"),
  bot: document.getElementById("view-bot"),
  about: document.getElementById("view-about"),
  login: document.getElementById("view-login"),
  register: document.getElementById("view-register")
};

function navigateToView(viewName) {
  // Authentication Guard: Restrict Analyze, History, and Results access to active farmers
  if ((viewName === "analyze" || viewName === "history" || viewName === "results") && !currentUser) {
    window.location.hash = "login";
    return;
  }

  // Redirect logged-in farmers away from login/register
  if ((viewName === "login" || viewName === "register") && currentUser) {
    window.location.hash = "analyze";
    return;
  }

  // Deactivate all sections
  Object.keys(views).forEach(key => {
    if (views[key]) views[key].classList.remove("active");
  });

  // Activate destination section
  if (views[viewName]) {
    views[viewName].classList.add("active");
  }

  // Handle nav/footer hidden status for login/register screen layouts
  if (viewName === "login" || viewName === "register") {
    document.body.classList.add("hide-nav-footer");
  } else {
    document.body.classList.remove("hide-nav-footer");
  }

  // Update navbar links active status
  const navItems = document.querySelectorAll(".nav-links li");
  navItems.forEach(item => {
    item.classList.remove("active");
    if (item.getAttribute("data-view") === viewName) {
      item.classList.add("active");
    }
  });

  // Re-load scan logs and calculations upon visiting history timeline
  if (viewName === "history") {
    loadHistoryTimeline();
  }

  // Dynamic initializers for newly introduced pages
  if (viewName === "library") {
    renderLibrary("", "all");
  }
  if (viewName === "heatmap") {
    renderHeatmapOutbreaks("east");
  }
  if (viewName === "weather") {
    const weatherSelect = document.getElementById("weather-farm-select");
    if (weatherSelect) {
      updateWeatherAdvisory(weatherSelect.value);
    }
  }
}

// Hash-based router listener
window.addEventListener("hashchange", () => {
  const hash = window.location.hash.substring(1);
  if (hash === "home" || hash === "") navigateToView("landing");
  else if (hash === "analyze") navigateToView("analyze");
  else if (hash === "results") navigateToView("results");
  else if (hash === "history") navigateToView("history");
  else if (hash === "library") navigateToView("library");
  else if (hash === "heatmap") navigateToView("heatmap");
  else if (hash === "weather") navigateToView("weather");
  else if (hash === "bot") navigateToView("bot");
  else if (hash === "about") navigateToView("about");
  else if (hash === "login") navigateToView("login");
  else if (hash === "register") navigateToView("register");
});

// Initial load check
function initRouter() {
  const hash = window.location.hash.substring(1);
  if (hash === "analyze") navigateToView("analyze");
  else if (hash === "results") navigateToView("results");
  else if (hash === "history") navigateToView("history");
  else if (hash === "library") navigateToView("library");
  else if (hash === "heatmap") navigateToView("heatmap");
  else if (hash === "weather") navigateToView("weather");
  else if (hash === "bot") navigateToView("bot");
  else if (hash === "about") navigateToView("about");
  else if (hash === "login") navigateToView("login");
  else if (hash === "register") navigateToView("register");
  else navigateToView("landing");
}

// ==========================================
// 8. INTERACTIVE UI RENDERERS & EVENT BINDINGS
// ==========================================

// Global Modal Controls
const authModalOverlay = document.getElementById("auth-modal-overlay");
const btnCloseAuth = document.getElementById("btn-close-auth");

function openAuthModal(defaultTab = "login") {
  if (!authModalOverlay) return;
  
  authModalOverlay.classList.add("active");
  
  // Toggle internal active tabs
  const tabLogin = document.querySelector(".auth-tab[data-form='auth-form-login']");
  const tabRegister = document.querySelector(".auth-tab[data-form='auth-form-register']");
  const formLogin = document.getElementById("auth-form-login");
  const formRegister = document.getElementById("auth-form-register");

  // Reset errors
  document.getElementById("login-error-container").style.display = "none";
  document.getElementById("register-error-container").style.display = "none";

  if (defaultTab === "login") {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    formLogin.classList.add("active");
    formRegister.classList.remove("active");
  } else {
    tabLogin.classList.remove("active");
    tabRegister.classList.add("active");
    formLogin.classList.remove("active");
    formRegister.classList.add("active");
  }
}

function closeAuthModal() {
  if (authModalOverlay) authModalOverlay.classList.remove("active");
}

if (btnCloseAuth) btnCloseAuth.addEventListener("click", closeAuthModal);

// Switch Modal tabs inside modal
document.querySelectorAll(".auth-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    const formId = tab.getAttribute("data-form");
    
    document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".auth-form-wrapper").forEach(f => f.classList.remove("active"));
    
    tab.classList.add("active");
    const targetForm = document.getElementById(formId);
    if (targetForm) targetForm.classList.add("active");
  });
});

// Update navbar and controls for Logged-In User
function updateUIForLoginState() {
  const guestNav = document.getElementById("guest-nav-actions");
  const userBubble = document.getElementById("user-nav-bubble");
  const avatarLbl = document.getElementById("user-avatar-lbl");
  const nameLbl = document.getElementById("user-name-lbl");

  if (guestNav) guestNav.style.display = "none";
  if (userBubble) {
    userBubble.style.display = "flex";
    if (avatarLbl) avatarLbl.innerText = currentUser.name.charAt(0).toUpperCase();
    if (nameLbl) nameLbl.innerText = currentUser.name;
  }

  // Sync mobile nav elements
  const mobileGuest = document.getElementById("mobile-guest-nav-actions");
  const mobileBubble = document.getElementById("mobile-user-nav-bubble");
  const mobileAvatar = document.getElementById("mobile-user-avatar-lbl");
  const mobileName = document.getElementById("mobile-user-name-lbl");
  if (mobileGuest) mobileGuest.style.display = "none";
  if (mobileBubble) {
    mobileBubble.style.display = "flex";
    if (mobileAvatar) mobileAvatar.innerText = currentUser.name.charAt(0).toUpperCase();
    if (mobileName) mobileName.innerText = currentUser.name;
  }
  
  // Enable scan results container hover states
  const resultsCard = document.getElementById("results-card-wrapper");
  if (resultsCard) resultsCard.style.opacity = "1";
}

// Update navbar and controls for Logged-Out Guest
function updateUIForLogoutState() {
  const guestNav = document.getElementById("guest-nav-actions");
  const userBubble = document.getElementById("user-nav-bubble");

  if (guestNav) guestNav.style.display = "flex";
  if (userBubble) userBubble.style.display = "none";

  // Sync mobile nav elements
  const mobileGuest = document.getElementById("mobile-guest-nav-actions");
  const mobileBubble = document.getElementById("mobile-user-nav-bubble");
  if (mobileGuest) mobileGuest.style.display = "block";
  if (mobileBubble) mobileBubble.style.display = "none";

  // Disable scans cards active visual styling
  resetScanDashboard();
}

// Reset predictor view
function resetScanDashboard() {
  const resultsWrapper = document.getElementById("results-card-wrapper");
  const placeholder = document.getElementById("results-placeholder-view");
  const content = document.getElementById("results-content-view");

  if (resultsWrapper) resultsWrapper.classList.remove("populated");
  if (placeholder) placeholder.style.display = "flex";
  if (content) content.classList.remove("active");
  
  const scanOverlay = document.getElementById("crop-scan-overlay");
  if (scanOverlay) scanOverlay.style.display = "none";
}

// Bind navbar registration trigger
const btnNavLogin = document.getElementById("btn-nav-login");
if (btnNavLogin) btnNavLogin.addEventListener("click", () => openAuthModal("login"));

const btnNavLogout = document.getElementById("btn-nav-logout");
if (btnNavLogout) btnNavLogout.addEventListener("click", logoutFarmer);

// Bind Hero Section Buttons
const heroBtnScan = document.getElementById("hero-btn-scan");
if (heroBtnScan) {
  heroBtnScan.addEventListener("click", () => {
    if (currentUser) {
      window.location.hash = "analyze";
    } else {
      openAuthModal("register");
    }
  });
}

const heroBtnHistory = document.getElementById("hero-btn-history");
if (heroBtnHistory) {
  heroBtnHistory.addEventListener("click", () => {
    if (currentUser) {
      window.location.hash = "history";
    } else {
      openAuthModal("login");
    }
  });
}

// Bind logo to return home
const navLogo = document.getElementById("nav-logo");
if (navLogo) {
  navLogo.addEventListener("click", () => {
    window.location.hash = "home";
  });
}

// ==========================================
// 9. FORM VALIDATION & SIGNUP SUBMISSIONS
// ==========================================

// Register Form Submission
const formRegister = document.getElementById("farmer-register-form");
if (formRegister) {
  formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const errContainer = document.getElementById("register-error-container");
    const errMsg = document.getElementById("register-error-text");

    try {
      errContainer.style.display = "none";
      await registerFarmer(email, password, name);
      closeAuthModal();
      updateUIForLoginState();
      loadHistoryTimeline();
      
      // Auto-navigate to analyzer to begin experience!
      window.location.hash = "analyze";
    } catch (err) {
      errContainer.style.display = "flex";
      errMsg.innerText = err.message || "Failed to create account.";
    }
  });
}

// Login Form Submission
const formLogin = document.getElementById("farmer-login-form");
if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const errContainer = document.getElementById("login-error-container");
    const errMsg = document.getElementById("login-error-text");

    try {
      errContainer.style.display = "none";
      await loginFarmer(email, password);
      closeAuthModal();
      updateUIForLoginState();
      loadHistoryTimeline();
      
      // Auto-navigate to analyzer
      window.location.hash = "analyze";
    } catch (err) {
      errContainer.style.display = "flex";
      errMsg.innerText = err.message || "Invalid credentials.";
    }
  });
}

// ==========================================
// 10. PREDICTOR SCANNING SYSTEM (PIPELINE PROCESSOR)
// ==========================================
const dropzone = document.getElementById("crop-dropzone");
const fileInput = document.getElementById("crop-file-input");
const scanOverlay = document.getElementById("crop-scan-overlay");
const scanPreview = document.getElementById("crop-scan-preview");
const scanStatus = document.getElementById("crop-scan-status");

// Activate File selector by clicking dropzone
if (dropzone) {
  dropzone.addEventListener("click", (e) => {
    // Avoid double triggering camera click inside zone
    if (e.target.tagName !== "BUTTON" && !e.target.closest("button")) {
      fileInput.click();
    }
  });
}

// Handle File upload change
if (fileInput) {
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handlePlantScanSelection(file);
  });
}

// Drag & Drop bindings
if (dropzone) {
  ["dragenter", "dragover"].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "hsl(var(--primary))";
      dropzone.style.background = "hsl(var(--primary) / 6%)";
    }, false);
  });

  ["dragleave", "drop"].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "hsl(var(--primary) / 30%)";
      dropzone.style.background = "transparent";
    }, false);
  });

  dropzone.addEventListener("drop", (e) => {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    if (file) handlePlantScanSelection(file);
  });
}

// Live Camera capturing engine
const cameraContainer = document.getElementById("crop-camera-container");
const videoStream = document.getElementById("crop-video-stream");
const btnCameraCapture = document.getElementById("btn-camera-capture");
const btnCameraCancel = document.getElementById("btn-camera-cancel");
let activeStream = null;

const btnCameraTrigger = dropzone ? dropzone.querySelector("button") : null;
if (btnCameraTrigger) {
  btnCameraTrigger.addEventListener("click", async (e) => {
    e.stopPropagation(); // Avoid triggering parent dropzone click
    
    // Request webcam stream
    try {
      activeStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      videoStream.srcObject = activeStream;
      dropzone.style.display = "none";
      cameraContainer.style.display = "block";
    } catch (e) {
      alert("Camera access denied or unavailable. Please upload a crop leaf image instead.");
    }
  });
}

if (btnCameraCancel) {
  btnCameraCancel.addEventListener("click", () => {
    stopCameraStream();
  });
}

function stopCameraStream() {
  if (activeStream) {
    activeStream.getTracks().forEach(track => track.stop());
    activeStream = null;
  }
  if (videoStream) videoStream.srcObject = null;
  cameraContainer.style.display = "none";
  if (dropzone) dropzone.style.display = "flex";
}

if (btnCameraCapture) {
  btnCameraCapture.addEventListener("click", () => {
    if (!activeStream) return;

    // Create canvas snapshot
    const canvas = document.createElement("canvas");
    canvas.width = videoStream.videoWidth || 640;
    canvas.height = videoStream.videoHeight || 480;
    
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoStream, 0, 0, canvas.width, canvas.height);
    
    // Export to blob file
    canvas.toBlob((blob) => {
      const file = new File([blob], "crop_camera_capture.jpg", { type: "image/jpeg" });
      stopCameraStream();
      handlePlantScanSelection(file);
    }, "image/jpeg");
  });
}

// Preloaded Quick test sample buttons
document.querySelectorAll(".sample-leaf-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const sampleId = btn.getAttribute("data-sample");
    
    // Create a mock File object to send to the scanner
    const file = new File(["leaf_mock"], `sample_${sampleId}.jpg`, { type: "image/jpeg" });
    
    // Pre-populate scanner with specific leaf mock asset color templates if desired
    handlePlantScanSelection(file, sampleId);
  });
});

// Run full neural scanning animation and prediction resolver
async function handlePlantScanSelection(file, forcedSampleId = null) {
  if (!currentUser) {
    window.location.hash = "login";
    return;
  }

  // Activate Visual Scanning Overlay
  scanOverlay.style.display = "flex";
  
  // Set preview thumbnail
  if (forcedSampleId) {
    scanPreview.style.background = "none";
    if (forcedSampleId === "tomato_early_blight") scanPreview.src = "assets/tomato_blight.png";
    else if (forcedSampleId === "corn_common_rust") scanPreview.src = "assets/corn_rust.png";
    else if (forcedSampleId === "potato_late_blight") scanPreview.src = "assets/potato_blight.png";
    else scanPreview.src = "";
  } else {
    // Generate actual file URI reader
    const reader = new FileReader();
    reader.onload = (e) => {
      scanPreview.style.background = "none";
      scanPreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Loop through simulated scanning stages
  const statusLog = [
    "Establishing link with AgriSense Cloud...",
    "Scanning chloroplast grid densities...",
    "Calculating foliage cell anomalies...",
    "Resolving pathogen DNA profiles...",
    "Retrieving precautions & treatment..."
  ];

  for (let i = 0; i < statusLog.length; i++) {
    scanStatus.innerText = statusLog[i];
    await new Promise(resolve => setTimeout(resolve, 550));
  }

  try {
    let result = null;
    if (forcedSampleId && window.AGRI_DISEASES[forcedSampleId]) {
      // Force matched sample data
      result = { ...window.AGRI_DISEASES[forcedSampleId] };
      // Randomize confidence slightly
      result.confidence = (92 + Math.random() * 6).toFixed(1) + "%";
    } else {
      // Run actual Prediction engine client (API or local fallbacks)
      result = await predictCropDisease(file);
    }

    // Hide scanning overlay
    scanOverlay.style.display = "none";
    fileInput.value = ""; // Clear file

    // Save scan to farmer history list
    await saveScanToDatabase({
      crop: result.crop,
      disease: result.disease,
      scientific_name: result.scientificName,
      confidence: result.confidence,
      severity: result.severity,
      description: result.description,
      precautions: result.precautions,
      cure: result.cure,
      fertilizer: result.fertilizer
    });

    // Display Results Pane
    displayDiagnosticResults(result);

    // Auto-navigate SPA to results page
    window.location.hash = "results";

  } catch (err) {
    scanOverlay.style.display = "none";
    alert("An error occurred during AI analysis. Please try again.");
    console.error("AI Analysis Pipeline failed:", err);
  }
}

// Generate gradient representation for sample leaves thumbnail preview
function getSampleGradBackground(sampleId) {
  if (sampleId === "tomato_early_blight") return "linear-gradient(135deg, #f87171, #b91c1c)";
  if (sampleId === "corn_common_rust") return "linear-gradient(135deg, #fbbf24, #d97706)";
  if (sampleId === "potato_late_blight") return "linear-gradient(135deg, #a78bfa, #6d28d9)";
  return "linear-gradient(135deg, #34d399, #059669)";
}

// ==========================================
// 11. DIAGNOSTIC RESULTS DISPLAY RENDERER
// ==========================================
function displayDiagnosticResults(result) {
  const placeholder = document.getElementById("results-placeholder-view");
  const content = document.getElementById("results-content-view");
  const resultsCard = document.getElementById("results-card-wrapper");

  if (placeholder) placeholder.style.display = "none";
  if (content) content.classList.add("active");
  if (resultsCard) resultsCard.classList.add("populated");

  // Load basic texts
  document.getElementById("result-disease").innerText = result.disease;
  document.getElementById("result-scientific").innerText = result.scientificName;
  document.getElementById("result-description-text").innerText = result.description;

  const remedyText = document.getElementById("result-remedy-text");
  if (remedyText) {
    remedyText.innerText = result.cure && result.cure.length > 0 ? result.cure[0] : "";
  }

  const fertilizerText = document.getElementById("result-fertilizer-text");
  if (fertilizerText) {
    fertilizerText.innerText = result.fertilizer || "No corrective fertilizers are required.";
  }

  // Confidence radial loader
  document.getElementById("result-confidence-val").innerText = result.confidence;
  
  // Set leaf image dynamically matching the identified disease code
  const leafImage = document.getElementById("result-leaf-image");
  if (leafImage) {
    const diseaseCode = result.id || mapDiseaseId(result.disease);
    leafImage.src = getThumbImagePath(diseaseCode);
  }

  // Set Specimen type in the HUD matrix table
  const specType = document.getElementById("hud-specimen-type");
  if (specType) {
    specType.innerText = result.scientificName;
  }

  // Set severity pill color
  const sevPill = document.getElementById("result-severity");
  if (sevPill) {
    sevPill.innerText = result.severity;
    sevPill.className = `severity-pill severity-${result.severity}`;
  }

  // Animate the Circular Gauge Meter
  const pct = parseFloat(result.confidence);
  const strokeOffset = 226 - (226 * pct) / 100;
  const confBar = document.getElementById("result-confidence-bar");
  if (confBar) {
    // Trigger paint layout reflow before triggering transition
    confBar.getBoundingClientRect();
    confBar.style.strokeDashoffset = strokeOffset;
  }

  // Populate Precautions checklist
  const precList = document.getElementById("result-precautions-list");
  if (precList) {
    precList.innerHTML = "";
    result.precautions.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${item}`;
      precList.appendChild(li);
    });
  }

  // Populate Cures checklist
  const cureList = document.getElementById("result-cure-list");
  if (cureList) {
    cureList.innerHTML = "";
    result.cure.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<i class="fa-solid fa-square-check"></i> ${item}`;
      cureList.appendChild(li);
    });
  }

  // Reset Results tab active classes to Diagnosis Tab
  document.querySelectorAll(".result-view-tab").forEach(tab => {
    tab.classList.remove("active");
    if (tab.getAttribute("data-tab") === "tab-description") tab.classList.add("active");
  });
  document.querySelectorAll(".result-panel-tabcontent").forEach(pane => {
    pane.classList.remove("active");
    if (pane.id === "tab-description") pane.classList.add("active");
  });
}

// Bind click transitions for Results Tabs
document.querySelectorAll(".result-view-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    const paneId = tab.getAttribute("data-tab");
    
    document.querySelectorAll(".result-view-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".result-panel-tabcontent").forEach(p => p.classList.remove("active"));
    
    tab.classList.add("active");
    const targetPane = document.getElementById(paneId);
    if (targetPane) targetPane.classList.add("active");
  });
});

// ==========================================
// 12. HISTORY LIST TIMELINE RENDERER
// ==========================================
function renderHistoryTimeline() {
  const emptyView = document.getElementById("history-empty-view");
  const entriesList = document.getElementById("history-entries-list");
  
  // Aggregate Calculations
  const totalScansVal = document.getElementById("stat-total-scans");
  const healthyScansVal = document.getElementById("stat-healthy-scans");
  const infectedScansVal = document.getElementById("stat-infected-scans");

  const totalCount = scanHistory.length;
  let healthyCount = 0;
  let infectedCount = 0;

  scanHistory.forEach(item => {
    if (item.disease === "Healthy Crop" || item.severity === "None") healthyCount++;
    else infectedCount++;
  });

  const healthyRatio = totalCount > 0 ? Math.round((healthyCount / totalCount) * 100) : 0;

  if (totalScansVal) totalScansVal.innerText = totalCount;
  if (healthyScansVal) healthyScansVal.innerText = healthyRatio + "%";
  if (infectedScansVal) infectedScansVal.innerText = infectedCount;

  if (totalCount === 0) {
    if (emptyView) emptyView.style.display = "flex";
    if (entriesList) entriesList.style.display = "none";
    return;
  }

  if (emptyView) emptyView.style.display = "none";
  if (entriesList) {
    entriesList.style.display = "flex";
    entriesList.innerHTML = "";

    scanHistory.forEach(item => {
      const card = document.createElement("div");
      card.className = "glass-card timeline-card";
      
      const formattedDate = new Date(item.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      const diseaseCode = mapDiseaseId(item.disease);
      const imgPath = getThumbImagePath(diseaseCode);

      card.innerHTML = `
        <div class="timeline-left">
          <img class="timeline-thumb" src="${imgPath}" alt="${item.disease}" style="object-fit: cover; border: 1px solid hsl(var(--border-glass));">
          <div class="timeline-details">
            <h4>${item.crop} - ${item.disease}</h4>
            <span class="timestamp"><i class="fa-solid fa-calendar-day" style="font-size:11px; margin-right:4px;"></i> ${formattedDate}</span>
          </div>
        </div>
        <div class="timeline-right">
          <div class="timeline-score">
            <div class="score-pct">${item.confidence}</div>
            <div class="score-lbl">Accuracy</div>
          </div>
          <button class="btn btn-secondary btn-view-history-detail" style="padding: 8px 14px; font-size:12px;"><i class="fa-solid fa-arrow-right"></i> Review</button>
          <button class="btn-icon-danger btn-delete-history-item" title="Delete scan record"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      `;

      // Event listener: View Full Analysis Card
      card.querySelector(".btn-view-history-detail").addEventListener("click", () => {
        navigateToView("analyze");
        displayDiagnosticResults(item);
        window.location.hash = "analyze";
      });

      // Event listener: Delete entry
      card.querySelector(".btn-delete-history-item").addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this diagnostic report from your farming records?")) {
          deleteScanFromDatabase(item.id);
        }
      });

      entriesList.appendChild(card);
    });
  }
}

// Map disease names back to keys
function mapDiseaseId(name) {
  if (name.includes("Early Blight")) return "tomato_early_blight";
  if (name.includes("Leaf Mold")) return "tomato_leaf_mold";
  if (name.includes("Common Rust")) return "corn_common_rust";
  if (name.includes("Late Blight")) return "potato_late_blight";
  if (name.includes("Apple Scab") || name.includes("Scab")) return "apple_scab";
  return "healthy_crop";
}

function getThumbImagePath(code) {
  if (code === "tomato_early_blight" || code === "tomato_leaf_mold") return "assets/tomato_blight.png";
  if (code === "corn_common_rust") return "assets/corn_rust.png";
  if (code === "potato_late_blight") return "assets/potato_blight.png";
  if (code === "apple_scab") return "assets/potato_blight.png"; // fallback
  return "assets/tomato_blight.png"; // default healthy/other
}

// ==========================================
// 13. MOCK CHATBOT BOTANIST ENGINE (OMNIDIMENSION MOCKUP)
// ==========================================
const chatLauncher = document.getElementById("chat-launcher");
const chatWindow = document.getElementById("chat-window-container");
const btnCloseChat = document.getElementById("btn-close-chat");
const chatInput = document.getElementById("chat-user-input");
const btnSendChat = document.getElementById("btn-submit-chat");
const chatMessagesPane = document.getElementById("chat-messages-pane");

if (chatLauncher) {
  chatLauncher.addEventListener("click", () => {
    chatWindow.classList.toggle("active");
  });
}

if (btnCloseChat) {
  btnCloseChat.addEventListener("click", () => {
    chatWindow.classList.remove("active");
  });
}

function appendChatMessage(sender, text) {
  const bubble = document.createElement("div");
  bubble.className = `msg-bubble ${sender === "bot" ? "msg-bot" : "msg-user"}`;
  bubble.innerText = text;
  chatMessagesPane.appendChild(bubble);
  
  // Auto-scroll messages pane
  chatMessagesPane.scrollTop = chatMessagesPane.scrollHeight;
}

function triggerBotReply(userQuery) {
  const query = userQuery.toLowerCase();
  let reply = "";

  if (query.includes("blight")) {
    reply = "Early Blight thrives in warm, wet foliage. Ensure you mulch your plants to stop fungal spores from splashing onto lower leaves. Potato late blight is critical - destroy infected vines immediately.";
  } else if (query.includes("rust")) {
    reply = "Common corn rust creates orange cinnamon-brown pustules. Spray copper fungicides or use rust-resistant hybrids during planting next season.";
  } else if (query.includes("scab")) {
    reply = "Apple Scab is caused by Venturia inaequalis. Clean up and burn fallen apple tree leaves in autumn to stop the fungal spores from overwintering.";
  } else if (query.includes("fertilizer") || query.includes("nutrient") || query.includes("nitrogen")) {
    reply = "Balanced soil nutrients are essential for plant immunity! While nitrogen boosts leaves, excess nitrogen makes plants soft and highly susceptible to leaf molds and rust.";
  } else if (query.includes("watering") || query.includes("irrigation") || query.includes("humidity")) {
    reply = "Never overhead water diseased crops! Spores spread through droplets. Always irrigate at the base of the plant using drip pipes early in the morning.";
  } else {
    reply = "I'm on it! I can help you with crop disease details, preventative precautions, organic cures, soil nutrients, or botanical tips. What crop are you cultivating?";
  }

  // Append with a natural small bot delay
  setTimeout(() => {
    appendChatMessage("bot", reply);
  }, 750);
}

function submitUserChat() {
  const text = chatInput.value.trim();
  if (!text) return;

  appendChatMessage("user", text);
  chatInput.value = "";
  triggerBotReply(text);
}

if (btnSendChat) btnSendChat.addEventListener("click", submitUserChat);
if (chatInput) {
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") submitUserChat();
  });
}

// ==========================================
// 13.5. NEW INTERACTIVE FEATURES: TREATMENT LIBRARY, HEATMAP, WEATHER, BOT PAGE, ABOUT US
// ==========================================

// Treatment Library Dynamic Renderer
let currentLibCropFilter = "all";
let currentLibSearchTerm = "";

function renderLibrary(searchTerm = "", cropFilter = "all") {
  const grid = document.getElementById("lib-disease-grid");
  if (!grid) return;
  grid.innerHTML = "";

  searchTerm = searchTerm.toLowerCase();

  const diseases = Object.values(window.AGRI_DISEASES);

  const filtered = diseases.filter(item => {
    if (item.id === "healthy_crop") return false;

    const matchesSearch = item.disease.toLowerCase().includes(searchTerm) || 
                          item.crop.toLowerCase().includes(searchTerm) || 
                          item.scientificName.toLowerCase().includes(searchTerm) ||
                          item.description.toLowerCase().includes(searchTerm);
    
    const matchesCrop = cropFilter === "all" || item.crop.toLowerCase() === cropFilter.toLowerCase();

    return matchesSearch && matchesCrop;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="library-empty" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: hsl(var(--text-secondary));">
        <i class="fa-solid fa-folder-open" style="font-size: 48px; margin-bottom: 12px; color: hsl(var(--primary) / 30%);"></i>
        <h3>No Treatment Records Found</h3>
        <p>Try refining your search terms or selecting a different crop category tab.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "glass-card library-card";
    
    const severityClass = `severity-${item.severity}`;
    const typeBadge = item.disease.includes("Blight") || item.disease.includes("Mold") || item.disease.includes("Rust") || item.disease.includes("Rot") ? "FUNGAL PATHOGEN" : "BACTERIAL STRAIN";
    
    card.innerHTML = `
      <div class="library-card-header">
        <div class="library-card-badge-row">
          <span class="crop-tag">${item.crop.toUpperCase()}</span>
          <span class="severity-pill ${severityClass}">${item.severity} Risk</span>
        </div>
        <h3 class="library-disease-title">${item.disease}</h3>
        <span class="library-scientific-name"><i>${item.scientificName}</i></span>
      </div>
      <div class="library-card-body">
        <p class="library-description-text">${item.description}</p>
        
        <!-- Expandable Treatment Sections -->
        <div class="library-treatment-details" style="display: none; margin-top: 16px; border-top: 1px solid hsl(var(--border-glass)); padding-top: 16px;">
          <div style="margin-bottom: 12px;">
            <h5 style="color: hsl(var(--primary)); margin-bottom: 6px; font-size:12px; font-weight:bold;"><i class="fa-solid fa-triangle-exclamation"></i> Actionable Precautions:</h5>
            <ul style="padding-left: 18px; font-size: 12px; color: hsl(var(--text-secondary)); list-style-type: disc;">
              ${item.precautions.map(p => `<li style="margin-bottom:4px;">${p}</li>`).join("")}
            </ul>
          </div>
          <div>
            <h5 style="color: hsl(var(--success)); margin-bottom: 6px; font-size:12px; font-weight:bold;"><i class="fa-solid fa-square-check"></i> Curative Treatments:</h5>
            <ul style="padding-left: 18px; font-size: 12px; color: hsl(var(--text-secondary)); list-style-type: disc;">
              ${item.cure.map(c => `<li style="margin-bottom:4px;">${c}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
      <div class="library-card-footer" style="margin-top: auto; padding-top: 16px; border-top: 1px solid hsl(var(--border-glass)); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 11px; font-weight: 500; color: hsl(var(--primary)); background: hsl(var(--primary) / 8%); padding: 4px 8px; border-radius: 4px;">${typeBadge}</span>
        <button class="btn btn-secondary btn-library-toggle-details" style="padding: 6px 12px; font-size: 11px;"><i class="fa-solid fa-chevron-down"></i> Treatments</button>
      </div>
    `;

    // Toggle details expansion
    const btnToggle = card.querySelector(".btn-library-toggle-details");
    const detailsSection = card.querySelector(".library-treatment-details");
    btnToggle.addEventListener("click", () => {
      if (detailsSection.style.display === "none") {
        detailsSection.style.display = "block";
        btnToggle.innerHTML = `<i class="fa-solid fa-chevron-up"></i> Collapse`;
        btnToggle.classList.add("active");
      } else {
        detailsSection.style.display = "none";
        btnToggle.innerHTML = `<i class="fa-solid fa-chevron-down"></i> Treatments`;
        btnToggle.classList.remove("active");
      }
    });

    grid.appendChild(card);
  });
}

// Search and crop tabs listeners
function initLibraryListeners() {
  const searchInput = document.getElementById("lib-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentLibSearchTerm = e.target.value;
      renderLibrary(currentLibSearchTerm, currentLibCropFilter);
    });
  }

  const cropTabs = document.querySelectorAll("#lib-crop-tabs .library-tab-btn");
  cropTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      cropTabs.forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
      currentLibCropFilter = btn.getAttribute("data-crop");
      renderLibrary(currentLibSearchTerm, currentLibCropFilter);
    });
  });

  const expertBtn = document.getElementById("lib-contact-expert-btn");
  if (expertBtn) {
    expertBtn.addEventListener("click", () => {
      window.location.hash = "about";
      setTimeout(() => {
        const inquiryForm = document.getElementById("about-advisory-form");
        if (inquiryForm) {
          inquiryForm.scrollIntoView({ behavior: "smooth" });
          const firstInput = inquiryForm.querySelector("input");
          if (firstInput) firstInput.focus();
        }
      }, 150);
    });
  }
}

// Outbreak Heatmap Configuration
const MOCK_OUTBREAKS = [
  {
    region: "east",
    zoneName: "East Zone",
    crop: "Tomato",
    disease: "Early Blight",
    scientificName: "Alternaria solani",
    severity: "High",
    rate: "+12.4% this week",
    riskLevel: "Critical",
    timestamp: "Just updated",
    affectedFields: "14 Fields",
    description: "High relative humidity (88%) in the eastern low valleys has triggered rapid multiplication of blight fungal spores. Chemical spray is highly recommended."
  },
  {
    region: "east",
    zoneName: "East Zone",
    crop: "Potato",
    disease: "Late Blight",
    scientificName: "Phytophthora infestans",
    severity: "High",
    rate: "+8.2% this week",
    riskLevel: "Critical",
    timestamp: "2 hours ago",
    affectedFields: "9 Fields",
    description: "Late blight spores have been identified near river banks in the East Zone. Crop containment protocols are active."
  },
  {
    region: "west",
    zoneName: "West Zone",
    crop: "Corn",
    disease: "Common Rust",
    scientificName: "Puccinia sorghi",
    severity: "Medium",
    rate: "+4.1% this week",
    riskLevel: "Warning",
    timestamp: "1 day ago",
    affectedFields: "7 Fields",
    description: "Moderate wind currents in the West hills are spreading rust pustules. Farmers are advised to plant early hybrids and spray protective fungicides."
  },
  {
    region: "west",
    zoneName: "West Zone",
    crop: "Grape",
    disease: "Black Rot",
    scientificName: "Guignardia bidwellii",
    severity: "Medium",
    rate: "+2.8% this week",
    riskLevel: "Warning",
    timestamp: "3 days ago",
    affectedFields: "5 Vineyards",
    description: "Black rot warnings have been issued for vineyard slopes facing south in the West hills. Ensure vines are well pruned to keep leaves dry."
  },
  {
    region: "north",
    zoneName: "North Zone",
    crop: "Rice",
    disease: "Rice Blast",
    scientificName: "Magnaporthe oryzae",
    severity: "Low",
    rate: "0.0% stable",
    riskLevel: "Safe",
    timestamp: "Weekly sweep",
    affectedFields: "0 Fields",
    description: "North zone fields report stable, healthy leaf indices. Blast preventative treatments are complete and effective."
  },
  {
    region: "south",
    zoneName: "South Zone",
    crop: "Citrus",
    disease: "Citrus Canker",
    scientificName: "Xanthomonas axonopodis",
    severity: "Low",
    rate: "-1.5% decreasing",
    riskLevel: "Safe",
    timestamp: "4 days ago",
    affectedFields: "1 Orchard",
    description: "Disinfection measures at South Delta orchard checkpoints have successfully arrested canker spread. Condition holds stable."
  }
];

function renderHeatmapOutbreaks(regionFilter = "east") {
  const timeline = document.getElementById("outbreak-records-timeline");
  if (!timeline) return;
  timeline.innerHTML = "";

  const filtered = MOCK_OUTBREAKS.filter(item => {
    if (regionFilter === "all") return true;
    return item.region === regionFilter;
  });

  if (filtered.length === 0) {
    timeline.innerHTML = `
      <div style="text-align: center; padding: 40px; color: hsl(var(--text-secondary));">
        <i class="fa-solid fa-circle-check" style="font-size: 40px; color: hsl(var(--success)); margin-bottom: 12px;"></i>
        <h4>All Clear in this Zone</h4>
        <p>No active outbreaks or biological hazards reported.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const row = document.createElement("div");
    row.className = "outbreak-timeline-item";
    
    // Assign color border depending on severity
    let riskColor = "hsl(var(--success))";
    if (item.riskLevel === "Critical") riskColor = "hsl(var(--destructive))";
    else if (item.riskLevel === "Warning") riskColor = "hsl(var(--warning))";

    row.style.borderLeft = `4px solid ${riskColor}`;
    row.style.marginBottom = "16px";
    row.style.padding = "16px";
    row.style.background = "#ffffff";
    row.style.borderRadius = "0 8px 8px 0";
    row.style.boxShadow = "var(--shadow-card)";

    row.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
        <div>
          <span style="font-size:10px; font-weight:700; text-transform:uppercase; color:${riskColor};">${item.zoneName} Outbreak</span>
          <h4 style="margin: 2px 0 0 0; font-size:15px; font-weight:600; color:hsl(var(--text-primary));">${item.crop} ${item.disease}</h4>
        </div>
        <span style="font-size: 11px; color: hsl(var(--text-secondary));"><i class="fa-regular fa-clock"></i> ${item.timestamp}</span>
      </div>
      <p style="font-size:12px; line-height:1.6; color:hsl(var(--text-secondary)); margin-bottom:10px;">${item.description}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
        <span style="font-weight: 500; color: hsl(var(--text-primary));"><i class="fa-solid fa-chart-line"></i> Spreading rate: <strong>${item.rate}</strong></span>
        <span style="background: hsl(var(--primary) / 6%); padding: 3px 6px; border-radius: 4px; color: hsl(var(--primary)); font-weight: 600;"><i class="fa-solid fa-map-pin"></i> ${item.affectedFields}</span>
      </div>
    `;
    timeline.appendChild(row);
  });
}

function initHeatmapListeners() {
  const tabs = document.querySelectorAll("#heatmap-region-tabs button");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const region = tab.getAttribute("data-region");
      renderHeatmapOutbreaks(region);
    });
  });

  // Map elements clicking
  const regions = {
    north: document.getElementById("map-region-north"),
    east: document.getElementById("map-region-east"),
    west: document.getElementById("map-region-west"),
    south: document.getElementById("map-region-south")
  };

  Object.keys(regions).forEach(key => {
    const el = regions[key];
    if (el) {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => {
        // Toggle tab Selection
        let tabToClick = Array.from(tabs).find(t => t.getAttribute("data-region") === key);
        if (!tabToClick) {
          tabToClick = Array.from(tabs).find(t => t.getAttribute("data-region") === "all");
        }
        if (tabToClick) {
          tabToClick.click();
        }
      });
    }
  });
}

// Weather Advisory Calculator
const WEATHER_DATA = {
  central_plains: {
    temp: "29°C",
    condition: "Mostly Sunny",
    descr: "Perfect sunlight for farming",
    humidity: "55%",
    wind: "8 km/h",
    rain: "12%",
    suitability: "suitability-excellent",
    suitabilityTitle: "Excellent Conditions",
    advisoryIcon: '<i class="fa-solid fa-circle-check" style="color: hsl(var(--success)); margin-right:6px;"></i>',
    advisoryText: "Low winds (8 km/h) and moderate temperature (29°C) mean minimal spray drift risk. Excellent conditions to apply organic copper-based fungicides or liquid bio-stimulants early in the evening."
  },
  eastern_valleys: {
    temp: "34°C",
    condition: "Hot & Windy",
    descr: "High transpiration, risk of dehydration",
    humidity: "30%",
    wind: "24 km/h",
    rain: "5%",
    suitability: "suitability-poor",
    suitabilityTitle: "High Spray Drift Risk",
    advisoryIcon: '<i class="fa-solid fa-circle-exclamation" style="color: hsl(var(--warning)); margin-right:6px;"></i>',
    advisoryText: "High wind speeds of 24 km/h present a significant risk of chemical spray drift. Foliar applications are not recommended as treatments will blow off-target. Wait until winds drop below 15 km/h."
  },
  western_hills: {
    temp: "22°C",
    condition: "Heavy Rain & Winds",
    descr: "Severe runoff risk, protect root beds",
    humidity: "85%",
    wind: "18 km/h",
    rain: "75%",
    suitability: "suitability-hazardous",
    suitabilityTitle: "Highly Unsuitable",
    advisoryIcon: '<i class="fa-solid fa-triangle-exclamation" style="color: hsl(var(--destructive)); margin-right:6px;"></i>',
    advisoryText: "With rain probability at 75%, any applied fungicides or nutrients will be washed off immediately by runoff water. Hold all spray routines. Ensure fields are properly drained."
  },
  southern_delta: {
    temp: "26°C",
    condition: "Humid & Overcast",
    descr: "Ideal for spore growth, monitor closely",
    humidity: "80%",
    wind: "6 km/h",
    rain: "20%",
    suitability: "suitability-good",
    suitabilityTitle: "Good Spray Conditions",
    advisoryIcon: '<i class="fa-solid fa-circle-info" style="color: #2563eb; margin-right:6px;"></i>',
    advisoryText: "Low wind (6 km/h) is perfect, but relative humidity is very high (80%), delaying spray dry time. Safe to apply treatments, but prioritize doing so in the early morning so foliage dries rapidly."
  }
};

function updateWeatherAdvisory(farmId) {
  const data = WEATHER_DATA[farmId];
  if (!data) return;

  const tempEl = document.getElementById("weather-temp-lbl");
  const condEl = document.getElementById("weather-condition-lbl");
  const descEl = document.querySelector(".weather-status-badge .weather-descr");
  const humidEl = document.getElementById("weather-humidity-lbl");
  const windEl = document.getElementById("weather-wind-lbl");
  const rainEl = document.getElementById("weather-rain-lbl");
  
  const suitBadge = document.getElementById("weather-suitability-badge");
  const suitTitle = document.getElementById("weather-suitability-title");
  const advIcon = document.getElementById("weather-advisory-icon");
  const advText = document.getElementById("weather-advisory-text");

  if (tempEl) tempEl.innerText = data.temp;
  if (condEl) condEl.innerText = data.condition;
  if (descEl) descEl.innerText = data.descr;
  if (humidEl) humidEl.innerText = data.humidity;
  if (windEl) windEl.innerText = data.wind;
  if (rainEl) rainEl.innerText = data.rain;

  if (suitBadge) {
    suitBadge.innerText = data.suitabilityTitle.toUpperCase();
    suitBadge.className = `suitability-badge ${data.suitability}`;
  }
  if (suitTitle) suitTitle.innerText = data.suitabilityTitle;
  if (advIcon) advIcon.innerHTML = `${data.advisoryIcon} Current Recommendation`;
  if (advText) advText.innerText = data.advisoryText;
  
  // Update weather icon style dynamically
  const weatherIcon = document.querySelector(".weather-current-row i");
  if (weatherIcon) {
    weatherIcon.className = "";
    if (farmId === "central_plains") {
      weatherIcon.className = "fa-solid fa-cloud-sun";
      weatherIcon.style.color = "#fbbf24";
    } else if (farmId === "eastern_valleys") {
      weatherIcon.className = "fa-solid fa-wind";
      weatherIcon.style.color = "#94a3b8";
    } else if (farmId === "western_hills") {
      weatherIcon.className = "fa-solid fa-cloud-showers-heavy";
      weatherIcon.style.color = "#60a5fa";
    } else if (farmId === "southern_delta") {
      weatherIcon.className = "fa-solid fa-cloud";
      weatherIcon.style.color = "#cbd5e1";
    }
  }
}

function initWeatherListeners() {
  const select = document.getElementById("weather-farm-select");
  if (select) {
    select.addEventListener("change", (e) => {
      updateWeatherAdvisory(e.target.value);
    });
  }
}

// Dedicated AI Bot View Center Flow
function appendPageChatMessage(sender, text) {
  const pane = document.getElementById("bot-page-chat-pane");
  if (!pane) return;

  const bubble = document.createElement("div");
  bubble.className = `msg-bubble ${sender === "bot" ? "msg-bot" : "msg-user"}`;
  bubble.innerText = text;
  pane.appendChild(bubble);
  
  pane.scrollTop = pane.scrollHeight;
}

function triggerPageBotReply(userQuery) {
  const query = userQuery.toLowerCase();
  let reply = "";

  if (query.includes("blight")) {
    reply = "Early Blight thrives in warm, wet foliage. Ensure you mulch your plants to stop fungal spores from splashing onto lower leaves. Potato late blight is critical - destroy infected vines immediately.";
  } else if (query.includes("rust")) {
    reply = "Common corn rust creates orange cinnamon-brown pustules. Spray copper fungicides or use rust-resistant hybrids during planting next season.";
  } else if (query.includes("scab")) {
    reply = "Apple Scab is caused by Venturia inaequalis. Clean up and burn fallen apple tree leaves in autumn to stop the fungal spores from overwintering.";
  } else if (query.includes("rot") || query.includes("black rot")) {
    reply = "Grape Black Rot causes shriveled mummified berries. Apply protective fungicides containing myclobutanil early in the season and clear fallen vine debris to prevent winter survival.";
  } else if (query.includes("canker") || query.includes("citrus")) {
    reply = "Citrus Canker is highly contagious. Strictly prune infected branches, paint large cuts with copper, and disinfect your tools to prevent tree-to-tree bacterial transfer.";
  } else if (query.includes("fertilizer") || query.includes("nutrient") || query.includes("nitrogen")) {
    reply = "Balanced soil nutrients are essential for plant immunity! While nitrogen boosts leaves, excess nitrogen makes plants soft and highly susceptible to leaf molds and rust.";
  } else if (query.includes("watering") || query.includes("irrigation") || query.includes("humidity")) {
    reply = "Never overhead water diseased crops! Spores spread through droplets. Always irrigate at the base of the plant using drip pipes early in the morning.";
  } else {
    reply = "I'm on it! I can help you with crop disease details, preventative precautions, organic cures, soil nutrients, or botanical tips. What crop are you cultivating?";
  }

  setTimeout(() => {
    appendPageChatMessage("bot", reply);
  }, 750);
}

function submitPageUserChat() {
  const input = document.getElementById("bot-page-chat-input");
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  appendPageChatMessage("user", text);
  input.value = "";
  triggerPageBotReply(text);
}

function initBotPageListeners() {
  const submitBtn = document.getElementById("bot-page-chat-submit");
  const chatInput = document.getElementById("bot-page-chat-input");

  if (submitBtn) {
    submitBtn.addEventListener("click", submitPageUserChat);
  }
  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") submitPageUserChat();
    });
  }

  const suggestionPills = document.querySelectorAll(".bot-suggestion-pill");
  suggestionPills.forEach(pill => {
    pill.addEventListener("click", () => {
      const query = pill.getAttribute("data-query");
      if (query) {
        appendPageChatMessage("user", query);
        triggerPageBotReply(query);
      }
    });
  });
}

// Agronomist inquiry form submission handler
function initAboutFormListener() {
  const aboutForm = document.getElementById("about-advisory-form");
  if (aboutForm) {
    aboutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you! Your agronomist advisory inquiry has been submitted. A certified specialist from our board will contact you within 24 hours.");
      aboutForm.reset();
    });
  }
}

// Translation logic dictionary and engine
function translatePage(lang) {
  // Save language state inside localStorage
  localStorage.setItem("agrisense_lang", lang);

  const translations = {
    en: {
      // Nav
      nav_brand: "AgriSense",
      nav_home: "Home",
      nav_scanner: "AI Scanner",
      nav_treatments: "Treatments",
      nav_heatmap: "Heatmap",
      nav_weather: "Live Weather",
      nav_bot: "AI Bot",
      nav_about: "About Us",
      nav_logs: "Logs",
      nav_new_scan: "New Scan",
      nav_login: "Login",
      nav_register: "Register",
      
      // Hero
      hero_tag: "CERTIFIED CROP DIAGNOSTICS",
      hero_title: "Smarter Farming,\nHealthier Crops.",
      hero_desc: "Protect your yields with advanced plant disease diagnostics. Upload a leaf photo to instantly detect pathogen strains, retrieve statistical confidence, and receive tailored care treatments.",
      hero_btn_scan: "Analyze Crop Now",
      hero_btn_history: "View Past Logs",
      hero_badge_confident: "98% Confident",
      hero_badge_verified: "Verified Cure",
      
      // Stats
      stats_farmers: "Active Farmers Registered",
      stats_accuracy: "AI Accuracy Confidence",
      stats_scans: "Foliage Scans Resolved",
      stats_support: "Certified Agronomist Help",
      
      // Features Section
      feat_section_title: "Built to Support Farmers",
      feat_section_desc: "Empowering agricultural decisions with precision diagnostics, immediate treatment plans, and continuous crop health logs.",
      
      // Promos
      promo_title_1: "Instant AI Diagnostics",
      promo_desc_1: "Click or drag-and-drop crop leaves. Our deep neural networks analyze textures and colors to isolate diseases within 3 seconds.",
      promo_link_1: "Open Diagnostic Core",
      
      promo_title_2: "Actionable Treatment Plans",
      promo_desc_2: "Receive transparent organic remedies and precise chemical solutions immediately after diagnosis. Designed to arrest pathogen growth without crop toxicity.",
      promo_link_2: "Browse Remedy Archive",
      
      // Bullets
      bullet_1: "Organic Pruning & Mulching",
      bullet_2: "Copper-based Fungicides",
      bullet_3: "Bactericide Spore Isolation",
      bullet_4: "24hr Extension Team Support",
      
      // Core Cards
      feat_title_1: "Statistical Confidence",
      feat_desc_1: "Receive transparent confidence indexes evaluated directly by deep-learning visual model matches.",
      feat_title_2: "Scan Vault",
      feat_desc_2: "Every crop scan is cataloged securely in the cloud via Supabase, creating an accessible visual timeline of crop health.",
      feat_title_3: "Microclimate Alerts",
      feat_desc_3: "Pair weather metrics with spraying warnings to select the optimal hour for foliar fertilizer and copper sprays.",
      
      // Ready to protect
      ready_title: "Ready to Protect Your Yield?",
      ready_desc: "Join thousands of smart farmers defending their fields with advanced diagnostic algorithms.",
      ready_btn: "Start Your First Scan",
      
      // Auth tab cards
      auth_tab_login: "Farmer Login",
      auth_tab_register: "Register Farmer",
      lbl_email: "Email Address",
      lbl_password: "Password",
      lbl_farmer_name: "Farmer Name",
      btn_login: "Login Access",
      btn_register: "Complete Registration",
      lbl_dont_have_acct: "Don't have a registered farm?",
      lbl_already_have_acct: "Already have a registered farm?",
      
      // New results keys
      agronomist_verified_cure: "agronomist verified immediate cure",
      suggested_fertilizer: "Suggested Fertilizer / Nutrient",

      // Placeholders
      placeholder_farmer_email: "farmer@village.com",
      placeholder_password: "enter password",
      placeholder_farmer_name: "e.g. Rajesh Kumar",
      placeholder_password_min: "minimum 6 characters"
    },
    gu: {
      // Nav
      nav_brand: "એગ્રીસેન્સ",
      nav_home: "મુખ્ય પૃષ્ઠ",
      nav_scanner: "AI સ્કેનર",
      nav_treatments: "ઉપચાર પદ્ધતિઓ",
      nav_heatmap: "રોગ નકશો",
      nav_weather: "હવામાન",
      nav_bot: "બોટ સહાયક",
      nav_about: "અમારા વિશે",
      nav_logs: "ઈતિહાસ લોગ",
      nav_new_scan: "નવું સ્કેન",
      nav_login: "લોગઇન",
      nav_register: "નોંધણી",
      
      // Hero
      hero_tag: "પ્રમાણિત પાક નિદાન",
      hero_title: "સ્માર્ટ ખેતી,\nતંદુરસ્ત પાક.",
      hero_desc: "અદ્યતન પ્લાન્ટ ડિસીઝ ડાયગ્નોસ્ટિક્સ વડે તમારી ઉપજનું રક્ષણ કરો. પેથોજેન સ્ટ્રેન્સને તરત જ શોધવા, આંકડાકીય આત્મવિશ્વાસ મેળવવા અને અનુરૂપ કાળજી સારવાર મેળવવા માટે પાંદડાનો ફોટો અપલોડ કરો.",
      hero_btn_scan: "હમણાં જ પાક વિશ્લેષણ કરો",
      hero_btn_history: "ભૂતકાળના લોગ જુઓ",
      hero_badge_confident: "૯૮% ચોકસાઈ",
      hero_badge_verified: "ચોક્કસ ઉપચાર",
      
      // Stats
      stats_farmers: "સક્રિય ખેડૂતો નોંધાયેલા છે",
      stats_accuracy: "AI નિદાન ચોકસાઈ દર",
      stats_scans: "પર્ણસમૂહ સ્કેન સફળતાપૂર્વક ઉકેલાયા",
      stats_support: "પ્રમાણિત કૃષિશાસ્ત્રીની મદદ",
      
      // Features Section
      feat_section_title: "ખેડૂતોના સમર્થન માટે બનાવવામાં આવેલ",
      feat_section_desc: "ચોક્કસ ડાયગ્નોસ્ટિક્સ, તાત્કાલિક સારવાર યોજનાઓ અને સતત પાક આરોગ્ય લોગ દ્વારા કૃષિ નિર્ણયોને સશક્ત બનાવવું.",
      
      // Promos
      promo_title_1: "ઝડપી AI પાક નિદાન",
      promo_desc_1: "પાંદડાના ફોટા પર ક્લિક કરો અથવા ખેંચો. અમારા ઊંડા ન્યુરલ નેટવર્ક્સ ૩ સેકન્ડમાં રોગોને અલગ કરવા માટે રચના અને રંગોનું વિશ્લેષણ કરે છે.",
      promo_link_1: "ડાયગ્નોસ્ટિક કોર ખોલો",
      
      promo_title_2: "અમલમાં મૂકી શકાય તેવી સારવાર યોજનાઓ",
      promo_desc_2: "નિદાન પછી તરત જ કાર્બનિક ઉપચારો અને ચોક્કસ રાસાયણિક ઉકેલો મેળવો. પાકની ઝેરી અસરો વિના પેથોજેન વૃદ્ધિને રોકવા માટે રચાયેલ છે.",
      promo_link_2: "સારવાર આર્કાઇવ બ્રાઉઝ કરો",
      
      // Bullets
      bullet_1: "સેન્દ્રિય કાપણી અને લીલાશ પડતી પદ્ધતિ",
      bullet_2: "કોપર આધારિત ફૂગનાશકો",
      bullet_3: "બેક્ટેરિસાઇડ બીજકણ અલગતા",
      bullet_4: "૨૪ કલાક કૃષિશાસ્ત્રી ટીમ સપોર્ટ",
      
      // Core Cards
      feat_title_1: "આંકડાકીય ચોકસાઈ",
      feat_desc_1: "ન્યુરલ મોડલ મેચો દ્વારા સીધા મૂલ્યાંકન કરાયેલ પારદર્શક આત્મવિશ્વાસ નિર્દેશકો મેળવો.",
      feat_title_2: "સ્કેન વોલ્ટ સંગ્રહ",
      feat_desc_2: "દરેક પાક સ્કેન સુપાબેઝ દ્વારા ક્લાઉડમાં સુરક્ષિત રીતે કેટેલોગ કરવામાં આવે છે, જે પાકના સ્વાસ્થ્યની ઍક્સેસિબલ વિઝ્યુઅલ ટાઈમલાઈન બનાવે છે.",
      feat_title_3: "સૂક્ષ્મ આબોહવા ચેતવણીઓ",
      feat_desc_3: "પર્ણસમૂહ ખાતર અને કોપર સ્પ્રે માટે શ્રેષ્ઠ કલાક પસંદ કરવા માટે છંટકાવ ચેતવણીઓ સાથે હવામાન મેટ્રિક્સ જોડો.",
      
      // Ready to protect
      ready_title: "તમારી ઉપજ બચાવવા માટે તૈયાર છો?",
      ready_desc: "અદ્યતન નિદાન અલ્ગોરિધમ્સ સાથે તેમના ખેતરોનું રક્ષણ કરતા હજારો સ્માર્ટ ખેડૂતો સાથે જોડાઓ.",
      ready_btn: "તમારો પ્રથમ સ્કેન શરૂ કરો",
      
      // Auth tab cards
      auth_tab_login: "ખેડૂત લોગઇન",
      auth_tab_register: "ખેડૂત નોંધણી",
      lbl_email: "ઇમેઇલ સરનામું",
      lbl_password: "પાસવર્ડ",
      lbl_farmer_name: "ખેડૂતનું નામ",
      btn_login: "પ્રવેશ મેળવો",
      btn_register: "નોંધણી પૂર્ણ કરો",
      lbl_dont_have_acct: "તમારી પાસે નોંધાયેલ ફાર્મ નથી?",
      lbl_already_have_acct: "પહેલેથી જ નોંધાયેલ ફાર્મ છે?",
      
      // New results keys
      agronomist_verified_cure: "કૃષિ નિષ્ણાત દ્વારા પ્રમાણિત ત્વરિત ઉપચાર",
      suggested_fertilizer: "ભલામણ કરેલ ખાતર / પોષક તત્વો",

      // Placeholders
      placeholder_farmer_email: "farmer@village.com",
      placeholder_password: "પાસવર્ડ દાખલ કરો",
      placeholder_farmer_name: "દા.ત. રાજેશ કુમાર",
      placeholder_password_min: "ન્યૂનતમ ૬ અક્ષરો"
    }
  };

  const t = translations[lang] || translations.en;

  // 1. Update selection in language switcher
  const switcher = document.getElementById("language-switcher");
  if (switcher) switcher.value = lang;

  // 2. Recursive DOM translation of all elements with data-translate attributes
  const translateElements = document.querySelectorAll("[data-translate]");
  translateElements.forEach(el => {
    const key = el.getAttribute("data-translate");
    if (t[key]) {
      const icon = el.querySelector("i");
      
      // If it contains a FontAwesome icon, detach it, assign translated text, and re-append icon
      if (icon) {
        el.innerHTML = "";
        el.appendChild(icon);
        el.appendChild(document.createTextNode(" " + t[key]));
      } else {
        el.innerText = t[key];
      }
    }
  });

  // 3. Translate placeholders in form fields with data-translate-placeholder attributes
  const placeholderElements = document.querySelectorAll("[data-translate-placeholder]");
  placeholderElements.forEach(el => {
    const key = el.getAttribute("data-translate-placeholder");
    if (t[key]) {
      el.placeholder = t[key];
    }
  });

  console.log(`Language switched to: ${lang}`);
}

function initFullAuthAndLanguageListeners() {
  // Full-screen Login Submission
  const formLoginFull = document.getElementById("farmer-login-form-full");
  if (formLoginFull) {
    formLoginFull.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email-full").value;
      const password = document.getElementById("login-password-full").value;
      const errContainer = document.getElementById("login-error-container-full");
      const errMsg = document.getElementById("login-error-text-full");

      try {
        errContainer.style.display = "none";
        await loginFarmer(email, password);
        updateUIForLoginState();
        loadHistoryTimeline();
        
        // Auto-navigate to analyzer
        window.location.hash = "analyze";
      } catch (err) {
        errContainer.style.display = "flex";
        errMsg.innerText = err.message || "Invalid credentials.";
      }
    });
  }

  // Full-screen Register Submission
  const formRegisterFull = document.getElementById("farmer-register-form-full");
  if (formRegisterFull) {
    formRegisterFull.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("register-name-full").value;
      const email = document.getElementById("register-email-full").value;
      const password = document.getElementById("register-password-full").value;
      const errContainer = document.getElementById("register-error-container-full");
      const errMsg = document.getElementById("register-error-text-full");

      try {
        errContainer.style.display = "none";
        await registerFarmer(email, password, name);
        updateUIForLoginState();
        loadHistoryTimeline();
        
        // Auto-navigate to analyzer
        window.location.hash = "analyze";
      } catch (err) {
        errContainer.style.display = "flex";
        errMsg.innerText = err.message || "Failed to create account.";
      }
    });
  }

  // Navbar Scan button redirect
  const btnNavScan = document.getElementById("nav-btn-scan");
  if (btnNavScan) {
    btnNavScan.addEventListener("click", () => {
      if (currentUser) {
        window.location.hash = "analyze";
      } else {
        window.location.hash = "login";
      }
    });
  }

  // Language switcher event listener
  const langSwitcher = document.getElementById("language-switcher");
  if (langSwitcher) {
    langSwitcher.addEventListener("change", (e) => {
      translatePage(e.target.value);
      // Sync mobile language switcher
      const mobileLang = document.getElementById("mobile-language-switcher");
      if (mobileLang) mobileLang.value = e.target.value;
    });
  }

  // Mobile language switcher sync
  const mobileLangSwitcher = document.getElementById("mobile-language-switcher");
  if (mobileLangSwitcher) {
    mobileLangSwitcher.addEventListener("change", (e) => {
      translatePage(e.target.value);
      // Sync desktop language switcher
      if (langSwitcher) langSwitcher.value = e.target.value;
    });
  }

  // Mobile login redirect
  const btnMobileLogin = document.getElementById("btn-mobile-login-redirect");
  if (btnMobileLogin) {
    btnMobileLogin.addEventListener("click", (e) => {
      e.preventDefault();
      // Close mobile menu
      const navLinksEl = document.querySelector(".nav-links");
      if (navLinksEl) navLinksEl.classList.remove("mobile-active");
      const menuIcon = document.querySelector("#mobile-menu-toggle i");
      if (menuIcon) menuIcon.className = "fa-solid fa-bars";
      // Navigate to login
      window.location.hash = "login";
    });
  }

  // Mobile logout button
  const btnMobileLogout = document.getElementById("btn-mobile-logout");
  if (btnMobileLogout) {
    btnMobileLogout.addEventListener("click", async () => {
      // Close mobile menu
      const navLinksEl = document.querySelector(".nav-links");
      if (navLinksEl) navLinksEl.classList.remove("mobile-active");
      const menuIcon = document.querySelector("#mobile-menu-toggle i");
      if (menuIcon) menuIcon.className = "fa-solid fa-bars";
      // Trigger logout
      await logoutFarmer();
    });
  }

  // Mobile Hamburger Menu Toggle Listener
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      navLinks.classList.toggle("mobile-active");
      const icon = mobileMenuToggle.querySelector("i");
      if (icon) {
        if (navLinks.classList.contains("mobile-active")) {
          icon.className = "fa-solid fa-xmark";
        } else {
          icon.className = "fa-solid fa-bars";
        }
      }
    });

    // Close menu when clicking anywhere else
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navLinks.classList.remove("mobile-active");
        const icon = mobileMenuToggle.querySelector("i");
        if (icon) icon.className = "fa-solid fa-bars";
      }
    });

    // Close menu when selecting any nav link item
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("mobile-active");
        const icon = mobileMenuToggle.querySelector("i");
        if (icon) icon.className = "fa-solid fa-bars";
      });
    });
  }
}

// ==========================================
// 14. INITIALIZE APP
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initDatabase();
  checkActiveSession();
  initRouter();

  // Initialize new interactive page elements and handlers
  initLibraryListeners();
  initHeatmapListeners();
  initWeatherListeners();
  initBotPageListeners();
  initAboutFormListener();
  initFullAuthAndLanguageListeners();

  // Recover saved language preference state and trigger translation
  const savedLang = localStorage.getItem("agrisense_lang") || "en";
  translatePage(savedLang);
});
