const nodemailer = require('nodemailer');
const path = require('path');

const sendHotelConfirmation = async (booking) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth: {
            user: 'lalit.lakshmipathi@gmail.com',
            pass: 'uydn mijd uktm qsdh' 
        },
        tls: {
            rejectUnauthorized: false 
        }
    });

    const formattedCheckIn = new Date(booking.checkIn).toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff; }
            .header { background-color: #003580; padding: 25px; text-align: center; color: white; }
            /* The banner section with your new hotel image */
            .hero-image { width: 100%; height: 300px; object-fit: cover; display: block; }
            .content { padding: 35px; color: #333333; line-height: 1.6; }
            .hotel-box { background-color: #ffffff; border: 2px solid #003580; padding: 25px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            .footer { background-color: #f8f9fa; padding: 25px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; }
            .status-badge { background-color: #f3a614; color: white; padding: 6px 18px; border-radius: 50px; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
            .button { background-color: #003580; color: #ffffff !important; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 800; display: inline-block; font-size: 14px; text-transform: uppercase; }
            .company-desc { font-size: 13px; color: #555; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; line-height: 1.5; }
            h2 { color: #003580; font-weight: 800; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                 <h1 style="margin: 0; font-size: 30px; font-weight: 900; letter-spacing: 1px;">TravelGo</h1>
            </div>

            <!-- New Luxury Hotel Banner Image -->
           <img src="https://pix10.agoda.net/hotelImages/999/99963/99963_17062213550053971406.jpg" 
     alt="Hotel Luxury Banner" 
     class="hero-image">

            <div class="content">
                <div style="text-align: center;"><span class="status-badge">Booking Confirmed</span></div>
                
                <h2 style="margin-top: 25px;">Your Stay is Confirmed, ${booking.passengerName}!</h2>
                <p>Pack your bags! Your reservation at <b>${booking.hotelName}</b> is ready. We've coordinated with our hospitality partners to ensure your arrival and stay are absolutely seamless.</p>
                
                <div class="hotel-box">
                    <h3 style="margin-top: 0; color: #003580; font-size: 22px;">${booking.hotelName}</h3>
                    <p style="margin: 8px 0;"><b>📍 Location:</b> ${booking.city}</p>
                    <p style="margin: 8px 0;"><b>📅 Check-In:</b> ${formattedCheckIn}</p>
                    <p style="margin: 8px 0;"><b>🏠 Address:</b> ${booking.address}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
                    <p style="margin: 0; font-size: 24px; color: #28a745; font-weight: 900;">Amount Paid: ₹${booking.totalPrice.toLocaleString('en-IN')}</p>
                </div>

                <div style="text-align: center; margin-top: 35px;">
                    <a href="http://localhost:3000/my-bookings" class="button">Manage My Booking</a>
                </div>

                <div class="company-desc">
                    <b style="color: #003580;">About TravelGo:</b><br>
                    TravelGo is a premier global travel technology platform dedicated to making world exploration seamless, affordable, and inspiring. We bridge the gap between travelers and their dream destinations by providing instant access to the best flight deals, luxury accommodations, and curated vacation packages.
                </div>
            </div>

            <div class="footer">
                <p>&copy; 2026 TravelGo Aviation & Hospitality Group.</p>
                <p>Connecting Skies. Connecting Souls.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const info = await transporter.sendMail({
            from: '"TravelGo Reservations" <lalit.lakshmipathi@gmail.com>',
            to: booking.passengerEmail,
            subject: `Confirmed: Your Stay at ${booking.hotelName} | TravelGo`,
            html: htmlContent
        });
        console.log("✅ Branded Hotel Email sent successfully: " + info.messageId);
    } catch (error) {
        console.error("❌ Email failed to send: ", error.message);
    }
};

module.exports = sendHotelConfirmation;