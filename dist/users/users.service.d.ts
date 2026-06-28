import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './schema/user.entity';
import { QueryParams } from './dto/query-params.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    findAll({ page, take }: QueryParams): Promise<{
        users: (import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        total: number;
        page: number;
        take: number;
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateUser(requesterId: string, targetUserId: string, dto: UpdateUserDto): Promise<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    deleteUser(requesterId: string, targetUserId: string): Promise<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
