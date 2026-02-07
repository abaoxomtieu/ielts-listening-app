import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public/data/uploads');
const PUBLIC_PREFIX = '/data/uploads';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, GIF or WebP.' }, { status: 400 });
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const ext = path.extname(file.name) || (file.type === 'image/png' ? '.png' : '.jpg');
    const base = path.basename(file.name, path.extname(file.name)).replace(/\s+/g, '-') || 'image';
    const name = `${base}-${Date.now()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, name);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    const url = `${PUBLIC_PREFIX}/${name}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload image error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
