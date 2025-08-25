-- CreateTable
CREATE TABLE "Users" (
    "usr_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usr_email" TEXT NOT NULL,
    "usr_username" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Tasks" (
    "tks_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tks_title" TEXT NOT NULL,
    "tks_done" BOOLEAN NOT NULL DEFAULT false,
    "tks_fk_user" INTEGER NOT NULL,
    "tks_created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tks_updated_at" DATETIME NOT NULL,
    CONSTRAINT "Tasks_tks_fk_user_fkey" FOREIGN KEY ("tks_fk_user") REFERENCES "Users" ("usr_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_usr_email_key" ON "Users"("usr_email");
