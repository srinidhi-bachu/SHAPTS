// PDF generation service for prescriptions with QR support
// Works with graceful fallback if dependencies are not installed yet.

export async function generatePrescriptionPDF({ doctor, patient, rows, meta }) {
  // Try dynamic imports so app stays runnable without deps
  let jsPDFModule = null;
  let QRCode = null;
  try {
    jsPDFModule = await import('jspdf');
    // Prefer 'qrcode' (string to canvas), fallback to 'qrcode.react' not needed here
    QRCode = await import('qrcode');
  } catch (e) {
    return { ok: false, reason: 'missing_deps', error: e };
  }

  try {
    const { jsPDF } = jsPDFModule;
    const doc = new jsPDF({ unit: 'pt' });

    const pad = 24;
    const lineH = 18;
    let y = pad + 8;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(doctor?.fullName || 'Doctor', pad, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    y += lineH;
    doc.text(doctor?.specialization ? `${doctor.specialization}` : '', pad, y);
    y += lineH;
    doc.text(meta?.clinic || 'Clinic', pad, y);
    y += lineH * 1.5;

    // Patient + meta
    doc.setFont('helvetica', 'bold');
    doc.text('Prescription', pad, y);
    y += lineH;
    doc.setFont('helvetica', 'normal');
    const today = meta?.date || new Date().toISOString().slice(0, 10);
    doc.text(`Date: ${today}`, pad, y);
    y += lineH;
    if (patient) {
      doc.text(`Patient: ${patient}`, pad, y);
      y += lineH;
    }

    y += 8;
    // Table header
    doc.setFont('helvetica', 'bold');
    doc.text('Medicine', pad, y);
    doc.text('Dosage', pad + 250, y);
    doc.text('Duration', pad + 350, y);
    doc.text('Notes', pad + 450, y);

    y += lineH;
    doc.setFont('helvetica', 'normal');
    rows.forEach((r) => {
      doc.text(r.medicine || '-', pad, y);
      doc.text(r.dosage || '-', pad + 250, y);
      doc.text(r.duration || '-', pad + 350, y);
      const notes = (r.notes || '').slice(0, 40);
      doc.text(notes || '-', pad + 450, y);
      y += lineH;
    });

    y += lineH;
    // Footer note
    doc.setFontSize(9);
    doc.text('This is a digital prescription. Verify with QR code.', pad, y);

    // QR payload with simple signature placeholder
    const payload = {
      type: 'RX',
      patient: patient || '-',
      doctor: doctor?.fullName || '-',
      spec: doctor?.specialization || '-',
      rows: rows.map(({ medicine, dosage, duration, notes }) => ({ medicine, dosage, duration, notes })),
      ts: Date.now(),
      v: 1,
    };
    const payloadStr = JSON.stringify(payload);

    // Render QR to dataURL using qrcode library
    const qrDataUrl = await QRCode.toDataURL(payloadStr, { width: 120, margin: 1 });
    // Place QR at top-right
    doc.addImage(qrDataUrl, 'PNG', doc.internal.pageSize.getWidth() - (pad + 120), pad, 120, 120);

    // Save
    const filename = `Prescription_${(patient || 'patient').replace(/\s+/g, '_')}_${today}.pdf`;
    doc.save(filename);

    return { ok: true, filename, payload };
  } catch (e) {
    return { ok: false, reason: 'pdf_error', error: e };
  }
}
