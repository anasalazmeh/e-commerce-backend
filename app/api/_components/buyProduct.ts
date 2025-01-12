import prisma from "@/prisma/client";

export async function buyProduct(orderId: number): Promise<boolean> {
  // جلب تفاصيل الطلب
  let allSuccessful = true;
  const orderDetails = await prisma.orderDetails.findMany({
    where: { orderId },
  });

  if (!orderDetails.length) {
    console.error(`No products found for Order ID: ${orderId}`);
    return false;
  }


  for (const item of orderDetails) {
    // جلب المنتج من قاعدة البيانات
    const p = await prisma.products.findUnique({
      where: { productId: item.productId },
    });

    // التحقق من وجود المنتج
    if (p) {
      // التحقق من أن المخزون يكفي
      if (p.stock >= item.quantity) {
        const newStock = p.stock - item.quantity;

        // تحديث المخزون
        await prisma.products.update({
          where: { productId: item.productId },
          data: {
            stock: newStock,
          },
        });
      } else {
        console.error(
          `Insufficient stock for Product ID: ${item.productId}. Available: ${p.stock}, Requested: ${item.quantity}`
        );
        allSuccessful = false;
      }
    } else {
      console.error(`Product with ID: ${item.productId} does not exist.`);
      allSuccessful = false;
    }
  }

  return allSuccessful;
}
