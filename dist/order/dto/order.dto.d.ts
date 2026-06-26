export declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    totalAmount: number;
    items: OrderItemDto[];
    userId: string;
}
