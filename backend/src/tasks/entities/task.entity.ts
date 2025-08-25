import { User } from "../../users/entities/user.entity";

export class Task {
    tks_id: number;
    tks_title: string;
    tks_done: boolean;
    tks_user: User;
    tks_created_at: Date;
    tks_updated_at: Date | null;
}
