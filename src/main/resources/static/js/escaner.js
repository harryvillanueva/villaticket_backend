document.addEventListener('DOMContentLoaded', () => {

    // 1. VERIFICACIÓN DE SEGURIDAD (Evitar el bucle infinito)
    if (!Auth.estaAutenticado()) {
        console.warn("No hay sesión activa. Redirigiendo...");
        // Codificamos la URL para evitar problemas con caracteres especiales
        const currentPath = window.location.pathname.split('/').pop() || 'escaner.html';
        window.location.href = `login.html?redirect=${encodeURIComponent(currentPath)}`;
        return;
    }

    console.log("Sesión válida detectada. Iniciando escáner...");

    const html5QrCode = new Html5Qrcode("reader");
    const resultBox = document.getElementById('resultBox');
    const resultMessage = document.getElementById('resultMessage');
    const resultDetails = document.getElementById('resultDetails');
    const btnContinuar = document.getElementById('btnContinuar');

    /**
     * Lógica al detectar un QR
     */
    const onScanSuccess = async (decodedText) => {
        // Pausar para no procesar múltiples veces el mismo código
        html5QrCode.pause();

        resultBox.style.display = 'block';
        resultMessage.textContent = "Validando...";
        resultBox.className = "result-box warning";
        resultDetails.innerHTML = "";

        try {
            const token = Auth.obtenerToken();
            const baseUrl = window.location.origin + '/api';

            const response = await fetch(`${baseUrl}/tickets/validar/${decodedText}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error("Error en la respuesta del servidor");

            const data = await response.json();

            if (data.valido) {
                resultBox.className = "result-box success";
                resultMessage.textContent = data.mensaje;
                resultDetails.innerHTML = `
                    <b>Asistente:</b> ${data.asistente} <br>
                    <b>DNI:</b> ${data.documento} <br>
                    <b>Zona:</b> ${data.zona}
                `;
            } else {
                resultBox.className = "result-box error";
                resultMessage.textContent = data.mensaje;
                if(data.asistente) {
                    resultDetails.innerHTML = `Titular del ticket: <b>${data.asistente}</b>`;
                }
            }
        } catch (error) {
            console.error("Error al validar QR:", error);
            resultBox.className = "result-box error";
            resultMessage.textContent = "Error de red o de servidor.";
        }
    };

    // 2. INICIO DE CÁMARA
    // Importante: facingMode "environment" usa la cámara trasera
    const config = { fps: 15, qrbox: { width: 250, height: 250 } };

    html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess)
        .catch(err => {
            console.error("Error de cámara:", err);
            const msg = document.createElement("p");
            msg.style.color = "red";
            msg.textContent = "Error: No se pudo acceder a la cámara. Asegúrate de usar HTTPS y dar permisos.";
            document.getElementById("reader").appendChild(msg);
        });

    btnContinuar.addEventListener('click', () => {
        resultBox.style.display = 'none';
        html5QrCode.resume();
    });
});