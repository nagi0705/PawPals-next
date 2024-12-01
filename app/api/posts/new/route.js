export async function GET() {
  const newPostTemplate = {
    title: "",
    content: "",
    author: "",
  };

  return new Response(JSON.stringify(newPostTemplate), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}