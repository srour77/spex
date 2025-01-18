class PaymentHandler {
  static async processPayment(): Promise<void> {
    console.log('start');

    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('success');
      }, 5000);
    });

    console.log('finish');
  }
}

export default PaymentHandler;
