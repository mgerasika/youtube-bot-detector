import { api } from '@/api.generated';
import { toQuery } from '@/utils/to-query.util';
import { validateYouTubeVideoId } from '@/utils/validate-youtube-video-id.util';
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const origin = request.headers.get('Origin');

  const allowedOrigin = 'https://www.youtube.com';

  const isOriginAllowed = origin === allowedOrigin;
  if (!isOriginAllowed) {
      return Response.json('not allowed ' + origin, {status:403})
  }
  const searchParams = request.nextUrl.searchParams
  const video_id = searchParams.get('video_id')
  if(!validateYouTubeVideoId(video_id || '')) {
    return Response.json('invalid videoId ' , {status:400})
  }

  const [response, error] = await toQuery( async () => await api.scanFullByVideoGet({ video_id: video_id || '' }));
  if(!response?.data || error) {
    return Response.json('invalid call proxy server ' , {status:400})
  }

  return Response.json(response.data,
    { status: 200, headers: {
    'Access-Control-Allow-Origin': isOriginAllowed ? allowedOrigin : '',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },}
  )
}