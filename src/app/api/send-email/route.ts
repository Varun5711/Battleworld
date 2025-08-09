import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { to, subject, body, interviewId } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const html = `
  <div style="font-family: 'Courier New', monospace; background-color: #0a0f0a; padding: 20px;">
    <div style="max-width: 600px; background: #0d1a0d; border-radius: 10px; overflow: hidden; margin: auto; border: 1px solid #00ff99; box-shadow: 0 0 25px rgba(0,255,153,0.3);">
      
      <!-- Header -->
      <div style="background: linear-gradient(90deg, #004d26, #00ff99); padding: 16px; border-bottom: 2px solid #00cc77;">
        <h2 style="color: #e6fff5; margin: 0; font-size: 22px; letter-spacing: 2px; text-transform: uppercase; font-weight: bold;">
          BattleWorld DOOM Arena
        </h2>
      </div>
      
      <!-- Body -->
      <div style="padding: 20px; color: #d9ffec; background: #0f1f17;">
        <p style="font-size: 16px; line-height: 1.6; color: #b3ffdb;">
          ${body}
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background: #0a140f; padding: 14px; text-align: center; font-size: 12px; color: #66ffcc; border-top: 1px solid #00ff99;">
        © ${new Date().getFullYear()} BattleWorld — Power, Precision, Prestige.
      </div>
    </div>
  </div>
`;

    await transporter.sendMail({
      from: `"BattleWorld Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email." },
      { status: 500 }
    );
  }
}
