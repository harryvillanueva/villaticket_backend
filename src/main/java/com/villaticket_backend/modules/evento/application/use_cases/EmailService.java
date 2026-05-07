package com.villaticket_backend.modules.evento.application.use_cases;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Recibe el correo del cliente y un "Mapa" con los nombres de los PDFs y sus archivos correspondientes
    public void enviarCorreoConTickets(String destinatario, String tituloEvento, Map<String, byte[]> pdfsAdjuntos) {
        try {
            // Creamos un mensaje complejo (MimeMessage) que soporta HTML y archivos adjuntos
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setTo(destinatario);
            helper.setSubject("🎟️ Tus entradas para: " + tituloEvento);

            // Diseñamos un correo en HTML sencillo pero atractivo
            String contenidoHtml = "<h2>¡Gracias por tu compra en Villaticket!</h2>"
                    + "<p>Tu pago se ha procesado correctamente y tus entradas ya están listas.</p>"
                    + "<p>Adjunto a este correo encontrarás los tickets en formato PDF. Recuerda llevarlos en tu móvil o impresos el día del evento.</p>"
                    + "<br><p><b>Detalles del Evento:</b> " + tituloEvento + "</p>"
                    + "<hr><p><small>Este es un correo automático, por favor no respondas.</small></p>";

            helper.setText(contenidoHtml, true);

            // Iteramos sobre nuestra lista de PDFs y los adjuntamos al correo uno por uno
            for (Map.Entry<String, byte[]> adjunto : pdfsAdjuntos.entrySet()) {
                String nombreArchivo = adjunto.getKey();
                byte[] archivoBytes = adjunto.getValue();

                // Convertimos los bytes en un recurso que el correo pueda leer
                helper.addAttachment(nombreArchivo, new ByteArrayResource(archivoBytes));
            }

            // Enviamos el correo
            mailSender.send(mensaje);
            System.out.println("Correo enviado exitosamente a: " + destinatario);

        } catch (Exception e) {
            System.err.println("Error al enviar el correo: " + e.getMessage());
        }
    }
}