// Utility to sync orders between checkout and admin dashboard

export const getLocalOrders = () => {
  try {
    const lastOrder = localStorage.getItem("lastOrder");
    return lastOrder ? [JSON.parse(lastOrder)] : [];
  } catch (error) {
    console.error("Error reading local orders:", error);
    return [];
  }
};

export const addOrderToAdmin = (orderData) => {
  try {
    // Transform order data to admin format
    const adminOrder = {
      id: orderData.orderId,
      customer: {
        name: `${orderData.shippingInfo.firstName} ${orderData.shippingInfo.lastName}`,
        email: orderData.shippingInfo.email,
        id: orderData.userId || "local-user"
      },
      items: orderData.items.map(item => ({
        name: item.title,
        quantity: item.quantity,
        price: item.price
      })),
      total: orderData.total,
      status: orderData.status || "pending",
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus || "paid",
      date: orderData.orderDate,
      shippingAddress: `${orderData.shippingInfo.address}, ${orderData.shippingInfo.city}, ${orderData.shippingInfo.state} ${orderData.shippingInfo.zipCode}`,
      trackingNumber: null,
      notes: orderData.orderNotes || ""
    };

    return adminOrder;
  } catch (error) {
    console.error("Error transforming order data:", error);
    return null;
  }
};

export const syncLocalOrdersWithAdmin = (existingOrders) => {
  const localOrders = getLocalOrders();
  const transformedLocal = localOrders
    .map(addOrderToAdmin)
    .filter(order => order !== null);

  // Check if local orders are already in existing orders
  const newOrders = transformedLocal.filter(localOrder => 
    !existingOrders.some(existing => existing.id === localOrder.id)
  );

  return [...existingOrders, ...newOrders];
};
