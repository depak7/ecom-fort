/*
  Warnings:

  - Added the required column `businessType` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Made the column `phoneNumber` on table `Store` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "addressProof" TEXT,
ADD COLUMN     "alternatePhone" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "businessLicense" TEXT,
ADD COLUMN     "businessProof" TEXT,
ADD COLUMN     "businessType" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "gstNumber" TEXT,
ADD COLUMN     "identityProof" TEXT,
ADD COLUMN     "ifscCode" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "panNumber" TEXT,
ADD COLUMN     "pincode" TEXT NOT NULL,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "phoneNumber" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Store_verificationStatus_idx" ON "Store"("verificationStatus");

-- CreateIndex
CREATE INDEX "Store_isApproved_idx" ON "Store"("isApproved");
