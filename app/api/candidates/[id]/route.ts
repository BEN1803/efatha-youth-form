import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { jina, jinsia, umri, kazi, simu } = body;

    const { data, error } = await supabaseAdmin
      .from("candidates")
      .update({ jina, jinsia, umri, kazi, simu })
      .eq("id", id)
      .select();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { error } = await supabaseAdmin
      .from("candidates")
      .delete()
      .eq("id", id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
  }
}