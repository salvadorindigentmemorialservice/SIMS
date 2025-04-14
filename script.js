document.addEventListener('DOMContentLoaded', () => {
  // Get DOM Elements
  const nameSection = document.getElementById('name-section');
  const signatureSection = document.getElementById('signature-section');
  const resultSection = document.getElementById('result-section');
  const formSection = document.getElementById('form-section');

  const fullNameInput = document.getElementById('fullName');
  const nextButton = document.getElementById('next-to-signature');
  const clearButton = document.getElementById('clear-signature');
  const saveButton = document.getElementById('save-signature');

  const nameError = document.getElementById('name-error');
  const signatureError = document.getElementById('signature-error');

  const canvas = document.getElementById('signature-pad');
  const signaturePadContainer = document.getElementById('signature-pad-container');
  const resultName = document.getElementById('result-name');
  const resultImage = document.getElementById('signature-image');
  const formIframe = document.getElementById('google-form-iframe');

  const googleFormUrl = 'https://forms.gle/xjoDkXWbniG15z1v6'; // Your Google Form URL

  let signaturePad; // To be initialized later

  // Function to resize canvas
  function resizeCanvas() {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      // Use offsetWidth/Height for actual displayed size
      canvas.width = signaturePadContainer.offsetWidth * ratio;
      canvas.height = signaturePadContainer.offsetHeight * ratio;
      canvas.getContext('2d').scale(ratio, ratio);
      if (signaturePad) {
          signaturePad.clear(); // Clear signature on resize
      }
  }

  // Initialize Signature Pad (only after section is shown)
  function initializeSignaturePad() {
      if (!signaturePad) {
          signaturePad = new SignaturePad(canvas, {
              backgroundColor: 'rgb(253, 253, 253)', // Match container background
              penColor: 'rgb(0, 0, 0)'
          });
          resizeCanvas(); // Initial resize
          window.addEventListener('resize', resizeCanvas); // Adjust canvas on window resize
      }
  }

  // --- Event Listeners ---

  // 1. Move from Name to Signature
  nextButton.addEventListener('click', () => {
      const fullName = fullNameInput.value.trim();
      if (fullName === '') {
          nameError.style.display = 'block';
      } else {
          nameError.style.display = 'none';
          nameSection.style.display = 'none';
          signatureSection.style.display = 'block';
          initializeSignaturePad(); // Initialize pad now that it's visible
      }
  });

  // 2. Clear Signature
  clearButton.addEventListener('click', () => {
      if (signaturePad) {
          signaturePad.clear();
          signatureError.style.display = 'none'; // Hide error if clearing
      }
  });

  // 3. Save Signature and Proceed
  saveButton.addEventListener('click', () => {
      if (!signaturePad || signaturePad.isEmpty()) {
          signatureError.style.display = 'block';
          return; // Stop if no signature
      }

      signatureError.style.display = 'none';
      const fullName = fullNameInput.value.trim(); // Get name again

      // --- Generate Combined Image ---
      const signatureDataUrl = signaturePad.toDataURL('image/png');

      // Create a temporary canvas to combine signature and name
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      const signatureImage = new Image();

      signatureImage.onload = () => {
          // Set temp canvas size (adjust padding/spacing as needed)
          const padding = 20;
          const fontSize = 24; // Adjust font size
          const textHeight = fontSize * 1.5; // Approximate height needed for text
          tempCanvas.width = Math.max(signatureImage.width + 2 * padding, 400); // Ensure minimum width
          tempCanvas.height = signatureImage.height + textHeight + 2 * padding;

          // Fill background (optional, white is default)
          tempCtx.fillStyle = 'white';
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

          // Draw signature (centered horizontally)
          const sigX = (tempCanvas.width - signatureImage.width) / 2;
          const sigY = padding;
          tempCtx.drawImage(signatureImage, sigX, sigY);

          // Draw name below signature (centered horizontally)
          tempCtx.fillStyle = 'black';
          tempCtx.font = `${fontSize}px Arial`; // Adjust font
          tempCtx.textAlign = 'center';
          const textX = tempCanvas.width / 2;
          const textY = sigY + signatureImage.height + fontSize + padding / 2; // Position below signature
          tempCtx.fillText(fullName, textX, textY);

          // Get the combined image data URL
          const combinedImageDataUrl = tempCanvas.toDataURL('image/png');

          // --- Update UI ---
          resultName.textContent = fullName;
          resultImage.src = combinedImageDataUrl;

          signatureSection.style.display = 'none';
          resultSection.style.display = 'block'; // Show confirmation

          // Load Google Form after a short delay (optional, feels smoother)
          setTimeout(() => {
              resultSection.style.display = 'none'; // Hide confirmation
              formSection.style.display = 'block';
              formIframe.src = googleFormUrl; // Load the form URL
          }, 2500); // Show confirmation for 2.5 seconds

      };

      signatureImage.onerror = () => {
          console.error("Failed to load signature image for processing.");
          alert("An error occurred while processing the signature. Please try again.");
      };

      signatureImage.src = signatureDataUrl; // Start loading the signature image
  });

});
