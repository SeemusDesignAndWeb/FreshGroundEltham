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
						body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
						.container { max-width: 600px; margin: 0 auto; padding: 20px; }
						.header { background-color: #39918c; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
						.content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
						.field { margin-bottom: 15px; }
						.label { font-weight: bold; color: #39918c; }
						.message-box { background-color: white; padding: 15px; border-left: 4px solid #39918c; margin-top: 10px; }
					</style>
				</head>
				<body>
					<div class="container">
						<div class="header">
							<h1>New Contact Form Submission</h1>
						</div>
						<div class="content">
							<div class="field">
								<span class="label">Name:</span> ${name}
							</div>
							<div class="field">
								<span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
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
							body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
							.container { max-width: 600px; margin: 0 auto; padding: 20px; }
							.header { background-color: #39918c; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
							.content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
						</style>
					</head>
					<body>
						<div class="container">
							<div class="header">
								<h1>Thank You for Contacting Us!</h1>
							</div>
							<div class="content">
								<p>Dear ${name},</p>
								<p>Thank you for contacting Fresh Ground Eltham. We have received your message and will get back to you as soon as possible.</p>
								<p><strong>Your Message:</strong></p>
								<p>${subject}</p>
								<p>If you have any urgent questions, please feel free to contact us.</p>
								<p>Best regards,<br>The Fresh Ground Eltham Team</p>
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
