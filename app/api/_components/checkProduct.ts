import prisma from "@/prisma/client";


/**
 * التحقق من وجود المنتجات والكميات
 * @param {number} orderId - رقم الطلب
 * @returns {Promise<boolean>} - إرجاع true إذا كانت كل المنتجات والكميات متطابقة، وإلا false
 */
export async function checkOrder(orderId:number) {
  try {
    // جلب تفاصيل الطلب
    const orderDetails = await prisma.orderDetails.findMany({
      where: { orderId },
    });

    if (!orderDetails.length) {
      console.error(`No products found for Order ID: ${orderId}`);
      return false;
    }

    // استخراج معرفات المنتجات
    const productIds = orderDetails.map((item) => item.productId);

    // جلب جميع المنتجات
    const allProducts = await prisma.products.findMany({
      where: {
        productId: { in: productIds },
      },
    });

    // التحقق من المنتجات والكميات
    for (const item of orderDetails) {
      const product = allProducts.find((p) => p.productId === item.productId);
      if (!product || product.stock < item.quantity) {
        console.error(
          `Product mismatch: ${!product ? 'Product not found' : 'Quantity mismatch'} for Product ID: ${item.productId}`
        );
        return false; // إرجاع false إذا لم يتم العثور على المنتج أو الكمية غير مطابقة
      }
    }
    return true; // كل شيء صحيح
  } catch (error) {
    console.error(`Error checking products: ${error}`);
    return false;
  }
}
interface Product{
  productId:number,
  quantity:number
}
export async function checkProducts(products:Product[]) {
  try {
    // جلب تفاصيل الطلب
    // const orderDetails = await prisma.orderDetails.findMany({
    //   where: { orderId },
    // });

    if (!products.length) {
      // console.error(`No products found for Order ID: ${orderId}`);
      return false;
    }

    // استخراج معرفات المنتجات
    const productIds = products.map((item) => item.productId);

    // جلب جميع المنتجات
    const allProducts = await prisma.products.findMany({
      where: {
        productId: { in: productIds },
      },
    });

    // التحقق من المنتجات والكميات
    for (const item of products) {
      const product = allProducts.find((p) => p.productId === item.productId);
      if (!product || product.stock !== item.quantity) {
        console.error(
          `Product mismatch: ${!product ? 'Product not found' : 'Quantity mismatch'} for Product ID: ${item.productId}`
        );
        return false; // إرجاع false إذا لم يتم العثور على المنتج أو الكمية غير مطابقة
      }
    }
    return true; // كل شيء صحيح
  } catch (error) {
    console.error(`Error checking products: ${error}`);
    return false;
  }
}

