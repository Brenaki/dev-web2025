export class CreateTaskDto {
    tks_title: string;
    tks_done: boolean;
    tks_fk_user: number; // User ID
}
