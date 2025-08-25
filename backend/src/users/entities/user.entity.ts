import { Task } from "../../tasks/entities/task.entity";

export class User {
    usr_id: number;
    usr_email: string;
    usr_username: string;
    usr_password: string;
    tasks: Task[];
}
