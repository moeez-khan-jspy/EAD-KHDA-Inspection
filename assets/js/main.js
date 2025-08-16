// Main JavaScript functionality for KHDA Inspection Website
class KHDAInspectionApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeInspectorPage();
        this.setupSmoothScrolling();
    }

    setupEventListeners() {
        // General navigation and smooth scrolling
        document.addEventListener('DOMContentLoaded', () => {
            this.setupSmoothScrolling();
        });

        // Add click handlers for buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn[href="#features"]')) {
                e.preventDefault();
                this.scrollToSection('features');
            }
        });
    }

    setupSmoothScrolling() {
        // Smooth scrolling for anchor links
        const scrollToSection = (targetId) => {
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        };

        // Attach to window for global access
        window.scrollToSection = scrollToSection;
    }

    scrollToSection(targetId) {
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    initializeInspectorPage() {
        // Only run on inspector page
        if (!document.getElementById('inspector-app')) return;

        // Initialize inspector functionality
        this.setupInspectorApp();
    }

    setupInspectorApp() {
        // Inspector Page State
        const state = {
            file: null,
            status: { message: "", type: null },
            isBusy: false,
            analysisText: "",
            reportFile: ""
        };

        // API Configuration
        const API_BASE_URL = "https://web-production-48e9c.up.railway.app/api/v1";
        const ANALYSIS_URL = `${API_BASE_URL}/analysis/analyze`;
        const REPORT_URL = `${API_BASE_URL}/inspection/generate-report`;
        const DOWNLOAD_BASE_URL = `${API_BASE_URL}/reports/`;

        // DOM Elements
        const fileInput = document.getElementById('file-input');
        const analyzeForm = document.getElementById('analyze-form');
        const analyzeBtn = document.getElementById('analyze-btn');
        const generateBtn = document.getElementById('generate-btn');
        const downloadBtn = document.getElementById('download-btn');
        const statusAlert = document.getElementById('status-alert');
        const analysisContainer = document.getElementById('analysis-container');
        const fileSelectedSpan = document.getElementById('file-selected');

        // Utility Functions
        const updateButtonState = (button, isLoading, loadingText, defaultText) => {
            if (isLoading) {
                button.disabled = true;
                button.innerHTML = `
                    <svg class="icon animate-spin" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m8 12 4 4 4-4"></path>
                    </svg>
                    ${loadingText}
                `;
            } else {
                button.disabled = false;
                button.innerHTML = defaultText;
            }
        };

        const showStatus = (message, type) => {
            state.status = { message, type };
            if (message) {
                statusAlert.className = `alert ${type === 'error' ? 'alert-destructive' : 'alert-default'}`;
                statusAlert.innerHTML = `
                    <div class="alert-title">${type === 'error' ? 'There was a problem' : 'Working...'}</div>
                    <div class="alert-description">${message}</div>
                `;
                statusAlert.style.display = 'block';
            } else {
                statusAlert.style.display = 'none';
            }
        };

        const updateAnalysisDisplay = (text) => {
            if (text) {
                analysisContainer.innerHTML = `<div class="analysis-content">${this.parseMarkdown(text)}</div>`;
            } else {
                analysisContainer.innerHTML = `
                    <p class="analysis-placeholder">
                        No analysis yet. Upload a document and click "Analyze Document" to see structured findings here.
                    </p>
                `;
            }
        };

        const updateDownloadButton = () => {
            if (state.reportFile) {
                downloadBtn.href = `${DOWNLOAD_BASE_URL}${state.reportFile}`;
                downloadBtn.style.display = 'inline-flex';
                document.getElementById('report-notice').style.display = 'block';
            } else {
                downloadBtn.style.display = 'none';
                document.getElementById('report-notice').style.display = 'none';
            }
        };

        // File Input Handler
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files?.[0];
                state.file = file || null;
                
                // Reset downstream state
                state.analysisText = "";
                state.reportFile = "";
                showStatus("", null);
                updateAnalysisDisplay("");
                updateDownloadButton();

                // Update UI
                if (file) {
                    fileSelectedSpan.textContent = `Selected: ${file.name}`;
                    fileSelectedSpan.style.display = 'inline';
                    analyzeBtn.disabled = false;
                } else {
                    fileSelectedSpan.style.display = 'none';
                    analyzeBtn.disabled = true;
                }
                
                generateBtn.disabled = true;
            });
        }

        // Analyze Form Handler
        if (analyzeForm) {
            analyzeForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                if (!state.file) {
                    showStatus("Please select a file to analyze.", "error");
                    return;
                }

                state.isBusy = true;
                showStatus("Analyzing document... This may take a moment.", "info");
                updateButtonState(analyzeBtn, true, "Processing", "Analyze Document");
                
                state.analysisText = "";
                state.reportFile = "";
                updateAnalysisDisplay("");
                updateDownloadButton();

                try {
                    const formData = new FormData();
                    formData.append("file", state.file);
                    
                    const response = await fetch(ANALYSIS_URL, {
                        method: "POST",
                        body: formData,
                    });

                    const result = await response.json();
                    
                    if (!response.ok) {
                        throw new Error(result?.detail || "Analysis failed. Please try again.");
                    }

                    state.analysisText = result?.result || "";
                    updateAnalysisDisplay(state.analysisText);
                    showStatus("", null);
                    
                    // Enable generate button
                    generateBtn.disabled = false;

                } catch (error) {
                    showStatus(`Error during analysis: ${error?.message || "Unknown error"}`, "error");
                } finally {
                    state.isBusy = false;
                    updateButtonState(analyzeBtn, false, "", "Analyze Document");
                }
            });
        }

        // Generate Report Handler
        if (generateBtn) {
            generateBtn.addEventListener('click', async () => {
                if (!state.analysisText) {
                    showStatus("No analysis text available to generate a report.", "error");
                    return;
                }

                state.isBusy = true;
                state.reportFile = "";
                showStatus("Generating report with AI agents... This is a complex task and can take up to a minute.", "info");
                updateButtonState(generateBtn, true, "Generating", "Generate Inspection Report");
                updateDownloadButton();

                try {
                    const response = await fetch(REPORT_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ analysis_text: state.analysisText }),
                    });

                    const result = await response.json();
                    
                    if (!response.ok) {
                        throw new Error(result?.detail || "Report generation failed.");
                    }

                    const filename = result?.report_filename;
                    state.reportFile = filename || "";
                    updateDownloadButton();
                    showStatus("", null);

                } catch (error) {
                    showStatus(`Error generating report: ${error?.message || "Unknown error"}`, "error");
                } finally {
                    state.isBusy = false;
                    updateButtonState(generateBtn, false, "", "Generate Inspection Report");
                }
            });
        }

        // Initialize UI state
        if (analyzeBtn) analyzeBtn.disabled = true;
        if (generateBtn) generateBtn.disabled = true;
        updateAnalysisDisplay("");
        updateDownloadButton();
    }

    // Simple Markdown Parser
    parseMarkdown(text) {
        return text
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            // Code blocks
            .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
            // Inline code
            .replace(/`([^`]*)`/gim, '<code>$1</code>')
            // Lists
            .replace(/^\* (.*$)/gim, '<li>$1</li>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            // Line breaks
            .replace(/\n\n/gim, '</p><p>')
            .replace(/\n/gim, '<br>')
            // Wrap in paragraphs
            .replace(/^(.*)$/gim, '<p>$1</p>')
            // Clean up list items
            .replace(/<p><li>/gim, '<ul><li>')
            .replace(/<\/li><\/p>/gim, '</li></ul>')
            // Clean up multiple paragraphs
            .replace(/<\/p><p><\/p><p>/gim, '</p><p>');
    }
}

// Utility Functions for Icons (SVG)
const Icons = {
    arrowRight: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    
    fileUp: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/></svg>`,
    
    fileText: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>`,
    
    download: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    
    rocket: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
    
    shieldCheck: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>`,
    
    bot: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`,
    
    loader: `<svg class="icon animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>`
};

// Helper function to insert icons into buttons
const insertIcon = (selector, iconName) => {
    const element = document.querySelector(selector);
    if (element && Icons[iconName]) {
        element.innerHTML = Icons[iconName] + element.innerHTML;
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new KHDAInspectionApp();
    
    // Add icons to buttons that need them
    setTimeout(() => {
        insertIcon('.btn[href="/inspector"] .icon-placeholder', 'arrowRight');
        insertIcon('#analyze-btn .icon-placeholder', 'fileUp');
        insertIcon('#generate-btn .icon-placeholder', 'rocket');
        insertIcon('#download-btn .icon-placeholder', 'download');
    }, 100);
});

// Utility function for smooth scrolling (global access)
window.scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KHDAInspectionApp;
} 