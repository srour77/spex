/*
  Warnings:

  - You are about to drop the `cpu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cpuOrders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gpu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gpuOrders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `motherBoard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `motherBoardOrders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ram` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ramOrders` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[cpu] DROP CONSTRAINT [cpu_vendorId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[cpuOrders] DROP CONSTRAINT [cpuOrders_cpuId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[cpuOrders] DROP CONSTRAINT [cpuOrders_orderId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[gpu] DROP CONSTRAINT [gpu_vendorId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[gpuOrders] DROP CONSTRAINT [gpuOrders_gpuId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[gpuOrders] DROP CONSTRAINT [gpuOrders_orderId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[motherBoard] DROP CONSTRAINT [motherBoard_vendorId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[motherBoardOrders] DROP CONSTRAINT [motherBoardOrders_motherBoardId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[motherBoardOrders] DROP CONSTRAINT [motherBoardOrders_ordersId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ram] DROP CONSTRAINT [ram_vendorId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ramOrders] DROP CONSTRAINT [ramOrders_orderId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ramOrders] DROP CONSTRAINT [ramOrders_ramId_fkey];

-- DropTable
DROP TABLE [dbo].[cpu];

-- DropTable
DROP TABLE [dbo].[cpuOrders];

-- DropTable
DROP TABLE [dbo].[gpu];

-- DropTable
DROP TABLE [dbo].[gpuOrders];

-- DropTable
DROP TABLE [dbo].[motherBoard];

-- DropTable
DROP TABLE [dbo].[motherBoardOrders];

-- DropTable
DROP TABLE [dbo].[ram];

-- DropTable
DROP TABLE [dbo].[ramOrders];

-- CreateTable
CREATE TABLE [dbo].[products] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(100) NOT NULL,
    [desc] NVARCHAR(500),
    [stock] INT NOT NULL,
    [price] INT NOT NULL,
    [manufacturer] VARCHAR(50) NOT NULL,
    [warranty] SMALLINT NOT NULL,
    [model] VARCHAR(30) NOT NULL,
    [year] DATE NOT NULL,
    [isNew] BIT NOT NULL,
    [isDeleted] BIT NOT NULL,
    [category] VARCHAR(40) NOT NULL,
    [specs] VARCHAR(600) NOT NULL,
    [vendorId] INT NOT NULL,
    CONSTRAINT [products_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[products_orders] (
    [productId] INT NOT NULL,
    [orderId] NVARCHAR(1000) NOT NULL,
    [price] INT NOT NULL,
    [itemNo] INT NOT NULL,
    CONSTRAINT [products_orders_pkey] PRIMARY KEY CLUSTERED ([productId],[orderId])
);

-- AddForeignKey
ALTER TABLE [dbo].[products] ADD CONSTRAINT [products_vendorId_fkey] FOREIGN KEY ([vendorId]) REFERENCES [dbo].[vendors]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[products_orders] ADD CONSTRAINT [products_orders_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[products]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[products_orders] ADD CONSTRAINT [products_orders_orderId_fkey] FOREIGN KEY ([orderId]) REFERENCES [dbo].[orders]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
