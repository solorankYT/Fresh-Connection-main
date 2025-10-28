-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 01, 2025 at 05:27 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

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
(34, 1, 'e4485607-1c15-402c-82b0-fbbc1c932e2d', 2, '2025-04-01 07:24:58', '2025-04-01 07:25:09'),
(35, 1, '497c60f0-0414-48dd-80b1-1e5ae2508e17', 1, '2025-04-01 07:25:03', '2025-04-01 07:25:03');

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
(21, '2025_04_01_130845_add_stocks_and_status_column_to_products_table', 18);

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
  `received_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `first_name`, `last_name`, `address`, `pin_address`, `zip_code`, `city`, `region`, `mobile_number`, `subtotal`, `delivery_fee`, `total`, `status`, `payment_method`, `paid`, `card_number_last4`, `gcash_or_maya_account`, `created_at`, `updated_at`, `shipped_at`, `received_at`, `completed_at`) VALUES
(10, 1, 'hojn', 'jokm', '786 hahaha', NULL, '1291', 'qezn cit', 'Ilocos Region', '0912345678', 5300.00, 0.00, 5300.00, 'created', 'cod', 'unpaid', NULL, NULL, '2025-03-26 01:52:35', '2025-03-26 01:52:35', NULL, NULL, NULL),
(11, 1, 'John', 'Doeeee', '123 Main St. Barangay 123', NULL, '1000', 'Manila', 'National Capital Region (NCR)', '0912345678', 5300.00, 0.00, 5300.00, 'placed', 'cod', 'unpaid', NULL, NULL, '2025-03-26 06:04:54', '2025-03-26 06:04:54', NULL, NULL, NULL),
(12, 1, 'John2', 'doe2', '123 unMain st barangay 234', NULL, '1000', 'Quezon city', 'Davao Region', '0912345678', 5390.00, 0.00, 5390.00, 'placed', 'cod', 'unpaid', NULL, NULL, '2025-03-28 04:18:03', '2025-03-28 04:18:03', NULL, NULL, NULL),
(13, 1, 'John Kelly', 'Guillermo', '123 Main street, barangay 1', NULL, '1000', 'Manila', 'National Capital Region (NCR)', '0912345678', 5510.00, 0.00, 5510.00, 'placed', 'cod', 'unpaid', NULL, NULL, '2025-03-28 23:10:24', '2025-03-28 23:10:24', NULL, NULL, NULL),
(14, 1, 'Johny', 'Doey', '123 Mian st. Barangay 234', NULL, '1000', 'Manila', 'Zamboanga Peninsula', '0912345678', 6105.00, 0.00, 6105.00, 'placed', 'cod', 'unpaid', NULL, NULL, '2025-03-29 01:33:02', '2025-03-29 01:33:02', NULL, NULL, NULL),
(15, 1, 'Henry', 'Sy', 'franker 123 gobg', NULL, '1212', 'Hitop', 'Cordillera Administrative Region (CAR)', '09876543210', 2300.00, 0.00, 2300.00, 'placed', 'cod', 'unpaid', NULL, NULL, '2025-03-29 01:35:20', '2025-03-29 01:35:20', NULL, NULL, NULL),
(16, 1, 'Hohjoeb', 'dasd', 'sdada', NULL, '1000', 'Manila', 'CALABARZON', '0912345678', 470.00, 0.00, 470.00, 'placed', 'cod', 'unpaid', NULL, NULL, '2025-03-30 21:18:43', '2025-03-30 21:18:43', NULL, NULL, NULL);

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
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `created_at`, `updated_at`) VALUES
(113, 10, 'afe27871-c3a2-4a51-8dd7-08d3e9cb64ad', 11, 150.00, '2025-03-26 01:52:35', '2025-03-26 01:52:35'),
(114, 10, '8c3748fd-acff-46d9-93eb-5fce621e3a6a', 1, 130.00, '2025-03-26 01:52:35', '2025-03-26 01:52:35'),
(115, 10, '3ffaf3af-11bd-4734-9e70-8c0c2b0e0a10', 1, 130.00, '2025-03-26 01:52:35', '2025-03-26 01:52:35'),
(116, 10, 'eafadd9a-7d98-4652-a967-a8730ae0fa48', 1, 40.00, '2025-03-26 01:52:35', '2025-03-26 01:52:35'),
(117, 10, '9093db47-a413-4681-afc9-f547bee00c5c', 1, 60.00, '2025-03-26 01:52:35', '2025-03-26 01:52:35'),
(118, 10, 'd395f635-b57c-4fd6-95db-a376b6355ad7', 5, 45.00, '2025-03-26 01:52:35', '2025-03-26 01:52:35'),
(119, 10, '8569221f-292d-488f-aa98-f648f74b165c', 1, 45.00, '2025-03-26 01:52:35', '2025-03-26 01:52:35'),
(120, 10, '25aee7ff-1619-4ec0-ab08-7f7b354e4cc7', 2, 50.00, '2025-03-26 01:52:35', '2025-03-26 01:52:35'),
(121, 10, 'c0314eb6-9ed0-4687-b45a-53792809b3f3', 5, 180.00, '2025-03-26 01:52:35', '2025-03-26 01:52:35'),
(122, 10, 'a18713f7-c626-49f3-9fd0-f12822fb4125', 4, 85.00, '2025-03-26 01:52:35', '2025-03-26 01:52:35'),
(123, 10, 'b3aea825-a8e9-4349-9729-2513c659befa', 1, 80.00, '2025-03-26 01:52:35', '2025-03-26 01:52:35'),
(124, 10, '96f10c76-46f8-42e4-adcc-2e29e82423ae', 3, 120.00, '2025-03-26 01:52:35', '2025-03-26 01:52:35'),
(125, 10, '4f641f4a-0d57-458d-a7b8-eeb7fa8ce1fc', 2, 600.00, '2025-03-26 01:52:35', '2025-03-26 01:52:35'),
(126, 10, '049af473-bd9e-41e2-ab97-bf3542444bcd', 1, 40.00, '2025-03-26 01:52:35', '2025-03-26 01:52:35'),
(127, 11, 'afe27871-c3a2-4a51-8dd7-08d3e9cb64ad', 11, 150.00, '2025-03-26 06:04:54', '2025-03-26 06:04:54'),
(128, 11, '8c3748fd-acff-46d9-93eb-5fce621e3a6a', 1, 130.00, '2025-03-26 06:04:54', '2025-03-26 06:04:54'),
(129, 11, '3ffaf3af-11bd-4734-9e70-8c0c2b0e0a10', 1, 130.00, '2025-03-26 06:04:54', '2025-03-26 06:04:54'),
(130, 11, 'eafadd9a-7d98-4652-a967-a8730ae0fa48', 1, 40.00, '2025-03-26 06:04:54', '2025-03-26 06:04:54'),
(131, 11, '9093db47-a413-4681-afc9-f547bee00c5c', 1, 60.00, '2025-03-26 06:04:54', '2025-03-26 06:04:54'),
(132, 11, 'd395f635-b57c-4fd6-95db-a376b6355ad7', 5, 45.00, '2025-03-26 06:04:54', '2025-03-26 06:04:54'),
(133, 11, '8569221f-292d-488f-aa98-f648f74b165c', 1, 45.00, '2025-03-26 06:04:54', '2025-03-26 06:04:54'),
(134, 11, '25aee7ff-1619-4ec0-ab08-7f7b354e4cc7', 2, 50.00, '2025-03-26 06:04:54', '2025-03-26 06:04:54'),
(135, 11, 'c0314eb6-9ed0-4687-b45a-53792809b3f3', 5, 180.00, '2025-03-26 06:04:54', '2025-03-26 06:04:54'),
(136, 11, 'a18713f7-c626-49f3-9fd0-f12822fb4125', 4, 85.00, '2025-03-26 06:04:54', '2025-03-26 06:04:54'),
(137, 11, 'b3aea825-a8e9-4349-9729-2513c659befa', 1, 80.00, '2025-03-26 06:04:54', '2025-03-26 06:04:54'),
(138, 11, '96f10c76-46f8-42e4-adcc-2e29e82423ae', 3, 120.00, '2025-03-26 06:04:54', '2025-03-26 06:04:54'),
(139, 11, '4f641f4a-0d57-458d-a7b8-eeb7fa8ce1fc', 2, 600.00, '2025-03-26 06:04:54', '2025-03-26 06:04:54'),
(140, 11, '049af473-bd9e-41e2-ab97-bf3542444bcd', 1, 40.00, '2025-03-26 06:04:54', '2025-03-26 06:04:54'),
(141, 12, 'afe27871-c3a2-4a51-8dd7-08d3e9cb64ad', 11, 150.00, '2025-03-28 04:18:03', '2025-03-28 04:18:03'),
(142, 12, '8c3748fd-acff-46d9-93eb-5fce621e3a6a', 1, 130.00, '2025-03-28 04:18:03', '2025-03-28 04:18:03'),
(143, 12, '3ffaf3af-11bd-4734-9e70-8c0c2b0e0a10', 1, 130.00, '2025-03-28 04:18:03', '2025-03-28 04:18:03'),
(144, 12, 'eafadd9a-7d98-4652-a967-a8730ae0fa48', 1, 40.00, '2025-03-28 04:18:03', '2025-03-28 04:18:03'),
(145, 12, '9093db47-a413-4681-afc9-f547bee00c5c', 1, 60.00, '2025-03-28 04:18:03', '2025-03-28 04:18:03'),
(146, 12, 'd395f635-b57c-4fd6-95db-a376b6355ad7', 7, 45.00, '2025-03-28 04:18:03', '2025-03-28 04:18:03'),
(147, 12, '8569221f-292d-488f-aa98-f648f74b165c', 1, 45.00, '2025-03-28 04:18:03', '2025-03-28 04:18:03'),
(148, 12, '25aee7ff-1619-4ec0-ab08-7f7b354e4cc7', 2, 50.00, '2025-03-28 04:18:03', '2025-03-28 04:18:03'),
(149, 12, 'c0314eb6-9ed0-4687-b45a-53792809b3f3', 5, 180.00, '2025-03-28 04:18:03', '2025-03-28 04:18:03'),
(150, 12, 'a18713f7-c626-49f3-9fd0-f12822fb4125', 4, 85.00, '2025-03-28 04:18:03', '2025-03-28 04:18:03'),
(151, 12, 'b3aea825-a8e9-4349-9729-2513c659befa', 1, 80.00, '2025-03-28 04:18:03', '2025-03-28 04:18:03'),
(152, 12, '96f10c76-46f8-42e4-adcc-2e29e82423ae', 3, 120.00, '2025-03-28 04:18:03', '2025-03-28 04:18:03'),
(153, 12, '4f641f4a-0d57-458d-a7b8-eeb7fa8ce1fc', 2, 600.00, '2025-03-28 04:18:03', '2025-03-28 04:18:03'),
(154, 12, '049af473-bd9e-41e2-ab97-bf3542444bcd', 1, 40.00, '2025-03-28 04:18:03', '2025-03-28 04:18:03'),
(155, 13, 'afe27871-c3a2-4a51-8dd7-08d3e9cb64ad', 11, 150.00, '2025-03-28 23:10:24', '2025-03-28 23:10:24'),
(156, 13, '8c3748fd-acff-46d9-93eb-5fce621e3a6a', 1, 130.00, '2025-03-28 23:10:24', '2025-03-28 23:10:24'),
(157, 13, '3ffaf3af-11bd-4734-9e70-8c0c2b0e0a10', 1, 130.00, '2025-03-28 23:10:24', '2025-03-28 23:10:24'),
(158, 13, 'eafadd9a-7d98-4652-a967-a8730ae0fa48', 1, 40.00, '2025-03-28 23:10:24', '2025-03-28 23:10:24'),
(159, 13, '9093db47-a413-4681-afc9-f547bee00c5c', 1, 60.00, '2025-03-28 23:10:24', '2025-03-28 23:10:24'),
(160, 13, 'd395f635-b57c-4fd6-95db-a376b6355ad7', 7, 45.00, '2025-03-28 23:10:24', '2025-03-28 23:10:24'),
(161, 13, '8569221f-292d-488f-aa98-f648f74b165c', 1, 45.00, '2025-03-28 23:10:24', '2025-03-28 23:10:24'),
(162, 13, '25aee7ff-1619-4ec0-ab08-7f7b354e4cc7', 2, 50.00, '2025-03-28 23:10:24', '2025-03-28 23:10:24'),
(163, 13, 'c0314eb6-9ed0-4687-b45a-53792809b3f3', 5, 180.00, '2025-03-28 23:10:24', '2025-03-28 23:10:24'),
(164, 13, 'a18713f7-c626-49f3-9fd0-f12822fb4125', 4, 85.00, '2025-03-28 23:10:24', '2025-03-28 23:10:24'),
(165, 13, 'b3aea825-a8e9-4349-9729-2513c659befa', 1, 80.00, '2025-03-28 23:10:24', '2025-03-28 23:10:24'),
(166, 13, '96f10c76-46f8-42e4-adcc-2e29e82423ae', 3, 120.00, '2025-03-28 23:10:24', '2025-03-28 23:10:24'),
(167, 13, '4f641f4a-0d57-458d-a7b8-eeb7fa8ce1fc', 2, 600.00, '2025-03-28 23:10:24', '2025-03-28 23:10:24'),
(168, 13, '049af473-bd9e-41e2-ab97-bf3542444bcd', 1, 40.00, '2025-03-28 23:10:24', '2025-03-28 23:10:24'),
(169, 13, 'ab615361-3e23-4b14-b33b-dbaabf1df3b5', 1, 120.00, '2025-03-28 23:10:24', '2025-03-28 23:10:24'),
(170, 14, 'afe27871-c3a2-4a51-8dd7-08d3e9cb64ad', 11, 150.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(171, 14, '8c3748fd-acff-46d9-93eb-5fce621e3a6a', 1, 130.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(172, 14, '3ffaf3af-11bd-4734-9e70-8c0c2b0e0a10', 1, 130.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(173, 14, 'eafadd9a-7d98-4652-a967-a8730ae0fa48', 1, 40.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(174, 14, '9093db47-a413-4681-afc9-f547bee00c5c', 1, 60.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(175, 14, 'd395f635-b57c-4fd6-95db-a376b6355ad7', 7, 45.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(176, 14, '8569221f-292d-488f-aa98-f648f74b165c', 1, 45.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(177, 14, '25aee7ff-1619-4ec0-ab08-7f7b354e4cc7', 2, 50.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(178, 14, 'c0314eb6-9ed0-4687-b45a-53792809b3f3', 5, 180.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(179, 14, 'a18713f7-c626-49f3-9fd0-f12822fb4125', 4, 85.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(180, 14, 'b3aea825-a8e9-4349-9729-2513c659befa', 1, 80.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(181, 14, '96f10c76-46f8-42e4-adcc-2e29e82423ae', 3, 120.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(182, 14, '4f641f4a-0d57-458d-a7b8-eeb7fa8ce1fc', 2, 600.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(183, 14, '049af473-bd9e-41e2-ab97-bf3542444bcd', 1, 40.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(184, 14, 'ab615361-3e23-4b14-b33b-dbaabf1df3b5', 1, 120.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(185, 14, '241c89f1-608b-4b6a-bc24-186280dc9230', 4, 60.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(186, 14, 'c578e5ae-04fe-455e-9445-d86d90bfb18f', 1, 85.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(187, 14, '3f7925ef-5ade-41cb-8c39-0f83803a598c', 3, 90.00, '2025-03-29 01:33:02', '2025-03-29 01:33:02'),
(188, 15, '0c6e010d-6778-40b7-92c8-72e69fe96da1', 1, 110.00, '2025-03-29 01:35:20', '2025-03-29 01:35:20'),
(189, 15, '3ffaf3af-11bd-4734-9e70-8c0c2b0e0a10', 3, 130.00, '2025-03-29 01:35:20', '2025-03-29 01:35:20'),
(190, 15, '497c60f0-0414-48dd-80b1-1e5ae2508e17', 4, 90.00, '2025-03-29 01:35:20', '2025-03-29 01:35:20'),
(191, 15, 'ab615361-3e23-4b14-b33b-dbaabf1df3b5', 3, 120.00, '2025-03-29 01:35:20', '2025-03-29 01:35:20'),
(192, 15, 'e041c5d8-4405-4d39-811d-3bcc1f9114f8', 1, 500.00, '2025-03-29 01:35:20', '2025-03-29 01:35:20'),
(193, 15, '2d9e42d1-cf42-4460-93c9-16e6a448dc12', 1, 420.00, '2025-03-29 01:35:20', '2025-03-29 01:35:20'),
(194, 15, '78ab95bc-d750-4f01-9bec-ce8f1cd13a7b', 1, 160.00, '2025-03-29 01:35:20', '2025-03-29 01:35:20'),
(195, 16, 'afe27871-c3a2-4a51-8dd7-08d3e9cb64ad', 1, 150.00, '2025-03-30 21:18:43', '2025-03-30 21:18:43'),
(196, 16, 'a15f5d4a-a100-4422-bfcc-ba0dfc1dd083', 1, 70.00, '2025-03-30 21:18:43', '2025-03-30 21:18:43'),
(197, 16, '85412e34-6545-47c4-bad2-dbbd67ebf051', 1, 90.00, '2025-03-30 21:18:43', '2025-03-30 21:18:43'),
(198, 16, '0c81aa1b-82b8-4ba6-aa2f-9287a414853a', 1, 75.00, '2025-03-30 21:18:43', '2025-03-30 21:18:43'),
(199, 16, 'a18713f7-c626-49f3-9fd0-f12822fb4125', 1, 85.00, '2025-03-30 21:18:43', '2025-03-30 21:18:43');

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
  `category` enum('Fruits','Vegetables','Seafood','Meat','Rice & Grains','Herbs & Spices','Beverages') NOT NULL,
  `sub_category` varchar(255) DEFAULT NULL,
  `product_rating` decimal(2,1) NOT NULL DEFAULT 0.0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `stocks` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `product_id`, `product_name`, `product_description`, `product_serving`, `product_price`, `category`, `sub_category`, `product_rating`, `created_at`, `updated_at`, `product_image`, `status`, `stocks`) VALUES
(1, 'b1788367-e964-40ca-b40c-2936df8359fc', 'Apple', 'A crisp and refreshing fruit known for its sweet and juicy taste. Packed with fiber and vitamin C, apples make for a healthy snack, an essential ingredient in pies, or a great addition to fruit salads.', '1kg', 120.00, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'inactive', 7),
(2, 'b3aea825-a8e9-4349-9729-2513c659befa', 'Banana', 'A naturally sweet and creamy fruit loaded with potassium, fiber, and antioxidants. Bananas are perfect for breakfast smoothies, baking banana bread, or eating on the go as a quick energy booster.', '1kg', 80.00, 'Fruits', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 23),
(3, 'afe27871-c3a2-4a51-8dd7-08d3e9cb64ad', 'Mango', 'A tropical delight with a rich, juicy flavor and a soft, fibrous texture. High in vitamin A and vitamin C, mangoes are ideal for fresh consumption, smoothies, or as a topping for desserts.', '1kg', 150.00, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 61),
(4, '0c6e010d-6778-40b7-92c8-72e69fe96da1', 'Grapes', 'Small, seedless, and bursting with sweetness, grapes are perfect for snacking or making fresh juice. They are rich in antioxidants and make a delicious addition to salads or cheese platters.', '500g', 110.00, 'Fruits', 'Featured Products', 4.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 43),
(5, 'bfe29b72-d0c8-41da-b359-8e4c5542fc8f', 'Pineapple', 'A vibrant tropical fruit with a tangy, sweet flavor. Pineapples are high in vitamin C and bromelain, making them great for digestion. Enjoy fresh, in juices, or as part of a savory dish.', '1 whole', 95.00, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 76),
(6, 'd395f635-b57c-4fd6-95db-a376b6355ad7', 'Carrot', 'Crunchy and naturally sweet, carrots are rich in beta-carotene, fiber, and antioxidants. They can be eaten raw, roasted, blended into soups, or added to stir-fry dishes for extra nutrition.', '500g', 45.00, 'Vegetables', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 26),
(7, '990bdbb9-4643-4965-ae3f-37654e564e41', 'Broccoli', 'A nutrient-dense vegetable packed with vitamins C and K, fiber, and antioxidants. Broccoli can be steamed, roasted, or added to stir-fries and casseroles for a delicious and healthy meal.', '500g', 70.00, 'Vegetables', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 95),
(8, 'b3ebc4e2-4646-48f7-9aee-0a2f46ce024e', 'Spinach', 'Dark leafy greens known for their high iron and calcium content. Spinach is great for salads, omelets, pasta, and smoothies, offering a powerful dose of nutrients and antioxidants.', '300g', 60.00, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 29),
(9, '17d62263-19f2-404b-a1a9-75bc973a39d3', 'Lettuce', 'A fresh and crisp leafy vegetable that is the foundation of any great salad. It has a mild flavor and is often used in sandwiches, wraps, and burgers for added crunch and nutrition.', '1 head', 50.00, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 80),
(10, 'a18713f7-c626-49f3-9fd0-f12822fb4125', 'Tomato', 'Juicy and bursting with flavor, tomatoes are rich in lycopene, vitamin C, and potassium. They can be used in sauces, salads, sandwiches, and countless cooked dishes.', '1kg', 85.00, 'Vegetables', 'Featured Products', 4.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 42),
(11, '180cf37a-865c-4664-b6bf-6f1eb2f4d8dc', 'Salmon', 'A premium seafood choice known for its rich, buttery taste and high omega-3 content. Salmon can be grilled, baked, or pan-seared to perfection, making it a versatile and healthy protein source.', '200g', 350.00, 'Seafood', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 47),
(12, '7799628a-018f-4fd0-9671-5fbe965afa50', 'Shrimp', 'Juicy and tender seafood, loved for its delicate flavor. Shrimp can be used in pasta, stir-fries, and seafood platters, providing a great source of lean protein and essential minerals.', '500g', 280.00, 'Seafood', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 63),
(13, '5488a7c2-9db6-4a55-a550-4382efe05f0f', 'Tuna', 'A firm, meaty fish with a mild, slightly sweet flavor. Tuna is perfect for grilling, sushi, salads, or sandwiches and is an excellent source of protein and omega-3 fatty acids.', '250g', 320.00, 'Seafood', 'Featured Products', 4.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 26),
(14, 'bdd9eeb8-1596-4772-8318-fd64492979d9', 'Lobster', 'A luxurious seafood delicacy with a sweet and tender texture. Best enjoyed steamed or grilled, lobster is rich in protein, vitamins, and minerals that promote overall health.', '1 whole', 950.00, 'Seafood', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 71),
(15, '4f641f4a-0d57-458d-a7b8-eeb7fa8ce1fc', 'Crab', 'A flavorful and meaty seafood that is commonly enjoyed boiled, steamed, or in creamy crab dishes. Crab is low in fat and high in essential nutrients like zinc and selenium.', '1kg', 600.00, 'Seafood', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 91),
(16, '788ade8a-e43e-46c3-a867-85f26bcf8985', 'Chicken Breast', 'Lean, protein-rich meat that is versatile and easy to cook. Chicken breast is ideal for grilling, baking, or pan-frying, making it a healthy and delicious choice for meals.', '500g', 160.00, 'Meat', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 85),
(17, '2d9e42d1-cf42-4460-93c9-16e6a448dc12', 'Beef Steak', 'A tender and flavorful cut of beef, perfect for grilling, pan-searing, or roasting. High in protein and iron, steak is a classic favorite for meat lovers.', '500g', 420.00, 'Meat', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 77),
(18, '4111cd2a-ee04-43f6-b2fc-d7da147b0379', 'Pork Chops', 'Juicy and well-marbled meat that is perfect for grilling or pan-searing. Pork chops offer a rich, savory taste and pair well with various seasonings and marinades.', '500g', 280.00, 'Meat', 'Featured Products', 4.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 17),
(19, 'e041c5d8-4405-4d39-811d-3bcc1f9114f8', 'Lamb', 'A premium cut of meat known for its rich, earthy flavor. Lamb is best roasted, grilled, or braised, providing essential nutrients like iron, zinc, and B vitamins.', '500g', 500.00, 'Meat', 'Featured Products', 4.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 13),
(20, 'ab615361-3e23-4b14-b33b-dbaabf1df3b5', 'Sausage', 'Savory and juicy, sausages are packed with spices and herbs. Great for breakfast, grilling, or stews, they offer a rich and delicious flavor in every bite.', '300g', 120.00, 'Meat', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 4),
(21, '718946b5-8724-48d5-b3b9-34714bc0e279', 'White Rice', 'Soft, fluffy grains that serve as a staple food in many cultures. White rice pairs perfectly with curries, stews, and stir-fries for a satisfying meal.', '1kg', 70.00, 'Rice & Grains', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 46),
(22, 'aad10c07-ccc1-4495-bbf5-d064d181d12d', 'Brown Rice', 'A fiber-rich alternative to white rice, brown rice has a nutty flavor and chewy texture. It is highly nutritious and pairs well with lean proteins and vegetables.', '1kg', 90.00, 'Rice & Grains', 'Featured Products', 5.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 82),
(23, '3c0322cf-4929-4e79-ae60-6bfc54b36cab', 'Quinoa', 'A protein-packed superfood that is naturally gluten-free. Quinoa has a mild, nutty flavor and is a great addition to salads, bowls, and stir-fries.', '500g', 150.00, 'Rice & Grains', 'Featured Products', 4.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 99),
(24, 'c9c0294f-b7cb-4036-8e37-d47994edde06', 'Barley', 'A hearty and nutritious grain, often used in soups, stews, and grain salads. Barley has a chewy texture and a rich, nutty taste.', '1kg', 110.00, 'Rice & Grains', 'Featured Products', 3.0, '2025-03-19 17:27:30', '2025-04-01 05:13:39', NULL, 'active', 67),
(25, 'f669b1ee-35cf-4850-a872-ac0e99b17018', 'Oats', 'A classic breakfast staple that is high in fiber and heart-healthy nutrients. Oats can be enjoyed as oatmeal, granola, or added to baked goods.', '1kg', 120.00, 'Rice & Grains', 'Featured Products', 4.0, '2025-03-19 17:27:31', '2025-04-01 05:13:39', NULL, 'active', 40),
(26, 'eafadd9a-7d98-4652-a967-a8730ae0fa48', 'Basil', 'A fragrant herb commonly used in Italian dishes, salads, and pestos. Basil has a slightly sweet and peppery flavor, enhancing the taste of various meals.', '50g', 40.00, 'Herbs & Spices', 'Featured Products', 4.0, '2025-03-19 17:27:31', '2025-04-01 05:13:39', NULL, 'active', 94),
(27, '544e63f0-d184-4b72-993c-4305c99a3462', 'Thyme', 'An aromatic herb with a slightly minty, earthy flavor. Thyme is perfect for roasting meats, making soups, and seasoning stews.', '50g', 45.00, 'Herbs & Spices', 'Featured Products', 3.0, '2025-03-19 17:27:31', '2025-04-01 05:13:39', NULL, 'active', 37),
(28, '77426a6a-2024-4daf-b409-0ec1122d7ed7', 'Cinnamon', 'A warm, sweet spice often used in baking, desserts, and hot drinks. Cinnamon has a comforting aroma and is known for its anti-inflammatory properties.', '50g', 60.00, 'Herbs & Spices', 'Featured Products', 3.0, '2025-03-19 17:27:31', '2025-04-01 05:13:39', NULL, 'active', 32),
(29, '8e7bddde-84f3-4a1b-9e9b-749dcdae6936', 'Turmeric', 'A golden-yellow spice with a mild, earthy flavor. Turmeric is used in curries, teas, and wellness drinks due to its powerful health benefits.', '50g', 55.00, 'Herbs & Spices', 'Featured Products', 5.0, '2025-03-19 17:27:31', '2025-04-01 05:13:39', NULL, 'active', 92),
(30, 'a15f5d4a-a100-4422-bfcc-ba0dfc1dd083', 'Ginger', 'A spicy and aromatic root commonly used in teas, stir-fries, and baked goods. Ginger has anti-inflammatory properties and adds a warming flavor to dishes.', '100g', 70.00, 'Herbs & Spices', 'Featured Products', 3.0, '2025-03-19 17:27:31', '2025-04-01 05:13:39', NULL, 'active', 38),
(31, '96f10c76-46f8-42e4-adcc-2e29e82423ae', 'Apple', 'A crisp and refreshing fruit, packed with fiber and vitamin C.', '1kg', 120.00, 'Fruits', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 58),
(32, 'd8c75109-c6b5-405d-a389-cd786cbd045e', 'Banana', 'A naturally sweet fruit loaded with potassium, great for snacks.', '1kg', 80.00, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 60),
(33, '8aae6e6e-546d-4786-afe1-5f058e717b94', 'Mango', 'A tropical delight with a juicy, rich flavor.', '1kg', 150.00, 'Fruits', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 27),
(34, '175cf315-6ff7-4bff-8012-a85f8330aa1f', 'Grapes', 'Sweet, seedless grapes perfect for snacking.', '500g', 110.00, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 12),
(35, '11051210-0271-42a6-a1f7-463fc83b0fe8', 'Pineapple', 'A vibrant fruit with a tangy-sweet taste.', '1 whole', 95.00, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 32),
(36, 'c0314eb6-9ed0-4687-b45a-53792809b3f3', 'Strawberry', 'Juicy and bright red, rich in antioxidants.', '250g', 180.00, 'Fruits', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 51),
(37, 'da7c1686-7e3a-45da-9823-90b0059a182c', 'Papaya', 'A tropical fruit with enzymes that aid digestion.', '1kg', 130.00, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 84),
(38, '36b1300e-85f5-4b55-ab29-5dcf3dbb325d', 'Blueberry', 'Tiny, nutrient-packed berries for snacking.', '250g', 220.00, 'Fruits', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 21),
(39, '840e1025-33ae-4f35-9ba7-14e6c5e58394', 'Watermelon', 'Refreshing and hydrating with a juicy bite.', '1 whole', 160.00, 'Fruits', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 79),
(40, 'be2d3b59-5a4b-41c3-88f4-27d1ed931f31', 'Peach', 'A soft, sweet fruit with a fuzzy skin.', '500g', 140.00, 'Fruits', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 40),
(41, '78ab95bc-d750-4f01-9bec-ce8f1cd13a7b', 'Kiwi', 'Tangy and packed with vitamin C.', '500g', 160.00, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 45),
(42, 'b4517489-8fed-4119-982e-a7b0f04c6294', 'Pomegranate', 'A powerhouse of antioxidants with juicy seeds.', '500g', 190.00, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 40),
(43, '129bfea9-b6a9-497e-b0a5-119a6efb9657', 'Dragon Fruit', 'Exotic fruit with a mildly sweet taste.', '1 whole', 210.00, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 84),
(44, '90954c91-a47e-451e-9a87-4dfe545a3ea6', 'Cantaloupe', 'Sweet and fragrant, perfect for summer.', '1 whole', 150.00, 'Fruits', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 13),
(45, '5c3c49df-c5fc-42d9-93b6-6c95832e9b26', 'Plum', 'Juicy and rich in flavor, high in vitamins.', '500g', 130.00, 'Fruits', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 58),
(46, '36172c93-dde5-485c-93ce-ba059aac0ca7', 'Carrot', 'Crunchy and naturally sweet, great for vision.', '500g', 45.00, 'Vegetables', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 73),
(47, '5f5aec91-4b4f-4077-b6b7-9b7a56995f97', 'Broccoli', 'A nutrient powerhouse rich in fiber and vitamins.', '500g', 70.00, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 71),
(48, 'fdf612c0-0da4-4177-854b-51f69d1ca52b', 'Spinach', 'Iron-rich leafy greens great for salads.', '300g', 60.00, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 52),
(49, '44f7e2c9-7a7f-4e68-90c8-d615d0c0faa0', 'Lettuce', 'Crisp and refreshing, perfect for salads.', '1 head', 50.00, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 72),
(50, 'ab8fd30f-50c0-45d9-bddc-01434ee28763', 'Tomato', 'Juicy and versatile, great for sauces.', '1kg', 85.00, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 87),
(51, '7805edfc-8a91-4f64-a16e-0e7b86e7d9cf', 'Cucumber', 'Hydrating and crunchy, great for salads.', '500g', 40.00, 'Vegetables', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 92),
(52, '9157cf98-fb25-4f51-bc99-cb4ce70a4ce8', 'Bell Pepper', 'Colorful and sweet, rich in vitamin C.', '500g', 90.00, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 33),
(53, 'df946766-3356-4f18-8af0-2eb67a347293', 'Onion', 'A staple in cooking, adds flavor to dishes.', '1kg', 60.00, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 75),
(54, 'e677156c-b261-4188-990e-cbd5c75c2e68', 'Garlic', 'Aromatic and medicinal, enhances any meal.', '250g', 75.00, 'Vegetables', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 24),
(55, 'e4485607-1c15-402c-82b0-fbbc1c932e2d', 'Zucchini', 'Mild and versatile, used in various dishes.', '500g', 85.00, 'Vegetables', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 78),
(56, '25038377-4f61-4c59-a93f-7f0e618cc3a8', 'Eggplant', 'Soft and slightly bitter, great for grilling.', '500g', 95.00, 'Vegetables', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 40),
(57, 'c68f6952-ea5d-4e1a-943e-28e212e573c4', 'Cabbage', 'Crunchy and fibrous, great for slaws.', '1 whole', 75.00, 'Vegetables', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 22),
(58, '2d9d99da-38bb-455e-a824-53dcdcc0c254', 'Pumpkin', 'Sweet and hearty, used in soups and pies.', '1kg', 105.00, 'Vegetables', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 31),
(59, '0fdd348a-412f-4cc4-a326-dd1ea4dfc2ee', 'Radish', 'Peppery and crisp, great for salads.', '500g', 60.00, 'Vegetables', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-03-19 17:37:57', NULL, 'active', 0),
(60, '019c3339-2ceb-46d6-b1c6-b3f351a9419f', 'Green Beans', 'Crunchy and fiber-rich, great as a side dish.', '500g', 80.00, 'Vegetables', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 78),
(61, 'fbc5a48d-b3ca-4428-bbc9-bfa119268c86', 'White Rice', 'Staple food, fluffy when cooked.', '1kg', 70.00, 'Rice & Grains', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 80),
(62, '85412e34-6545-47c4-bad2-dbbd67ebf051', 'Brown Rice', 'Nutritious whole-grain alternative.', '1kg', 90.00, 'Rice & Grains', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 75),
(63, '84d9ead6-bfff-47e3-a0d0-b37ac4560dce', 'Quinoa', 'Protein-rich and gluten-free.', '500g', 140.00, 'Rice & Grains', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 68),
(64, 'a13d3dd9-20fb-45d3-8460-0953930f4339', 'Oats', 'Great for breakfast and baking.', '500g', 95.00, 'Rice & Grains', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 88),
(65, 'ac50f669-cd9c-481f-a573-a4f9452fdea7', 'Barley', 'Nutty grain rich in fiber.', '500g', 80.00, 'Rice & Grains', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 8),
(66, '0c81aa1b-82b8-4ba6-aa2f-9287a414853a', 'Cornmeal', 'Fine ground corn, used for bread and porridge.', '500g', 75.00, 'Rice & Grains', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 45),
(67, '8838eacb-61d6-4de0-b403-e41f0050b16e', 'Couscous', 'Tiny pasta-like grain, quick to cook.', '500g', 85.00, 'Rice & Grains', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 78),
(68, '3ffaf3af-11bd-4734-9e70-8c0c2b0e0a10', 'Black Rice', 'Highly nutritious, deep purple in color.', '1kg', 130.00, 'Rice & Grains', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 8),
(69, '1a850c35-63cd-4ce7-b950-e5fe44cfcad1', 'Wild Rice', 'Chewy and nutty, great for salads.', '500g', 150.00, 'Rice & Grains', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 23),
(70, '9093db47-a413-4681-afc9-f547bee00c5c', 'Millet', 'Small grain rich in protein.', '500g', 60.00, 'Rice & Grains', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 56),
(71, '049af473-bd9e-41e2-ab97-bf3542444bcd', 'Basil', 'Fragrant herb, great for pasta.', '50g', 40.00, 'Herbs & Spices', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 76),
(72, '24e3f1ce-bf5b-4c48-abc2-44279f1ce74d', 'Oregano', 'Used in Italian and Mediterranean dishes.', '50g', 35.00, 'Herbs & Spices', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 69),
(73, '5adc8302-b308-4362-84fc-02d7ff468e57', 'Cinnamon', 'Sweet and aromatic spice.', '50g', 50.00, 'Herbs & Spices', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 99),
(74, '8569221f-292d-488f-aa98-f648f74b165c', 'Paprika', 'Mildly spicy, adds rich color to food.', '50g', 45.00, 'Herbs & Spices', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 13),
(75, '241c89f1-608b-4b6a-bc24-186280dc9230', 'Ginger', 'Spicy and medicinal root.', '100g', 60.00, 'Herbs & Spices', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 74),
(76, '25aee7ff-1619-4ec0-ab08-7f7b354e4cc7', 'Garlic Powder', 'Used to enhance flavors in cooking.', '50g', 50.00, 'Herbs & Spices', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 79),
(77, 'ce3c8412-9cfa-49d8-a763-c5308330ca8b', 'Rosemary', 'Pine-like flavor, great for meats.', '50g', 40.00, 'Herbs & Spices', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 32),
(78, '43c473fd-9408-47f9-bc84-342f0a807e31', 'Turmeric', 'Bright yellow, known for anti-inflammatory benefits.', '50g', 55.00, 'Herbs & Spices', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 92),
(79, '78a70422-f46f-4f6b-b3e4-bf7a432f764b', 'Cumin', 'Earthy and warm spice, great for curries.', '50g', 45.00, 'Herbs & Spices', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 16),
(80, '61a6a831-1de1-47ce-8ca8-b2749c51b488', 'Bay Leaves', 'Aromatic leaves used in soups.', '25g', 30.00, 'Herbs & Spices', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 16),
(81, 'f52937a9-f4c4-4ce4-8e0d-32d5981663c3', 'Orange Juice', 'Freshly squeezed citrus goodness.', '1L', 120.00, 'Beverages', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 55),
(82, 'cba148ca-9e72-43be-8d46-273a0f6cc6df', 'Green Tea', 'Healthy and refreshing, packed with antioxidants.', '250ml', 80.00, 'Beverages', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 23),
(83, '3f7925ef-5ade-41cb-8c39-0f83803a598c', 'Black Coffee', 'Strong and aromatic, a morning essential.', '250ml', 90.00, 'Beverages', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 57),
(84, '1c5c3ec8-cd38-4bd5-9afc-5dd163c29baa', 'Milk', 'Dairy staple, rich in calcium.', '1L', 100.00, 'Beverages', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 27),
(85, '8c3748fd-acff-46d9-93eb-5fce621e3a6a', 'Almond Milk', 'Nut-based alternative, lactose-free.', '1L', 130.00, 'Beverages', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 31),
(86, '497c60f0-0414-48dd-80b1-1e5ae2508e17', 'Coconut Water', 'Hydrating and rich in electrolytes.', '500ml', 90.00, 'Beverages', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 19),
(87, 'c578e5ae-04fe-455e-9445-d86d90bfb18f', 'Lemonade', 'Sweet and tangy, perfect for summer.', '500ml', 85.00, 'Beverages', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 49),
(88, '69cf8e49-2aa6-47fe-ba75-ad79bcddc316', 'Energy Drink', 'Boosts energy with caffeine and vitamins.', '250ml', 110.00, 'Beverages', 'Featured Products', 4.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 51),
(89, '6b9752bb-4642-47d0-ba3f-853f78505ad4', 'Protein Shake', 'Nutrient-packed drink for muscle recovery.', '500ml', 150.00, 'Beverages', 'Featured Products', 3.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 3),
(90, 'c85d518a-3606-480a-be5c-1aee2421a754', 'Iced Tea', 'Refreshing blend of tea and lemon.', '500ml', 95.00, 'Beverages', 'Featured Products', 5.0, '2025-03-19 17:37:57', '2025-04-01 05:13:39', NULL, 'active', 96);

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
('KW8N3qZ0JTEs4Q7NsAAMNwQLUJ5NWdBxrHR9W3fe', 1, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Safari/605.1.15', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoid2hNWGdNWkg5bkZwSmtYRW5xYU5ENkthUzh5RW9SQVFjbUVBVnRROSI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjQzOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYWRtaW4vbWFuYWdlLXByb2R1Y3RzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTt9', 1743521137),
('oWgPnfWfxMoIMlH3wXmMry5oXSLL7sB9pdodXwvm', 1, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Safari/605.1.15', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoicDRFWGV0YzV6QVlwOTVGYmlFZWdabFlYWlZKVDhBRlFtNFluMVBOeiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czo0MzoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2FkbWluL21hbmFnZS1wcm9kdWN0cyI7fX0=', 1743515195);

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
(2, 'Test', 'User', 'test@example.com', '2025-03-31 03:47:42', '$2y$12$NcwMTzUh7fLZihgQfOxKX.HcyXNqfBAYQO6CtMSWstohn62AZkLSu', 'user', 'xtGK9bTSFxgaSC894LbymMxDEf0OnXrfgtsFLu0USJDHfCzjW8auWbr4QXhX', '2025-03-31 03:47:42', '2025-03-31 04:16:52', NULL, NULL, 'Mexico', NULL, NULL, NULL, NULL, NULL);

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=200;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
