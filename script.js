/**
 * Email Link Generator
 * Main JavaScript file with improved structure and organization
 */

// ============================================
// Configuration & Constants
// ============================================
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+(,\s*[^\s@]+@[^\s@]+\.[^\s@]+)*$/;
const GMAIL_BASE_URL = 'https://mail.google.com/mail/u/0/?';

// ============================================
// Translations
// ============================================
const translations = {
    he: {
        title: 'יוצר לינקים למייל',
        subtitle: 'צור בקלות קישורים למייל עם כל הפרטים הדרושים',
        to: 'כתובת מייל',
        cc: 'עותק (CC)',
        bcc: 'עותק מוסתר (BCC)',
        subject: 'נושא',
        body: 'תוכן',
        copyMailto: 'העתק לינק ל-Mailto',
        copyGmail: 'העתק לינק ל-Gmail',
        copied: 'הועתק לינק למייל!',
        copiedGmail: 'הועתק לינק ל-Gmail!',
        copyError: 'לא ניתן להעתיק, נסה להעתיק ידנית',
        placeholders: {
            to: 'example1@domain.com, example2@domain.com',
            cc: 'example1@domain.com, example2@domain.com',
            bcc: 'example1@domain.com, example2@domain.com',
            subject: 'הזן נושא להודעה',
            body: 'הזן את תוכן ההודעה'
        },
        placeholder: 'הזן כתובת מייל כדי להתחיל ליצור קישורים',
        required: 'שדה חובה',
        invalidEmail: 'כתובת מייל אינה תקינה',
        buttonTooltip: 'הזן כתובת מייל תקינה כדי להעתיק',
        addFields: 'עותק / עותק מוסתר',
        hideFields: 'הסתר עותקים',
        disabledButtonTooltip: 'הזן כתובת מייל תקינה כדי להמשיך'
    },
    en: {
        title: 'Email Link Generator',
        subtitle: 'Easily create email links with all the details you need',
        to: 'Email Address',
        cc: 'CC',
        bcc: 'BCC',
        subject: 'Subject',
        body: 'Message',
        copyMailto: 'Copy Mailto Link',
        copyGmail: 'Copy Gmail Link',
        copied: 'Email link copied!',
        copiedGmail: 'Gmail link copied!',
        copyError: 'Could not copy, try copying manually',
        placeholders: {
            to: 'example1@domain.com, example2@domain.com',
            cc: 'example1@domain.com, example2@domain.com',
            bcc: 'example1@domain.com, example2@domain.com',
            subject: 'Enter message subject',
            body: 'Enter message content'
        },
        placeholder: 'Enter an email address to start creating links',
        required: 'Required field',
        invalidEmail: 'Invalid email address',
        buttonTooltip: 'Enter a valid email to copy',
        addFields: 'Add CC/BCC',
        hideFields: 'Hide CC/BCC',
        disabledButtonTooltip: 'Enter a valid email to continue'
    }
};

// ============================================
// State Management
// ============================================
let currentLanguage = detectLanguage();

// ============================================
// Utility Functions
// ============================================

/**
 * Detects user's preferred language
 * @returns {string} Language code ('he' or 'en')
 */
function detectLanguage() {
    return navigator.language.toLowerCase().split('-')[0] === 'he' ? 'he' : 'en';
}

/**
 * Gets current translation object
 * @returns {Object} Translation object for current language
 */
function getTranslations() {
    return translations[currentLanguage];
}

/**
 * Validates email addresses
 * @param {string} emailString - Comma-separated email addresses
 * @returns {boolean} True if all emails are valid
 */
function validateEmails(emailString) {
    if (!emailString || emailString.trim().length === 0) {
        return false;
    }
    
    const emails = emailString.split(/[,\s]+/).filter(email => email.length > 0);
    return emails.every(email => EMAIL_REGEX.test(email.trim()));
}

/**
 * Gets form field values
 * @returns {Object} Object containing all form field values
 */
function getFormValues() {
    return {
        to: document.getElementById('to').value.trim(),
        cc: document.getElementById('cc').value.trim(),
        bcc: document.getElementById('bcc').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        body: document.getElementById('body').value.trim()
    };
}

// ============================================
// Link Generation Functions
// ============================================

/**
 * Generates a mailto: link
 * @returns {string} Generated mailto link
 */
function generateMailto() {
    const values = getFormValues();
    let mailto = `mailto:${values.to}`;
    const params = [];

    if (values.cc) {
        params.push(`cc=${encodeURIComponent(values.cc).replace(/%40/g, '@')}`);
    }
    if (values.bcc) {
        params.push(`bcc=${encodeURIComponent(values.bcc).replace(/%40/g, '@')}`);
    }
    if (values.subject) {
        params.push(`subject=${encodeURIComponent(values.subject)}`);
    }
    if (values.body) {
        params.push(`body=${encodeURIComponent(values.body)}`);
    }

    if (params.length > 0) {
        mailto += '?' + params.join('&');
    }

    return mailto;
}

/**
 * Generates a Gmail link
 * @returns {string} Generated Gmail link
 */
