/**
 * GeneWise Health - Pharmacogenomics Frontend
 * Handles VCF upload, drug analysis, and result display
 */

// ============================================
// DOM ELEMENT REFERENCES
// ============================================

const analysisForm = document.getElementById('analysisForm');
const vcfFileInput = document.getElementById('vcfFile');
const fileNameLabel = document.getElementById('fileName');
const drugNameInput = document.getElementById('drugName');
const fileInputWrapper = document.querySelector('.file-input-wrapper');

const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');
const inputSection = document.querySelector('.input-section');

// Result elements
const resultGene = document.getElementById('resultGene');
const resultVariant = document.getElementById('resultVariant');
const resultDrug = document.getElementById('resultDrug');
const riskBadge = document.getElementById('riskBadge');
const riskValue = document.getElementById('riskValue');
const resultRecommendation = document.getElementById('resultRecommendation');
const resultExplanation = document.getElementById('resultExplanation');
const errorMessage = document.getElementById('errorMessage');

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    analysisForm.addEventListener('submit', handleFormSubmit);
    vcfFileInput.addEventListener('change', handleFileChange);
});

// ============================================
// FILE HANDLING
// ============================================

/**
 * Update file input label when file is selected
 */
function handleFileChange(event) {
    const file = event.target.files[0];

    if (file) {
        fileNameLabel.textContent = file.name;
        fileInputWrapper.classList.add('has-file');
    } else {
        fileNameLabel.textContent = 'Choose VCF file...';
        fileInputWrapper.classList.remove('has-file');
    }
}

// ============================================
// FORM SUBMISSION
// ============================================

/**
 * Handle form submission - validate and send to backend
 */
async function handleFormSubmit(event) {
    event.preventDefault();

    // Hide previous sections
    hideAllSections();

    // Validate inputs
    const validated = validateInputs();
    if (!validated.valid) {
        showError(validated.message);
        return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('vcf', vcfFileInput.files[0]);
    formData.append('drug', drugNameInput.value.trim());

    // Show loading state
    showLoading();

    try {
        // Call backend API
        const response = await sendAnalysisRequest(formData);

        // Validate response
        if (!response || typeof response !== 'object') {
            throw new Error('Invalid response format from server');
        }

        // Display results
        displayResults(response);
    } catch (error) {
        console.error('Analysis error:', error);
        showError(error.message || 'An error occurred during analysis. Please try again.');
    }
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validate form inputs
 */
function validateInputs() {
    const file = vcfFileInput.files[0];
    const drug = drugNameInput.value.trim();

    if (!file) {
        return {
            valid: false,
            message: 'Please upload a VCF file before analyzing.'
        };
    }

    if (!drug) {
        return {
            valid: false,
            message: 'Please enter a medication name before analyzing.'
        };
    }

    const validExtensions = ['.vcf', '.gz', '.txt'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

    if (!hasValidExtension) {
        return {
            valid: false,
            message: 'Please upload a valid VCF file (accepted: .vcf, .vcf.gz, .txt).'
        };
    }

    return { valid: true };
}

// ============================================
// API COMMUNICATION
// ============================================

/**
 * Send analysis request to backend API
 * Assumes backend API endpoint: POST /api/analyze
 */
async function sendAnalysisRequest(formData) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            body: formData,
            signal: controller.signal,
            headers: {
                'Accept': 'application/json'
            }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message ||
                `Server error: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error('Request timeout. Please check your connection and try again.');
        }

        if (error instanceof SyntaxError) {
            throw new Error('Invalid response format from server.');
        }

        throw error;
    }
}

// ============================================
// UI DISPLAY FUNCTIONS
// ============================================

/**
 * Display analysis results in UI
 */
function displayResults(data) {
    // Extract data safely with defaults
    const gene = normalizeValue(data.gene);
    const variant = normalizeValue(data.variant || data.metabolizerStatus);
    const drug = normalizeValue(data.drug || data.medication);
    const risk = normalizeValue(data.risk || data.riskCategory);
    const recommendation = normalizeValue(data.recommendation);
    const explanation = normalizeValue(data.explanation || data.aiExplanation);

    // Validate critical fields
    if (!gene || !variant || !drug) {
        throw new Error('Incomplete data received from analysis. Please try again.');
    }

    // Update result elements
    resultGene.textContent = gene;
    resultVariant.textContent = variant;
    resultDrug.textContent = drug;
    resultRecommendation.textContent = recommendation;
    resultExplanation.textContent = explanation;

    // Update risk badge with color coding
    updateRiskBadge(risk);

    // Scroll to results
    hideAllSections();
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Update risk badge with color coding
 */
function updateRiskBadge(riskLevel) {
    // Clear previous classes
    riskBadge.classList.remove('risk-low', 'risk-medium', 'risk-high');

    // Normalize risk level
    const normalizedRisk = riskLevel.toLowerCase().trim();

    // Determine risk category and color
    let riskClass = 'risk-medium';
    if (normalizedRisk.includes('low') || normalizedRisk.includes('safe') || normalizedRisk.includes('normal')) {
        riskClass = 'risk-low';
    } else if (normalizedRisk.includes('high') || normalizedRisk.includes('severe') || normalizedRisk.includes('critical')) {
        riskClass = 'risk-high';
    }

    riskBadge.classList.add(riskClass);
    riskValue.textContent = riskLevel;
}

/**
 * Show loading spinner
 */
function showLoading() {
    hideAllSections();
    loadingSection.classList.remove('hidden');
}

/**
 * Show error message
 */
function showError(message) {
    hideAllSections();
    errorMessage.textContent = message;
    errorSection.classList.remove('hidden');
    errorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Hide all result/error/loading sections
 */
function hideAllSections() {
    loadingSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    errorSection.classList.add('hidden');
}

/**
 * Reset form and go back to input
 */
function resetForm() {
    analysisForm.reset();
    vcfFileInput.value = '';
    fileNameLabel.textContent = 'Choose VCF file...';
    fileInputWrapper.classList.remove('has-file');
    drugNameInput.value = '';

    hideAllSections();
    inputSection.classList.remove('hidden');
    inputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Dismiss error and go back to input
 */
function dismissError() {
    hideAllSections();
    inputSection.classList.remove('hidden');
    inputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Normalize and validate data values
 */
function normalizeValue(value) {
    if (value === null || value === undefined) {
        return '—';
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed === '' ? '—' : trimmed;
    }

    if (typeof value === 'number') {
        return value.toString();
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return '—';
}
