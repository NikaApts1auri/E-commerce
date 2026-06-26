import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryParams } from './dto/query-params.dto';
import { IsValidMongoDBId } from './dto/is-valid-objectID.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll({ page, take }: QueryParams): Promise<{
        users: (import("mongoose").Document<unknown, {}, import("./schema/user.entity").User> & import("./schema/user.entity").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        total: number;
        page: number;
        take: number;
    }>;
    findOne({ id }: IsValidMongoDBId): Promise<import("mongoose").Document<unknown, {}, import("./schema/user.entity").User> & import("./schema/user.entity").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(requesterId: string, { id }: IsValidMongoDBId, updateUserDto: UpdateUserDto): Promise<(import("mongoose").Document<unknown, {}, import("./schema/user.entity").User> & import("./schema/user.entity").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    remove(requesterId: string, { id }: IsValidMongoDBId): Promise<(import("mongoose").Document<unknown, {}, import("./schema/user.entity").User> & import("./schema/user.entity").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
