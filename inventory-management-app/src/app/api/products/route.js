import { NextResponse } from "next/server";
import { promises as fs } from "fs";

const dataPath = `${process.cwd()}/public/data/products.json`;

export async function GET(request) {
  const url = new URL(request.url);
  const searchValue = url.searchParams.get("search") || "";

  let products = await fs.readFile(dataPath, "utf8");
  products = JSON.parse(products);

  if (!searchValue.trim()) {
    return NextResponse.json({
      success: true,
      message: "Products Fetched Successfully",
      data: products,
    });
  }

  const normalizedSearch = searchValue.trim().toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().startsWith(normalizedSearch)
  );

  return NextResponse.json({
    success: true,
    message: "Products Fetched Successfully",
    data: filteredProducts,
  });
}

export async function DELETE(request) {
  const body = await request.json().catch(() => null);
  const id = typeof body === "object" && body !== null ? body.id ?? body : body;

  if (!id) {
    return NextResponse.json(
      {
        success: false,
        message: "Product id is required",
      },
      { status: 400 }
    );
  }

  let products = await fs.readFile(dataPath, "utf8");
  products = JSON.parse(products);

  const productIndex = products.findIndex((product) => product.id === id);
  if (productIndex < 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Product not found",
      },
      { status: 404 }
    );
  }

  products.splice(productIndex, 1);
  await fs.writeFile(dataPath, JSON.stringify(products, null, 4));

  return NextResponse.json({
    success: true,
    message: "Product Deleted Successfully",
  });
}
