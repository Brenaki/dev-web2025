-- CreateTable
CREATE TABLE "Subtasks" (
    "stb_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stb_title" TEXT NOT NULL,
    "stb_done" BOOLEAN NOT NULL DEFAULT false,
    "stb_fk_task" INTEGER NOT NULL,
    "stb_created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stb_updated_at" DATETIME NOT NULL,
    CONSTRAINT "Subtasks_stb_fk_task_fkey" FOREIGN KEY ("stb_fk_task") REFERENCES "Tasks" ("tks_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tasks" (
    "tks_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tks_title" TEXT NOT NULL,
    "tks_done" BOOLEAN NOT NULL DEFAULT false,
    "tks_fk_user" INTEGER NOT NULL,
    "tks_priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "tks_created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tks_updated_at" DATETIME NOT NULL,
    CONSTRAINT "Tasks_tks_fk_user_fkey" FOREIGN KEY ("tks_fk_user") REFERENCES "Users" ("usr_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tasks" ("tks_created_at", "tks_done", "tks_fk_user", "tks_id", "tks_title", "tks_updated_at") SELECT "tks_created_at", "tks_done", "tks_fk_user", "tks_id", "tks_title", "tks_updated_at" FROM "Tasks";
DROP TABLE "Tasks";
ALTER TABLE "new_Tasks" RENAME TO "Tasks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
