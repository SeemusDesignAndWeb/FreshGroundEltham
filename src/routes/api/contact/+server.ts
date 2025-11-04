import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { Resend } from 'resend';

// Initialize Resend
const RESEND_API_KEY = env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = env.RESEND_FROM_EMAIL || 'Fresh Ground Eltham <coffeehouse@freshgroundeltham.co.uk>';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export const POST: RequestHandler = async ({ request }) => {
	if (!resend || !RESEND_API_KEY) {
		return json(
			{ 
				success: false, 
				message: 'Email service is not configured. Please contact us directly at coffeehouse@freshgroundeltham.co.uk' 
			},
			{ status: 500 }
		);
	}

	try {
		const { name, email, phone, subject, message } = await request.json();

		// Validate required fields
		if (!name || !email || !subject || !message) {
			return json(
				{ success: false, message: 'Please fill in all required fields' },
				{ status: 400 }
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json(
				{ success: false, message: 'Please provide a valid email address' },
				{ status: 400 }
			);
		}

		// Get site URL for logo
		const siteUrl = request.headers.get('origin') || 'https://freshgroundeltham.co.uk';
		const logoUrl = `${siteUrl}/images/freshgroundadmin_320.png`;

		// Send email to Fresh Ground Eltham
		const emailResult = await resend.emails.send({
			from: RESEND_FROM_EMAIL,
			to: 'coffeehouse@freshgroundeltham.co.uk',
			replyTo: email,
			subject: `Contact Form: ${subject}`,
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<style>
						body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
						.container { max-width: 600px; margin: 0 auto; padding: 20px; }
						.header { background-color: #d0b49f; color: #333; padding: 30px 20px; border-radius: 5px 5px 0 0; text-align: center; }
						.logo { max-width: 200px; height: auto; margin-bottom: 15px; }
						.header h1 { margin: 0; color: #2f435a; font-size: 24px; }
						.content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
						.field { margin-bottom: 15px; }
						.label { font-weight: bold; color: #ab6b51; }
						.message-box { background-color: white; padding: 15px; border-left: 4px solid #ab6b51; margin-top: 10px; }
					</style>
				</head>
				<body>
					<div class="container">
						<div class="header">
							<img src="${logoUrl}" alt="Fresh Ground Eltham" class="logo" />
							<h1>New Contact Form Submission</h1>
						</div>
						<div class="content">
							<div class="field">
								<span class="label">Name:</span> ${name}
							</div>
							<div class="field">
								<span class="label">Email:</span> <a href="mailto:${email}" style="color: #ab6b51;">${email}</a>
							</div>
							${phone ? `
							<div class="field">
								<span class="label">Phone:</span> ${phone}
							</div>
							` : ''}
							<div class="field">
								<span class="label">Subject:</span> ${subject}
							</div>
							<div class="field">
								<span class="label">Message:</span>
								<div class="message-box">
									${message.replace(/\n/g, '<br>')}
								</div>
							</div>
						</div>
					</div>
				</body>
				</html>
			`,
			text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
Subject: ${subject}

Message:
${message}
			`.trim()
		});

		// Send confirmation email to the user
		try {
			await resend.emails.send({
				from: RESEND_FROM_EMAIL,
				to: email,
				subject: 'Thank you for contacting Fresh Ground Eltham',
				html: `
					<!DOCTYPE html>
					<html>
					<head>
						<style>
							body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
							.container { max-width: 600px; margin: 0 auto; padding: 20px; }
							.header { background-color: #d0b49f; color: #333; padding: 30px 20px; text-align: center; border-radius: 5px 5px 0 0; }
							.logo { max-width: 200px; height: auto; margin-bottom: 15px; }
							.header h1 { margin: 0; color: #2f435a; font-size: 24px; }
							.content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
							.footer { text-align: center; padding-top: 20px; margin-top: 20px; border-top: 2px solid #d0b49f; color: #666; font-size: 14px; }
						</style>
					</head>
					<body>
						<div class="container">
							<div class="header">
								<img src="${logoUrl}" alt="Fresh Ground Eltham" class="logo" />
								<h1>Thank You for Contacting Us!</h1>
							</div>
							<div class="content">
								<p>Dear ${name},</p>
								<p>Thank you for contacting Fresh Ground Eltham. We have received your message and will get back to you as soon as possible.</p>
								<p><strong>Your Message:</strong></p>
								<p>${subject}</p>
								<p>If you have any urgent questions, please feel free to contact us.</p>
								<p>Best regards,<br>The Fresh Ground Eltham Team</p>
								<div class="footer">
									<p>Fresh Ground Eltham<br>
									542 Westhorne Avenue, Eltham, London SE9 6DH<br>
									<a href="mailto:coffeehouse@freshgroundeltham.co.uk" style="color: #ab6b51;">coffeehouse@freshgroundeltham.co.uk</a></p>
								</div>
							</div>
						</div>
					</body>
					</html>
				`,
				text: `
Thank you for contacting Fresh Ground Eltham!

Dear ${name},

Thank you for contacting Fresh Ground Eltham. We have received your message and will get back to you as soon as possible.

Your Message: ${subject}

If you have any urgent questions, please feel free to contact us.

Best regards,
The Fresh Ground Eltham Team
				`.trim()
			});
		} catch (confirmationError) {
			// Log but don't fail the request if confirmation email fails
			console.error('Failed to send confirmation email:', confirmationError);
		}

		return json({ 
			success: true, 
			message: 'Your message has been sent successfully. We\'ll get back to you soon!' 
		});
	} catch (error: any) {
		console.error('Error sending contact form email:', error);
		
		return json({ 
			success: false, 
			message: 'Failed to send message. Please try again or contact us directly at coffeehouse@freshgroundeltham.co.uk' 
		}, { status: 500 });
	}
};
