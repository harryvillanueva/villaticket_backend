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


    public void enviarCorreoConTickets(String destinatario, String tituloEvento, Map<String, byte[]> pdfsAdjuntos) {
        try {

            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setTo(destinatario);
            helper.setSubject("🎟️ Tus entradas para: " + tituloEvento);


            String contenidoHtml = "<h2>¡Gracias por tu compra en Villaticket!</h2>"
                    + "<p>Tu pago se ha procesado correctamente y tus entradas ya están listas.</p>"
                    + "<p>Adjunto a este correo encontrarás los tickets en formato PDF. Recuerda llevarlos en tu móvil o impresos el día del evento.</p>"
                    + "<br><p><b>Detalles del Evento:</b> " + tituloEvento + "</p>"
                    + "<hr><p><small>Este es un correo automático, por favor no respondas.</small></p>";

            helper.setText(contenidoHtml, true);


            for (Map.Entry<String, byte[]> adjunto : pdfsAdjuntos.entrySet()) {
                String nombreArchivo = adjunto.getKey();
                byte[] archivoBytes = adjunto.getValue();


                helper.addAttachment(nombreArchivo, new ByteArrayResource(archivoBytes));
            }


            mailSender.send(mensaje);
            System.out.println("Correo enviado exitosamente a: " + destinatario);

        } catch (Exception e) {
            System.err.println("Error al enviar el correo: " + e.getMessage());
        }
    }
}