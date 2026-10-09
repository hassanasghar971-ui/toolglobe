import { NextResponse } from 'next/server';
import { generateToolById, TOTAL_LIVE_TOOLS } from '@/lib/toolsData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const chunkId = parseInt(params.id, 10);
  if (isNaN(chunkId) || chunkId < 1 || chunkId > 40) {
    return new NextResponse('Sitemap Chunk Not Found', { status: 404 });
  }

  const host = request.headers.get('host') || 'toolglobe.vercel.app';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  const chunkSize = 500;
  const startId = (chunkId - 1) * chunkSize + 1;
  const endId = Math.min(startId + chunkSize - 1, TOTAL_LIVE_TOOLS);

  if (startId > TOTAL_LIVE_TOOLS) {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { status: 200, headers: { 'Content-Type': 'application/xml' } }
    );
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (let id = startId; id <= endId; id++) {
    const tool = generateToolById(id);
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/tools/${tool.slug}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
