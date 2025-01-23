BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Customer] ADD [emailVerified] BIT NOT NULL CONSTRAINT [Customer_emailVerified_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[Vendor] ADD [emailVerified] BIT NOT NULL CONSTRAINT [Vendor_emailVerified_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
