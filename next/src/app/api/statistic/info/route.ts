import { api } from '@/api.generated';
import { type NextRequest } from 'next/server'

let _cache: object | undefined = undefined;
let _lastDate: Date | undefined = undefined

export async function GET(request: NextRequest) {
  const diff = _lastDate ? ((new Date().getTime() - _lastDate.getTime())/1000) : Number.MAX_SAFE_INTEGER
  _lastDate = new Date()
  if(diff > 60) {
    api.statisticInfoGet().then(response => {
      _cache = response.data;
    });

  }
  if (_cache) {
    const jsonResponse = Response.json(_cache);
    // Add Cache-Control headers to instruct the browser to cache the response
    jsonResponse.headers.set('Cache-Control', 'public, max-age=60'); // Cache for 60 seconds
    return jsonResponse;
  }
  else {
    return Response.json({ error: 'Data unavailable' }, { status: 400 });
  }
}