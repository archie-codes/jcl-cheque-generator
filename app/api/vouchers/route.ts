// app/api/vouchers/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET LAST VOUCHER (For Auto-Increment)
export async function GET() {
  try {
    const lastVoucher = await sql`
      SELECT 
        cv_no AS "cvNo", 
        check_no AS "checkNo"
      FROM vouchers 
      ORDER BY id DESC 
      LIMIT 1
    `;

    return NextResponse.json(lastVoucher[0] || null);
  } catch (error) {
    console.error("GET Last Voucher Error:", error);
    return NextResponse.json(
      { error: "Failed to load last voucher" },
      { status: 500 },
    );
  }
}

// ADD NEW VOUCHER
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Remove commas from the amount before saving to the DB
    const amountNum = body.amount ? body.amount.replace(/,/g, "") : 0;
    const checkDate = body.checkDate ? new Date(body.checkDate) : null;

    const result = await sql`
      INSERT INTO vouchers (
        payee_name, check_date, amount, particulars,
        prepared_by, prepared_by_pos, verified_by, verified_by_pos,
        audited_by, audited_by_pos, received_by, received_by_pos,
        cv_no, check_no, bank
      ) VALUES (
        ${body.payeeName}, ${checkDate}, ${amountNum}, ${body.particulars},
        ${body.preparedBy}, ${body.preparedByPos}, ${body.verifiedBy}, ${body.verifiedByPos},
        ${body.auditedBy}, ${body.auditedByPos}, ${body.receivedBy}, ${body.receivedByPos},
        ${body.cvNo}, ${body.checkNo}, ${body.bank}
      ) RETURNING id
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("POST Voucher Error:", error);
    return NextResponse.json(
      { error: "Failed to save voucher" },
      { status: 500 },
    );
  }
}
