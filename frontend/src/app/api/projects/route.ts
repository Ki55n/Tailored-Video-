import { NextResponse } from 'next/server';

const mockProjects = [
    {
        id: '1',
        title: 'Winter Expedition 2024',
        duration: '02:45',
        resolution: '4K HDR',
        createdAt: '2024-10-24T10:00:00Z',
        updatedAt: '2024-10-24T14:00:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=250&fit=crop',
        status: 'completed',
    },
    {
        id: '2',
        title: 'Cyberpunk Music Video',
        duration: '00:58',
        resolution: '1080p',
        createdAt: '2024-10-22T10:00:00Z',
        updatedAt: '2024-10-22T18:00:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&h=250&fit=crop',
        status: 'completed',
    },
    {
        id: '3',
        title: 'Product Showcase v4',
        duration: '01:20',
        resolution: '4K HDR',
        createdAt: '2024-10-10T10:00:00Z',
        updatedAt: '2024-10-10T16:00:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=250&fit=crop',
        status: 'rendering',
    },
];

export async function GET() {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 300));
    return NextResponse.json({ projects: mockProjects, total: mockProjects.length });
}

export async function POST(request: Request) {
    const body = await request.json();
    const newProject = {
        id: String(Date.now()),
        title: body.title || 'Untitled Project',
        duration: '00:00',
        resolution: body.resolution || '1080p',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        thumbnail: '',
        status: 'draft',
    };
    return NextResponse.json({ project: newProject }, { status: 201 });
}
