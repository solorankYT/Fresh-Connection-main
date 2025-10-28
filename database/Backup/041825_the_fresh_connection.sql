-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 17, 2025 at 11:12 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `the_fresh_connection`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` char(36) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`, `created_at`, `updated_at`) VALUES
(45, 1, 'f52937a9-f4c4-4ce4-8e0d-32d5981663c3', 1, '2025-04-05 11:34:51', '2025-04-05 11:34:51'),
(46, 1, 'eafadd9a-7d98-4652-a967-a8730ae0fa48', 1, '2025-04-05 11:38:09', '2025-04-05 11:38:09'),
(47, 1, 'b1788367-e964-40ca-b40c-2936df8359fc', 1, '2025-04-05 11:41:06', '2025-04-05 11:41:06'),
(48, 1, '69cf8e49-2aa6-47fe-ba75-ad79bcddc316', 1, '2025-04-05 11:41:18', '2025-04-05 11:41:18'),
(49, 1, '8569221f-292d-488f-aa98-f648f74b165c', 1, '2025-04-05 11:41:21', '2025-04-05 11:41:21'),
(50, 1, '96f10c76-46f8-42e4-adcc-2e29e82423ae', 2, '2025-04-05 11:42:01', '2025-04-05 11:42:44'),
(51, 1, 'b3aea825-a8e9-4349-9729-2513c659befa', 5, '2025-04-05 11:42:26', '2025-04-05 11:46:21'),
(52, 1, '8c3748fd-acff-46d9-93eb-5fce621e3a6a', 3, '2025-04-05 11:42:49', '2025-04-05 11:44:15'),
(53, 1, '61a6a831-1de1-47ce-8ca8-b2749c51b488', 1, '2025-04-05 11:42:52', '2025-04-05 11:42:52'),
(54, 1, 'd395f635-b57c-4fd6-95db-a376b6355ad7', 3, '2025-04-05 11:43:15', '2025-04-05 11:49:08'),
(55, 1, '4f641f4a-0d57-458d-a7b8-eeb7fa8ce1fc', 1, '2025-04-05 11:43:22', '2025-04-05 11:43:22'),
(56, 1, 'ac50f669-cd9c-481f-a573-a4f9452fdea7', 1, '2025-04-05 11:44:23', '2025-04-05 11:44:23'),
(57, 1, 'd8c75109-c6b5-405d-a389-cd786cbd045e', 1, '2025-04-05 11:47:18', '2025-04-05 11:47:18'),
(58, 1, '5f5aec91-4b4f-4077-b6b7-9b7a56995f97', 1, '2025-04-05 11:47:24', '2025-04-05 11:47:24'),
(59, 1, '90954c91-a47e-451e-9a87-4dfe545a3ea6', 3, '2025-04-05 11:47:28', '2025-04-05 11:49:36'),
(60, 1, 'a15f5d4a-a100-4422-bfcc-ba0dfc1dd083', 1, '2025-04-05 11:50:05', '2025-04-05 11:50:05');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_03_13_165848_add_first_last_name_to_users_table', 2),
(5, '2025_03_13_170500_remove_name_column_from_users_table', 3),
(6, '2025_03_20_010501_create_products_table', 4),
(7, '2025_03_20_023124_add_product_image_to_products_table', 5),
(9, '2025_03_22_063842_create_cart_table', 6),
(10, '2025_03_22_132130_create_reviews_table', 7),
(11, '2025_03_25_072500_create_orders_table', 8),
(12, '2025_03_25_072600_create_order_items_table', 9),
(13, '2025_03_26_085955_2025_03_26_165900_add_paid_to_orders_table', 10),
(14, '2025_03_26_173900_add_paid_to_orders_table', 11),
(15, '2025_03_26_110605_add_status_timestamps_to_orders_table', 12),
(16, '2025_03_28_131619_add_address_details_to_users', 13),
(17, '2025_03_28_143050_update_phone_number_column_in_users_table', 14),
(18, '2025_03_31_104825_add_admin_table', 15),
(19, '2025_03_31_105512_create_admin_table', 16),
(20, '2025_03_31_120105_add_role_to_users_table', 17),
(21, '2025_04_01_130845_add_stocks_and_status_column_to_products_table', 18),
(22, '2023_10_01_000000_create_product_feedback_table', 19),
(23, '2025_04_05_063958_create_productfeedback_table', 19),
(24, '2025_04_14_200416_update_order_items_table', 20),
(25, '2025_04_14_204543_update_pricing_fields', 21),
(26, '2025_04_17_195504_add_tax_exemption_to_products_table', 22),
(27, '2025_04_17_210722_add_vat_exemption_to_order_items_table', 23);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `pin_address` text DEFAULT NULL,
  `zip_code` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `region` varchar(255) NOT NULL,
  `mobile_number` varchar(255) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `delivery_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'placed',
  `payment_method` varchar(255) NOT NULL,
  `paid` enum('paid','unpaid') NOT NULL DEFAULT 'unpaid',
  `card_number_last4` varchar(255) DEFAULT NULL,
  `gcash_or_maya_account` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `first_name`, `last_name`, `address`, `pin_address`, `zip_code`, `city`, `region`, `mobile_number`, `subtotal`, `delivery_fee`, `total`, `status`, `payment_method`, `paid`, `card_number_last4`, `gcash_or_maya_account`, `created_at`, `updated_at`, `shipped_at`, `delivered_at`, `completed_at`) VALUES
(10, 1, 'hojn', 'jokm', '786 hahaha', NULL, '1291', 'qezn cit', 'Ilocos Region', '0912345678', 6795.60, 0.00, 6795.60, 'shipped', 'cod', 'unpaid', NULL, NULL, '2025-03-26 01:52:35', '2025-04-14 13:29:01', NULL, NULL, NULL),
(11, 1, 'John', 'Doeeee', '123 Main St. Barangay 123', NULL, '1000', 'Manila', 'National Capital Region (NCR)', '0912345678', 5030.60, 0.00, 5030.60, 'delivered', 'cod', 'unpaid', NULL, NULL, '2025-03-26 06:04:54', '2025-04-14 13:22:39', '2025-04-11 08:23:14', '2025-04-11 08:24:19', NULL),
(12, 1, 'John2', 'doe2', '123 unMain st barangay 234', NULL, '1000', 'Quezon city', 'Davao Region', '0912345678', 5600.60, 0.00, 5600.60, 'placed', 'cod', 'unpaid', NULL, NULL, '2025-03-28 04:18:03', '2025-04-14 13:22:39', NULL, NULL, NULL),
(13, 1, 'John Kelly', 'Guillermo', '123 Main street, barangay 1', NULL, '1000', 'Manila', 'National Capital Region (NCR)', '0912345678', 5510.00, 0.00, 5510.00, 'placed', 'cod', 'unpaid', NULL, NULL, '2025-03-28 23:10:24', '2025-04-14 13:22:39', NULL, NULL, NULL),
(14, 1, 'Johny', 'Doey', '123 Mian st. Barangay 234', NULL, '1000', 'Manila', 'Zamboanga Peninsula', '0912345678', 6105.00, 0.00, 6105.00, 'placed', 'cod', 'unpaid', NULL, NULL, '2025-03-29 01:33:02', '2025-04-14 13:22:39', NULL, NULL, NULL),
(15, 1, 'Henry', 'Sy', 'franker 123 gobg', NULL, '1212', 'Hitop', 'Cordillera Administrative Region (CAR)', '09876543210', 2300.00, 0.00, 2300.00, 'placed', 'cod', 'unpaid', NULL, NULL, '2025-03-29 01:35:20', '2025-04-14 13:22:39', NULL, NULL, NULL),
(16, 1, 'Hohjoeb', 'dasd', 'sdada', NULL, '1000', 'Manila', 'CALABARZON', '0912345678', 470.00, 0.00, 470.00, 'placed', 'cod', 'unpaid', NULL, NULL, '2025-03-30 21:18:43', '2025-04-14 13:22:39', NULL, NULL, NULL),
(17, 1, 'jk', 'Gulle', 'wadad', NULL, '1212', 'addada', 'Bicol Region', '0987654312', 380.00, 0.00, 380.00, 'placed', 'cod', 'unpaid', NULL, NULL, '2025-04-03 02:13:58', '2025-04-14 13:22:39', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` char(36) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `base_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `vat` decimal(10,2) NOT NULL DEFAULT 0.00,
  `vat_exemption` tinyint(1) NOT NULL DEFAULT 0,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) DEFAULT NULL,
  `tax` decimal(10,2) DEFAULT NULL,
  `other_tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `final_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `base_price`, `vat`, `vat_exemption`, `total`, `discount`, `tax`, `other_tax`, `final_price`, `created_at`, `updated_at`) VALUES
(113, 10, 'afe27871-c3a2-4a51-8dd7-08d3e9cb64ad', 1, 150.00, 0.00, 16.00, 0, 116.00, 150.00, 100.00, 0.00, 168.00, '2025-03-26 01:52:35', '2025-04-14 13:29:01'),
(114, 10, '8c3748fd-acff-46d9-93eb-5fce621e3a6a', 23, 129.00, 0.00, 15.60, 0, 2982.60, NULL, NULL, 0.00, 145.60, '2025-03-26 01:52:35', '2025-04-14 13:29:01'),
(115, 10, '3ffaf3af-11bd-4734-9e70-8c0c2b0e0a10', 1, 130.00, 0.00, 15.60, 0, 145.60, NULL, NULL, 0.00, 145.60, '2025-03-26 01:52:35', '2025-04-14 13:29:01'),
(116, 10, 'eafadd9a-7d98-4652-a967-a8730ae0fa48', 1, 40.00, 0.00, 4.80, 0, 44.80, NULL, NULL, 0.00, 44.80, '2025-03-26 01:52:35', '2025-04-14 13:29:01'),
(117, 10, '9093db47-a413-4681-afc9-f547bee00c5c', 1, 60.00, 0.00, 7.20, 0, 67.20, NULL, NULL, 0.00, 67.20, '2025-03-26 01:52:35', '2025-04-14 13:29:01'),
(118, 10, 'd395f635-b57c-4fd6-95db-a376b6355ad7', 5, 45.00, 0.00, 5.40, 0, 230.40, NULL, NULL, 0.00, 50.40, '2025-03-26 01:52:35', '2025-04-14 13:29:01'),
(119, 10, '8569221f-292d-488f-aa98-f648f74b165c', 1, 45.00, 0.00, 5.40, 0, 50.40, NULL, NULL, 0.00, 50.40, '2025-03-26 01:52:35', '2025-04-14 13:29:01'),
(120, 10, '25aee7ff-1619-4ec0-ab08-7f7b354e4cc7', 2, 50.00, 0.00, 6.00, 0, 106.00, NULL, NULL, 0.00, 56.00, '2025-03-26 01:52:35', '2025-04-14 13:29:01'),
(121, 10, 'c0314eb6-9ed0-4687-b45a-53792809b3f3', 5, 180.00, 0.00, 21.60, 0, 921.60, NULL, NULL, 0.00, 201.60, '2025-03-26 01:52:35', '2025-04-14 13:29:01'),
(122, 10, 'a18713f7-c626-49f3-9fd0-f12822fb4125', 4, 85.00, 0.00, 10.20, 0, 350.20, NULL, NULL, 0.00, 95.20, '2025-03-26 01:52:35', '2025-04-14 13:29:01'),
(123, 10, 'b3aea825-a8e9-4349-9729-2513c659befa', 1, 80.00, 0.00, 9.60, 0, 89.60, NULL, NULL, 0.00, 89.60, '2025-03-26 01:52:35', '2025-04-14 13:29:01'),
(124, 10, '96f10c76-46f8-42e4-adcc-2e29e82423ae', 3, 120.00, 0.00, 14.40, 0, 374.40, NULL, NULL, 0.00, 134.40, '2025-03-26 01:52:35', '2025-04-14 13:29:01'),
(125, 10, '4f641f4a-0d57-458d-a7b8-eeb7fa8ce1fc', 2, 600.00, 0.00, 72.00, 0, 1272.00, NULL, NULL, 0.00, 672.00, '2025-03-26 01:52:35', '2025-04-14 13:29:01'),
(126, 10, '049af473-bd9e-41e2-ab97-bf3542444bcd', 1, 40.00, 0.00, 4.80, 0, 44.80, NULL, NULL, 0.00, 44.80, '2025-03-26 01:52:35', '2025-04-14 13:29:01'),
(127, 11, 'afe27871-c3a2-4a51-8dd7-08d3e9cb64ad', 0, 150.00, 0.00, 18.00, 0, 18.00, NULL, NULL, 0.00, 168.00, '2025-03-26 06:04:54', '2025-04-14 13:11:17'),
(128, 11, '8c3748fd-acff-46d9-93eb-5fce621e3a6a', 10, 130.00, 0.00, 15.60, 0, 1315.60, NULL, NULL, 0.00, 145.60, '2025-03-26 06:04:54', '2025-04-14 13:11:17'),
(129, 11, '3ffaf3af-11bd-4734-9e70-8c0c2b0e0a10', 1, 130.00, 0.00, 15.60, 0, 145.60, NULL, NULL, 0.00, 145.60, '2025-03-26 06:04:54', '2025-04-14 13:11:17'),
(130, 11, 'eafadd9a-7d98-4652-a967-a8730ae0fa48', 1, 40.00, 0.00, 4.80, 0, 44.80, NULL, NULL, 0.00, 44.80, '2025-03-26 06:04:54', '2025-04-14 13:11:17'),
(131, 11, '9093db47-a413-4681-afc9-f547bee00c5c', 1, 60.00, 0.00, 7.20, 0, 67.20, NULL, NULL, 0.00, 67.20, '2025-03-26 06:04:54', '2025-04-14 13:11:17'),
(132, 11, 'd395f635-b57c-4fd6-95db-a376b6355ad7', 5, 45.00, 0.00, 5.40, 0, 230.40, NULL, NULL, 0.00, 50.40, '2025-03-26 06:04:54', '2025-04-14 13:11:17'),
(133, 11, '8569221f-292d-488f-aa98-f648f74b165c', 1, 45.00, 0.00, 5.40, 0, 50.40, NULL, NULL, 0.00, 50.40, '2025-03-26 06:04:54', '2025-04-14 13:11:17'),
(134, 11, '25aee7ff-1619-4ec0-ab08-7f7b354e4cc7', 2, 50.00, 0.00, 6.00, 0, 106.00, NULL, NULL, 0.00, 56.00, '2025-03-26 06:04:54', '2025-04-14 13:11:17'),
(135, 11, 'c0314eb6-9ed0-4687-b45a-53792809b3f3', 5, 180.00, 0.00, 21.60, 0, 921.60, NULL, NULL, 0.00, 201.60, '2025-03-26 06:04:54', '2025-04-14 13:11:17'),
(136, 11, 'a18713f7-c626-49f3-9fd0-f12822fb4125', 4, 85.00, 0.00, 10.20, 0, 350.20, NULL, NULL, 0.00, 95.20, '2025-03-26 06:04:54', '2025-04-14 13:11:17'),
(137, 11, 'b3aea825-a8e9-4349-9729-2513c659befa', 1, 80.00, 0.00, 9.60, 0, 89.60, NULL, NULL, 0.00, 89.60, '2025-03-26 06:04:54', '2025-04-14 13:11:17'),
(138, 11, '96f10c76-46f8-42e4-adcc-2e29e82423ae', 3, 120.00, 0.00, 14.40, 0, 374.40, NULL, NULL, 0.00, 134.40, '2025-03-26 06:04:54', '2025-04-14 13:11:17'),
(139, 11, '4f641f4a-0d57-458d-a7b8-eeb7fa8ce1fc', 2, 600.00, 0.00, 72.00, 0, 1272.00, NULL, NULL, 0.00, 672.00, '2025-03-26 06:04:54', '2025-04-14 13:11:17'),
(140, 11, '049af473-bd9e-41e2-ab97-bf3542444bcd', 1, 40.00, 0.00, 4.80, 0, 44.80, NULL, NULL, 0.00, 44.80, '2025-03-26 06:04:54', '2025-04-14 13:11:17'),
(141, 12, 'afe27871-c3a2-4a51-8dd7-08d3e9cb64ad', 11, 150.00, 0.00, 18.00, 0, 1668.00, NULL, NULL, 0.00, 168.00, '2025-03-28 04:18:03', '2025-04-14 13:14:11'),
(142, 12, '8c3748fd-acff-46d9-93eb-5fce621e3a6a', 1, 130.00, 0.00, 15.60, 0, 145.60, NULL, NULL, 0.00, 145.60, '2025-03-28 04:18:03', '2025-04-14 13:14:11'),
(143, 12, '3ffaf3af-11bd-4734-9e70-8c0c2b0e0a10', 1, 130.00, 0.00, 15.60, 0, 145.60, NULL, NULL, 0.00, 145.60, '2025-03-28 04:18:03', '2025-04-14 13:14:11'),
(144, 12, 'eafadd9a-7d98-4652-a967-a8730ae0fa48', 1, 40.00, 0.00, 4.80, 0, 44.80, NULL, NULL, 0.00, 44.80, '2025-03-28 04:18:03', '2025-04-14 13:14:11'),
(145, 12, '9093db47-a413-4681-afc9-f547bee00c5c', 1, 60.00, 0.00, 7.20, 0, 67.20, NULL, NULL, 0.00, 67.20, '2025-03-28 04:18:03', '2025-04-14 13:14:11'),
(146, 12, 'd395f635-b57c-4fd6-95db-a376b6355ad7', 7, 45.00, 0.00, 5.40, 0, 320.40, NULL, NULL, 0.00, 50.40, '2025-03-28 04:18:03', '2025-04-14 13:14:11'),
(147, 12, '8569221f-292d-488f-aa98-f648f74b165c', 1, 45.00, 0.00, 5.40, 0, 50.40, NULL, NULL, 0.00, 50.40, '2025-03-28 04:18:03', '2025-04-14 13:14:11'),
(148, 12, '25aee7ff-1619-4ec0-ab08-7f7b354e4cc7', 2, 50.00, 0.00, 6.00, 0, 106.00, NULL, NULL, 0.00, 56.00, '2025-03-28 04:18:03', '2025-04-14 13:14:11'),
(149, 12, 'c0314eb6-9ed0-4687-b45a-53792809b3f3', 5, 180.00, 0.00, 21.60, 0, 921.60, NULL, NULL, 0.00, 201.60, '2025-03-28 04:18:03', '2025-04-14 13:14:11'),
(150, 12, 'a18713f7-c626-49f3-9fd0-f12822fb4125', 4, 85.00, 0.00, 10.20, 0, 350.20, NULL, NULL, 0.00, 95.20, '2025-03-28 04:18:03', '2025-04-14 13:14:11'),
(151, 12, 'b3aea825-a8e9-4349-9729-2513c659befa', 1, 80.00, 0.00, 9.60, 0, 89.60, NULL, NULL, 0.00, 89.60, '2025-03-28 04:18:03', '2025-04-14 13:14:11'),
(152, 12, '96f10c76-46f8-42e4-adcc-2e29e82423ae', 3, 120.00, 0.00, 14.40, 0, 374.40, NULL, NULL, 0.00, 134.40, '2025-03-28 04:18:03', '2025-04-14 13:14:11'),
(153, 12, '4f641f4a-0d57-458d-a7b8-eeb7fa8ce1fc', 2, 600.00, 0.00, 72.00, 0, 1272.00, NULL, NULL, 0.00, 672.00, '2025-03-28 04:18:03', '2025-04-14 13:14:11'),
(154, 12, '049af473-bd9e-41e2-ab97-bf3542444bcd', 1, 40.00, 0.00, 4.80, 0, 44.80, NULL, NULL, 0.00, 44.80, '2025-03-28 04:18:03', '2025-04-14 13:14:11'),
(155, 13, 'afe27871-c3a2-4a51-8dd7-08d3e9cb64ad', 1, 150.00, 0.00, 18.00, 0, 1650.00, NULL, NULL, 0.00, 168.00, '2025-03-28 23:10:24', '2025-04-14 13:01:41'),
(156, 13, '8c3748fd-acff-46d9-93eb-5fce621e3a6a', 1, 130.00, 0.00, 15.60, 0, 130.00, NULL, NULL, 0.00, 145.60, '2025-03-28 23:10:24', '2025-04-14 13:01:41'),
(157, 13, '3ffaf3af-11bd-4734-9e70-8c0c2b0e0a10', 1, 130.00, 0.00, 15.60, 0, 130.00, NULL, NULL, 0.00, 145.60, '2025-03-28 23:10:24', '2025-04-14 13:01:41'),
(158, 13, 'eafadd9a-7d98-4652-a967-a8730ae0fa48', 1, 40.00, 0.00, 4.80, 0, 40.00, NULL, NULL, 0.00, 44.80, '2025-03-28 23:10:24', '2025-04-14 13:01:41'),
(159, 13, '9093db47-a413-4681-afc9-f547bee00c5c', 1, 60.00, 0.00, 7.20, 0, 60.00, NULL, NULL, 0.00, 67.20, '2025-03-28 23:10:24', '2025-04-14 13:01:41'),
(160, 13, 'd395f635-b57c-4fd6-95db-a376b6355ad7', 7, 45.00, 0.00, 5.40, 0, 315.00, NULL, NULL, 0.00, 50.40, '2025-03-28 23:10:24', '2025-04-14 13:01:41'),
(161, 13, '8569221f-292d-488f-aa98-f648f74b165c', 1, 45.00, 0.00, 5.40, 0, 45.00, NULL, NULL, 0.00, 50.40, '2025-03-28 23:10:24', '2025-04-14 13:01:41'),
(162, 13, '25aee7ff-1619-4ec0-ab08-7f7b354e4cc7', 2, 50.00, 0.00, 6.00, 0, 100.00, NULL, NULL, 0.00, 56.00, '2025-03-28 23:10:24', '2025-04-14 13:01:41'),
(163, 13, 'c0314eb6-9ed0-4687-b45a-53792809b3f3', 5, 180.00, 0.00, 21.60, 0, 900.00, NULL, NULL, 0.00, 201.60, '2025-03-28 23:10:24', '2025-04-14 13:01:41'),
(164, 13, 'a18713f7-c626-49f3-9fd0-f12822fb4125', 4, 85.00, 0.00, 10.20, 0, 340.00, NULL, NULL, 0.00, 95.20, '2025-03-28 23:10:24', '2025-04-14 13:01:41'),
(165, 13, 'b3aea825-a8e9-4349-9729-2513c659befa', 1, 80.00, 0.00, 9.60, 0, 80.00, NULL, NULL, 0.00, 89.60, '2025-03-28 23:10:24', '2025-04-14 13:01:41'),
(166, 13, '96f10c76-46f8-42e4-adcc-2e29e82423ae', 3, 120.00, 0.00, 14.40, 0, 360.00, NULL, NULL, 0.00, 134.40, '2025-03-28 23:10:24', '2025-04-14 13:01:41'),
(167, 13, '4f641f4a-0d57-458d-a7b8-eeb7fa8ce1fc', 2, 600.00, 0.00, 72.00, 0, 1200.00, NULL, NULL, 0.00, 672.00, '2025-03-28 23:10:24', '2025-04-14 13:01:41'),
(168, 13, '049af473-bd9e-41e2-ab97-bf3542444bcd', 1, 40.00, 0.00, 4.80, 0, 40.00, NULL, NULL, 0.00, 44.80, '2025-03-28 23:10:24', '2025-04-14 13:01:41'),
(169, 13, 'ab615361-3e23-4b14-b33b-dbaabf1df3b5', 1, 120.00, 0.00, 14.40, 0, 120.00, NULL, NULL, 0.00, 134.40, '2025-03-28 23:10:24', '2025-04-14 13:01:41'),
(170, 14, 'afe27871-c3a2-4a51-8dd7-08d3e9cb64ad', 11, 150.00, 0.00, 18.00, 0, 1650.00, NULL, NULL, 0.00, 168.00, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(171, 14, '8c3748fd-acff-46d9-93eb-5fce621e3a6a', 1, 130.00, 0.00, 15.60, 0, 130.00, NULL, NULL, 0.00, 145.60, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(172, 14, '3ffaf3af-11bd-4734-9e70-8c0c2b0e0a10', 1, 130.00, 0.00, 15.60, 0, 130.00, NULL, NULL, 0.00, 145.60, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(173, 14, 'eafadd9a-7d98-4652-a967-a8730ae0fa48', 1, 40.00, 0.00, 4.80, 0, 40.00, NULL, NULL, 0.00, 44.80, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(174, 14, '9093db47-a413-4681-afc9-f547bee00c5c', 1, 60.00, 0.00, 7.20, 0, 60.00, NULL, NULL, 0.00, 67.20, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(175, 14, 'd395f635-b57c-4fd6-95db-a376b6355ad7', 7, 45.00, 0.00, 5.40, 0, 315.00, NULL, NULL, 0.00, 50.40, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(176, 14, '8569221f-292d-488f-aa98-f648f74b165c', 1, 45.00, 0.00, 5.40, 0, 45.00, NULL, NULL, 0.00, 50.40, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(177, 14, '25aee7ff-1619-4ec0-ab08-7f7b354e4cc7', 2, 50.00, 0.00, 6.00, 0, 100.00, NULL, NULL, 0.00, 56.00, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(178, 14, 'c0314eb6-9ed0-4687-b45a-53792809b3f3', 5, 180.00, 0.00, 21.60, 0, 900.00, NULL, NULL, 0.00, 201.60, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(179, 14, 'a18713f7-c626-49f3-9fd0-f12822fb4125', 4, 85.00, 0.00, 10.20, 0, 340.00, NULL, NULL, 0.00, 95.20, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(180, 14, 'b3aea825-a8e9-4349-9729-2513c659befa', 1, 80.00, 0.00, 9.60, 0, 80.00, NULL, NULL, 0.00, 89.60, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(181, 14, '96f10c76-46f8-42e4-adcc-2e29e82423ae', 3, 120.00, 0.00, 14.40, 0, 360.00, NULL, NULL, 0.00, 134.40, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(182, 14, '4f641f4a-0d57-458d-a7b8-eeb7fa8ce1fc', 2, 600.00, 0.00, 72.00, 0, 1200.00, NULL, NULL, 0.00, 672.00, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(183, 14, '049af473-bd9e-41e2-ab97-bf3542444bcd', 1, 40.00, 0.00, 4.80, 0, 40.00, NULL, NULL, 0.00, 44.80, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(184, 14, 'ab615361-3e23-4b14-b33b-dbaabf1df3b5', 1, 120.00, 0.00, 14.40, 0, 120.00, NULL, NULL, 0.00, 134.40, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(185, 14, '241c89f1-608b-4b6a-bc24-186280dc9230', 4, 60.00, 0.00, 7.20, 0, 240.00, NULL, NULL, 0.00, 67.20, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(186, 14, 'c578e5ae-04fe-455e-9445-d86d90bfb18f', 1, 85.00, 0.00, 10.20, 0, 85.00, NULL, NULL, 0.00, 95.20, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(187, 14, '3f7925ef-5ade-41cb-8c39-0f83803a598c', 3, 90.00, 0.00, 10.80, 0, 270.00, NULL, NULL, 0.00, 100.80, '2025-03-29 01:33:02', '2025-04-14 13:01:41'),
(188, 15, '0c6e010d-6778-40b7-92c8-72e69fe96da1', 1, 110.00, 0.00, 13.20, 0, 110.00, NULL, NULL, 0.00, 123.20, '2025-03-29 01:35:20', '2025-04-14 13:01:41'),
(189, 15, '3ffaf3af-11bd-4734-9e70-8c0c2b0e0a10', 3, 130.00, 0.00, 15.60, 0, 390.00, NULL, NULL, 0.00, 145.60, '2025-03-29 01:35:20', '2025-04-14 13:01:41'),
(190, 15, '497c60f0-0414-48dd-80b1-1e5ae2508e17', 4, 90.00, 0.00, 10.80, 0, 360.00, NULL, NULL, 0.00, 100.80, '2025-03-29 01:35:20', '2025-04-14 13:01:41'),
(191, 15, 'ab615361-3e23-4b14-b33b-dbaabf1df3b5', 3, 120.00, 0.00, 14.40, 0, 360.00, NULL, NULL, 0.00, 134.40, '2025-03-29 01:35:20', '2025-04-14 13:01:41'),
(192, 15, 'e041c5d8-4405-4d39-811d-3bcc1f9114f8', 1, 500.00, 0.00, 60.00, 0, 500.00, NULL, NULL, 0.00, 560.00, '2025-03-29 01:35:20', '2025-04-14 13:01:41'),
(193, 15, '2d9e42d1-cf42-4460-93c9-16e6a448dc12', 1, 420.00, 0.00, 50.40, 0, 420.00, NULL, NULL, 0.00, 470.40, '2025-03-29 01:35:20', '2025-04-14 13:01:41'),
(194, 15, '78ab95bc-d750-4f01-9bec-ce8f1cd13a7b', 1, 160.00, 0.00, 19.20, 0, 160.00, NULL, NULL, 0.00, 179.20, '2025-03-29 01:35:20', '2025-04-14 13:01:41'),
(195, 16, 'afe27871-c3a2-4a51-8dd7-08d3e9cb64ad', 1, 150.00, 0.00, 18.00, 0, 150.00, NULL, NULL, 0.00, 168.00, '2025-03-30 21:18:43', '2025-04-14 13:01:41'),
(196, 16, 'a15f5d4a-a100-4422-bfcc-ba0dfc1dd083', 1, 70.00, 0.00, 8.40, 0, 70.00, NULL, NULL, 0.00, 78.40, '2025-03-30 21:18:43', '2025-04-14 13:01:41'),
(197, 16, '85412e34-6545-47c4-bad2-dbbd67ebf051', 1, 90.00, 0.00, 10.80, 0, 90.00, NULL, NULL, 0.00, 100.80, '2025-03-30 21:18:43', '2025-04-14 13:01:41'),
(198, 16, '0c81aa1b-82b8-4ba6-aa2f-9287a414853a', 1, 75.00, 0.00, 9.00, 0, 75.00, NULL, NULL, 0.00, 84.00, '2025-03-30 21:18:43', '2025-04-14 13:01:41'),
(199, 16, 'a18713f7-c626-49f3-9fd0-f12822fb4125', 1, 85.00, 0.00, 10.20, 0, 85.00, NULL, NULL, 0.00, 95.20, '2025-03-30 21:18:43', '2025-04-14 13:01:41'),
(200, 17, 'e4485607-1c15-402c-82b0-fbbc1c932e2d', 2, 85.00, 0.00, 10.20, 0, 170.00, NULL, NULL, 0.00, 95.20, '2025-04-03 02:13:59', '2025-04-14 13:01:41'),
(201, 17, '497c60f0-0414-48dd-80b1-1e5ae2508e17', 1, 90.00, 0.00, 10.80, 0, 90.00, NULL, NULL, 0.00, 100.80, '2025-04-03 02:13:59', '2025-04-14 13:01:41'),
(202, 17, 'b1788367-e964-40ca-b40c-2936df8359fc', 1, 120.00, 0.00, 14.40, 0, 120.00, NULL, NULL, 0.00, 134.40, '2025-04-03 02:13:59', '2025-04-14 13:01:41');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` char(36) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_description` text NOT NULL,
  `product_serving` varchar(255) DEFAULT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `vat` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax_exemption` tinyint(1) NOT NULL DEFAULT 0,
  `other_tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `final_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `category` enum('Fruits','Vegetables','Seafood','Meat','Rice & Grains','Herbs & Spices','Beverages') NOT NULL,
  `sub_category` varchar(255) DEFAULT NULL,
  `product_rating` decimal(2,1) NOT NULL DEFAULT 0.0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `product_image_1` varchar(255) DEFAULT NULL,
  `product_image_2` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `stocks` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `product_id`, `product_name`, `product_description`, `product_serving`, `product_price`, `vat`, `tax`, `tax_exemption`, `other_tax`, `final_price`, `category`, `sub_category`, `product_rating`, `created_at`, `updated_at`, `product_image`, `product_image_1`, `product_image_2`, `status`, `stocks`) VALUES
