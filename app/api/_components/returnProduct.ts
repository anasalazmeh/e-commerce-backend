import prisma from "@/prisma/client";

export async function returnProduct(orderId: number): Promise<boolean> {
  // جلب تفاصيل الطلب
  let allSuccessful = true;
  const orderDetails = await prisma.orderDetails.findMany({
    where: { orderId },
  });
  if (!orderDetails.length) {
    allSuccessful = false;
  }

  for (const item of orderDetails) {
    // جلب المنتج من قاعدة البيانات
    const p = await prisma.products.findUnique({
      where: { productId: item.productId },
    });

    if (p) {
      const newStock = p.stock + item.quantity;

      await prisma.products.update({
        where: { productId: item.productId },
        data: {
          stock: newStock,
        },
      });
    } else {
      allSuccessful = false;
    }
  }
  return allSuccessful;
}
