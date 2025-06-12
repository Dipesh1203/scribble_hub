/*
  Warnings:

  - Changed the type of `message` on the `Chat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN "message_json" JSONB;

-- Step 2: Copy and cast data from old column to new column
UPDATE "Chat" SET "message_json" = to_jsonb("message"::text);

-- Step 3: Drop the old column
ALTER TABLE "Chat" DROP COLUMN "message";

-- Step 4: Rename the new column to the original name
ALTER TABLE "Chat" RENAME COLUMN "message_json" TO "message";

-- CreateTable
CREATE TABLE "NormalChat" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "NormalChat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NormalChat" ADD CONSTRAINT "NormalChat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NormalChat" ADD CONSTRAINT "NormalChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
