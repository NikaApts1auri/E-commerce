import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
export declare class DiscountController {
    private readonly discountService;
    constructor(discountService: DiscountService);
    create(createDiscountDto: CreateDiscountDto): Promise<import("./schema/discount.schema").Discount>;
    findAll(active?: string): Promise<import("./schema/discount.schema").Discount[]>;
}
