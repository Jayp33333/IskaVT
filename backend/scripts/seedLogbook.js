import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Logbook from '../models/Logbook.js';

dotenv.config();

const BASE_DATE = '6/10/2026';

const VISITOR_ROWS = [
  ['Juan Miguel Santos', 'Administration Building', 'Document Request', '08:00 AM', '08:12 AM'],
  ['Maria Cristina Reyes', "Registrar's Office", 'Enrollment Concern', '08:03 AM', '08:18 AM'],
  ['John Patrick Dela Cruz', 'Library', 'Research', '08:05 AM', '08:45 AM'],
  ['Angela Mae Villanueva', 'Room 106 (Lecture Room)', 'Class Attendance', '08:08 AM', '09:08 AM'],
  ['Mark Anthony Gonzales', 'PUP Gymnasium', 'Sports Activity', '08:10 AM', '08:40 AM'],
  ['Rica Joy Mendoza', 'Grandstand', 'Campus Event', '08:12 AM', '08:27 AM'],
  ['Carl Joseph Ramos', 'Computer Laboratory 1', 'Programming Activity', '08:15 AM', '09:45 AM'],
  ['Jasmine Nicole Flores', 'Computer Laboratory 2', 'Project Development', '08:18 AM', '09:48 AM'],
  ['Kenneth Paul Garcia', 'Director Office', 'Appointment Meeting', '08:20 AM', '08:35 AM'],
  ['Rose Ann Bautista', 'Cashier Office', 'Payment Transaction', '08:25 AM', '08:35 AM'],
  ['Michael James Torres', 'Library', 'Book Borrowing', '08:30 AM', '08:50 AM'],
  ['Princess Mae Navarro', 'Guidance Office', 'Consultation', '08:35 AM', '08:55 AM'],
  ['Christian Paul Santiago', 'Administration Building', 'Permit Request', '08:40 AM', '08:55 AM'],
  ['Jennylyn Mae Perez', 'Room 204', 'Lecture Session', '08:45 AM', '09:45 AM'],
  ['Ronald Vincent Cruz', 'Grandstand', 'Photography Session', '08:50 AM', '09:05 AM'],
  ['Shaira Mae Domingo', 'Library', 'Research Work', '08:55 AM', '09:35 AM'],
  ['Jerome Albert Castillo', 'Computer Laboratory 1', 'Database Activity', '09:00 AM', '10:30 AM'],
  ['Angelica Joy Fernandez', "Registrar's Office", 'Records Verification', '09:05 AM', '09:15 AM'],
  ['Nathaniel Pareja Grobador', 'Administration Building', 'Document Submission', '09:08 AM', '09:23 AM'],
  ['Alyssa Mae Hernandez', 'PUP Gymnasium', 'Practice Session', '09:10 AM', '09:50 AM'],
  ['John Paul Jamito', 'Computer Laboratory 2', 'Capstone Research', '09:15 AM', '10:45 AM'],
  ['Carlo Miguel Aquino', 'Library', 'Study Session', '09:20 AM', '10:00 AM'],
  ['Kimberly Anne Rivera', 'Director Office', 'Project Consultation', '09:25 AM', '09:40 AM'],
  ['Joshua Daniel Mercado', 'Grandstand', 'Campus Tour', '09:30 AM', '09:45 AM'],
  ['Patricia Mae Lopez', 'Room 106 (Lecture Room)', 'Presentation', '09:35 AM', '10:20 AM'],
  ['Francis John Soriano', 'Computer Laboratory 1', 'Web Development', '09:40 AM', '11:10 AM'],
  ['Mae Christine Velasco', 'Guidance Office', 'Personal Concern', '09:45 AM', '10:05 AM'],
  ['Kevin Matthew Mendoza', "Registrar's Office", 'Certificate Request', '09:50 AM', '10:00 AM'],
  ['Jonalyn Grace Ramos', 'Library', 'Research Paper', '10:00 AM', '10:50 AM'],
  ['Renz Michael Evangelista', 'PUP Gymnasium', 'Training Activity', '10:05 AM', '10:50 AM'],
  ['Catherine Joy Villamor', 'Administration Building', 'Scholarship Inquiry', '10:10 AM', '10:25 AM'],
  ['Bryan Paul Natividad', 'Computer Laboratory 2', 'System Development', '10:15 AM', '11:45 AM'],
  ['Erika Mae Salazar', 'Grandstand', 'Student Gathering', '10:20 AM', '10:35 AM'],
  ['Vincent Lloyd De Guzman', 'Library', 'Book Return', '10:25 AM', '10:35 AM'],
  ['Charlene Mae Torres', 'Room 204', 'Lecture Attendance', '10:30 AM', '11:30 AM'],
  ['Jefferson Kyle Alonzo', 'Director Office', 'Approval Request', '10:35 AM', '10:50 AM'],
  ['Mariane Nicole Bautista', 'Guidance Office', 'Counseling Session', '10:40 AM', '11:05 AM'],
  ['John Mark Fernandez', 'Computer Laboratory 1', 'Software Testing', '10:45 AM', '12:15 PM'],
  ['Shane Mae Cabrera', 'Library', 'Review Session', '10:50 AM', '11:40 AM'],
  ['Patrick Lawrence Reyes', 'Administration Building', 'Information Request', '10:55 AM', '11:10 AM'],
  ['Mary Ann Dela Peña', 'Cashier Office', 'Payment Processing', '11:00 AM', '11:12 AM'],
  ['John Rey Martinez', 'Grandstand', 'Event Participation', '11:05 AM', '11:25 AM'],
  ['Kristine Joy Mendoza', 'Room 106 (Lecture Room)', 'Project Defense', '11:10 AM', '11:55 AM'],
  ['Gabriel James Santos', 'Computer Laboratory 2', 'Programming Exam', '11:15 AM', '12:45 PM'],
  ['Angelica Mae Gutierrez', 'Library', 'Research Consultation', '11:20 AM', '12:00 PM'],
  ['Ralph Christian Cruz', 'PUP Gymnasium', 'Physical Activity', '11:25 AM', '12:10 PM'],
  ['Nicole Anne Villanueva', 'Administration Building', 'Permit Inquiry', '11:30 AM', '11:45 AM'],
  ['Jericho Paul Ramirez', "Registrar's Office", 'Document Claiming', '11:35 AM', '11:45 AM'],
  ['Princess Joy Navarro', 'Grandstand', 'Campus Visit', '11:40 AM', '11:55 AM'],
  ['Nathaniel Pareja Grobador', 'Computer Laboratory 1', 'Project Development', '11:45 AM', '01:15 PM'],
  ['John Paul Jamito', 'Administration Building', 'System Demonstration', '01:20 PM', null],
];

function parseTime(baseDate, timeLabel) {
  return new Date(`${baseDate} ${timeLabel}`);
}

function buildEntries() {
  return VISITOR_ROWS.map(([fullName, destination, purpose, timeInLabel, timeOutLabel]) => {
    const date = parseTime(BASE_DATE, '12:00 AM');
    const timeIn = parseTime(BASE_DATE, timeInLabel);
    const timeOut = timeOutLabel ? parseTime(BASE_DATE, timeOutLabel) : null;

    return {
      fullName,
      visitorType: 'Student',
      destination,
      purpose,
      date,
      timeIn,
      timeOut,
    };
  });
}

async function seedLogbook() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/iska-vt';

  try {
    await mongoose.connect(uri);
    console.log(`Connected to MongoDB`);

    const deleted = await Logbook.deleteMany({});
    console.log(`Removed ${deleted.deletedCount} existing logbook entries`);

    const entries = buildEntries();
    const inserted = await Logbook.insertMany(entries);
    console.log(`Inserted ${inserted.length} logbook entries`);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedLogbook();
