import { NextResponse } from "next/server";

// GETリクエストの処理
export async function GET() {
  const formData = {
    name: "",
    description: "",
  };

  return NextResponse.json(formData);
}