// app/api/payees/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET PAYEES
export async function GET() {
  try {
    const payees = await sql`SELECT id, name FROM payees ORDER BY name ASC`;
    return NextResponse.json(payees);
  } catch (error) {
    console.error("GET Payees Error:", error);
    return NextResponse.json({ error: "Failed to load payees" }, { status: 500 });
  }
}

// ADD NEW PAYEE
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const result =
      await sql`INSERT INTO payees (name) VALUES (${name}) RETURNING id, name`;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("POST Payee Error:", error);
    return NextResponse.json({ error: "Failed to add payee" }, { status: 500 });
  }
}
