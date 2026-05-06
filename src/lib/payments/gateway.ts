export type PaymentGatewayRequest = {
  recordId: string;
  amount: number;
  description: string;
  returnUrl: string;
};

export type PaymentGatewayResponse = {
  redirectUrl: string;
  provider: "demo-gateway";
};

export async function createPaymentRedirect(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
  await new Promise((resolve) => window.setTimeout(resolve, 800));

  const params = new URLSearchParams({
    recordId: request.recordId,
    amount: request.amount.toString(),
    description: request.description,
    returnUrl: request.returnUrl,
  });

  return {
    provider: "demo-gateway",
    redirectUrl: `/dashboard/payments?${params.toString()}&status=redirecting`,
  };
}
