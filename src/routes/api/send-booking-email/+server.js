import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Resend } from 'resend';

// Initialize Resend
const RESEND_API_KEY = env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = env.RESEND_FROM_EMAIL || 'Fresh Ground Eltham <coffeehouse@freshgroundeltham.co.uk>';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

function formatPrice(price) {
	return new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP'
	}).format(price);
}

function formatTime(time24) {
	if (!time24) return '';
	const [hours, minutes] = time24.split(':');
	const hour = parseInt(hours, 10);
	const ampm = hour >= 12 ? 'pm' : 'am';
	const hour12 = hour % 12 || 12;
	return `${hour12}:${minutes}${ampm}`;
}

function formatDate(dateString) {
	if (!dateString) return '';
	const date = new Date(dateString);
	return date.toLocaleDateString('en-GB', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

export const POST = async ({ request }) => {
	console.log('[BOOKING EMAIL] Received request to send booking confirmation email');
	
	if (!resend || !RESEND_API_KEY) {
		console.error('[BOOKING EMAIL] Email service not configured - RESEND_API_KEY missing');
		return json({
			success: false,
			message: 'Email service is not configured'
		}, { status: 500 });
	}

	try {
		const bookingData = await request.json();
		console.log('[BOOKING EMAIL] Booking data received:', {
			bookingId: bookingData.bookingId,
			email: bookingData.email,
			name: bookingData.name,
			total: bookingData.total,
			cartItems: bookingData.cart?.length || 0
		});

		if (!bookingData.email) {
			return json({
				success: false,
				message: 'Email address is required'
			}, { status: 400 });
		}

		// Get site URL for logo
		const siteUrl = request.headers.get('origin') || 'https://freshgroundeltham.co.uk';
		const logoUrl = `${siteUrl}/images/freshgroundadmin_320.png`;

		// Build cart items HTML
		const cartItemsHtml = bookingData.cart.map(item => `
			<tr>
				<td style="padding: 12px; border-bottom: 1px solid #eee;">
					<strong style="color: #39918c;">${item.title}</strong>
					${item.date ? `<br><span style="color: #666; font-size: 14px;">${formatDate(item.date)}</span>` : ''}
					${item.time ? `<br><span style="color: #666; font-size: 14px;">${formatTime(item.time)}${item.endTime ? ` - ${formatTime(item.endTime)}` : ''}</span>` : ''}
				</td>
				<td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
				<td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price)}</td>
				<td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
			</tr>
		`).join('');

		// Build cart items plain text
		const cartItemsText = bookingData.cart.map(item => {
			let text = `- ${item.title}`;
			if (item.date) text += ` (${formatDate(item.date)}`;
			if (item.time) text += ` at ${formatTime(item.time)}${item.endTime ? ` - ${formatTime(item.endTime)}` : ''}`;
			if (item.date || item.time) text += ')';
			text += ` x${item.quantity} = ${formatPrice(item.price * item.quantity)}`;
			return text;
		}).join('\n');

		// Send confirmation email to customer
		await resend.emails.send({
			from: RESEND_FROM_EMAIL,
			to: bookingData.email,
			subject: `Booking Confirmation - ${bookingData.bookingId}`,
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<style>
						body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
						.container { max-width: 600px; margin: 0 auto; padding: 20px; }
						.header { background-color: #39918c; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
						.logo { max-width: 150px; height: auto; margin-bottom: 15px; }
						.header h1 { margin: 0; font-size: 28px; }
						.content { background-color: white; padding: 30px; border: 1px solid #ddd; }
						.booking-id { background-color: #f0f9f8; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 25px; }
						.booking-id strong { color: #39918c; font-size: 18px; }
						.details-section { margin-bottom: 25px; }
						.details-section h2 { color: #39918c; font-size: 18px; margin-bottom: 10px; border-bottom: 2px solid #39918c; padding-bottom: 5px; }
						.detail-row { margin-bottom: 8px; }
						.detail-label { font-weight: bold; color: #555; }
						table { width: 100%; border-collapse: collapse; margin-top: 15px; }
						th { background-color: #39918c; color: white; padding: 12px; text-align: left; }
						th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align: center; }
						th:last-child { text-align: right; }
						.total-row { background-color: #f0f9f8; font-weight: bold; }
						.total-row td { padding: 15px 12px; border-top: 2px solid #39918c; }
						.footer { background-color: #2f435a; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
						.footer a { color: #ff8c42; text-decoration: none; }
						.important-note { background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin-top: 20px; }
						.important-note strong { color: #856404; }
					</style>
				</head>
				<body>
					<div class="container">
						<div class="header">
							<img src="${logoUrl}" alt="Fresh Ground Eltham" class="logo" />
							<h1>Booking Confirmed!</h1>
						</div>
						<div class="content">
							<p>Dear ${bookingData.name},</p>
							<p>Thank you for your booking at Fresh Ground Eltham. Your payment has been successfully processed.</p>
							
							<div class="booking-id">
								<strong>Booking Reference: ${bookingData.bookingId}</strong>
							</div>

							<div class="details-section">
								<h2>Contact Details</h2>
								<div class="detail-row">
									<span class="detail-label">Name:</span> ${bookingData.name}
								</div>
								<div class="detail-row">
									<span class="detail-label">Email:</span> ${bookingData.email}
								</div>
								${bookingData.phone ? `
								<div class="detail-row">
									<span class="detail-label">Phone:</span> ${bookingData.phone}
								</div>
								` : ''}
							</div>

							<div class="details-section">
								<h2>Booking Details</h2>
								<table>
									<thead>
										<tr>
											<th>Activity</th>
											<th>Qty</th>
											<th>Price</th>
											<th>Total</th>
										</tr>
									</thead>
									<tbody>
										${cartItemsHtml}
										<tr class="total-row">
											<td colspan="3" style="text-align: right;"><strong>Total Paid:</strong></td>
											<td style="text-align: right;"><strong>${formatPrice(bookingData.total)}</strong></td>
										</tr>
									</tbody>
								</table>
							</div>

							<div class="details-section">
								<h2>Payment Information</h2>
								<div class="detail-row">
									<span class="detail-label">Payment Method:</span> ${bookingData.paymentMethod || 'PayPal'}
								</div>
								<div class="detail-row">
									<span class="detail-label">Transaction ID:</span> ${bookingData.transactionId}
								</div>
								<div class="detail-row">
									<span class="detail-label">Date:</span> ${new Date(bookingData.paidAt).toLocaleString('en-GB', {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									})}
								</div>
							</div>

							<div class="important-note">
								<strong>Important:</strong> Please arrive 5-10 minutes before your scheduled activity time. If you need to cancel or reschedule, please contact us at least 24 hours in advance.
							</div>

							<p style="margin-top: 25px;">We look forward to seeing you!</p>
							<p><strong>The Fresh Ground Eltham Team</strong></p>
						</div>
						<div class="footer">
							<p>Fresh Ground Eltham</p>
							<p><a href="mailto:coffeehouse@freshgroundeltham.co.uk">coffeehouse@freshgroundeltham.co.uk</a></p>
							<p><a href="https://freshgroundeltham.co.uk">freshgroundeltham.co.uk</a></p>
						</div>
					</div>
				</body>
				</html>
			`,
			text: `
BOOKING CONFIRMATION

Dear ${bookingData.name},

Thank you for your booking at Fresh Ground Eltham. Your payment has been successfully processed.

Booking Reference: ${bookingData.bookingId}

CONTACT DETAILS
---------------
Name: ${bookingData.name}
Email: ${bookingData.email}
${bookingData.phone ? `Phone: ${bookingData.phone}` : ''}

BOOKING DETAILS
---------------
${cartItemsText}

Total Paid: ${formatPrice(bookingData.total)}

PAYMENT INFORMATION
-------------------
Payment Method: ${bookingData.paymentMethod || 'PayPal'}
Transaction ID: ${bookingData.transactionId}
Date: ${new Date(bookingData.paidAt).toLocaleString('en-GB')}

IMPORTANT: Please arrive 5-10 minutes before your scheduled activity time. If you need to cancel or reschedule, please contact us at least 24 hours in advance.

We look forward to seeing you!

The Fresh Ground Eltham Team
coffeehouse@freshgroundeltham.co.uk
https://freshgroundeltham.co.uk
			`.trim()
		});

		// Also send a copy to Fresh Ground Eltham
		try {
			await resend.emails.send({
				from: RESEND_FROM_EMAIL,
				to: 'coffeehouse@freshgroundeltham.co.uk',
				subject: `New Booking: ${bookingData.bookingId} - ${bookingData.name}`,
				html: `
					<!DOCTYPE html>
					<html>
					<head>
						<style>
							body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
							.container { max-width: 600px; margin: 0 auto; padding: 20px; }
							.header { background-color: #ff8c42; color: white; padding: 20px; text-align: center; }
							.content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
							table { width: 100%; border-collapse: collapse; margin: 15px 0; }
							th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
							th { background-color: #39918c; color: white; }
						</style>
					</head>
					<body>
						<div class="container">
							<div class="header">
								<h1>New Booking Received!</h1>
							</div>
							<div class="content">
								<h2>Booking Reference: ${bookingData.bookingId}</h2>
								
								<h3>Customer Details</h3>
								<p><strong>Name:</strong> ${bookingData.name}</p>
								<p><strong>Email:</strong> <a href="mailto:${bookingData.email}">${bookingData.email}</a></p>
								${bookingData.phone ? `<p><strong>Phone:</strong> ${bookingData.phone}</p>` : ''}
								
								<h3>Booking Items</h3>
								<table>
									<thead>
										<tr>
											<th>Activity</th>
											<th>Date/Time</th>
											<th>Qty</th>
											<th>Total</th>
										</tr>
									</thead>
									<tbody>
										${bookingData.cart.map(item => `
											<tr>
												<td>${item.title}</td>
												<td>${item.date ? formatDate(item.date) : 'N/A'} ${item.time ? formatTime(item.time) : ''}</td>
												<td>${item.quantity}</td>
												<td>${formatPrice(item.price * item.quantity)}</td>
											</tr>
										`).join('')}
									</tbody>
								</table>
								
								<p style="font-size: 18px;"><strong>Total: ${formatPrice(bookingData.total)}</strong></p>
								
								<h3>Payment Details</h3>
								<p><strong>Transaction ID:</strong> ${bookingData.transactionId}</p>
								<p><strong>Paid At:</strong> ${new Date(bookingData.paidAt).toLocaleString('en-GB')}</p>
							</div>
						</div>
					</body>
					</html>
				`,
				text: `
NEW BOOKING RECEIVED

Booking Reference: ${bookingData.bookingId}

Customer: ${bookingData.name}
Email: ${bookingData.email}
${bookingData.phone ? `Phone: ${bookingData.phone}` : ''}

Items:
${cartItemsText}

Total: ${formatPrice(bookingData.total)}

Transaction ID: ${bookingData.transactionId}
Paid At: ${new Date(bookingData.paidAt).toLocaleString('en-GB')}
				`.trim()
			});
		} catch (adminEmailError) {
			console.error('Failed to send admin notification email:', adminEmailError);
			// Don't fail the request if admin email fails
		}

		console.log('Booking confirmation email sent to:', bookingData.email);

		return json({
			success: true,
			message: 'Booking confirmation email sent successfully'
		});
	} catch (error) {
		console.error('Error sending booking email:', error);
		return json({
			success: false,
			message: 'Failed to send booking confirmation email'
		}, { status: 500 });
	}
};
