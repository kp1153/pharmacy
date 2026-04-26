import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        phone TEXT,
        status TEXT DEFAULT 'trial',
        expiry_date TEXT,
        reminder_sent INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS pre_activations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS pharmacy_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pharmacy_name TEXT DEFAULT 'My Pharmacy',
        owner_name TEXT,
        address TEXT,
        phone TEXT,
        email TEXT,
        gstin TEXT,
        dl_no TEXT,
        city TEXT,
        state TEXT,
        pincode TEXT,
        logo_url TEXT,
        tagline TEXT,
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS medicines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        generic TEXT,
        company TEXT,
        batch TEXT,
        expiry TEXT,
        mrp REAL NOT NULL,
        purchase_price REAL,
        stock INTEGER DEFAULT 0,
        unit TEXT DEFAULT 'strip',
        rack TEXT,
        hsn TEXT,
        gst REAL DEFAULT 12,
        reorder_level INTEGER DEFAULT 10,
        barcode TEXT,
        schedule_type TEXT DEFAULT 'general',
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        age INTEGER,
        gender TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        state TEXT,
        gst_no TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bill_no TEXT NOT NULL,
        patient_id INTEGER,
        patient_name TEXT,
        patient_phone TEXT,
        subtotal REAL NOT NULL,
        discount REAL DEFAULT 0,
        gst_amount REAL DEFAULT 0,
        net_amount REAL NOT NULL,
        payment_type TEXT DEFAULT 'cash',
        paid_amount REAL DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS sale_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sale_id INTEGER NOT NULL,
        medicine_id INTEGER,
        medicine_name TEXT NOT NULL,
        batch TEXT,
        expiry TEXT,
        qty INTEGER NOT NULL,
        mrp REAL NOT NULL,
        discount REAL DEFAULT 0,
        gst REAL DEFAULT 0,
        amount REAL NOT NULL
      )
    `);
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        supplier_id INTEGER,
        supplier_name TEXT,
        invoice_no TEXT,
        total_amount REAL NOT NULL,
        paid_amount REAL DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS purchase_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        purchase_id INTEGER NOT NULL,
        medicine_id INTEGER,
        medicine_name TEXT NOT NULL,
        batch TEXT,
        expiry TEXT,
        qty INTEGER NOT NULL,
        purchase_price REAL NOT NULL,
        mrp REAL NOT NULL,
        gst REAL DEFAULT 12,
        amount REAL NOT NULL
      )
    `);
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sale_id INTEGER NOT NULL,
        patient_name TEXT,
        amount REAL NOT NULL,
        mode TEXT DEFAULT 'cash',
        note TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS narcotic_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        medicine_id INTEGER NOT NULL,
        medicine_name TEXT NOT NULL,
        schedule_type TEXT NOT NULL,
        transaction_type TEXT NOT NULL,
        qty INTEGER NOT NULL,
        sale_id INTEGER,
        purchase_id INTEGER,
        patient_name TEXT,
        patient_phone TEXT,
        doctor_name TEXT,
        prescription_no TEXT,
        remarks TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS bank_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        category TEXT,
        reference_no TEXT,
        bank_name TEXT,
        reconciled INTEGER DEFAULT 0,
        sale_id INTEGER,
        purchase_id INTEGER,
        remarks TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS stores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT,
        phone TEXT,
        email TEXT,
        gstin TEXT,
        dl_no TEXT,
        city TEXT,
        state TEXT,
        pincode TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS promise_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_name TEXT NOT NULL,
        patient_phone TEXT,
        medicine_name TEXT NOT NULL,
        qty INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    return NextResponse.json({ success: true, message: "All tables ready" });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message });
  }
}