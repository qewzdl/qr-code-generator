const baseUrl = 'http://localhost:3000';

const body = document.body;
const urlInput = document.getElementById('url-input-field');
const generateQrButton = document.getElementById('generate-qr-button');
const qrContainer = document.getElementById('qr-container');

const copyQrButton = document.getElementById('copy-qr-button');
const downloadQrButton = document.getElementById('dwnl-qr-button');

const messageElement = document.getElementById('message');

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    generateQrButton.addEventListener('click', () => {
        console.log(urlInput);
        generateQr(urlInput.value);
    });

    copyQrButton.addEventListener('click', () => {
        copyQrSvg();
    });

    downloadQrButton.addEventListener('click', () => {
        downloadQrSvg();
    });
}

async function generateQr(url) {
    try {
        response = await fetch(baseUrl + '/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userUrl: url })
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const sbgText = await response.text();

        setQrImage(sbgText);
    } catch (err) {
        console.error(err);
    }
}

function setQrImage(svg) {
    animateQrContainer();

    qrContainer.innerHTML = svg;
}

function animateQrContainer() {
    qrContainer.style.transition = 'opacity 0s, width 0s';
    body.classList.remove('ready');
    setTimeout(() => {
        qrContainer.style.transition = 'opacity 0.1s, width 0.2s';
        body.classList.add('ready');
    }, 10)
}

function copyQrSvg() {
    var svg = qrContainer.innerHTML;
    navigator.clipboard.writeText(svg);

    showMessage('SVG copied to clipboard!');
}

function downloadQrSvg() {
    var svg = qrContainer.innerHTML;

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('download', 'qr.svg');
    a.setAttribute('href', url);
    a.style.display = 'none';
    body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    showMessage('SVG file downloaded!');
}

function showMessage(message) {
    messageElement.innerText = message;
}