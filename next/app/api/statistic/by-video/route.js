import { api } from "src/api.generated";



// Handle GET requests
export async function GET(request) {

  const { searchParams } = new URL(request.url);
  
  const video_id = searchParams.get('video_id'); 

  const data = await api.statisticByVideoGet({video_id: video_id});
  return new Response(JSON.stringify(data.data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}


