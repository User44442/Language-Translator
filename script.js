const inputText = document.getElementById('input-text');
const inputLang = document.getElementById('input-lang');
const outputLang = document.getElementById('output-lang');
const outputText = document.getElementById('output-text');
const translateBtn = document.getElementById('translate-btn');
const themeToggle = document.getElementById('theme-toggle');
const historyBtn = document.getElementById('history-btn');
const settingsBtn = document.getElementById('settings-btn');
const historyModal = document.getElementById('history-modal');
const settingsModal = document.getElementById('settings-modal');
const historyList = document.getElementById('history-list');
const closeHistory = document.querySelector('.close-history');
const closeSettings = document.querySelector('.close-settings');

const apiUrl = "https://libretranslate.de/translate"; // Free API Endpoint

const languages = {
    en: "English", es: "Spanish", fr: "French", de: "German", hi: "Hindi", zh: "Chinese", ru: "Russian", ar: "Arabic",
    ja: "Japanese", ko: "Korean", pt: "Portuguese", it: "Italian", nl: "Dutch"
};

// Populate language dropdowns
function populateLanguages() {
    for (let code in languages) {
        let option1 = new Option(languages[code], code);
        let option2 = new Option(languages[code], code);
        inputLang.add(option1);
        outputLang.add(option2);
    }
    inputLang.value = "en";
    outputLang.value = "es";
}

// Translate text using LibreTranslate
async function translateText() {
    let text = inputText.value.trim();
    let source = inputLang.value;
    let target = outputLang.value;

    if (!text) return;

    try {
        let response = await fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify({
                q: text,
                source: source,
                target: target,
                format: "text"
            }),
            headers: { "Content-Type": "application/json" }
        });

        let data = await response.json();
        if (data.translatedText) {
            outputText.value = data.translatedText;
            saveToHistory(text, data.translatedText, source, target);
        } else {
            outputText.value = "Translation failed.";
        }
    } catch (error) {
        outputText.value = "Error: Unable to translate.";
    }
}

// Save translation history in localStorage
function saveToHistory(original, translated, source, target) {
    let history = JSON.parse(localStorage.getItem('translationHistory')) || [];
    history.push({ original, translated, source, target, date: new Date().toLocaleString() });
    localStorage.setItem('translationHistory', JSON.stringify(history));
}

// Show translation history
function showHistory() {
    historyList.innerHTML = "";
    let history = JSON.parse(localStorage.getItem('translationHistory')) || [];

    history.forEach(entry => {
        let listItem = document.createElement('li');
        listItem.textContent = `${entry.date} | ${languages[entry.source]} ➝ ${languages[entry.target]}: ${entry.original} → ${entry.translated}`;
        historyList.appendChild(listItem);
    });

    historyModal.style.display = "block";
}

// Toggle dark theme
function toggleTheme() {
    if (document.body.style.backgroundColor === "white") {
        document.body.style.backgroundColor = "#1e1e1e";
        document.body.style.color = "white";
        themeToggle.textContent = "🌙";
    } else {
        document.body.style.backgroundColor = "white";
        document.body.style.color = "black";
        themeToggle.textContent = "☀️";
    }
}

// Show/hide modals
settingsBtn.addEventListener('click', () => settingsModal.style.display = "block");
closeSettings.addEventListener('click', () => settingsModal.style.display = "none");

historyBtn.addEventListener('click', showHistory);
closeHistory.addEventListener('click', () => historyModal.style.display = "none");

// Event listeners
populateLanguages();
translateBtn.addEventListener('click', translateText);
themeToggle.addEventListener('click', toggleTheme);