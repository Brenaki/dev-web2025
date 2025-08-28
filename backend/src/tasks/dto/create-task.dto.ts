export class CreateTaskDto {
    tks_title: string;
    tks_done: boolean;
    tks_fk_user: number; // User ID
    tks_priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    subtasks?: { stb_title: string; stb_done?: boolean }[];
}
