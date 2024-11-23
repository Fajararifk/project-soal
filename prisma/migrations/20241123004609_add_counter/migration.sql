/*
  Warnings:

  - Added the required column `counterInsert` to the `QuizResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "question" DROP NOT NULL;

-- AlterTable
ALTER TABLE "QuizResult" ADD COLUMN     "counterInsert" INTEGER NOT NULL;
