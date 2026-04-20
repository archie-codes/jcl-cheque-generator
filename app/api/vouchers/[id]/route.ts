// app/api/vouchers/[id]/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// UPDATE EXISTING VOUCHER
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // <-- 1. Change type to Promise
) {
  try {
    const { id } = await params; // <-- 2. Await the params before using id
    const body = await req.json();

    // Clean up the formatting just like you did in your POST route
    const amountNum = body.amount
      ? body.amount.toString().replace(/,/g, "")
      : 0;
    const checkDate = body.checkDate ? new Date(body.checkDate) : null;

    const result = await sql`
      UPDATE vouchers SET
        payee_name = ${body.payeeName},
        check_date = ${checkDate},
        amount = ${amountNum},
        particulars = ${body.particulars},
        prepared_by = ${body.preparedBy},
        prepared_by_pos = ${body.preparedByPos},
        verified_by = ${body.verifiedBy},
        verified_by_pos = ${body.verifiedByPos},
        audited_by = ${body.auditedBy},
        audited_by_pos = ${body.auditedByPos},
        received_by = ${body.receivedBy},
        received_by_pos = ${body.receivedByPos},
        cv_no = ${body.cvNo},
        check_no = ${body.checkNo},
        bank = ${body.bank}
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error("PUT Update Voucher Error:", error);
    return NextResponse.json(
      { error: "Failed to update voucher" },
      { status: 500 },
    );
  }
}
