// app/api/submit/route.js
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { subject, score, total, timeTakenMinutes } = await req.json();

    await resend.emails.send({
      from: 'WBCHSE Quiz Platform <onboarding@resend.dev>',
      to: process.env.NOTIFICATION_EMAIL,
      subject: `🚨 Exam Score: ${subject} - ${score}/${total}`,
      html: `
        <h2>WBCHSE Semester 3 Test Results</h2>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Score:</b> ${score} / ${total}</p>
        <p><b>Percentage:</b> ${((score / total) * 100).toFixed(1)}%</p>
        <p><b>Time Spent:</b> ${timeTakenMinutes} minutes</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}