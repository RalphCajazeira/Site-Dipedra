-- CreateTable
CREATE TABLE "CatalogItem" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "image" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT,
  "material" TEXT,
  "ambientes" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "CatalogItem_image_key" ON "CatalogItem"("image");

-- CreateTrigger
CREATE TRIGGER "CatalogItem_updatedAt"
AFTER UPDATE ON "CatalogItem"
FOR EACH ROW
BEGIN
  UPDATE "CatalogItem" SET "updatedAt" = CURRENT_TIMESTAMP WHERE rowid = NEW.rowid;
END;
