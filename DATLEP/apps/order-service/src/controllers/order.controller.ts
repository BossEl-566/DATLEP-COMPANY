import { Request, Response } from "express";
// import redis from "packages/libs/redis";

export const testOrderController = (req: Request, res: Response) => {
  res.status(200).json({
    service: "order-service",
    message: "order service is working correctly 🚀",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
}

// payment session controller
// export const createPaymentSession = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const{ cart, selectedAddressId, couponCode } = req.body;
//       const userId = req.user?.id;

//       if(!cart || !Array.isArray(cart) || cart.length === 0) {
//         return res.status(400).json({
//           error: "Invalid or empty cart",
//         });
//       }
//       const normalizedCart = JSON.stringify(
//         cart.map((item: any) => ({
//             id: item.id,
//           productId: item.productId,
//           quantity: item.quantity,
//           sale_price: item.sale_price,
//           shopId: item.shopId,
//           selectedOptions: item.selectedOptions || {},
//         })).sort((a: any, b: any) => a.productId.localeCompare(b.id))
//       );
//       const keys = await redis.keys("payment_session:*");
//         for(const key of keys) {
//           const data = await redis.get(key);
//           if(data) {
//             const session = JSON.parse(data);
//             if(session.userId === userId) {
//                const existingCart = JSON.stringify(session.cart.map((item: any) => ({
//                 id: item.id,
//                 productId: item.productId,
//                 quantity: item.quantity,
//                 sale_price: item.sale_price,
//                 shopId: item.shopId,
//                 selectedOptions: item.selectedOptions || {},
//               })).sort((a: any, b: any) => a.productId.localeCompare(b.id)));
//                 if(existingCart === normalizedCart) {
//                   return res.status(200).json({
//                     sessionId: key.split(":")[1],
//                 }) 
//             } else {
//               await redis.del(key);
//             }
//           }
//           } 
//         } 
//         // fetch sellers and thier account details
//         // calculate total amount 
//         // create session payload

//       res.status(200).json({
//         message: "Payment session created successfully",
//         cart: normalizedCart,
//         selectedAddressId,
//         couponCode,
//       });
//     } catch (error) {
//       next(error);  
//     }
// };

// verify payment section

// create order 