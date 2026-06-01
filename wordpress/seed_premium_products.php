<?php
/**
 * Orova Paris - Automated Premium Perfume Catalog Seeder
 * This script inserts signature perfumes into WooCommerce with custom specifications.
 */

// 1. Load WordPress Core environment
require_once('wp-load.php');

echo "Starting Premium Perfume Catalog seeding...\n";

// Ensure WooCommerce is active
if (!class_exists('WC_Product')) {
    die("Error: WooCommerce is not active on this site. Please activate WooCommerce first.\n");
}

// 2. Define our 4 Premium Signature Fragrances
$premium_perfumes = array(
    array(
        'title' => 'Oud Midnight Layers',
        'price' => '120.00',
        'description' => 'Ultra-concentrated luxury elixir inspired by evening prestige. Designed for sillage, longevity, and elegant confidence.',
        'short_description' => 'Agarwood (Oud), Ambergris, Saffron & Smoky Vetiver accords.',
        'top_notes' => 'Saffron, Nutmeg, Cardamom',
        'heart_notes' => 'Damask Rose, Jasmine Sambac',
        'base_notes' => 'Agarwood (Oud), Ambergris, Smoky Vetiver',
        'longevity' => 'very-long',
        'sillage' => 'strong',
        'projection' => 'heavy'
    ),
    array(
        'title' => 'Orova Tuberose',
        'price' => '95.00',
        'description' => 'A romantic, creamy blend of Indian tuberose and premium vanilla combinations that enchant the senses.',
        'short_description' => 'Indian Jasmine, Tuberose, Orange Blossom & Sweet Madagascar Vanilla.',
        'top_notes' => 'Tuberose, Orange Blossom',
        'heart_notes' => 'Indian Jasmine, Creamy Vanilla',
        'base_notes' => 'White Musk, Virginian Cedarwood',
        'longevity' => 'long',
        'sillage' => 'moderate',
        'projection' => 'moderate'
    ),
    array(
        'title' => 'Citrus Breeze',
        'price' => '80.00',
        'description' => 'Extremely refreshing fresh gym perfume. Grapefruit and marine accords designed for daily freshness.',
        'short_description' => 'Breezy citrus, marine salts, grapefruit and clean aromatics.',
        'top_notes' => 'Grapefruit, Calabrian Bergamot',
        'heart_notes' => 'Marine Salts, Clean Rosemary',
        'base_notes' => 'Amberwood, Patchouli, Oakmoss',
        'longevity' => 'moderate',
        'sillage' => 'moderate',
        'projection' => 'moderate'
    ),
    array(
        'title' => 'Velvet Bloom',
        'price' => '110.00',
        'description' => 'Authoritative floral and sweet spice blend designed to project confidence and gather compliments.',
        'short_description' => 'Pink Pepper, Creamy Jasmine, Sweet Pear & Sandalwood.',
        'top_notes' => 'Pink Pepper, Pear',
        'heart_notes' => 'Creamy Jasmine, Tuberose',
        'base_notes' => 'Cedarwood, Vanilla, White Musk',
        'longevity' => 'long',
        'sillage' => 'strong',
        'projection' => 'heavy'
    )
);

// 3. Seed Products into WooCommerce
foreach ($premium_perfumes as $perfume) {
    // Check if product already exists to avoid duplicates
    $existing_product = get_page_by_title($perfume['title'], OBJECT, 'product');
    
    if (!$existing_product) {
        $product = new WC_Product_Simple();
        $product->set_name($perfume['title']);
        $product->set_regular_price($perfume['price']);
        $product->set_description($perfume['description']);
        $product->set_short_description($perfume['short_description']);
        $product->set_status('publish');
        $product->set_catalog_visibility('visible');
        
        // Save product to generate ID
        $product_id = $product->save();
        echo "Created Premium Product: {$perfume['title']} with ID: $product_id\n";
        
        // Set custom olfactory specifications in meta
        update_post_meta($product_id, '_orova_top_notes', $perfume['top_notes']);
        update_post_meta($product_id, '_orova_heart_notes', $perfume['heart_notes']);
        update_post_meta($product_id, '_orova_base_notes', $perfume['base_notes']);
        update_post_meta($product_id, '_orova_longevity', $perfume['longevity']);
        update_post_meta($product_id, '_orova_sillage', $perfume['sillage']);
        update_post_meta($product_id, '_orova_projection', $perfume['projection']);
        echo "Successfully seeded custom note metadata for product ID: $product_id\n";
    } else {
        echo "Product '{$perfume['title']}' already exists.\n";
    }
}

echo "=============================================\n";
echo "Premium Perfume Catalog Seeding Complete!\n";
echo "=============================================\n";
?>
