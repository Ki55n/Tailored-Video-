import { NextResponse } from 'next/server';

const mockAssets = [
    { id: '1', name: 'Interview_01.mp4', type: 'video', duration: '04:22', size: '1.2 GB', resolution: '4K', dateAdded: '2023-10-24' },
    { id: '2', name: 'Background_Music.wav', type: 'audio', duration: '03:15', size: '45 MB', resolution: null, dateAdded: '2023-10-23' },
    { id: '3', name: 'B-Roll_City_Sunset.mov', type: 'video', duration: '00:15', size: '850 MB', resolution: '1080p', dateAdded: '2023-10-22' },
    { id: '4', name: 'Logo_Final.png', type: 'image', duration: null, size: '2.4 MB', resolution: '2000x2000', dateAdded: '2023-10-21' },
    { id: '5', name: 'Drone_Shot_05.mp4', type: 'video', duration: '01:10', size: '2.1 GB', resolution: '4K', dateAdded: '2023-10-20' },
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const typeFilter = searchParams.get('type');
    const search = searchParams.get('search');

    let filtered = [...mockAssets];

    if (typeFilter && typeFilter !== 'all') {
        filtered = filtered.filter((a) => a.type === typeFilter);
    }
    if (search) {
        filtered = filtered.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    return NextResponse.json({ assets: filtered, total: filtered.length, storageUsed: '5.4 GB', storageTotal: '50 GB' });
}
