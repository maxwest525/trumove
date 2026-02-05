import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-forwarded-for",
};

// Simple in-memory rate limiting - stricter for email sending
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // Very strict for email sending
const RATE_WINDOW = 60000;

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(clientIP);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('cf-connecting-ip') || 
         'unknown';
}

interface CCACHData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: "card" | "ach";
  cardNumber?: string;
  expiry?: string;
  bankName?: string;
  routingNumber?: string;
  accountNumber?: string;
  amount: string;
  refNumber: string;
  signedDate: string;
  initials: string;
}

// Generate a simple PDF using raw PDF commands
function generatePDF(data: CCACHData): Uint8Array {
  const lines: string[] = [];
  
  // PDF Header
  lines.push("%PDF-1.4");
  
  // Catalog object
  lines.push("1 0 obj");
  lines.push("<< /Type /Catalog /Pages 2 0 R >>");
  lines.push("endobj");
  
  // Pages object
  lines.push("2 0 obj");
  lines.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  lines.push("endobj");
  
  // Page object
  lines.push("3 0 obj");
  lines.push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>");
  lines.push("endobj");
  
  // Build content stream
  const contentLines: string[] = [];
  contentLines.push("BT");
  contentLines.push("/F1 18 Tf");
  contentLines.push("50 740 Td");
  contentLines.push("(TruMove LLC) Tj");
  
  contentLines.push("/F1 10 Tf");
  contentLines.push("0 -20 Td");
  contentLines.push(`(Reference: ${data.refNumber}) Tj`);
  contentLines.push("0 -12 Td");
  contentLines.push(`(Date: ${data.signedDate}) Tj`);
  
  contentLines.push("/F1 14 Tf");
  contentLines.push("0 -30 Td");
  contentLines.push("(CREDIT CARD / ACH AUTHORIZATION) Tj");
  
  contentLines.push("/F1 10 Tf");
  contentLines.push("0 -25 Td");
  contentLines.push("(Customer Information) Tj");
  contentLines.push("0 -15 Td");
  contentLines.push(`(Name: ${escapeText(data.customerName)}) Tj`);
  contentLines.push("0 -12 Td");
  contentLines.push(`(Email: ${escapeText(data.email)}) Tj`);
  contentLines.push("0 -12 Td");
  contentLines.push(`(Phone: ${escapeText(data.phone)}) Tj`);
  contentLines.push("0 -12 Td");
  contentLines.push(`(Address: ${escapeText(data.address)}) Tj`);
  
  contentLines.push("0 -25 Td");
  contentLines.push("(Payment Information) Tj");
  contentLines.push("0 -15 Td");
  const methodLabel = data.paymentMethod === "card" ? "Credit/Debit Card" : "ACH Bank Transfer";
  contentLines.push(`(Payment Method: ${methodLabel}) Tj`);
  contentLines.push("0 -12 Td");
  contentLines.push(`(Authorization Amount: $${escapeText(data.amount)}) Tj`);
  
  if (data.paymentMethod === "card") {
    contentLines.push("0 -12 Td");
    contentLines.push(`(Card Number: ${escapeText(data.cardNumber || "****")}) Tj`);
    contentLines.push("0 -12 Td");
    contentLines.push(`(Expiry: ${escapeText(data.expiry || "**/**")}) Tj`);
  } else {
    contentLines.push("0 -12 Td");
    contentLines.push(`(Bank Name: ${escapeText(data.bankName || "****")}) Tj`);
    contentLines.push("0 -12 Td");
    contentLines.push(`(Routing: ${escapeText(data.routingNumber || "****")}) Tj`);
    contentLines.push("0 -12 Td");
    contentLines.push(`(Account: ${escapeText(data.accountNumber || "****")}) Tj`);
  }
  
  contentLines.push("0 -25 Td");
  contentLines.push("(Authorization Terms) Tj");
  contentLines.push("0 -15 Td");
  contentLines.push("(1. I authorize TruMove LLC to charge the payment method listed above.) Tj");
  contentLines.push("0 -12 Td");
  contentLines.push("(2. This authorization is valid until services are completed or canceled.) Tj");
  contentLines.push("0 -12 Td");
  contentLines.push("(3. I agree to the cancellation policy and understand applicable fees.) Tj");
  
  contentLines.push("0 -25 Td");
  contentLines.push("(Electronic Signature) Tj");
  contentLines.push("0 -15 Td");
  contentLines.push(`(Signed by: ${escapeText(data.customerName)}) Tj`);
  contentLines.push("0 -12 Td");
  contentLines.push(`(Initials: ${escapeText(data.initials)}) Tj`);
  contentLines.push("0 -12 Td");
  contentLines.push(`(Date Signed: ${escapeText(data.signedDate)}) Tj`);
  
  contentLines.push("0 -30 Td");
  contentLines.push("/F1 8 Tf");
  contentLines.push("(This document was electronically signed and is legally binding.) Tj");
  contentLines.push("0 -10 Td");
  contentLines.push("(TruMove LLC - PCI-DSS Compliant - 256-bit Encryption) Tj");
  
  contentLines.push("ET");
  
  const contentStream = contentLines.join("\n");
  
  // Content stream object
  lines.push("4 0 obj");
  lines.push(`<< /Length ${contentStream.length} >>`);
  lines.push("stream");
  lines.push(contentStream);
  lines.push("endstream");
  lines.push("endobj");
  
  // Font object
  lines.push("5 0 obj");
  lines.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  lines.push("endobj");
  
  // Cross-reference table
  const xrefStart = lines.join("\n").length + 1;
  lines.push("xref");
  lines.push("0 6");
  lines.push("0000000000 65535 f ");
  lines.push("0000000009 00000 n ");
  lines.push("0000000058 00000 n ");
  lines.push("0000000115 00000 n ");
  lines.push("0000000266 00000 n ");
  lines.push(`0000000${String(350 + contentStream.length).padStart(3, "0")} 00000 n `);
  
  // Trailer
  lines.push("trailer");
  lines.push("<< /Size 6 /Root 1 0 R >>");
  lines.push("startxref");
  lines.push(String(xrefStart));
  lines.push("%%EOF");
  
  const pdfContent = lines.join("\n");
  return new TextEncoder().encode(pdfContent);
}

