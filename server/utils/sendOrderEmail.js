import nodemailer from 'nodemailer';

const sendOrderEmail = async (order, settings) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const itemsHtml = order.orderItems
    .map(
      (item) =>
        `<tr>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>R${item.price.toFixed(2)}</td>
    </tr>`
    )
    .join('');

  const output = `
    <h1>You have a new order! (Order ID: ${order._id})</h1>
    <h2>Customer Details</h2>
    <ul>
      <li><strong>Name:</strong> ${order.customer.name}</li>
      <li><strong>Email:</strong> ${order.customer.email}</li>
      <li><strong>Phone:</strong> ${order.customer.phone}</li>
      <li><strong>Shipping Address:</strong> ${order.customer.shippingAddress}</li>
    </ul>
    <h2>Order Summary</h2>
    <table border="1" cellpadding="5">
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
    <h3>Subtotal: R${order.itemsPrice.toFixed(2)}</h3>
    <h3>Shipping: R${order.shippingPrice.toFixed(2)}</h3>
    <h2>Total: R${order.totalPrice.toFixed(2)}</h2>
  `;

  const mailOptions = {
    from: '"Succulent Fairy Gardens" <noreply@succulentfairygardens.co.za>',
    to: settings.notificationEmail,
    subject: `New Order Received - ${order._id}`,
    html: output,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

export default sendOrderEmail;