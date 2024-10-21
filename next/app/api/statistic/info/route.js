import { myCors } from "@lib/my-cors";
import { api } from "src/api.generated";

export async function GET(request) {
  const error = myCors(request);
  if (error) {
    return error; 
  }

  const data = await api.statisticInfoGet();
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

