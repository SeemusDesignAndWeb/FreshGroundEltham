// PayPal REST API client
// Note: PayPal REST API requires server-side implementation
// For client-side, use PayPal JS SDK directly

export interface PayPalOrder {
	id: string;
	status: string;
	amount: {
		currency_code: string;
		value: string;
	};
}

export interface CreateOrderRequest {
	amount: number;
	currency?: string;
	bookingData?: any;
}

