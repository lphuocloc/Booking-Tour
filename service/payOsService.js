const PayOS = require('@payos/node');
const payOS = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY
);

exports.createPaymentLink = async ({ order_code, amount, items, returnUrl, cancelUrl }) => {
    const body = {
        orderCode: order_code,
        amount,
        description: `Booking #${order_code}`,
        items,
        returnUrl,
        cancelUrl
    };
    try {
        const res = await payOS.createPaymentLink(body);
        return res;
    } catch (error) {
        throw error;
    }
};
