// app/api/users/route.js

import { api } from "src/api.generated";

// Sample in-memory user data
let users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
];

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

// Handle POST requests
export async function POST(request) {
  const newUser = await request.json();
  if (!newUser.name) {
    return new Response(JSON.stringify({ error: 'Name is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  newUser.id = users.length + 1;
  users.push(newUser);
  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
