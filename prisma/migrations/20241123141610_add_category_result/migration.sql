/*
  Warnings:

  - Added the required column `category` to the `QuizResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuizResult" ADD COLUMN     "category" TEXT NOT NULL;
