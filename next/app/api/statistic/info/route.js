import { api } from "src/api.generated";

// Handle GET requests
export async function GET(request) {

  const data = await api.statisticInfoGet();
  return new Response(JSON.stringify(data.data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

