/*
  Warnings:

  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products_orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vendors` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[orders] DROP CONSTRAINT [orders_customerId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[products] DROP CONSTRAINT [products_vendorId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[products_orders] DROP CONSTRAINT [products_orders_orderId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[products_orders] DROP CONSTRAINT [products_orders_productId_fkey];

-- DropTable
DROP TABLE [dbo].[customers];

-- DropTable
DROP TABLE [dbo].[orders];

-- DropTable
DROP TABLE [dbo].[products];

-- DropTable
DROP TABLE [dbo].[products_orders];

-- DropTable
DROP TABLE [dbo].[vendors];

-- CreateTable
CREATE TABLE [dbo].[Vendor] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(100) NOT NULL,
    [address] NVARCHAR(200) NOT NULL,
    [email] VARCHAR(70) NOT NULL,
    [phone] CHAR(11) NOT NULL,
    [password] VARCHAR(100) NOT NULL,
    CONSTRAINT [Vendor_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Product] (
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
    CONSTRAINT [Product_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Customer] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(100) NOT NULL,
    [address] NVARCHAR(200) NOT NULL,
    [email] VARCHAR(70) NOT NULL,
    [phone] CHAR(11) NOT NULL,
    [password] VARCHAR(100) NOT NULL,
    CONSTRAINT [Customer_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Order] (
    [id] NVARCHAR(1000) NOT NULL,
    [customerId] INT NOT NULL,
    CONSTRAINT [Order_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Product_Order] (
    [productId] INT NOT NULL,
    [orderId] NVARCHAR(1000) NOT NULL,
    [price] INT NOT NULL,
    [itemNo] INT NOT NULL,
    CONSTRAINT [Product_Order_pkey] PRIMARY KEY CLUSTERED ([productId],[orderId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Product] ADD CONSTRAINT [Product_vendorId_fkey] FOREIGN KEY ([vendorId]) REFERENCES [dbo].[Vendor]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customer]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Product_Order] ADD CONSTRAINT [Product_Order_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Product_Order] ADD CONSTRAINT [Product_Order_orderId_fkey] FOREIGN KEY ([orderId]) REFERENCES [dbo].[Order]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
