import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { Resend } from 'resend';

// Initialize Resend
const RESEND_API_KEY = env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = env.RESEND_FROM_EMAIL || 'Fresh Ground Eltham <coffeehouse@freshgroundeltham.co.uk>';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Rate limiting: Store IP addresses and their submission timestamps
// In production, consider using Redis or a database for distributed systems
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_HOUR = 5;

// Common spam keywords/phrases
const SPAM_KEYWORDS = [
	'buy now', 'click here', 'limited time', 'act now', 'guaranteed',
	'no credit check', 'make money', 'work from home', 'free money',
	'viagra', 'cialis', 'casino', 'poker', 'lottery', 'winner',
	'congratulations', 'you have won', 'claim your prize'
];

// Get client IP address
function getClientIP(request: Request): string {
	// Check various headers that might contain the real IP
	const forwarded = request.headers.get('x-forwarded-for');
	if (forwarded) {
		return forwarded.split(',')[0].trim();
	}
	
	const realIP = request.headers.get('x-real-ip');
	if (realIP) {
		return realIP;
	}
	
	// Fallback (may not be available in all environments)
	return 'unknown';
}

// Check rate limiting
function checkRateLimit(ip: string): boolean {
	const now = Date.now();
	const submissions = rateLimitMap.get(ip) || [];
	
	// Remove old submissions outside the window
	const recentSubmissions = submissions.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
	
	if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_HOUR) {
		return false; // Rate limit exceeded
	}
	
	// Add current submission
	recentSubmissions.push(now);
	rateLimitMap.set(ip, recentSubmissions);
	
	// Clean up old entries periodically (every 100 requests)
	if (Math.random() < 0.01) {
		for (const [key, timestamps] of rateLimitMap.entries()) {
			const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
			if (validTimestamps.length === 0) {
				rateLimitMap.delete(key);
			} else {
				rateLimitMap.set(key, validTimestamps);
			}
		}
	}
	
	return true; // Within rate limit
}

// Check for spam content
function containsSpam(content: string): boolean {
	const lowerContent = content.toLowerCase();
	return SPAM_KEYWORDS.some(keyword => lowerContent.includes(keyword));
}

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
		const { name, email, phone, subject, message, website, formFillTime } = await request.json();

		// SPAM PROTECTION CHECKS

		// 1. Honeypot check - if website field is filled, it's likely a bot
		if (website && website.trim() !== '') {
			console.warn('Spam detected: Honeypot field filled', { email, ip: getClientIP(request) });
			return json(
				{ success: false, message: 'Invalid form submission. Please try again.' },
				{ status: 400 }
			);
		}

		// 2. Rate limiting check
		const clientIP = getClientIP(request);
		if (!checkRateLimit(clientIP)) {
			console.warn('Rate limit exceeded', { email, ip: clientIP });
			return json(
				{ success: false, message: 'Too many submissions. Please try again later.' },
				{ status: 429 }
			);
		}

		// 3. Form fill time check - if submitted too quickly (< 5 seconds), likely a bot
		if (formFillTime && formFillTime < 5000) {
			console.warn('Spam detected: Form submitted too quickly', { email, formFillTime, ip: clientIP });
			return json(
				{ success: false, message: 'Please take your time filling out the form.' },
				{ status: 400 }
			);
		}

		// Validate required fields
		if (!name || !email || !subject || !message) {
			return json(
				{ success: false, message: 'Please fill in all required fields' },
				{ status: 400 }
			);
		}

		// Field length validation
		if (name.length > 100) {
			return json(
				{ success: false, message: 'Name is too long. Please use 100 characters or less.' },
				{ status: 400 }
			);
		}

		if (subject.length > 200) {
			return json(
				{ success: false, message: 'Subject is too long. Please use 200 characters or less.' },
				{ status: 400 }
			);
		}

		if (message.length > 2000) {
			return json(
				{ success: false, message: 'Message is too long. Please use 2000 characters or less.' },
				{ status: 400 }
			);
		}

		if (phone && phone.length > 20) {
			return json(
				{ success: false, message: 'Phone number is too long.' },
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

		// Email length validation
		if (email.length > 254) {
			return json(
				{ success: false, message: 'Email address is too long.' },
				{ status: 400 }
			);
		}

		// 4. Spam content check
		const fullText = `${subject} ${message}`.toLowerCase();
		if (containsSpam(fullText)) {
			console.warn('Spam detected: Contains spam keywords', { email, ip: clientIP });
			return json(
				{ success: false, message: 'Your message contains inappropriate content. Please revise and try again.' },
				{ status: 400 }
			);
		}

		// 5. Check for excessive links (more than 3 links = likely spam)
		const linkRegex = /https?:\/\/[^\s]+/gi;
		const links = fullText.match(linkRegex);
		if (links && links.length > 3) {
			console.warn('Spam detected: Too many links', { email, linkCount: links.length, ip: clientIP });
			return json(
				{ success: false, message: 'Your message contains too many links. Please limit to 3 or fewer.' },
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