function escapeText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check - very strict for email sending
    const clientIP = getClientIP(req);
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for email sending from IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const data: CCACHData = await req.json();

    // Validate required fields
    if (!data.customerName || !data.email) {
      throw new Error("Customer name and email are required");
    }

    console.log(`Generating PDF for ${data.customerName}...`);

    // Generate PDF
    const pdfBytes = generatePDF(data);
    const pdfBase64 = btoa(String.fromCharCode(...pdfBytes));

    console.log(`Sending email to ${data.email}...`);

    // Send email with PDF attachment using Resend API directly
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "TruMove <onboarding@resend.dev>",
        to: [data.email],
        subject: `Your CC/ACH Authorization - ${data.refNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; font-size: 24px;">Payment Authorization Confirmed</h1>
            
            <p>Dear ${data.customerName},</p>
            
            <p>Thank you for completing your payment authorization. Please find attached a PDF copy of your signed CC/ACH Authorization form for your records.</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Authorization Details</h3>
              <p><strong>Reference:</strong> ${data.refNumber}</p>
              <p><strong>Amount:</strong> $${data.amount}</p>
              <p><strong>Payment Method:</strong> ${data.paymentMethod === "card" ? "Credit/Debit Card" : "ACH Bank Transfer"}</p>
              <p><strong>Date Signed:</strong> ${data.signedDate}</p>
            </div>
            
            <p>If you have any questions about your authorization, please contact our team.</p>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              This is an automated message from TruMove. Please do not reply directly to this email.
            </p>
          </div>
        `,
        attachments: [
          {
            filename: `CC-ACH-Authorization-${data.refNumber}.pdf`,
            content: pdfBase64,
          },
        ],
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", responseData);
      throw new Error(responseData.message || "Failed to send email");
    }

    console.log("Email sent successfully:", responseData);

    return new Response(
      JSON.stringify({ success: true, messageId: responseData.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error sending CC/ACH PDF:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
