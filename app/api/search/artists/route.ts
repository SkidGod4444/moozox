import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const page = parseInt(searchParams.get('page') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (!query) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`${process.env.JIO_SAAVAN_API}/search/artists?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch artists');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching artists:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
