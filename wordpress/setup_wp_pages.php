<?php
/**
 * Orova Paris - Automated WordPress Page Configuration & Seeder Script
 * This script programmatically creates the Home and Quiz pages and binds templates.
 */

// 1. Load WordPress Core environment
require_once('wp-load.php');

echo "Starting automated Orova page configuration...\n";

// 2. Create the Home Page (Luxury Landing Page)
$home_page_title = 'Home';
$home_page_check = get_page_by_title($home_page_title);

if (!$home_page_check) {
    $home_page_id = wp_insert_post(array(
        'post_title'   => $home_page_title,
        'post_content' => '<!-- Orova Luxury Editorial Homepage -->',
        'post_status'  => 'publish',
        'post_type'    => 'page',
        'post_author'  => 1
    ));
    echo "Created Home page with ID: $home_page_id\n";
} else {
    $home_page_id = $home_page_check->ID;
    echo "Home page already exists with ID: $home_page_id\n";
}

// Assign the custom Orova Luxury Landing Page Template to the Home page
update_post_meta($home_page_id, '_wp_page_template', 'page-templates/template-landing.php');
echo "Assigned Orova Luxury Landing template to Home page.\n";

// 3. Set the Home Page as the Static Front Page
update_option('show_on_front', 'page');
update_option('page_on_front', $home_page_id);
echo "Configured Settings > Reading: Static Homepage is now set to 'Home'.\n";

// 4. Create the Scent Quiz Page with Shortcode
$quiz_page_title = 'Scent Quiz';
$quiz_page_check = get_page_by_title($quiz_page_title);

if (!$quiz_page_check) {
    $quiz_page_id = wp_insert_post(array(
        'post_title'   => $quiz_page_title,
        'post_content' => '[orova_scent_quiz]',
        'post_status'  => 'publish',
        'post_type'    => 'page',
        'post_author'  => 1
    ));
    echo "Created Scent Quiz page with ID: $quiz_page_id\n";
} else {
    $quiz_page_id = $quiz_page_check->ID;
    echo "Scent Quiz page already exists with ID: $quiz_page_id\n";
}

echo "=============================================\n";
echo "Automated WordPress Page Setup Complete!\n";
echo "=============================================\n";
?>
