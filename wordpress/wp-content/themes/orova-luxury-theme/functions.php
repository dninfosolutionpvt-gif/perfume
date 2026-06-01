<?php
/**
 * Orova Luxury Theme Functions & Definitions
 */

if (!defined('ABSPATH')) exit; // Exit if accessed directly

// 1. Theme Setup Definitions
function orova_theme_setup() {
    // Add default title tag support
    add_theme_support('title-tag');

    // Add support for product and post thumbnails
    add_theme_support('post-thumbnails');

    // Declare WooCommerce Core Compatibility
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    // Register Navigation Menus
    register_nav_menus(array(
        'primary' => esc_html__('Primary Sliding Menu', 'orova-theme'),
        'footer'  => esc_html__('Footer Quick Links', 'orova-theme'),
    ));
}
add_action('after_setup_theme', 'orova_theme_setup');

// 2. Enqueue Theme Styles and Fonts
function orova_theme_assets() {
    // Enqueue Google Fonts
    wp_enqueue_style('orova-google-fonts', 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap', array(), null);

    // Enqueue Main Stylesheet
    wp_enqueue_style('orova-main-style', get_stylesheet_uri(), array(), '1.0.0');
}
add_action('wp_enqueue_scripts', 'orova_theme_assets');

// 3. Customize WooCommerce Wrapper Structure (Matching Luxury Design Grid)
remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);

function orova_wrapper_start() {
    echo '<div class="orova-container"><div class="woocommerce-main-content">';
}
add_action('woocommerce_before_main_content', 'orova_wrapper_start', 10);

function orova_wrapper_end() {
    echo '</div></div>';
}
add_action('woocommerce_after_main_content', 'orova_wrapper_end', 10);

// 4. Adjust WooCommerce Single Product Layout Adjustments
// Display Rating and reviews count inside summary
remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_rating', 10);
add_action('woocommerce_single_product_summary', 'woocommerce_template_single_rating', 8);

// Remove default WooCommerce sidebar from Single Product and Cart pages to maintain editorial look
function orova_remove_sidebar_shop() {
    if (is_product() || is_cart() || is_checkout()) {
        remove_action('woocommerce_sidebar', 'woocommerce_get_sidebar', 10);
    }
}
add_action('wp', 'orova_remove_sidebar_shop');
