/**
 * SIMS Application Form Handler
 * Manages the multi-step application process with signature capture
 * Author: SIMS Development Team
 * Last Updated: 2025
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('SIMS Application Form: Initializing...');

  // DOM Element References
  const elements = {
    sections: {
      name: document.getElementById('name-section'),
      signature: document.getElementById('signature-section'),
      result: document.getElementById('result-section'),
      form: document.getElementById('form-section')
    },
    inputs: {
      fullName: document.getElementById('fullName'),
      canvas: document.getElementById('signature-pad'),
      container: document.getElementById('signature-pad-container')
    },
    buttons: {
      next: document.getElementById('next-to-signature'),
      clear: document.getElementById('clear-signature'),
      save: document.getElementById('save-signature')
    },
    errors: {
      name: document.getElementById('name-error'),
      signature: document.getElementById('signature-error')
    },
    results: {
      name: document.getElementById('result-name'),
      image: document.getElementById('signature-image'),
      iframe: document.getElementById('google-form-iframe')
    }
  };

  // Configuration
  const config = {
    googleFormUrl: 'https://forms.gle/xjoDkXWbniG15z1v6',
    confirmationDelay: 2500,
    signature: {
      backgroundColor: 'rgb(253, 253, 253)',
      penColor: 'rgb(0, 0, 0)',
      fontSize: 24,
      padding: 20
    }
  };

  // Application State
  let signaturePad = null;
  let isInitialized = false;

  /**
   * Validates that all required DOM elements exist
   * @returns {boolean} True if all elements are found
   */
  function validateDOMElements() {
    const missing = [];
    
    // Check sections
    Object.entries(elements.sections).forEach(([key, element]) => {
      if (!element) missing.push(`${key}-section`);
    });

    // Check critical inputs
    if (!elements.inputs.fullName) missing.push('fullName input');
    if (!elements.inputs.canvas) missing.push('signature canvas');

    if (missing.length > 0) {
      console.error('SIMS Application Form: Missing DOM elements:', missing);
      return false;
    }

    return true;
  }

  /**
   * Resizes the signature canvas to match container dimensions
   * Maintains proper pixel ratio for crisp signatures
   */
  function resizeCanvas() {
    try {
      if (!elements.inputs.canvas || !elements.inputs.container) return;

      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const container = elements.inputs.container;
      
      elements.inputs.canvas.width = container.offsetWidth * ratio;
      elements.inputs.canvas.height = container.offsetHeight * ratio;
      
      const ctx = elements.inputs.canvas.getContext('2d');
      ctx.scale(ratio, ratio);
      
      if (signaturePad) {
        signaturePad.clear();
      }
      
      console.log('SIMS Application Form: Canvas resized successfully');
    } catch (error) {
      console.error('SIMS Application Form: Canvas resize failed:', error);
    }
  }

  /**
   * Initializes the signature pad component
   * Only called when the signature section becomes visible
   */
  function initializeSignaturePad() {
    try {
      if (signaturePad || !window.SignaturePad) {
        console.warn('SIMS Application Form: SignaturePad already initialized or library not loaded');
        return;
      }

      signaturePad = new SignaturePad(elements.inputs.canvas, {
        backgroundColor: config.signature.backgroundColor,
        penColor: config.signature.penColor
      });

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      console.log('SIMS Application Form: SignaturePad initialized successfully');
    } catch (error) {
      console.error('SIMS Application Form: SignaturePad initialization failed:', error);
      showError('signature', 'Failed to initialize signature pad. Please refresh the page.');
    }
  }

  /**
   * Shows error message for a specific field
   * @param {string} field - The field name (name or signature)
   * @param {string} message - Optional custom error message
   */
  function showError(field, message = null) {
    const errorElement = elements.errors[field];
    if (errorElement) {
      if (message) errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  /**
   * Hides error message for a specific field
   * @param {string} field - The field name (name or signature)
   */
  function hideError(field) {
    const errorElement = elements.errors[field];
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  /**
   * Validates the full name input
   * @returns {boolean} True if valid
   */
  function validateName() {
    const name = elements.inputs.fullName.value.trim();
    if (name.length < 2) {
      showError('name', 'Please enter your full name (at least 2 characters).');
      return false;
    }
    hideError('name');
    return true;
  }

  /**
   * Validates the signature input
   * @returns {boolean} True if valid
   */
  function validateSignature() {
    if (!signaturePad || signaturePad.isEmpty()) {
      showError('signature', 'Please provide your signature before proceeding.');
      return false;
    }
    hideError('signature');
    return true;
  }

  /**
   * Transitions between application steps
   * @param {string} from - Current section ID
   * @param {string} to - Target section ID
   */
  function transitionToStep(from, to) {
    try {
      if (elements.sections[from]) {
        elements.sections[from].style.display = 'none';
      }
      if (elements.sections[to]) {
        elements.sections[to].style.display = 'block';
      }
      console.log(`SIMS Application Form: Transitioned from ${from} to ${to}`);
    } catch (error) {
      console.error('SIMS Application Form: Step transition failed:', error);
    }
  }

  /**
   * Generates a combined image with signature and name
   * @param {string} signatureDataUrl - Base64 signature image
   * @param {string} fullName - User's full name
   * @returns {Promise<string>} Combined image data URL
   */
  function generateCombinedImage(signatureDataUrl, fullName) {
    return new Promise((resolve, reject) => {
      try {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const signatureImage = new Image();

        signatureImage.onload = () => {
          try {
            const { padding, fontSize } = config.signature;
            const textHeight = fontSize * 1.5;
            
            tempCanvas.width = Math.max(signatureImage.width + 2 * padding, 400);
            tempCanvas.height = signatureImage.height + textHeight + 2 * padding;

            // Fill background
            tempCtx.fillStyle = 'white';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            // Draw signature (centered)
            const sigX = (tempCanvas.width - signatureImage.width) / 2;
            const sigY = padding;
            tempCtx.drawImage(signatureImage, sigX, sigY);

            // Draw name below signature (centered)
            tempCtx.fillStyle = 'black';
            tempCtx.font = `${fontSize}px Arial`;
            tempCtx.textAlign = 'center';
            const textX = tempCanvas.width / 2;
            const textY = sigY + signatureImage.height + fontSize + padding / 2;
            tempCtx.fillText(fullName, textX, textY);

            resolve(tempCanvas.toDataURL('image/png'));
          } catch (error) {
            reject(new Error('Failed to generate combined image: ' + error.message));
          }
        };

        signatureImage.onerror = () => {
          reject(new Error('Failed to load signature image'));
        };

        signatureImage.src = signatureDataUrl;
      } catch (error) {
        reject(error);
      }
    });
  }

  // Event Handlers

  /**
   * Handles the transition from name input to signature step
   */
  function handleNameToSignature() {
    if (!validateName()) return;

    transitionToStep('name', 'signature');
    initializeSignaturePad();
  }

  /**
   * Handles clearing the signature pad
   */
  function handleClearSignature() {
    if (signaturePad) {
      signaturePad.clear();
      hideError('signature');
      console.log('SIMS Application Form: Signature cleared');
    }
  }

  /**
   * Handles saving signature and proceeding to final steps
   */
  async function handleSaveSignature() {
    if (!validateSignature()) return;

    try {
      const fullName = elements.inputs.fullName.value.trim();
      const signatureDataUrl = signaturePad.toDataURL('image/png');

      // Generate combined image
      const combinedImageDataUrl = await generateCombinedImage(signatureDataUrl, fullName);

      // Update result display
      if (elements.results.name) elements.results.name.textContent = fullName;
      if (elements.results.image) elements.results.image.src = combinedImageDataUrl;

      // Transition to confirmation
      transitionToStep('signature', 'result');

      // Auto-proceed to form after delay
      setTimeout(() => {
        transitionToStep('result', 'form');
        if (elements.results.iframe) {
          elements.results.iframe.src = config.googleFormUrl;
        }
      }, config.confirmationDelay);

      console.log('SIMS Application Form: Signature saved and processed successfully');
    } catch (error) {
      console.error('SIMS Application Form: Signature processing failed:', error);
      showError('signature', 'Failed to process signature. Please try again.');
    }
  }

  // Initialize Application
  function initialize() {
    if (!validateDOMElements()) {
      console.error('SIMS Application Form: Initialization failed - missing DOM elements');
      return;
    }

    // Check for SignaturePad library
    if (!window.SignaturePad) {
      console.error('SIMS Application Form: SignaturePad library not loaded');
      return;
    }

    // Attach event listeners
    try {
      if (elements.buttons.next) {
        elements.buttons.next.addEventListener('click', handleNameToSignature);
      }
      
      if (elements.buttons.clear) {
        elements.buttons.clear.addEventListener('click', handleClearSignature);
      }
      
      if (elements.buttons.save) {
        elements.buttons.save.addEventListener('click', handleSaveSignature);
      }

      // Add Enter key support for name input
      if (elements.inputs.fullName) {
        elements.inputs.fullName.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            handleNameToSignature();
          }
        });
      }

      isInitialized = true;
      console.log('SIMS Application Form: Initialization completed successfully');
    } catch (error) {
      console.error('SIMS Application Form: Event listener setup failed:', error);
    }
  }

  // Start initialization
  initialize();
});
