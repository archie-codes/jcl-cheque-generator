// app/api/vouchers/history/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);
    const offset = (page - 1) * limit;

    const searchTerm = `%${search}%`;

    // 1. Get the paginated data
    const history = await sql`
      SELECT 
        id,
        payee_name AS "payeeName",
        check_date AS "checkDate",
        amount,
        cv_no AS "cvNo",
        check_no AS "checkNo",
        particulars,
        prepared_by AS "preparedBy",
        prepared_by_pos AS "preparedByPos",
        verified_by AS "verifiedBy",
        verified_by_pos AS "verifiedByPos",
        audited_by AS "auditedBy",
        audited_by_pos AS "auditedByPos",
        received_by AS "receivedBy",
        received_by_pos AS "receivedByPos",
        bank
      FROM vouchers
      WHERE payee_name ILIKE ${searchTerm}
         OR cv_no ILIKE ${searchTerm}
         OR check_no ILIKE ${searchTerm}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // 2. Get the total count of matching records for the frontend math
    const countResult = await sql`
      SELECT COUNT(*)
      FROM vouchers
      WHERE payee_name ILIKE ${searchTerm}
         OR cv_no ILIKE ${searchTerm}
         OR check_no ILIKE ${searchTerm}
    `;

    const totalItems = parseInt(countResult[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      data: history,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
      },
    });
  } catch (error) {
    console.error("GET History Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 },
    );
  }
}
