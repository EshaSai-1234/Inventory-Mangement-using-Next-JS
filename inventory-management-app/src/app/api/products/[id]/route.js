import { NextResponse } from "next/server";
import { promises as fs } from "fs";

const dataPath = `${process.cwd()}/public/data/products.json`;

export async function GET(request, { params }) {
  let products = await fs.readFile(dataPath, "utf8");
  products = JSON.parse(products);

  const product = products.find((product) => product.id === params.id);
  if (!product) {
    return NextResponse.json(
      {
        success: false,
        message: "Product not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Product Fetched Successfully",
    data: product,
  });
}

export async function PUT(request, { params }) {
  const payload = await request.json();

  let products = await fs.readFile(dataPath, "utf8");
  products = JSON.parse(products);

  const productIndex = products.findIndex((product) => product.id === params.id);
  if (productIndex < 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Product not found",
      },
      { status: 404 }
    );
  }

  products[productIndex] = { ...products[productIndex], ...payload, id: params.id };
  await fs.writeFile(dataPath, JSON.stringify(products, null, 4));

  return NextResponse.json({
    success: true,
    message: "Product Updated Successfully",
  });
}
