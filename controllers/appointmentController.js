import Appointment from '../models/Appointment.js';
import { sendEmail } from '../services/email.js';

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Public
export const bookAppointment = async (req, res, next) => {
  try {
    const { name, email, phone, practiceArea, date, time, message } = req.body;

    // Check if the requested date and time slot is already booked (excluding cancelled ones)
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const existingBooking = await Appointment.findOne({
      date: { $gte: startOfDay, $lte: endOfDay },
      time: time,
      status: { $ne: 'cancelled' },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This date and time slot is already booked. Please choose a different date or time.',
      });
    }

    const appointment = await Appointment.create({
      name,
      email,
      phone,
      practiceArea,
      date,
      time,
      message,
    });

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Send email alert to Admin
    const emailOptionsAdmin = {
      email: process.env.CONTACT_EMAIL_RECEIVER || 'admin@mubashiralam.com',
      subject: `New Consultation Booking: ${name}`,
      message: `You have received a new consultation request:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nPractice Area: ${practiceArea}\nPreferred Date: ${formattedDate}\nPreferred Time: ${time}\nMessage:\n${message || 'None'}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0B1F3A; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">New Consultation Request</h2>
          <p><strong>Client Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Practice Area:</strong> ${practiceArea}</p>
          <p><strong>Date Requested:</strong> ${formattedDate}</p>
          <p><strong>Time Slot Requested:</strong> ${time}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #F5F5F5; padding: 15px; border-left: 5px solid #0B1F3A;">
            ${(message || 'No additional details provided.').replace(/\n/g, '<br>')}
          </blockquote>
        </div>
      `,
    };

    // Send email copy/confirmation to Client
    const emailOptionsClient = {
      email: email,
      subject: `Consultation Request Received - Advocate Mubashir Alam`,
      message: `Dear ${name},\n\nThank you for booking a consultation with Advocate Mubashir Alam. We have received your request for ${formattedDate} at ${time}.\n\nOur office will contact you shortly to confirm your appointment.\n\nBest regards,\nOffice of Advocate Mubashir Alam`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #0B1F3A; text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 15px;">Appointment Requested</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for reaching out. We have received your consultation booking request for:</p>
          <div style="background: #F9F9F9; padding: 15px; margin: 15px 0; border-radius: 4px; border-left: 4px solid #D4AF37;">
            <p style="margin: 5px 0;"><strong>Practice Area:</strong> ${practiceArea}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Time Slot:</strong> ${time}</p>
          </div>
          <p>Our office will verify schedules and contact you shortly via phone or email to confirm your consultation session.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">This is an automated confirmation of your request. Thank you.</p>
        </div>
      `,
    };

    // Send emails asynchronously
    sendEmail(emailOptionsAdmin).catch((err) => console.error('Failed to notify admin of booking:', err));
    sendEmail(emailOptionsClient).catch((err) => console.error('Failed to notify client of booking:', err));

    res.status(201).json({
      success: true,
      message: 'Your appointment has been successfully requested.',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin
export const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1, time: 1 });
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private/Admin
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Send email alert to client regarding status update
    const emailOptions = {
      email: appointment.email,
      subject: `Consultation Status Updated - Advocate Mubashir Alam`,
      message: `Dear ${appointment.name},\n\nYour consultation status has been updated to: ${status.toUpperCase()} for ${formattedDate} at ${appointment.time}.\n\nBest regards,\nOffice of Advocate Mubashir Alam`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #0B1F3A; text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 15px;">Appointment Status Update</h2>
          <p>Dear <strong>${appointment.name}</strong>,</p>
          <p>The status of your consultation scheduled on <strong>${formattedDate}</strong> at <strong>${appointment.time}</strong> has been updated to:</p>
          <div style="background: #0B1F3A; color: white; padding: 15px; margin: 15px 0; border-radius: 4px; text-align: center; font-size: 18px; font-weight: bold; letter-spacing: 1px;">
            ${status.toUpperCase()}
          </div>
          <p>If you have any questions or need to reschedule, please contact our office immediately at process.env.OFFICE_PHONE.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">Office of Advocate Mubashir Alam</p>
        </div>
      `,
    };

    sendEmail(emailOptions).catch((err) => console.error('Failed to email status update:', err));

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
