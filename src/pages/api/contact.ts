import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { firstName, lastName, email, phone, message, website } = data;

    // Honeypot check
    if (website) {
      return new Response(JSON.stringify({ message: 'Bot detected' }), { status: 400 });
    }

    const resendApiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY is missing in environment variables.' }), 
        { status: 500 }
      );
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        // If your domain is verified in Resend, use it here (e.g., 'system@themushroom.agency')
        // Otherwise, keep it as 'onboarding@resend.dev' until verified.
        from: 'The Mushroom Agency <onboarding@resend.dev>',
        
        // Your actual receiving email
        to: ['zwood@themushroom.agency'], 
        
        subject: `🍄 New Transmission: ${firstName} ${lastName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #a855f7;">New Project Transmission</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <h3>Project Details:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        `,
      }),
    });

    if (resendResponse.ok) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      const errorData = await resendResponse.json();
      console.error("Resend API Error Details:", errorData); // This logs to your Vercel dashboard
      
      // Extract the string message so the UI shows the real error instead of [object Object]
      const errorMessage = errorData.message || errorData.name || 'Unknown Resend Error';
      return new Response(JSON.stringify({ error: errorMessage }), { status: 400 });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};