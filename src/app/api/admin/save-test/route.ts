import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const { filename, data } = await request.json();

        if (!filename || !data) {
            return NextResponse.json(
                { error: 'Filename and data are required' },
                { status: 400 }
            );
        }

        // Ensure the directory exists
        const directoryPath = path.join(process.cwd(), 'public/data/tests');
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        const filePath = path.join(directoryPath, `${filename}.json`);

        // Write the file
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        return NextResponse.json({ success: true, path: filePath });
    } catch (error) {
        console.error('Error saving test file:', error);
        return NextResponse.json(
            { error: 'Failed to save test file' },
            { status: 500 }
        );
    }
}
