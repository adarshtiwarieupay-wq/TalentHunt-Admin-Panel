import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ValidEmail from '@/models/ValidEmail';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.email || typeof body.email !== 'string') {
      return NextResponse.json({ error: 'Valid email string is required.' }, { status: 400 });
    }

    const email = body.email.trim().toLowerCase();

    // Check for duplicate
    const existingEmail = await ValidEmail.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({ error: 'This email is already authorized.' }, { status: 409 });
    }

    // Save
    await ValidEmail.create({ email });

    return NextResponse.json({ message: 'Email authorized successfully.' }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding email:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
