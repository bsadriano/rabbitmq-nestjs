export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  return Response.json({ test: "huh" });
}
