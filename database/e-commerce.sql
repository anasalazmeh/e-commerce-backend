-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 20 يناير 2025 الساعة 23:34
-- إصدار الخادم: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e-commerce`
--

-- --------------------------------------------------------

--
-- بنية الجدول `cart`
--

CREATE TABLE `cart` (
  `cartId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `categories`
--

CREATE TABLE `categories` (
  `categoryId` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `categories`
--

INSERT INTO `categories` (`categoryId`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'clothes', 'clothes', '2025-01-19 20:52:58.186', '2025-01-19 20:52:58.186'),
(2, 'makeup', 'makeup', '2025-01-20 20:20:13.056', '2025-01-20 20:20:13.056'),
(3, 'Flower ', 'Flower ', '2025-01-20 20:26:53.488', '2025-01-20 20:26:53.488');

-- --------------------------------------------------------

--
-- بنية الجدول `images`
--

CREATE TABLE `images` (
  `ImageId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `url` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `images`
--

INSERT INTO `images` (`ImageId`, `productId`, `url`, `createdAt`, `updatedAt`) VALUES
(25, 4, '/uploads/image-1737405019557-0.jpeg', '2025-01-20 20:30:21.430', '2025-01-20 20:30:21.430'),
(26, 8, '/uploads/3f3d76773d3231a1f219ea2f21e70a94.jpeg', '2025-01-20 20:52:51.047', '2025-01-20 20:52:51.047'),
(27, 7, '/uploads/3e22f26f67b1de1ead3074ef939f6912.jpeg', '2025-01-20 20:59:12.180', '2025-01-20 20:59:12.180'),
(28, 7, '/uploads/eff88d15e25dbd45f12ff180f3d5e843.jpeg', '2025-01-20 20:59:12.180', '2025-01-20 20:59:12.180'),
(29, 6, '/uploads/b2b1bc774aa5f00ca05b4b1eedc089bf.jpeg', '2025-01-20 20:59:41.974', '2025-01-20 20:59:41.974'),
(30, 6, '/uploads/f9fa887d7cfc02b4833a136d1c711f92.jpeg', '2025-01-20 20:59:41.974', '2025-01-20 20:59:41.974'),
(31, 9, '/uploads/a0bf4161c05c168f2a0d5db02ef4d6f7.jpeg', '2025-01-20 21:02:06.485', '2025-01-20 21:02:06.485'),
(36, 1, '/uploads/92fb110427518149f8d623b2e25b1188.jpeg', '2025-01-20 21:03:50.641', '2025-01-20 21:03:50.641'),
(37, 1, '/uploads/d64a8456d85b44236d026e0633b0e371.jpeg', '2025-01-20 21:03:50.641', '2025-01-20 21:03:50.641'),
(38, 1, '/uploads/f3c1e52035fc4ea8730b6f99847f681a.jpeg', '2025-01-20 21:03:50.641', '2025-01-20 21:03:50.641'),
(39, 1, '/uploads/c58417d2a6b3874c1b821411185be827.jpeg', '2025-01-20 21:03:50.641', '2025-01-20 21:03:50.641'),
(40, 2, '/uploads/c7b6bbf07042eeefc28091398bbfefc0.jpeg', '2025-01-20 21:04:50.719', '2025-01-20 21:04:50.719'),
(41, 3, '/uploads/50131d20f592ac4a75c304b2382b6df1.jpeg', '2025-01-20 21:07:18.147', '2025-01-20 21:07:18.147'),
(42, 5, '/uploads/ff20411c0e1e64013f15a4b20555b287.jpeg', '2025-01-20 21:07:40.462', '2025-01-20 21:07:40.462');

-- --------------------------------------------------------

--
-- بنية الجدول `orderdetails`
--

CREATE TABLE `orderdetails` (
  `OrderDetailId` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unitPrice` decimal(65,30) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `orderdetails`
--

INSERT INTO `orderdetails` (`OrderDetailId`, `orderId`, `productId`, `quantity`, `unitPrice`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 2, 50.000000000000000000000000000000, '2025-01-19 21:31:01.285', '2025-01-19 21:31:01.285'),
(2, 2, 1, 2, 50.000000000000000000000000000000, '2025-01-19 21:59:26.015', '2025-01-19 21:59:26.015');

-- --------------------------------------------------------

--
-- بنية الجدول `orders`
--

CREATE TABLE `orders` (
  `orderId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `totalAmount` decimal(65,30) NOT NULL,
  `status` enum('PendingPayment','Paid','Completed','Cancelled') NOT NULL DEFAULT 'PendingPayment',
  `address` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `orders`
--

INSERT INTO `orders` (`orderId`, `userId`, `totalAmount`, `status`, `address`, `createdAt`, `updatedAt`) VALUES
(1, 2, 100.000000000000000000000000000000, 'Completed', 'Damscus,syria', '2025-01-19 21:31:01.285', '2025-01-19 23:58:34.205'),
(2, 2, 100.000000000000000000000000000000, 'Cancelled', 'Damscus,syria', '2025-01-19 21:59:26.015', '2025-01-19 23:54:40.935');

-- --------------------------------------------------------

--
-- بنية الجدول `payments`
--

CREATE TABLE `payments` (
  `paymentsId` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `paymentMethod` varchar(191) NOT NULL,
  `amount` decimal(65,30) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `payments`
--

INSERT INTO `payments` (`paymentsId`, `orderId`, `paymentMethod`, `amount`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Credit Card', 100.000000000000000000000000000000, '2025-01-19 21:47:03.479', '2025-01-19 21:47:03.479');

-- --------------------------------------------------------

--
-- بنية الجدول `productreview`
--

CREATE TABLE `productreview` (
  `ReviewId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `rating` int(11) NOT NULL DEFAULT 1,
  `comment` varchar(191) DEFAULT NULL,
  `reviewDate` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `productreview`
--

INSERT INTO `productreview` (`ReviewId`, `productId`, `userId`, `rating`, `comment`, `reviewDate`) VALUES
(1, 9, 2, 5, 'good', '2025-01-20 21:08:18.730'),
(2, 8, 2, 2, 'good', '2025-01-20 21:11:16.754'),
(3, 1, 2, 5, 'test', '2025-01-20 21:18:33.519'),
(4, 4, 2, 2, 'test', '2025-01-20 22:26:48.290');

-- --------------------------------------------------------

--
-- بنية الجدول `products`
--

CREATE TABLE `products` (
  `productId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `price` decimal(65,30) NOT NULL,
  `stock` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `products`
--

INSERT INTO `products` (`productId`, `categoryId`, `name`, `description`, `price`, `stock`, `createdAt`, `updatedAt`) VALUES
(1, 3, 'Bouquest of roses', 'a beautiful bouquest of roses ', 50.000000000000000000000000000000, 3, '2025-01-19 21:08:43.217', '2025-01-20 21:03:50.279'),
(2, 1, 'Pajamas', 'Full pajama set: shorts and a cotton shirt', 100.000000000000000000000000000000, 5, '2025-01-20 19:59:22.828', '2025-01-20 21:04:50.438'),
(3, 1, 'Pajamas', '3-piece set: pants, shirt, and cotton shorts', 150.000000000000000000000000000000, 10, '2025-01-20 20:00:51.171', '2025-01-20 21:07:17.646'),
(4, 1, 'Pajamas', '4-piece set: two shirts, pants, and shorts', 130.000000000000000000000000000000, 12, '2025-01-20 20:03:11.652', '2025-01-20 20:30:21.256'),
(5, 1, 'Pajamas', '3-piece set: pants, tank top, and jacket', 200.000000000000000000000000000000, 9, '2025-01-20 20:04:47.801', '2025-01-20 21:07:40.277'),
(6, 1, 'Suit', 'Includes: shirt, sweater, pants, jacket, boots, cap, watch, and sunglasses', 230.000000000000000000000000000000, 9, '2025-01-20 20:06:56.987', '2025-01-20 20:59:41.500'),
(7, 1, 'Suits', 'Includes: knee-length jacket, sweater, pants, boots, scarf, and watch', 300.000000000000000000000000000000, 7, '2025-01-20 20:16:12.483', '2025-01-20 20:59:11.406'),
(8, 2, 'LASERG', 'Transparent with color, large size, unique color', 20.000000000000000000000000000000, 50, '2025-01-20 20:21:19.756', '2025-01-20 20:52:46.187'),
(9, 2, 'GlIconic', 'Comprehensive set with unique design and visual appeal.', 50.000000000000000000000000000000, 6, '2025-01-20 20:24:54.479', '2025-01-20 21:02:05.602');

-- --------------------------------------------------------

--
-- بنية الجدول `user`
--

CREATE TABLE `user` (
  `userId` int(11) NOT NULL,
  `fullName` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `roles` enum('Admin','Employee','User') NOT NULL DEFAULT 'User',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `user`
--

INSERT INTO `user` (`userId`, `fullName`, `email`, `password`, `phone`, `roles`, `createdAt`, `updatedAt`) VALUES
(1, 'Anas Alazmeh', 'anoosalazmeh@gmail.com', '$2a$12$Akedzu9ttFdGSz4w7DmOGuOORN64qhOqWfT5gbZjZhH.d6hp6KBY.', '+9639999999', 'Admin', '2025-01-19 20:40:37.568', '2025-01-20 10:34:27.597'),
(2, 'Anas Alazmeh', 'anas.alazmeh.2001@gmail.com', '$2a$12$J5YzCarM2Wj3lKwpqi/bcO9w6CLMJE.maa1mUGnTNKolR3jFfEYOq', '+963999999', 'User', '2025-01-19 21:28:36.421', '2025-01-19 21:28:36.421');

-- --------------------------------------------------------

--
-- بنية الجدول `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('179abed6-7fb3-4339-a758-3fb6f189de00', 'edd8c16e35aaa1c52729d9ab8bc44225c51bf7ef7e5770cb7cd349e38b656d0c', '2025-01-19 16:58:50.595', '20250119165836_add_column_address_in_table_orders', NULL, NULL, '2025-01-19 16:58:36.941', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cartId`),
  ADD KEY `Cart_userId_idx` (`userId`),
  ADD KEY `Cart_productId_idx` (`productId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`categoryId`),
  ADD UNIQUE KEY `Categories_name_key` (`name`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`ImageId`),
  ADD KEY `Images_productId_idx` (`productId`);

--
-- Indexes for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD PRIMARY KEY (`OrderDetailId`),
  ADD KEY `OrderDetails_orderId_idx` (`orderId`),
  ADD KEY `OrderDetails_productId_idx` (`productId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`),
  ADD KEY `Orders_userId_idx` (`userId`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`paymentsId`),
  ADD UNIQUE KEY `Payments_orderId_key` (`orderId`),
  ADD KEY `Payments_orderId_idx` (`orderId`);

--
-- Indexes for table `productreview`
--
ALTER TABLE `productreview`
  ADD PRIMARY KEY (`ReviewId`),
  ADD KEY `ProductReview_productId_idx` (`productId`),
  ADD KEY `ProductReview_userId_idx` (`userId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productId`),
  ADD KEY `Products_categoryId_idx` (`categoryId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cartId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `categoryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `ImageId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `orderdetails`
--
ALTER TABLE `orderdetails`
  MODIFY `OrderDetailId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `paymentsId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `productreview`
--
ALTER TABLE `productreview`
  MODIFY `ReviewId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `productId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- قيود الجداول المُلقاة.
--

--
-- قيود الجداول `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `Cart_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON UPDATE CASCADE;

--
-- قيود الجداول `images`
--
ALTER TABLE `images`
  ADD CONSTRAINT `Images_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- قيود الجداول `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD CONSTRAINT `OrderDetails_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderDetails_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON UPDATE CASCADE;

--
-- قيود الجداول `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `Orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON UPDATE CASCADE;

--
-- قيود الجداول `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `Payments_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`) ON UPDATE CASCADE;

--
-- قيود الجداول `productreview`
--
ALTER TABLE `productreview`
  ADD CONSTRAINT `ProductReview_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ProductReview_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON UPDATE CASCADE;

--
-- قيود الجداول `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `Products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`categoryId`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
