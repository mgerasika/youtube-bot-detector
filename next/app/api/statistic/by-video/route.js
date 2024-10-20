import { myCors } from "@lib/my-cors";
import { api } from "src/api.generated";


// Handle GET requests
export async function GET(request) {
  const corsErrorResponse = myCors(request);
  if (corsErrorResponse) {
    return corsErrorResponse; // Return the CORS error response if not allowed
  }
  
  const { searchParams } = new URL(request.url);
  
  const video_id = searchParams.get('video_id'); 

  const data = await api.statisticByVideoGet({video_id: video_id});
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


