// lib/upsertStreamUser.ts
export async function upsertStreamUser({
  id,
  name,
  image,
}: {
  id: string;
  name: string;
  image?: string;
}) {
  try {
    const res = await fetch("/api/stream-upsert-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, image }),
    });

    if (!res.ok) {
      throw new Error("Failed to upsert Stream user");
    }

    return true;
  } catch (err) {
    console.error("💥 Error in upsertStreamUser:", err);
    return false;
  }
}
