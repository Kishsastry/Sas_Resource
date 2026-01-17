import { NextResponse } from 'next/server';
import ical from 'node-ical';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    try {
        const data = await ical.async.fromURL(url);
        const events = Object.values(data).filter((event: any) => event.type === 'VEVENT').map((event: any) => ({
            id: event.uid,
            title: event.summary,
            start: event.start,
            end: event.end,
            description: event.description,
            location: event.location,
            allDay: event.datetype === 'date', // Heuristic for all-day events
        }));

        return NextResponse.json({ events });
    } catch (error) {
        console.error('Error fetching iCal:', error);
        return NextResponse.json({ error: 'Failed to fetch calendar data' }, { status: 500 });
    }
}
