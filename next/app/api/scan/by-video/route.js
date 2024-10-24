import { myCors } from "@lib/my-cors";
import { api } from "src/api.generated";


export async function GET(request) {
  const error = myCors(request);
  if (error) {
    return error;
  }
  
  const { searchParams } = new URL(request.url);
  
  const video_id = searchParams.get('video_id'); 

  const data = await api.scanByVideoGet({video_id});
  return new Response(JSON.stringify(data.data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': request.headers.get('origin'), // Set allowed origin
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Set allowed methods
    },
  });
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': request.headers.get('origin'),
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}


