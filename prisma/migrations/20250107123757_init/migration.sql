BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[vendors] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(100) NOT NULL,
    [address] NVARCHAR(200) NOT NULL,
    [email] VARCHAR(70) NOT NULL,
    [phone] CHAR(11) NOT NULL,
    [password] VARCHAR(100) NOT NULL,
    CONSTRAINT [vendors_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[customers] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(100) NOT NULL,
    [address] NVARCHAR(200) NOT NULL,
    [email] VARCHAR(70) NOT NULL,
    [phone] CHAR(11) NOT NULL,
    [password] VARCHAR(100) NOT NULL,
    CONSTRAINT [customers_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[cpu] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(100) NOT NULL,
    [desc] NVARCHAR(200),
    [stock] INT NOT NULL,
    [price] INT NOT NULL,
    [manufacturer] VARCHAR(50) NOT NULL,
    [warranty] SMALLINT NOT NULL,
    [model] VARCHAR(30) NOT NULL,
    [year] DATE NOT NULL,
    [new] BIT NOT NULL,
    [deleted] BIT NOT NULL,
    [cores] SMALLINT NOT NULL,
    [threads] SMALLINT NOT NULL,
    [l1Cache] SMALLINT NOT NULL,
    [l2Cache] SMALLINT NOT NULL,
    [l3Cache] SMALLINT,
    [baseClock] DECIMAL(3,2) NOT NULL,
    [boostClock] DECIMAL(3,2),
    [architecture] BIT NOT NULL,
    [socket] VARCHAR(20) NOT NULL,
    [integratedGraphics] VARCHAR(50),
    [vendorId] INT NOT NULL,
    CONSTRAINT [cpu_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ram] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(100) NOT NULL,
    [desc] NVARCHAR(200),
    [stock] INT NOT NULL,
    [price] INT NOT NULL,
    [manufacturer] VARCHAR(50) NOT NULL,
    [warranty] SMALLINT NOT NULL,
    [model] VARCHAR(30) NOT NULL,
    [year] DATE NOT NULL,
    [new] BIT NOT NULL,
    [deleted] BIT NOT NULL,
    [size] SMALLINT NOT NULL,
    [speed] SMALLINT NOT NULL,
    [latency] SMALLINT,
    [memoryType] VARCHAR(20) NOT NULL,
    [vendorId] INT NOT NULL,
    CONSTRAINT [ram_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[gpu] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(100) NOT NULL,
    [desc] NVARCHAR(200),
    [stock] INT NOT NULL,
    [price] INT NOT NULL,
    [manufacturer] VARCHAR(50) NOT NULL,
    [warranty] SMALLINT NOT NULL,
    [model] VARCHAR(30) NOT NULL,
    [year] DATE NOT NULL,
    [new] BIT NOT NULL,
    [deleted] BIT NOT NULL,
    [cores] SMALLINT NOT NULL,
    [rops] SMALLINT,
    [memoryType] VARCHAR(20) NOT NULL,
    [memorySize] SMALLINT NOT NULL,
    [busWidth] SMALLINT,
    [vendorId] INT NOT NULL,
    CONSTRAINT [gpu_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[motherBoard] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(100) NOT NULL,
    [desc] NVARCHAR(200),
    [stock] INT NOT NULL,
    [price] INT NOT NULL,
    [manufacturer] VARCHAR(50) NOT NULL,
    [warranty] SMALLINT NOT NULL,
    [model] VARCHAR(30) NOT NULL,
    [year] DATE NOT NULL,
    [new] BIT NOT NULL,
    [deleted] BIT NOT NULL,
    [socket] VARCHAR(50) NOT NULL,
    [memory] VARCHAR(100),
    [lan] VARCHAR(100),
    [storage] VARCHAR(100),
    [usb] VARCHAR(100),
    [network] VARCHAR(100),
    [vendorId] INT NOT NULL,
    CONSTRAINT [motherBoard_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[orders] (
    [id] NVARCHAR(1000) NOT NULL,
    [customerId] INT NOT NULL,
    CONSTRAINT [orders_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[cpuOrders] (
    [orderId] NVARCHAR(1000) NOT NULL,
    [cpuId] INT NOT NULL,
    [quantity] INT NOT NULL,
    [price] INT NOT NULL,
    CONSTRAINT [cpuOrders_pkey] PRIMARY KEY CLUSTERED ([orderId],[cpuId])
);

-- CreateTable
CREATE TABLE [dbo].[ramOrders] (
    [orderId] NVARCHAR(1000) NOT NULL,
    [ramId] INT NOT NULL,
    [quantity] INT NOT NULL,
    [price] INT NOT NULL,
    CONSTRAINT [ramOrders_pkey] PRIMARY KEY CLUSTERED ([orderId],[ramId])
);

-- CreateTable
CREATE TABLE [dbo].[gpuOrders] (
    [orderId] NVARCHAR(1000) NOT NULL,
    [gpuId] INT NOT NULL,
    [quantity] INT NOT NULL,
    [price] INT NOT NULL,
    [ordersId] NVARCHAR(1000),
    CONSTRAINT [gpuOrders_pkey] PRIMARY KEY CLUSTERED ([orderId],[gpuId])
);

-- CreateTable
CREATE TABLE [dbo].[motherBoardOrders] (
    [orderId] INT NOT NULL,
    [motherBoardId] INT NOT NULL,
    [quantity] INT NOT NULL,
    [price] INT NOT NULL,
    [ordersId] NVARCHAR(1000),
    CONSTRAINT [motherBoardOrders_pkey] PRIMARY KEY CLUSTERED ([orderId],[motherBoardId])
);

-- AddForeignKey
ALTER TABLE [dbo].[cpu] ADD CONSTRAINT [cpu_vendorId_fkey] FOREIGN KEY ([vendorId]) REFERENCES [dbo].[vendors]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ram] ADD CONSTRAINT [ram_vendorId_fkey] FOREIGN KEY ([vendorId]) REFERENCES [dbo].[vendors]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[gpu] ADD CONSTRAINT [gpu_vendorId_fkey] FOREIGN KEY ([vendorId]) REFERENCES [dbo].[vendors]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[motherBoard] ADD CONSTRAINT [motherBoard_vendorId_fkey] FOREIGN KEY ([vendorId]) REFERENCES [dbo].[vendors]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[orders] ADD CONSTRAINT [orders_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[customers]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[cpuOrders] ADD CONSTRAINT [cpuOrders_cpuId_fkey] FOREIGN KEY ([cpuId]) REFERENCES [dbo].[cpu]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[cpuOrders] ADD CONSTRAINT [cpuOrders_orderId_fkey] FOREIGN KEY ([orderId]) REFERENCES [dbo].[orders]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ramOrders] ADD CONSTRAINT [ramOrders_ramId_fkey] FOREIGN KEY ([ramId]) REFERENCES [dbo].[ram]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ramOrders] ADD CONSTRAINT [ramOrders_orderId_fkey] FOREIGN KEY ([orderId]) REFERENCES [dbo].[orders]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[gpuOrders] ADD CONSTRAINT [gpuOrders_gpuId_fkey] FOREIGN KEY ([gpuId]) REFERENCES [dbo].[gpu]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[gpuOrders] ADD CONSTRAINT [gpuOrders_orderId_fkey] FOREIGN KEY ([orderId]) REFERENCES [dbo].[orders]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[motherBoardOrders] ADD CONSTRAINT [motherBoardOrders_ordersId_fkey] FOREIGN KEY ([ordersId]) REFERENCES [dbo].[orders]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[motherBoardOrders] ADD CONSTRAINT [motherBoardOrders_motherBoardId_fkey] FOREIGN KEY ([motherBoardId]) REFERENCES [dbo].[motherBoard]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