function generateGmailLink() {
    const values = getFormValues();
    const params = ['view=cm', 'fs=1'];
    
    if (values.to) params.push(`to=${encodeURIComponent(values.to)}`);
    if (values.cc) params.push(`cc=${encodeURIComponent(values.cc)}`);
    if (values.bcc) params.push(`bcc=${encodeURIComponent(values.bcc)}`);
    if (values.subject) params.push(`su=${encodeURIComponent(values.subject)}`);
    if (values.body) params.push(`body=${encodeURIComponent(values.body)}`);

    return GMAIL_BASE_URL + params.join('&');
}

// ============================================
// Clipboard Functions
// ============================================

/**
 * Copies text to clipboard with fallback
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} True if copy succeeded
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

/**
 * Copies mailto link to clipboard
 */
async function copyMailto() {
    const link = generateMailto();
    const success = await copyToClipboard(link);
    
    if (success) {
        showCopyStatus('mailto');
    } else {
        showCopyStatus('error');
    }
}

/**
 * Copies Gmail link to clipboard
 */
async function copyLink() {
    const link = generateGmailLink();
    const success = await copyToClipboard(link);
    
    if (success) {
        showCopyStatus('gmail');
    } else {
        showCopyStatus('error');
    }
}

// ============================================
// UI Update Functions
// ============================================

/**
 * Shows copy status notification
 * @param {string} type - Type of status ('mailto', 'gmail', 'error')
 */
function showCopyStatus(type) {
    const t = getTranslations();
    let message;
    
    switch(type) {
        case 'mailto':
            message = t.copied;
            break;
        case 'gmail':
            message = t.copiedGmail;
            break;
        case 'error':
            message = t.copyError;
            break;
        default:
            message = '';
    }
    
    const statusElement = document.getElementById('copyStatus');
    statusElement.textContent = message;
    statusElement.classList.add('show');
    
    setTimeout(() => {
        statusElement.classList.remove('show');
    }, 2000);
}

/**
 * Updates button states based on form validation
 * Enables/disables copy buttons based on email field validity
 * Buttons are disabled if email field is empty or contains invalid addresses
 */
function updateButtonStates() {
    const emailInput = document.getElementById('to');
    const isValid = validateEmails(emailInput.value);
    const buttons = document.querySelectorAll('.buttons button');
    
    buttons.forEach(button => {
        button.disabled = !isValid;
    });
}

/**
 * Updates UI language
 */
function updateUILanguage() {
    const t = getTranslations();
    
    // Update page direction
    document.documentElement.dir = currentLanguage === 'he' ? 'rtl' : 'ltr';
    
    // Update title and subtitle
    document.title = t.title;
    const h2 = document.querySelector('h2');
    const subtitle = document.querySelector('.subtitle');
    if (h2) h2.textContent = t.title;
    if (subtitle) subtitle.textContent = t.subtitle;
    
    // Update labels and placeholders
    document.querySelectorAll('.form-group').forEach(group => {
        const label = group.querySelector('label');
        const input = group.querySelector('input, textarea');
        
        if (label && input) {
            const inputId = input.id;
            if (t[inputId]) {
                label.textContent = t[inputId];
            }
            if (t.placeholders && t.placeholders[inputId]) {
                input.placeholder = t.placeholders[inputId];
            }
        }
    });

    // Update footer
    const footer = document.querySelector('.footer p');
    if (footer) {
        if (currentLanguage === 'he') {
            footer.innerHTML = 'נבנה ע״י <a href="https://github.com/https1121" target="_blank" rel="noopener" tabindex="-1">Https1121</a><span class="separator">•</span><a href="https://github.com/https1121/mailtolink" target="_blank" rel="noopener" tabindex="-1">קוד מקור</a>';
        } else {
            footer.innerHTML = 'Built by <a href="https://github.com/https1121" target="_blank" rel="noopener" tabindex="-1">Https1121</a><span class="separator">•</span><a href="https://github.com/https1121/mailtolink" target="_blank" rel="noopener" tabindex="-1">Source Code</a>';
        }
    }
    
    // Update buttons
    document.querySelectorAll('button').forEach(button => {
        if (button.getAttribute('onclick') === 'copyMailto()') {
            button.textContent = t.copyMailto;
            button.setAttribute('data-tooltip', t.buttonTooltip);
        } else if (button.getAttribute('onclick') === 'copyLink()') {
            button.textContent = t.copyGmail;
            button.setAttribute('data-tooltip', t.buttonTooltip);
        } else if (button.classList.contains('add-fields-button')) {
            const additionalFields = document.querySelector('.additional-fields');
            const isVisible = additionalFields && additionalFields.classList.contains('visible');
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 9l-7 7-7-7"></path>
                </svg>
                ${isVisible ? t.hideFields : t.addFields}
            `;
        }
    });
}

// ============================================
// Event Handlers
// ============================================

/**
 * Handles add fields button click
 * Toggles visibility of CC/BCC fields and updates tabindex for accessibility
 * When fields are hidden, they are removed from tab order (tabindex="-1")
 * When fields are shown, they are added back to tab order
 */
function handleAddFieldsClick() {
    const t = getTranslations();
    const additionalFields = document.querySelector('.additional-fields');
    const button = document.querySelector('.add-fields-button');
    
    if (!additionalFields || !button) return;
    
    const isVisible = additionalFields.classList.contains('visible');
    
    // Update button text
    button.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"></path>
        </svg>
        ${!isVisible ? t.hideFields : t.addFields}
    `;
    
    // Toggle visibility
    button.classList.toggle('active');
    additionalFields.classList.toggle('visible');
    
    // Update tabindex for CC and BCC fields
    const ccInput = document.getElementById('cc');
    const bccInput = document.getElementById('bcc');
    
    if (!isVisible) {
        // Fields are being shown - make them accessible via tab
        if (ccInput) ccInput.removeAttribute('tabindex');
        if (bccInput) bccInput.removeAttribute('tabindex');
    } else {
        // Fields are being hidden - remove from tab order
        if (ccInput) ccInput.setAttribute('tabindex', '-1');
        if (bccInput) bccInput.setAttribute('tabindex', '-1');
    }
}

/**
 * Handles form input events
 */
function handleInputChange() {
    updateButtonStates();
}

/**
 * Handles email field validation
 */
function handleEmailValidation(e) {
    e.preventDefault();
    const t = getTranslations();
    const input = e.target;
    
    if (!input.value) {
        input.setCustomValidity(t.required);
    } else {
        input.setCustomValidity(t.invalidEmail);
    }
}

/**
 * Loads URL parameters into form
 * Allows pre-filling form fields via URL query parameters
 * Example: ?to=test@example.com&subject=Hello&body=World
 * Supported parameters: to, cc, bcc, subject, body
 */
function loadURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const fields = ['to', 'cc', 'bcc', 'subject', 'body'];
    
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element && urlParams.has(field)) {
            element.value = urlParams.get(field);
        }
    });
    
    updateButtonStates();
}

