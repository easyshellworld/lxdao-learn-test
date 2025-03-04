import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';
import { AuthFile, readFile } from '@/lib/github';

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret });
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const address = request.nextUrl.searchParams.get('address');
    if (!address) {
      return NextResponse.json({ message: 'Address is required' }, { status: 400 });
    }

    const registerFilePath = 'data/register.json';
    const registerData = await AuthFile(registerFilePath);
    if (!registerData) {
      return NextResponse.json({ message: 'Register data not found' }, { status: 404 });
    }

    const registers = JSON.parse(registerData);
    const user = registers[address];
    if (!user || !user.file) {
      return NextResponse.json({ message: 'File not found for this address' }, { status: 404 });
    }

    const filePath = user.file;
    const fileContent = await readFile(filePath);
    if (!fileContent) {
      return NextResponse.json({ message: 'File content not found' }, { status: 404 });
    }

    return NextResponse.json({ content: fileContent });
  } catch (error) {
    console.error('Failed to fetch file:', error);
    return NextResponse.json({ message: 'Failed to fetch file' }, { status: 500 });
  }
}