(1, 'b1788367-e964-40ca-b40c-2936df8359fc', 'Apple', 'A crisp and refreshing fruit known for its sweet and juicy taste. Packed with fiber and vitamin C, apples make for a healthy snack, an essential ingredient in pies, or a great addition to fruit salads.', '1kg', 880.00, 12.00, 0.00, 0, 0.00, 1000.00, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-17 12:42:16', 'products/XAWtkh1XBksqHSd506fs5C2wJ4Z4n6Y5MjyxeXsA.jpg', NULL, NULL, 'inactive', 0),
(2, 'b3aea825-a8e9-4349-9729-2513c659befa', 'Banana', 'A naturally sweet and creamy fruit loaded with potassium, fiber, and antioxidants. Bananas are perfect for breakfast smoothies, baking banana bread, or eating on the go as a quick energy booster.', '1kg', 105.60, 12.00, 0.00, 0, 0.00, 120.00, 'Fruits', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-17 12:41:54', 'products/dpNtjIDPNzZvLDGhhu46uS7Kqdg4qqNG320H25nD.png', NULL, NULL, 'inactive', 0),
(3, 'afe27871-c3a2-4a51-8dd7-08d3e9cb64ad', 'Mango', 'A tropical delight with a rich, juicy flavor and a soft, fibrous texture. High in vitamin A and vitamin C, mangoes are ideal for fresh consumption, smoothies, or as a topping for desserts.', '1kg', 440.00, 12.00, 0.00, 0, 0.00, 500.00, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-17 12:30:46', 'products/bp6EVrKot6Bf3wloJYsqfApq8TRPQJJRNNVyGXzk.jpg', NULL, NULL, 'inactive', 0),
(4, '0c6e010d-6778-40b7-92c8-72e69fe96da1', 'Grapes v2', 'Small, seedless, and bursting with sweetness, grapes are perfect for snacking or making fresh juice. They are rich in antioxidants and make a delicious addition to salads or cheese platters.', '500g', 110.00, 13.20, 0.00, 0, 0.00, 123.20, 'Fruits', 'Featured Products', 4.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', 'products/Iw35kUGtO6aPCEOJOzl49BwsdUT8TYCrFfpc8pHo.png', NULL, NULL, 'inactive', 0),
(5, 'bfe29b72-d0c8-41da-b359-8e4c5542fc8f', 'Pineapple', 'A vibrant tropical fruit with a tangy, sweet flavor. Pineapples are high in vitamin C and bromelain, making them great for digestion. Enjoy fresh, in juices, or as part of a savory dish.', '1 whole', 95.00, 11.40, 0.00, 0, 0.00, 106.40, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', 'products/7k6h2DVI7GHZnDo5y7sX92jFWxUZeQ4fywyYCwIw.jpg', NULL, NULL, 'inactive', 0),
(6, 'd395f635-b57c-4fd6-95db-a376b6355ad7', 'Carrot', 'Crunchy and naturally sweet, carrots are rich in beta-carotene, fiber, and antioxidants. They can be eaten raw, roasted, blended into soups, or added to stir-fry dishes for extra nutrition.', '500g', 45.00, 5.40, 0.00, 0, 0.00, 50.40, 'Vegetables', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', 'products/IpHb3Kv02LGyrTgxcGYrEuQQX7PYmbtADpmp7y5k.jpg', NULL, NULL, 'inactive', 0),
(7, '990bdbb9-4643-4965-ae3f-37654e564e41', 'Broccoli', 'A nutrient-dense vegetable packed with vitamins C and K, fiber, and antioxidants. Broccoli can be steamed, roasted, or added to stir-fries and casseroles for a delicious and healthy meal.', '500g', 70.00, 8.40, 0.00, 0, 0.00, 78.40, 'Vegetables', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-15 11:28:29', 'products/ztHlyMdHLeNU6GprS4XIGIZRWxFjsC2APQ6cSnb6.jpg', NULL, NULL, 'inactive', 0),
(8, 'b3ebc4e2-4646-48f7-9aee-0a2f46ce024e', 'Spinach', 'Dark leafy greens known for their high iron and calcium content. Spinach is great for salads, omelets, pasta, and smoothies, offering a powerful dose of nutrients and antioxidants.', '300g', 60.00, 7.20, 0.00, 0, 0.00, 67.20, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-17 12:43:06', 'products/Fg3OdeRc1j8Qcn9dXAWtMhbj41py5IFeMfYhxdce.png', NULL, NULL, 'inactive', 0),
(9, '17d62263-19f2-404b-a1a9-75bc973a39d3', 'Lettuce', 'A fresh and crisp leafy vegetable that is the foundation of any great salad. It has a mild flavor and is often used in sandwiches, wraps, and burgers for added crunch and nutrition.', '1 head', 50.00, 6.00, 0.00, 0, 0.00, 56.00, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', 'products/dQGdVXFnKAhCtpqfVSRBNj5fpqrZD2Dp0LUXjtmK.jpg', NULL, NULL, 'active', 80),
(10, 'a18713f7-c626-49f3-9fd0-f12822fb4125', 'Tomato', 'Juicy and bursting with flavor, tomatoes are rich in lycopene, vitamin C, and potassium. They can be used in sauces, salads, sandwiches, and countless cooked dishes.', '1kg', 85.00, 10.20, 0.00, 0, 0.00, 95.20, 'Vegetables', 'Featured Products', 4.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', 'products/M89WpM4EregGwYHIcdk6kcDpYV64dDihQlEbgihm.jpg', NULL, NULL, 'active', 42),
(11, '180cf37a-865c-4664-b6bf-6f1eb2f4d8dc', 'Salmon', 'A premium seafood choice known for its rich, buttery taste and high omega-3 content. Salmon can be grilled, baked, or pan-seared to perfection, making it a versatile and healthy protein source.', '200g', 350.00, 42.00, 0.00, 0, 0.00, 392.00, 'Seafood', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', 'products/bzCCc8A59QGJBFi3yHhpUoP6TXrx1FlinxaIe1u0.jpg', NULL, NULL, 'active', 47),
(12, '7799628a-018f-4fd0-9671-5fbe965afa50', 'Shrimp', 'Juicy and tender seafood, loved for its delicate flavor. Shrimp can be used in pasta, stir-fries, and seafood platters, providing a great source of lean protein and essential minerals.', '500g', 280.00, 33.60, 0.00, 0, 0.00, 313.60, 'Seafood', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', 'products/jqYlNB7fGxSx2FDVKtv9uoBoJpWL7EDkzK64Dyyg.jpg', NULL, NULL, 'active', 63),
(13, '5488a7c2-9db6-4a55-a550-4382efe05f0f', 'Tuna', 'A firm, meaty fish with a mild, slightly sweet flavor. Tuna is perfect for grilling, sushi, salads, or sandwiches and is an excellent source of protein and omega-3 fatty acids.', '250g', 320.00, 38.40, 0.00, 0, 0.00, 358.40, 'Seafood', 'Featured Products', 4.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', NULL, NULL, NULL, 'active', 26),
(14, 'bdd9eeb8-1596-4772-8318-fd64492979d9', 'Lobsterr', 'A luxurious seafood delicacy with a sweet and tender texture. Best enjoyed steamed or grilled, lobster is rich in protein, vitamins, and minerals that promote overall health.', '1 whole', 950.00, 114.00, 0.00, 0, 0.00, 1064.00, 'Seafood', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', 'products/jvgfU9VbV9A4hVllZN0JpuZHMNTXWCrjIG21f3ED.jpg', NULL, NULL, 'active', 71),
(15, '4f641f4a-0d57-458d-a7b8-eeb7fa8ce1fc', 'Crab', 'A flavorful and meaty seafood that is commonly enjoyed boiled, steamed, or in creamy crab dishes. Crab is low in fat and high in essential nutrients like zinc and selenium.', '1kg', 600.00, 72.00, 0.00, 0, 0.00, 672.00, 'Seafood', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', 'products/GTbFq3sQKi4A77neNOzR8BUS0uQT83rEiM436dkB.jpg', NULL, NULL, 'active', 91),
(16, '788ade8a-e43e-46c3-a867-85f26bcf8985', 'Chicken Breast', 'Lean, protein-rich meat that is versatile and easy to cook. Chicken breast is ideal for grilling, baking, or pan-frying, making it a healthy and delicious choice for meals.', '500g', 160.00, 19.20, 0.00, 0, 0.00, 179.20, 'Meat', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', 'products/2AKbUv3DT37fnQtW5Fq3IJK9aqd0gdkOMDpyAxKw.jpg', NULL, NULL, 'active', 80),
(17, '2d9e42d1-cf42-4460-93c9-16e6a448dc12', 'Beef Steak', 'A tender and flavorful cut of beef, perfect for grilling, pan-searing, or roasting. High in protein and iron, steak is a classic favorite for meat lovers.', '500g', 420.00, 50.40, 0.00, 0, 0.00, 470.40, 'Meat', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', 'products/RUUvVcctv4xC0oyawl6ek9ToVbUFBth3LN8TMrZO.jpg', NULL, NULL, 'active', 77),
(18, '4111cd2a-ee04-43f6-b2fc-d7da147b0379', 'Pork Chops', 'Juicy and well-marbled meat that is perfect for grilling or pan-searing. Pork chops offer a rich, savory taste and pair well with various seasonings and marinades.', '500g', 280.00, 33.60, 0.00, 0, 0.00, 313.60, 'Meat', 'Featured Products', 4.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', 'products/UoZs7kLOy4Msmw1RW8ugmhlv8N7gMS4ZJVPK6fiI.jpg', NULL, NULL, 'active', 17),
(19, 'e041c5d8-4405-4d39-811d-3bcc1f9114f8', 'Lamb', 'A premium cut of meat known for its rich, earthy flavor. Lamb is best roasted, grilled, or braised, providing essential nutrients like iron, zinc, and B vitamins.', '500g', 500.00, 60.00, 0.00, 0, 0.00, 560.00, 'Meat', 'Featured Products', 4.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', 'products/IaRFvzfALFhonXo7bdr5gK5kBxcMfBpg7jwQ7w3m.jpg', NULL, NULL, 'active', 13),
(20, 'ab615361-3e23-4b14-b33b-dbaabf1df3b5', 'Sausage', 'Savory and juicy, sausages are packed with spices and herbs. Great for breakfast, grilling, or stews, they offer a rich and delicious flavor in every bite.', '300g', 120.00, 14.40, 0.00, 0, 0.00, 134.40, 'Meat', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', 'products/eDHE4AvdTfMjLPZ7UhPNBQpsoQTOzRpy93mHgpwG.jpg', NULL, NULL, 'active', 4),
(21, '718946b5-8724-48d5-b3b9-34714bc0e279', 'White Rice', 'Soft, fluffy grains that serve as a staple food in many cultures. White rice pairs perfectly with curries, stews, and stir-fries for a satisfying meal.', '1kg', 70.00, 8.40, 0.00, 0, 0.00, 78.40, 'Rice & Grains', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', NULL, NULL, NULL, 'active', 46),
(22, 'aad10c07-ccc1-4495-bbf5-d064d181d12d', 'Brown Rice', 'A fiber-rich alternative to white rice, brown rice has a nutty flavor and chewy texture. It is highly nutritious and pairs well with lean proteins and vegetables.', '1kg', 90.00, 10.80, 0.00, 0, 0.00, 100.80, 'Rice & Grains', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', 'products/bXAFHwsu9NeKijTmwMiZweTYPLw72ZQCOKX5yP1e.jpg', NULL, NULL, 'active', 82),
(23, '3c0322cf-4929-4e79-ae60-6bfc54b36cab', 'Quinoa', 'A protein-packed superfood that is naturally gluten-free. Quinoa has a mild, nutty flavor and is a great addition to salads, bowls, and stir-fries.', '500g', 150.00, 18.00, 0.00, 0, 0.00, 168.00, 'Rice & Grains', 'Featured Products', 4.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', 'products/SRQpfegvcbe9snJZ75o8Dk7nZsYem69gdWDcZwDJ.png', NULL, NULL, 'active', 99),
(24, 'c9c0294f-b7cb-4036-8e37-d47994edde06', 'Barley', 'A hearty and nutritious grain, often used in soups, stews, and grain salads. Barley has a chewy texture and a rich, nutty taste.', '1kg', 110.00, 13.20, 0.00, 0, 0.00, 123.20, 'Rice & Grains', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-14 13:01:41', 'products/0E0Tc1yGVeUYZ8jnPVnPjK3s5C6QO0PPs8c1ETjg.jpg', NULL, NULL, 'active', 67),
(25, 'f669b1ee-35cf-4850-a872-ac0e99b17018', 'Oats', 'A classic breakfast staple that is high in fiber and heart-healthy nutrients. Oats can be enjoyed as oatmeal, granola, or added to baked goods.', '1kg', 120.00, 14.40, 0.00, 0, 0.00, 134.40, 'Rice & Grains', 'Featured Products', 4.0, '2025-03-19 17:27:31', '2025-04-14 13:01:41', 'products/DTtXQY2k1OOAl1jEmtjQ46gFRgl6AIJFwx1DUAEA.jpg', NULL, NULL, 'active', 40),
(26, 'eafadd9a-7d98-4652-a967-a8730ae0fa48', 'Basil', 'A fragrant herb commonly used in Italian dishes, salads, and pestos. Basil has a slightly sweet and peppery flavor, enhancing the taste of various meals.', '50g', 40.00, 4.80, 0.00, 0, 0.00, 44.80, 'Herbs & Spices', 'Featured Products', 4.0, '2025-03-19 17:27:31', '2025-04-14 13:01:41', 'products/Idn6UHc6TEFRYJEiGOkenLIjIG06XOLAwxI9LJsz.jpg', NULL, NULL, 'active', 94),
(27, '544e63f0-d184-4b72-993c-4305c99a3462', 'Thyme', 'An aromatic herb with a slightly minty, earthy flavor. Thyme is perfect for roasting meats, making soups, and seasoning stews.', '50g', 45.00, 5.40, 0.00, 0, 0.00, 50.40, 'Herbs & Spices', 'Featured Products', 3.0, '2025-03-19 17:27:31', '2025-04-14 13:01:41', 'products/eq5q8QwLLJTmy987d0kfOZczALKaOvDrkb28fM91.jpg', NULL, NULL, 'active', 37),
(28, '77426a6a-2024-4daf-b409-0ec1122d7ed7', 'Cinnamon', 'A warm, sweet spice often used in baking, desserts, and hot drinks. Cinnamon has a comforting aroma and is known for its anti-inflammatory properties.', '50g', 60.00, 7.20, 0.00, 0, 0.00, 67.20, 'Herbs & Spices', 'Featured Products', 3.0, '2025-03-19 17:27:31', '2025-04-14 13:01:41', 'products/50psR7csGCCwp8bFwT4jdwd8vnPnl2fbdkC2t6Qa.jpg', NULL, NULL, 'active', 32),
(29, '8e7bddde-84f3-4a1b-9e9b-749dcdae6936', 'Turmeric', 'A golden-yellow spice with a mild, earthy flavor. Turmeric is used in curries, teas, and wellness drinks due to its powerful health benefits.', '50g', 55.00, 6.60, 0.00, 0, 0.00, 61.60, 'Herbs & Spices', 'Featured Products', 5.0, '2025-03-19 17:27:31', '2025-04-15 11:29:07', NULL, NULL, NULL, 'inactive', 0),
(30, 'a15f5d4a-a100-4422-bfcc-ba0dfc1dd083', 'Ginger', 'A spicy and aromatic root commonly used in teas, stir-fries, and baked goods. Ginger has anti-inflammatory properties and adds a warming flavor to dishes.', '100g', 100.00, 8.40, 0.00, 0, 0.00, 78.40, 'Herbs & Spices', 'Featured Products', 3.0, '2025-03-19 17:27:31', '2025-04-15 11:28:45', 'products/AUfnDQRppNdQxYX0WjkLbTaCtFkZa6xMtnEYfkBZ.jpg', NULL, NULL, 'inactive', 0),
(31, '96f10c76-46f8-42e4-adcc-2e29e82423ae', 'Apple', 'A crisp and refreshing fruit, packed with fiber and vitamin C.', '1kg', 120.00, 14.40, 0.00, 0, 0.00, 134.40, 'Fruits', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/jXkxncslxmn97DgaewPvE1p2u84LtT4F75MsS44l.jpg', NULL, NULL, 'active', 58),
(32, 'd8c75109-c6b5-405d-a389-cd786cbd045e', 'Banana', 'A naturally sweet fruit loaded with potassium, great for snacks.', '1kg', 80.00, 9.60, 0.00, 0, 0.00, 89.60, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/THFGG6sHr7hR1i1vjoHe7jALdvbp0ZVkfU48p8Q6.jpg', NULL, NULL, 'active', 60),
(33, '8aae6e6e-546d-4786-afe1-5f058e717b94', 'Mango', 'A tropical delight with a juicy, rich flavor.', '1kg', 150.00, 18.00, 0.00, 0, 0.00, 168.00, 'Fruits', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/hMeGgsroC8o5pdkG69icDRcE1NxxGZ59vU2eS8Y9.jpg', NULL, NULL, 'active', 27),
(34, '175cf315-6ff7-4bff-8012-a85f8330aa1f', 'Grapes', 'Sweet, seedless grapes perfect for snacking.', '500g', 110.00, 13.20, 0.00, 0, 0.00, 123.20, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/sLKFgvcMM0vfAWDm15RVXKonfwq4XAQWOuzaHVCm.jpg', NULL, NULL, 'active', 12),
(35, '11051210-0271-42a6-a1f7-463fc83b0fe8', 'Pineapple', 'A vibrant fruit with a tangy-sweet taste.', '1 whole', 95.00, 11.40, 0.00, 0, 0.00, 106.40, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/nbvkVU2AQOjRg6ftk4chWGL157utNX5ITpjGEvUy.png', NULL, NULL, 'active', 32),
(36, 'c0314eb6-9ed0-4687-b45a-53792809b3f3', 'Strawberry', 'Juicy and bright red, rich in antioxidants.', '250g', 180.00, 21.60, 0.00, 0, 0.00, 201.60, 'Fruits', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/OJczpIjw08XowA5cNvTZtIfPFnjvqRr3itKUIPNZ.jpg', NULL, NULL, 'active', 51),
(37, 'da7c1686-7e3a-45da-9823-90b0059a182c', 'Papaya', 'A tropical fruit with enzymes that aid digestion.', '1kg', 130.00, 15.60, 0.00, 0, 0.00, 145.60, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/TwJtXBGXKJhwM5FaCzmf0DXMQ3vP61JZoG4pgE4K.jpg', NULL, NULL, 'active', 84),
(38, '36b1300e-85f5-4b55-ab29-5dcf3dbb325d', 'Blueberry', 'Tiny, nutrient-packed berries for snacking.', '250g', 220.00, 26.40, 0.00, 0, 0.00, 246.40, 'Fruits', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/CfnK9rk2GOZtc6Y1m7487Ffj4vnLhJhH4ZRBaRlk.jpg', NULL, NULL, 'active', 21),
(39, '840e1025-33ae-4f35-9ba7-14e6c5e58394', 'Watermelon', 'Refreshing and hydrating with a juicy bite.', '1 whole', 160.00, 19.20, 0.00, 0, 0.00, 179.20, 'Fruits', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', NULL, NULL, NULL, 'active', 79),
(40, 'be2d3b59-5a4b-41c3-88f4-27d1ed931f31', 'Peach', 'A soft, sweet fruit with a fuzzy skin.', '500g', 140.00, 16.80, 0.00, 0, 0.00, 156.80, 'Fruits', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/eVyMMD3IfWHNAaDAsa9ynzNJ08bE77yeRv1Dl2kg.jpg', NULL, NULL, 'active', 40),
(41, '78ab95bc-d750-4f01-9bec-ce8f1cd13a7b', 'Kiwi', 'Tangy and packed with vitamin C.', '500g', 160.00, 19.20, 0.00, 0, 0.00, 179.20, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/Ld8p1KPxOsa7wbnwNNUTWNA4rpNrj2xkJYtiaILW.jpg', NULL, NULL, 'active', 45),
(42, 'b4517489-8fed-4119-982e-a7b0f04c6294', 'Pomegranate', 'A powerhouse of antioxidants with juicy seeds.', '500g', 190.00, 22.80, 0.00, 0, 0.00, 212.80, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/gGh0yulQwlCAfNVLjPeQBYobCPCBRZ5Rni8MmDxm.jpg', NULL, NULL, 'active', 40),
(43, '129bfea9-b6a9-497e-b0a5-119a6efb9657', 'Dragon Fruit', 'Exotic fruit with a mildly sweet taste.', '1 whole', 210.00, 25.20, 0.00, 0, 0.00, 235.20, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/xGyQSsBpk4deTIsqbnSPybfew72YBFDvRmpPJtMJ.jpg', NULL, NULL, 'active', 84),
(44, '90954c91-a47e-451e-9a87-4dfe545a3ea6', 'Cantaloupe', 'Sweet and fragrant, perfect for summer.', '1 whole', 150.00, 18.00, 0.00, 0, 0.00, 168.00, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/CHAfsK1U2EJrciG1y6aSF9DrEf147XyQdiJpWaxR.png', NULL, NULL, 'active', 13),
(45, '5c3c49df-c5fc-42d9-93b6-6c95832e9b26', 'Plum', 'Juicy and rich in flavor, high in vitamins.', '500g', 130.00, 15.60, 0.00, 0, 0.00, 145.60, 'Fruits', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/7Sd7ozPxlSWP0aTh17Inp4SiVAkfZ2Uuwf0XyBo6.png', NULL, NULL, 'active', 58),
(46, '36172c93-dde5-485c-93ce-ba059aac0ca7', 'Carrot', 'Crunchy and naturally sweet, great for vision.', '500g', 45.00, 5.40, 0.00, 0, 0.00, 50.40, 'Vegetables', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/d2NcpLJAV1jliZqrXFDpQT3UA1V9UugSr5KOgXxM.jpg', NULL, NULL, 'active', 73),
(47, '5f5aec91-4b4f-4077-b6b7-9b7a56995f97', 'Broccoli', 'A nutrient powerhouse rich in fiber and vitamins.', '500g', 70.00, 8.40, 0.00, 0, 0.00, 78.40, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/MIxW8YB0znRbinH54qvQqNjGRd54mAI6zOuN7gqv.png', NULL, NULL, 'active', 71),
(48, 'fdf612c0-0da4-4177-854b-51f69d1ca52b', 'Spinach', 'Iron-rich leafy greens great for salads.', '300g', 60.00, 7.20, 0.00, 0, 0.00, 67.20, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/XqL5WzJlczC1GlCUQg3kPJb0mbekLuVqG9ZjLo3t.jpg', NULL, NULL, 'active', 52),
(49, '44f7e2c9-7a7f-4e68-90c8-d615d0c0faa0', 'Lettuce', 'Crisp and refreshing, perfect for salads.', '1 head', 50.00, 6.00, 0.00, 0, 0.00, 56.00, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/1jP3xJq4udfBPgmFBZMW9eKONJDsKhZq7Z9TImsb.jpg', NULL, NULL, 'active', 72),
(50, 'ab8fd30f-50c0-45d9-bddc-01434ee28763', 'Tomato', 'Juicy and versatile, great for sauces.', '1kg', 85.00, 10.20, 0.00, 0, 0.00, 95.20, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', NULL, NULL, NULL, 'active', 87),
(51, '7805edfc-8a91-4f64-a16e-0e7b86e7d9cf', 'Cucumber', 'Hydrating and crunchy, great for salads.', '500g', 40.00, 4.80, 0.00, 0, 0.00, 44.80, 'Vegetables', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/dnXsYGWUr9fyo2uN8WqqoOgjivQr2GIqTtRiHzyc.png', NULL, NULL, 'active', 92),
(52, '9157cf98-fb25-4f51-bc99-cb4ce70a4ce8', 'Bell Pepper', 'Colorful and sweet, rich in vitamin C.', '500g', 90.00, 10.80, 0.00, 0, 0.00, 100.80, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-15 11:20:39', 'products/x1ltmsoJLtV9LXM9msoppm8vfqOwcbgN9IqGWoYu.jpg', NULL, NULL, 'active', 34),
(53, 'df946766-3356-4f18-8af0-2eb67a347293', 'Onion', 'A staple in cooking, adds flavor to dishes.', '1kg', 60.00, 7.20, 0.00, 0, 0.00, 67.20, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/A8N98WkosjnLxaQ7wEjYB0ZOcyCWONcPawH9cVSh.jpg', NULL, NULL, 'active', 75),
(54, 'e677156c-b261-4188-990e-cbd5c75c2e68', 'Garlic', 'Aromatic and medicinal, enhances any meal.', '250g', 75.00, 9.00, 0.00, 0, 0.00, 84.00, 'Vegetables', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/jspPobSxie8sZTWx3y27AmXVDyveyJwixrUZlHQq.jpg', NULL, NULL, 'active', 24),
(55, 'e4485607-1c15-402c-82b0-fbbc1c932e2d', 'Zucchini', 'Mild and versatile, used in various dishes.', '500g', 85.00, 10.20, 0.00, 0, 0.00, 95.20, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', NULL, NULL, NULL, 'active', 78),
(56, '25038377-4f61-4c59-a93f-7f0e618cc3a8', 'Eggplant', 'Soft and slightly bitter, great for grilling.', '500g', 95.00, 11.40, 0.00, 0, 0.00, 106.40, 'Vegetables', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/OndivdKXXStFiLbcEUc2gTSv94h6ykr7Zac6Qphu.jpg', NULL, NULL, 'active', 40),
(57, 'c68f6952-ea5d-4e1a-943e-28e212e573c4', 'Cabbage', 'Crunchy and fibrous, great for slaws.', '1 whole', 75.00, 9.00, 0.00, 0, 0.00, 84.00, 'Vegetables', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/yUD2spckZjgKyxwchswIoGgH5FkurjphR4crIDhN.jpg', NULL, NULL, 'active', 22),
(58, '2d9d99da-38bb-455e-a824-53dcdcc0c254', 'Pumpkin', 'Sweet and hearty, used in soups and pies.', '1kg', 105.00, 12.60, 0.00, 0, 0.00, 117.60, 'Vegetables', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/Yk0bJnDPnCoeTtQNsgNWdPrwc3kdxwgHxcXYDMwE.jpg', NULL, NULL, 'active', 31),
(59, '0fdd348a-412f-4cc4-a326-dd1ea4dfc2ee', 'Radish', 'Peppery and crisp, great for salads.', '500g', 60.00, 7.20, 0.00, 0, 0.00, 67.20, 'Vegetables', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/px7hny3xMOrGNkkRz44z6Clk4vQrb7fywaQpzkCk.jpg', NULL, NULL, 'active', 0),
(60, '019c3339-2ceb-46d6-b1c6-b3f351a9419f', 'Green Beans', 'Crunchy and fiber-rich, great as a side dish.', '500g', 80.00, 9.60, 0.00, 0, 0.00, 89.60, 'Vegetables', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/41UP3lgS61hHzPv6RE1xp0l3BnGyBMYFCB6FB2cc.jpg', NULL, NULL, 'active', 78),
(61, 'fbc5a48d-b3ca-4428-bbc9-bfa119268c86', 'White Rice', 'Staple food, fluffy when cooked.', '1kg', 70.00, 8.40, 0.00, 0, 0.00, 78.40, 'Rice & Grains', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', NULL, NULL, NULL, 'active', 80),
(62, '85412e34-6545-47c4-bad2-dbbd67ebf051', 'Brown Rice', 'Nutritious whole-grain alternative.', '1kg', 90.00, 10.80, 0.00, 0, 0.00, 100.80, 'Rice & Grains', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/mRmwezUsMlk8TYeFxLxicU4YjhB13VMTIBo7quha.jpg', NULL, NULL, 'active', 75),
(63, '84d9ead6-bfff-47e3-a0d0-b37ac4560dce', 'Quinoa', 'Protein-rich and gluten-free.', '500g', 140.00, 16.80, 0.00, 0, 0.00, 156.80, 'Rice & Grains', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/GIj8lhLqPDU2uGhqOAq6KRWsZ1dtpgTegvhTFbsk.png', NULL, NULL, 'active', 68),
(64, 'a13d3dd9-20fb-45d3-8460-0953930f4339', 'Oats', 'Great for breakfast and baking.', '500g', 95.00, 11.40, 0.00, 0, 0.00, 106.40, 'Rice & Grains', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/vIkuwxDlisYEWhXifUZ5plNalhUMf5YZznJgHqKw.jpg', NULL, NULL, 'active', 88),
(65, 'ac50f669-cd9c-481f-a573-a4f9452fdea7', 'Barley', 'Nutty grain rich in fiber.', '500g', 80.00, 9.60, 0.00, 0, 0.00, 89.60, 'Rice & Grains', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/HCGAgvmUHdv2PxPJG1mFDqTBx2U4hJgkuFzSCWnE.jpg', NULL, NULL, 'active', 8),
(66, '0c81aa1b-82b8-4ba6-aa2f-9287a414853a', 'Cornmeal', 'Fine ground corn, used for bread and porridge.', '500g', 75.00, 9.00, 0.00, 0, 0.00, 84.00, 'Rice & Grains', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/LqM2IRmVM3DNQwq4mzwhtzBaYCgPZ6OgXbpE3Ukk.jpg', NULL, NULL, 'active', 45),
(67, '8838eacb-61d6-4de0-b403-e41f0050b16e', 'Couscous', 'Tiny pasta-like grain, quick to cook.', '500g', 85.00, 10.20, 0.00, 0, 0.00, 95.20, 'Rice & Grains', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/2voIRwclchCLC6YKUD92eufaMi5OFx7VogsRyFm7.jpg', NULL, NULL, 'active', 78),
(68, '3ffaf3af-11bd-4734-9e70-8c0c2b0e0a10', 'Black Rice', 'Highly nutritious, deep purple in color.', '1kg', 130.00, 15.60, 0.00, 0, 0.00, 145.60, 'Rice & Grains', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/A640JBf6UGdF4ZmupzYhHtyxkbSJQVH65Ks130u9.jpg', NULL, NULL, 'active', 8),
(69, '1a850c35-63cd-4ce7-b950-e5fe44cfcad1', 'Wild Rice', 'Chewy and nutty, great for salads.', '500g', 150.00, 18.00, 0.00, 0, 0.00, 168.00, 'Rice & Grains', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', NULL, NULL, NULL, 'active', 23),
(70, '9093db47-a413-4681-afc9-f547bee00c5c', 'Millet', 'Small grain rich in protein.', '500g', 60.00, 7.20, 0.00, 0, 0.00, 67.20, 'Rice & Grains', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/ZZlgwtHa4mFLXT541AR1rsxnJPij0SYjjxzKSEoa.jpg', NULL, NULL, 'active', 56),
(72, '24e3f1ce-bf5b-4c48-abc2-44279f1ce74d', 'Oregano', 'Used in Italian and Mediterranean dishes.', '50g', 35.00, 4.20, 0.00, 0, 0.00, 39.20, 'Herbs & Spices', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/nOkc2JBK6R3H7qxuMDsA3q9TEsEyLT7O7IP3wajU.jpg', NULL, NULL, 'active', 69),
(74, '8569221f-292d-488f-aa98-f648f74b165c', 'Paprika', 'Mildly spicy, adds rich color to food.', '50g', 45.00, 5.40, 0.00, 0, 0.00, 50.40, 'Herbs & Spices', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/Q0fjZ9n0zMhxfhxp0PBA8BdaNl8wsxemF7nWTIFX.jpg', NULL, NULL, 'active', 13),
(75, '241c89f1-608b-4b6a-bc24-186280dc9230', 'Ginger', 'Spicy and medicinal root.', '100g', 60.00, 7.20, 0.00, 0, 0.00, 67.20, 'Herbs & Spices', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/LmcwWfVB24J70zbVCT2wBL7kdQzFO0PXu8LMtPVJ.jpg', NULL, NULL, 'active', 74),
(76, '25aee7ff-1619-4ec0-ab08-7f7b354e4cc7', 'Garlic Powder', 'Used to enhance flavors in cooking.', '50g', 50.00, 6.00, 0.00, 0, 0.00, 56.00, 'Herbs & Spices', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', NULL, NULL, NULL, 'active', 79),
(77, 'ce3c8412-9cfa-49d8-a763-c5308330ca8b', 'Rosemary', 'Pine-like flavor, great for meats.', '50g', 40.00, 4.80, 0.00, 0, 0.00, 44.80, 'Herbs & Spices', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/aCaoVBhgj1HAT7t5aGYCZlVckN95UztjzWmlmCfq.jpg', NULL, NULL, 'active', 32),
(78, '43c473fd-9408-47f9-bc84-342f0a807e31', 'Turmeric', 'Bright yellow, known for anti-inflammatory benefits.', '50g', 55.00, 6.60, 0.00, 0, 0.00, 61.60, 'Herbs & Spices', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', NULL, NULL, NULL, 'active', 92),
(79, '78a70422-f46f-4f6b-b3e4-bf7a432f764b', 'Cumin', 'Earthy and warm spice, great for curries.', '50g', 45.00, 5.40, 0.00, 0, 0.00, 50.40, 'Herbs & Spices', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/FkvqZ09XlMmuN6pvgxLbk53sqqyHmPF60qKp6tes.jpg', NULL, NULL, 'active', 16),
(80, '61a6a831-1de1-47ce-8ca8-b2749c51b488', 'Bay Leaves', 'Aromatic leaves used in soups.', '25g', 30.00, 3.60, 0.00, 0, 0.00, 33.60, 'Herbs & Spices', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/dGd0OWdnEKOqQ0OSQDLr6LbMDGrDyfmdWW83ks3f.jpg', NULL, NULL, 'active', 16),
(81, 'f52937a9-f4c4-4ce4-8e0d-32d5981663c3', 'Orange Juice', 'Freshly squeezed citrus goodness.', '1L', 120.00, 14.40, 0.00, 0, 0.00, 134.40, 'Beverages', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/Q4I5g7tHPudGs7dGzjLJS09h5dChE21i20X0xqQM.jpg', NULL, NULL, 'active', 55),
(82, 'cba148ca-9e72-43be-8d46-273a0f6cc6df', 'Green Tea', 'Healthy and refreshing, packed with antioxidants.', '250ml', 80.00, 9.60, 0.00, 0, 0.00, 89.60, 'Beverages', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/DMxwCRh5bEWwYuG82kRsFF3HQqX8i09EcGeqB1II.jpg', NULL, NULL, 'active', 23),
(83, '3f7925ef-5ade-41cb-8c39-0f83803a598c', 'Black Coffee', 'Strong and aromatic, a morning essential.', '250ml', 90.00, 10.80, 0.00, 0, 0.00, 100.80, 'Beverages', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/Iy8Oz30OPZ3qNCZGCKZteWQtBxlfGJVJOR6D21Sq.jpg', NULL, NULL, 'inactive', 0),
(84, '1c5c3ec8-cd38-4bd5-9afc-5dd163c29baa', 'Milk', 'Dairy staple, rich in calcium.', '1L', 100.00, 12.00, 0.00, 0, 0.00, 112.00, 'Beverages', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/reUKkmovxKgxyBF3evSTxJNhqzTRU2Fh2UksG3Sp.jpg', NULL, NULL, 'active', 27),
(85, '8c3748fd-acff-46d9-93eb-5fce621e3a6a', 'Almond Milk', 'Nut-based alternative, lactose-free.', '1L', 130.00, 15.60, 0.00, 0, 0.00, 145.60, 'Beverages', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/VJUrvgdWhxBU43M4VERMC4VMyFJOoGCVFVznnyyz.jpg', NULL, NULL, 'active', 31),
(86, '497c60f0-0414-48dd-80b1-1e5ae2508e17', 'Coconut Water', 'Hydrating and rich in electrolytes.', '500ml', 90.00, 10.80, 0.00, 0, 0.00, 100.80, 'Beverages', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/c74dwbemjS3RqO4w20efHuOduJDOBFz7srD6MBbT.jpg', NULL, NULL, 'active', 19),
(87, 'c578e5ae-04fe-455e-9445-d86d90bfb18f', 'Lemonade', 'Sweet and tangy, perfect for summer.', '500ml', 85.00, 10.20, 0.00, 0, 0.00, 95.20, 'Beverages', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/QhInBSoX4HpAhfMwvm6AJNJkuX1z4wF4ZK7ZyThY.jpg', NULL, NULL, 'active', 49),
(88, '69cf8e49-2aa6-47fe-ba75-ad79bcddc316', 'Energy Drink', 'Boosts energy with caffeine and vitamins.', '250ml', 110.00, 13.20, 0.00, 0, 0.00, 123.20, 'Beverages', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/SKQA911Ed3LJ2u5ptJiZyzka9y0eeT4Ob7IX5xJa.jpg', NULL, NULL, 'active', 51),
(89, '6b9752bb-4642-47d0-ba3f-853f78505ad4', 'Protein Shake', 'Nutrient-packed drink for muscle recovery.', '500ml', 150.00, 18.00, 0.00, 0, 0.00, 168.00, 'Beverages', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/37PNQihGA9tnxEMvyLtlQCIaSyWacvtOH9Dpuuxl.png', NULL, NULL, 'active', 3),
(90, 'c85d518a-3606-480a-be5c-1aee2421a754', 'Iced Tea', 'Refreshing blend of tea and lemon.', '500ml', 95.00, 11.40, 0.00, 0, 0.00, 106.40, 'Beverages', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-14 13:01:41', 'products/PZXFfrApVMetPdNRorymf6TujKKrPzgSLvIxeyT7.jpg', NULL, NULL, 'active', 96),
(91, 'bad98763-8e41-4cbe-a0d5-18dcca3ebc46', 'I love you', 'love you too', '1kg', 28.00, 3.36, 0.00, 0, 0.00, 31.36, 'Seafood', NULL, 0.0, '2025-04-02 16:59:21', '2025-04-14 13:01:41', NULL, NULL, NULL, 'inactive', 0),
(92, '9ba2c185-0b5b-42fd-82b0-b306af33c9f4', 'Bag', 'Bag na malupet', '12oz', 232.00, 27.84, 0.00, 0, 0.00, 259.84, 'Fruits', NULL, 0.0, '2025-04-02 17:10:56', '2025-04-14 13:01:41', 'products/67ede02064b7b.png', NULL, NULL, 'active', 12),
(93, '88566966-4102-41a8-a74c-cc5f9d25a7dc', 'hahahha', 'ajajja', 's22', 12.00, 1.44, 0.00, 0, 0.00, 13.44, 'Fruits', NULL, 0.0, '2025-04-02 19:39:08', '2025-04-15 11:30:01', 'products/al4pEwoZVc6NZcYTKxzzU1YlXUWY20UsubX8gTWn.png', NULL, NULL, 'inactive', 0),
(104, '99226391-26ad-4509-bc6f-9ee457ef9fb4', 'sample product 2', 'sample description 2', '1kg', 90.00, 10.80, 0.00, 0, 0.00, 100.80, 'Seafood', NULL, 0.0, '2025-04-03 13:44:02', '2025-04-14 13:01:41', 'products/hzJJwjibMQt3aWtcJZykGFguQzjeOXAI4UGZhzJk.jpg', NULL, NULL, 'active', 12),
(105, '6492bf39-e9d6-4bf5-8404-13a198e39cd4', 'facecard', 'sarap kahit walang sauce', '1kg', 104.46, 12.00, 0.00, 0, 0.00, 117.00, 'Vegetables', NULL, 0.0, '2025-04-15 10:28:20', '2025-04-15 10:28:20', 'products/p5AcV50Tyhzdo4uyAvUBEdKSGeeMcFFIZXhgCsIs.jpg', NULL, NULL, 'active', 12),
(106, '52f356a9-dc37-44f0-80da-fffa7d290b87', 'heartbeat', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '1kg', 107.14, 0.00, 0.00, 0, 0.00, 107.14, 'Seafood', NULL, 0.0, '2025-04-15 10:31:29', '2025-04-15 10:31:29', 'products/DD8wksdsHCqYZeyBpsai6GYSKWqwNOtZFABPpOOn.jpg', NULL, NULL, 'inactive', 12),
(107, '3f805031-963a-477d-8b79-606d9200e89e', 'skull black', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi', '1kg', 108.04, 12.00, 0.00, 0, 0.00, 121.00, 'Vegetables', NULL, 0.0, '2025-04-15 10:35:32', '2025-04-15 10:35:32', 'products/pkpxpWm2mEjl0YIhDyTmJGycaO32xDac65V2Aweh.jpg', NULL, NULL, 'inactive', 121);

-- --------------------------------------------------------

--
-- Table structure for table `product_feedback`
--

CREATE TABLE `product_feedback` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL COMMENT 'Rating from 1 to 5',
  `review` text DEFAULT NULL COMMENT 'Customer review text',
  `review_image` varchar(255) DEFAULT NULL COMMENT 'Path to review image',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_feedback`
--

INSERT INTO `product_feedback` (`id`, `item_id`, `rating`, `review`, `review_image`, `created_at`, `updated_at`) VALUES
(3, 195, 5, 'sarap hinog an hinog', NULL, '2025-04-06 05:40:09', '2025-04-06 05:40:09');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `comments` text DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('sbcpnLWJi5qAbYNiOY9QLiv3Ad3SK77qbqgFGjzf', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiYWlGWUNBMWhxME9CVEp2eXR3NkE1S0lET0VCcFMxeUtPdGk5dzh2bSI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjQxOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYWRtaW4vbWFuYWdlLW9yZGVycyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7fQ==', 1744924099);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_image` varchar(255) DEFAULT NULL,
  `phone_number` bigint(20) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `postal_code` int(11) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `barangay` varchar(255) DEFAULT NULL,
  `street_address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`, `user_image`, `phone_number`, `country`, `postal_code`, `state`, `city`, `barangay`, `street_address`) VALUES
(1, 'john Kelly', 'Guillermo', 'jk.12102000@gmail.com', NULL, '$2y$12$1ADHAeuDnLuqXiuRS5dz7em2.tr3fZua/I61.Cj2tAnD7r7nUF9di', 'admin', NULL, '2025-03-13 09:06:53', '2025-03-28 06:44:15', NULL, 9396286340, 'Philippines', 1110, 'Metro Manila', 'Quezon City', NULL, 'Block 4 Lot 15 Sapphire Street'),
(2, 'Test', 'User', 'test@example.com', '2025-03-31 03:47:42', '$2y$12$NcwMTzUh7fLZihgQfOxKX.HcyXNqfBAYQO6CtMSWstohn62AZkLSu', 'user', 'czoYywOGtNeBSxtJ4gWl7arQsXkqUNnc7VWyXhrrzvfNNPvsxd8p2mnJidIF', '2025-03-31 03:47:42', '2025-03-31 04:16:52', NULL, NULL, 'Mexico', NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_user_id_foreign` (`user_id`),
  ADD KEY `cart_product_id_foreign` (`product_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_user_id_foreign` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_product_id_unique` (`product_id`);

--
-- Indexes for table `product_feedback`
--
ALTER TABLE `product_feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_feedback_item_id_index` (`item_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reviews_user_id_foreign` (`user_id`),
  ADD KEY `reviews_product_id_foreign` (`product_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=203;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `product_feedback`
--
ALTER TABLE `product_feedback`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_feedback`
--
ALTER TABLE `product_feedback`
  ADD CONSTRAINT `product_feedback_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `order_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
