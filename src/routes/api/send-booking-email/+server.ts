import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const bookingData = await request.json();
		
		// In a real application, you would:
		// 1. Use a service like SendGrid, Mailgun, or AWS SES
		// 2. Configure SMTP settings
		// 3. Send the actual email
		
		// For now, we'll simulate email sending
		console.log('Sending booking confirmation email to:', bookingData.email);
		console.log('Booking ID:', bookingData.bookingId);
		
		// Example email content (in real app, use an email template)
		const emailContent = {
			to: bookingData.email,
			subject: `Booking Confirmation - ${bookingData.bookingId}`,
			html: `
				<h1>Booking Confirmed!</h1>
				<p>Dear ${bookingData.name},</p>
				<p>Thank you for booking activities at Fresh Ground Eltham.</p>
				<p><strong>Booking ID:</strong> ${bookingData.bookingId}</p>
				<p><strong>Total Paid:</strong> £${bookingData.total.toFixed(2)}</p>
				<h2>Activities Booked:</h2>
				<ul>
					${bookingData.cart.map((item: any) => `
						<li>${item.title} - ${item.date} at ${item.time} (Qty: ${item.quantity})</li>
					`).join('')}
				</ul>
				<p>We look forward to seeing you!</p>
			`
		};
		
		// Simulate email delay
		await new Promise(resolve => setTimeout(resolve, 500));
		
		return json({ 
			success: true, 
			message: 'Email sent successfully',
			emailContent // In production, don't return the email content
		});
	} catch (error) {
		console.error('Error sending email:', error);
		return json({ 
			success: false, 
			message: 'Failed to send email' 
		}, { status: 500 });
	}
};

