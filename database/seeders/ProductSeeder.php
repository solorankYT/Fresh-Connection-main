<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $products = [
            // 🍏 Fruits
            ['Strawberry', 'Juicy and bright red, rich in antioxidants.', '250g', 180, 'Fruits'],
            ['Papaya', 'A tropical fruit with enzymes that aid digestion.', '1kg', 130, 'Fruits'],
            ['Blueberry', 'Tiny, nutrient-packed berries for snacking.', '250g', 220, 'Fruits'],
            ['Watermelon', 'Refreshing and hydrating with a juicy bite.', '1 whole', 160, 'Fruits'],
            ['Peach', 'A soft, sweet fruit with a fuzzy skin.', '500g', 140, 'Fruits'],
            ['Kiwi', 'Tangy and packed with vitamin C.', '500g', 160, 'Fruits'],
            ['Pomegranate', 'A powerhouse of antioxidants with juicy seeds.', '500g', 190, 'Fruits'],
            ['Dragon Fruit', 'Exotic fruit with a mildly sweet taste.', '1 whole', 210, 'Fruits'],
            ['Cantaloupe', 'Sweet and fragrant, perfect for summer.', '1 whole', 150, 'Fruits'],
            ['Plum', 'Juicy and rich in flavor, high in vitamins.', '500g', 130, 'Fruits'],

            // 🥕 Vegetables
            ['Cucumber', 'Hydrating and crunchy, great for salads.', '500g', 40, 'Vegetables'],
            ['Bell Pepper', 'Colorful and sweet, rich in vitamin C.', '500g', 90, 'Vegetables'],
            ['Onion', 'A staple in cooking, adds flavor to dishes.', '1kg', 60, 'Vegetables'],
            ['Garlic', 'Aromatic and medicinal, enhances any meal.', '250g', 75, 'Vegetables'],
            ['Zucchini', 'Mild and versatile, used in various dishes.', '500g', 85, 'Vegetables'],
            ['Eggplant', 'Soft and slightly bitter, great for grilling.', '500g', 95, 'Vegetables'],
            ['Cabbage', 'Crunchy and fibrous, great for slaws.', '1 whole', 75, 'Vegetables'],
            ['Pumpkin', 'Sweet and hearty, used in soups and pies.', '1kg', 105, 'Vegetables'],
            ['Radish', 'Peppery and crisp, great for salads.', '500g', 60, 'Vegetables'],
            ['Green Beans', 'Crunchy and fiber-rich, great as a side dish.', '500g', 80, 'Vegetables'],

            // 🦐 Seafood
            ['Oyster', 'Briny and nutrient-dense, great for appetizers.', '500g', 500, 'Seafood'],
            ['Clams', 'Mild and chewy, great for pasta dishes.', '1kg', 480, 'Seafood'],
            ['Sardines', 'Rich in omega-3, commonly canned or grilled.', '500g', 250, 'Seafood'],
            ['Mussels', 'Sweet and tender, great with butter sauce.', '1kg', 400, 'Seafood'],
            ['Cod', 'Mild white fish, flaky and tender.', '300g', 370, 'Seafood'],
            ['Snapper', 'Firm, sweet, and highly versatile fish.', '1 whole', 750, 'Seafood'],
            ['Squid', 'Chewy and slightly sweet, great for calamari.', '500g', 330, 'Seafood'],
            ['Mackerel', 'Rich in healthy fats, excellent grilled.', '1 whole', 420, 'Seafood'],
            ['Tilapia', 'Mild and affordable, great for frying.', '500g', 280, 'Seafood'],
            ['Anchovy', 'Tiny but flavorful, often used in sauces.', '250g', 310, 'Seafood'],

            // 🥩 Meat
            ['Turkey Breast', 'Lean and protein-packed alternative to chicken.', '500g', 200, 'Meat'],
            ['Duck', 'Rich and flavorful, often roasted.', '1kg', 450, 'Meat'],
            ['Veal', 'Delicate and tender, great for gourmet dishes.', '500g', 600, 'Meat'],
            ['Ground Beef', 'Versatile and commonly used in burgers.', '500g', 190, 'Meat'],
            ['Bacon', 'Smoky and crispy, a breakfast favorite.', '250g', 220, 'Meat'],
            ['Ham', 'Savory and often glazed, great for sandwiches.', '500g', 270, 'Meat'],
            ['Ribs', 'Slow-cooked for maximum tenderness.', '1kg', 450, 'Meat'],
            ['Brisket', 'A BBQ favorite, tender when slow-cooked.', '1kg', 500, 'Meat'],
            ['Salami', 'Cured and seasoned, great for charcuterie.', '300g', 180, 'Meat'],
            ['Meatballs', 'Savory and juicy, commonly served with pasta.', '500g', 160, 'Meat'],

            // 🥤 Beverages
            ['Orange Juice', 'Freshly squeezed citrus goodness.', '1L', 120, 'Beverages'],
            ['Green Tea', 'Healthy and refreshing, packed with antioxidants.', '250ml', 80, 'Beverages'],
            ['Black Coffee', 'Strong and aromatic, a morning essential.', '250ml', 90, 'Beverages'],
            ['Milk', 'Dairy staple, rich in calcium.', '1L', 100, 'Beverages'],
            ['Almond Milk', 'Nut-based alternative, lactose-free.', '1L', 130, 'Beverages'],
            ['Coconut Water', 'Hydrating and rich in electrolytes.', '500ml', 90, 'Beverages'],
            ['Lemonade', 'Sweet and tangy, perfect for summer.', '500ml', 85, 'Beverages'],
            ['Energy Drink', 'Boosts energy with caffeine and vitamins.', '250ml', 110, 'Beverages'],
            ['Protein Shake', 'Nutrient-packed drink for muscle recovery.', '500ml', 150, 'Beverages'],
            ['Iced Tea', 'Refreshing blend of tea and lemon.', '500ml', 95, 'Beverages'],

             // 🌿 Herbs & Spices
             ['Basil', 'Fragrant herb, great for pasta.', '50g', 40, 'Herbs & Spices'],
             ['Oregano', 'Used in Italian and Mediterranean dishes.', '50g', 35, 'Herbs & Spices'],
             ['Cinnamon', 'Sweet and aromatic spice.', '50g', 50, 'Herbs & Spices'],
             ['Paprika', 'Mildly spicy, adds rich color to food.', '50g', 45, 'Herbs & Spices'],
             ['Ginger', 'Spicy and medicinal root.', '100g', 60, 'Herbs & Spices'],
             ['Garlic Powder', 'Used to enhance flavors in cooking.', '50g', 50, 'Herbs & Spices'],
             ['Rosemary', 'Pine-like flavor, great for meats.', '50g', 40, 'Herbs & Spices'],
             ['Turmeric', 'Bright yellow, known for anti-inflammatory benefits.', '50g', 55, 'Herbs & Spices'],
             ['Cumin', 'Earthy and warm spice, great for curries.', '50g', 45, 'Herbs & Spices'],
             ['Bay Leaves', 'Aromatic leaves used in soups.', '25g', 30, 'Herbs & Spices'],

              // 🌾 Rice & Grains
            ['White Rice', 'Staple food, fluffy when cooked.', '1kg', 70, 'Rice & Grains'],
            ['Brown Rice', 'Nutritious whole-grain alternative.', '1kg', 90, 'Rice & Grains'],
            ['Quinoa', 'Protein-rich and gluten-free.', '500g', 140, 'Rice & Grains'],
            ['Oats', 'Great for breakfast and baking.', '500g', 95, 'Rice & Grains'],
            ['Barley', 'Nutty grain rich in fiber.', '500g', 80, 'Rice & Grains'],
            ['Cornmeal', 'Fine ground corn, used for bread and porridge.', '500g', 75, 'Rice & Grains'],
            ['Couscous', 'Tiny pasta-like grain, quick to cook.', '500g', 85, 'Rice & Grains'],
            ['Black Rice', 'Highly nutritious, deep purple in color.', '1kg', 130, 'Rice & Grains'],
            ['Wild Rice', 'Chewy and nutty, great for salads.', '500g', 150, 'Rice & Grains'],
            ['Millet', 'Small grain rich in protein.', '500g', 60, 'Rice & Grains']
  
        ];

        foreach ($products as $product) {
            DB::table('products')->insert([
                'product_id' => Str::uuid(),
                'product_name' => $product[0],
                'product_description' => $product[1],
                'product_serving' => $product[2],
                'product_price' => $product[3],
                'category' => $product[4],
                'sub_category' => 'Featured Products',
                'product_rating' => rand(3, 5),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
