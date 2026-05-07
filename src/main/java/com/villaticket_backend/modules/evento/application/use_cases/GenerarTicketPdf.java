package com.villaticket_backend.modules.evento.application.use_cases;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.TicketEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class GenerarTicketPdf {

    @Autowired
    private JpaTicketRepository ticketRepository;

    public byte[] ejecutar(Long ticketId) {
        TicketEntity ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            // Tamaño de página tipo recibo o tarjeta
            Document document = new Document(pdf, PageSize.A6);
            document.setMargins(20, 20, 20, 20);

            // Título
            document.add(new Paragraph("VILLATICKET")
                    .setBold().setFontSize(20).setFontColor(ColorConstants.RED)
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph(ticket.getEvento().getTitulo())
                    .setBold().setFontSize(14).setTextAlignment(TextAlignment.CENTER));

            // Datos del Asistente
            document.add(new Paragraph("\nDATOS DEL ASISTENTE").setBold().setFontSize(10).setUnderline());
            document.add(new Paragraph("Nombre: " + ticket.getNombreAsistente()).setFontSize(10));
            document.add(new Paragraph("DNI/NIE: " + ticket.getDocumentoAsistente()).setFontSize(10));

            // Datos del Evento
            document.add(new Paragraph("\nDETALLES").setBold().setFontSize(10).setUnderline());
            document.add(new Paragraph("Fecha: " + ticket.getEvento().getFecha()).setFontSize(10));
            document.add(new Paragraph("Zona: " + ticket.getZona().getNombre()).setFontSize(10));
            document.add(new Paragraph("Precio: " + ticket.getZona().getPrecio() + " €").setFontSize(10));

            // GENERAR CÓDIGO QR
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(ticket.getCodigoQr(), BarcodeFormat.QR_CODE, 200, 200);

            ByteArrayOutputStream qrBaos = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", qrBaos);
            Image qrImage = new Image(ImageDataFactory.create(qrBaos.toByteArray()));
            qrImage.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);

            document.add(new Paragraph("\n")); // Espacio
            document.add(qrImage);

            document.add(new Paragraph(ticket.getCodigoQr())
                    .setFontSize(7).setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER));

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error al generar el PDF: " + e.getMessage());
        }
    }
}