import emailjs from '@emailjs/nodejs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { subject, score, total, timeTakenMinutes } = await req.json();

    const percentage = ((score / total) * 100).toFixed(1);

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        subject,
        score,
        total,
        percentage,
        timeTakenMinutes,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}