/**
 * Initializes theme based on system preference
 * Prevents theme flash by setting theme before CSS loads
 * Detects user's preferred color scheme (dark/light mode)
 */
function initializeTheme() {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
}

// ============================================
// Initialization
// ============================================

/**
 * Initializes the application
 */
function init() {
    // Prevent theme flash
    initializeTheme();
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
}

/**
 * Initializes app after DOM is ready
 */
function initializeApp() {
    // Load URL parameters
    loadURLParameters();
    
    // Update UI language
    updateUILanguage();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update button states
    updateButtonStates();
    
    // Set initial tabindex for hidden fields
    const additionalFields = document.querySelector('.additional-fields');
    if (additionalFields && !additionalFields.classList.contains('visible')) {
        const ccInput = document.getElementById('cc');
        const bccInput = document.getElementById('bcc');
        if (ccInput) ccInput.setAttribute('tabindex', '-1');
        if (bccInput) bccInput.setAttribute('tabindex', '-1');
    }
}

/**
 * Sets up all event listeners
 */
function setupEventListeners() {
    // Form input listeners
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', handleInputChange);
    });
    
    // Email validation
    const emailInput = document.getElementById('to');
    if (emailInput) {
        emailInput.addEventListener('invalid', handleEmailValidation);
    }
    
    // Add fields button
    const addFieldsButton = document.querySelector('.add-fields-button');
    if (addFieldsButton) {
        addFieldsButton.addEventListener('click', handleAddFieldsClick);
    }
    
    // Form submit prevention
    const form = document.getElementById('emailForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }
    
    // Language change listener
    window.addEventListener('languagechange', () => {
        currentLanguage = detectLanguage();
        updateUILanguage();
    });
    
    // Prevent default invalid event behavior
    document.addEventListener('invalid', (e) => {
        e.preventDefault();
    }, true);
}

// ============================================
// Modal Functions
// ============================================

/**
 * Opens a help modal
 * @param {string} modalId - ID of the modal to open ('how-it-works' or 'links-difference')
 */
function openHelpModal(modalId) {
    const overlay = document.getElementById('modalOverlay');
    const modal = document.getElementById(modalId === 'how-it-works' ? 'howItWorksModal' : 'linksDifferenceModal');
    
    if (!overlay || !modal) return;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Show overlay and modal
    overlay.classList.add('active');
    modal.classList.add('active');
}

/**
 * Closes the help modal
 */
function closeHelpModal() {
    const overlay = document.getElementById('modalOverlay');
    const modals = document.querySelectorAll('.modal');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Hide overlay and all modals
    if (overlay) overlay.classList.remove('active');
    modals.forEach(modal => modal.classList.remove('active'));
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeHelpModal();
    }
});

// ============================================
// Global Functions (for onclick handlers)
// ============================================
window.copyMailto = copyMailto;
window.copyLink = copyLink;
window.openHelpModal = openHelpModal;
window.closeHelpModal = closeHelpModal;

// ============================================
// Start Application
// ============================================
init();
