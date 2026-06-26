import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(createOrderDto: CreateOrderDto): Promise<import("./schema/order.schema").Order>;
    findOne(id: string): Promise<import("./schema/order.schema").Order>;
}
