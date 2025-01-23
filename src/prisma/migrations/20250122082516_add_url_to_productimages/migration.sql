/*
  Warnings:

  - You are about to drop the column `name` on the `ProductImages` table. All the data in the column will be lost.
  - Added the required column `url` to the `ProductImages` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ProductImages] DROP COLUMN [name];
ALTER TABLE [dbo].[ProductImages] ADD [url] VARCHAR(250) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
