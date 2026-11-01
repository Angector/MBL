/**
 * Order service contract. This frontend phase ships a DEMO implementation only:
 * nothing is sent anywhere and no order exists. Replace `demoOrderService` with an
 * API client in the backend phase; the checkout UI will not change.
 */
export interface OrderRequest {
  customer: { fullName: string; email: string; phone: string };
  address: { country: string; region: string; city: string; line: string; postalCode: string };
  deliveryMethod: string;
  paymentMethod: string;
  notes?: string;
  lines: { productId: string; variantId: string; quantity: number }[];
}
export type OrderResult = { status: 'demo'; reference: string; request: OrderRequest };

export interface OrderService { submit(request: OrderRequest): Promise<OrderResult> }

export const demoOrderService: OrderService = {
  async submit(request) {
    await new Promise((r) => setTimeout(r, 700));
    return { status: 'demo', reference: `DEMO-${Date.now().toString(36).toUpperCase()}`, request };
  },
};
