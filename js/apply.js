document.addEventListener('DOMContentLoaded', () => {
    // --- Get DOM Elements (same as before) ---
    const nameSection = document.getElementById('name-section');
    const signatureSection = document.getElementById('signature-section');
    // const resultSection = document.getElementById('result-section'); // No longer shown in this flow
    const formSection = document.getElementById('form-section');

    const fullNameInput = document.getElementById('fullName');
    const nextButton = document.getElementById('next-to-signature');
    const clearButton = document.getElementById('clear-signature');
    const saveButton = document.getElementById('save-signature');

    const nameError = document.getElementById('name-error');
    const signatureError = document.getElementById('signature-error');

    const canvas = document.getElementById('signature-pad');
    const signaturePadContainer = document.getElementById('signature-pad-container');
    // const resultName = document.getElementById('result-name'); // No longer needed
    // const resultImage = document.getElementById('signature-image'); // No longer needed
    const formIframe = document.getElementById('google-form-iframe');

    const googleFormUrl = 'https://forms.gle/xjoDkXWbniG15z1v6'; // Your Google Form URL

    // --- Basic Canvas Drawing Setup (same as before) ---
    let ctx;
    let drawing = false;
    let hasDrawn = false;
    let lastX = 0;
    let lastY = 0;

    function setupCanvas() {
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = signaturePadContainer.offsetWidth * ratio;
        canvas.height = signaturePadContainer.offsetHeight * ratio;
        canvas.style.width = `${signaturePadContainer.offsetWidth}px`;
        canvas.style.height = `${signaturePadContainer.offsetHeight}px`;
        ctx.scale(ratio, ratio);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        clearCanvas();
    }

    function clearCanvas() {
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        hasDrawn = false;
        signatureError.style.display = 'none';
    }

    // --- Drawing Event Handlers (same as before) ---
    function getMousePos(canvasDom, mouseEvent) {
        const rect = canvasDom.getBoundingClientRect();
        return { x: mouseEvent.clientX - rect.left, y: mouseEvent.clientY - rect.top };
    }
    function getTouchPos(canvasDom, touchEvent) {
        const rect = canvasDom.getBoundingClientRect();
        return { x: touchEvent.touches[0].clientX - rect.left, y: touchEvent.touches[0].clientY - rect.top };
    }
    function startDrawing(e) {
        drawing = true;
        hasDrawn = true;
        const pos = e.touches ? getTouchPos(canvas, e) : getMousePos(canvas, e);
        [lastX, lastY] = [pos.x, pos.y];
        if (e.touches) e.preventDefault();
    }
    function draw(e) {
        if (!drawing) return;
        const pos = e.touches ? getTouchPos(canvas, e) : getMousePos(canvas, e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        [lastX, lastY] = [pos.x, pos.y];
        if (e.touches) e.preventDefault();
    }
    function stopDrawing() {
        if (drawing) {
            drawing = false;
            ctx.beginPath();
        }
    }

    // --- Main Application Logic ---

    // 1. Move from Name to Signature (same as before)
    nextButton.addEventListener('click', () => {
        const fullName = fullNameInput.value.trim();
        if (fullName === '') {
            nameError.style.display = 'block';
        } else {
            nameError.style.display = 'none';
            nameSection.style.display = 'none';
            signatureSection.style.display = 'block';
            setupCanvas();
        }
    });

    // 2. Clear Signature (same as before)
    clearButton.addEventListener('click', clearCanvas);

    // 3. Save Signature, Trigger Download, and Proceed *** MODIFIED ***
    saveButton.addEventListener('click', () => {
        if (!hasDrawn) {
            signatureError.style.display = 'block';
            return; // Stop if no signature
        }

        signatureError.style.display = 'none';
        const fullName = fullNameInput.value.trim();

        // --- Generate Combined Image (Same logic as before) ---
        const signatureDataUrl = canvas.toDataURL('image/png');
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const signatureImage = new Image();

        signatureImage.onload = () => {
            const padding = 20;
            const fontSize = 24;
            const textHeight = fontSize * 1.5;
            const ratio = window.devicePixelRatio || 1;
            const sigWidthOnTemp = signatureImage.width / ratio;
            const sigHeightOnTemp = signatureImage.height / ratio;

            tempCanvas.width = Math.max(sigWidthOnTemp + 2 * padding, 400);
            tempCanvas.height = sigHeightOnTemp + textHeight + 2 * padding;

            tempCtx.fillStyle = 'white';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            const sigX = (tempCanvas.width - sigWidthOnTemp) / 2;
            const sigY = padding;
            tempCtx.drawImage(signatureImage, 0, 0, signatureImage.width, signatureImage.height,
                              sigX, sigY, sigWidthOnTemp, sigHeightOnTemp);

            tempCtx.fillStyle = 'black';
            tempCtx.font = `${fontSize}px Arial`;
            tempCtx.textAlign = 'center';
            const textX = tempCanvas.width / 2;
            const textY = sigY + sigHeightOnTemp + fontSize + padding / 2;
            tempCtx.fillText(fullName, textX, textY);

            const combinedImageDataUrl = tempCanvas.toDataURL('image/png');

            // --- Trigger Download ---
            const downloadLink = document.createElement('a');
            // Create a safe filename
            const filename = (fullName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'signature') + '_confirmation.png';
            downloadLink.href = combinedImageDataUrl;
            downloadLink.download = filename; // Set the filename for download
            document.body.appendChild(downloadLink); // Required for Firefox
            downloadLink.click(); // Simulate click to trigger download
            document.body.removeChild(downloadLink); // Clean up the temporary link

            // --- Proceed to Google Form ---
            signatureSection.style.display = 'none';
            // resultSection.style.display = 'none'; // Ensure result section is hidden
            formSection.style.display = 'block';
            formIframe.src = googleFormUrl; // Load the form URL

        }; // End of signatureImage.onload

        signatureImage.onerror = () => {
            console.error("Failed to load signature image for processing.");
            alert("An error occurred while processing the signature. Please try again.");
        };

        signatureImage.src = signatureDataUrl; // Start loading the signature image
    }); // End of saveButton listener

    // --- Add Event Listeners to Canvas (same as before) ---
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    // --- Window Resize Listener (same as before) ---
    window.addEventListener('resize', () => {
        if (signatureSection.style.display === 'block') {
            setupCanvas();
        }
    });
});
