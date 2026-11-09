import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 } from "uuid";

const dataPath = `${process.cwd()}/public/data/products.json`;

export async function POST(request) {
  const payload = await request.json();
  const newProduct = { ...payload, id: v4() };

  let products = await fs.readFile(dataPath, "utf8");
  products = JSON.parse(products);

  products.push(newProduct);
  await fs.writeFile(dataPath, JSON.stringify(products, null, 4));

  return NextResponse.json({ success: true, message: "New Product Added Successfully" });
}
