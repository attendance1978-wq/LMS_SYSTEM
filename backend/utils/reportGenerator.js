const PDFDocument = require('pdfkit');

const generateStudentReport = (res, student, data) => {
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=report_${student.student_id_number || student.id}.pdf`);
  doc.pipe(res);

  // Header
  doc.fontSize(20).font('Helvetica-Bold').text('LMS - Student Academic Report', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleDateString('en-PH')}`, { align: 'center' });
  doc.moveTo(50, doc.y + 10).lineTo(550, doc.y + 10).stroke();
  doc.moveDown();

  // Student info
  doc.fontSize(14).font('Helvetica-Bold').text('Student Information');
  doc.fontSize(11).font('Helvetica');
  doc.text(`Name: ${student.first_name} ${student.last_name}`);
  doc.text(`ID Number: ${student.student_id_number || 'N/A'}`);
  doc.text(`Email: ${student.email}`);
  doc.moveDown();

  // Grades
  if (data.grades?.length) {
    doc.fontSize(14).font('Helvetica-Bold').text('Academic Performance');
    doc.moveDown(0.5);
    data.grades.forEach(g => {
      doc.fontSize(11).font('Helvetica').text(`${g.exam_title}: ${g.score}/${g.total_score} (${g.passed ? 'PASSED' : 'FAILED'})`);
    });
    doc.moveDown();
  }

  // Attendance
  if (data.attendance) {
    doc.fontSize(14).font('Helvetica-Bold').text('Attendance Summary');
    doc.fontSize(11).font('Helvetica');
    doc.text(`Total: ${data.attendance.total} | Present: ${data.attendance.present} | Absent: ${data.attendance.absent}`);
    doc.text(`Attendance Rate: ${data.attendance.rate}`);
  }

  doc.end();
};

module.exports = { generateStudentReport };
