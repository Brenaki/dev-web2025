/*
  Warnings:

  - Added the required column `usr_password` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Users" (
    "usr_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usr_email" TEXT NOT NULL,
    "usr_username" TEXT NOT NULL,
    "usr_password" TEXT NOT NULL
);
INSERT INTO "new_Users" ("usr_email", "usr_id", "usr_username") SELECT "usr_email", "usr_id", "usr_username" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_usr_email_key" ON "Users"("usr_email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
