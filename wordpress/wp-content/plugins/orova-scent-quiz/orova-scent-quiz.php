<?php
/**
 * Plugin Name: Orova Paris Scent Matcher & Product Specs
 * Description: Premium WooCommerce integration adding luxury scent quiz shortcode, custom product specification metaboxes, and visual luxury note breakdowns.
 * Version: 1.0.0
 * Author: Orova Paris
 * License: GPL2
 */

if (!defined('ABSPATH')) exit; // Exit if accessed directly

// 1. Enqueue Assets for the Scent Quiz
function orova_scent_quiz_assets() {
    wp_register_style('orova-quiz-style', plugins_url('assets/css/quiz.css', __FILE__), array(), '1.0.0');
    wp_register_script('orova-quiz-script', plugins_url('assets/js/quiz.js', __FILE__), array('jquery'), '1.0.0', true);

    // Pass site URL and REST API endpoint to JS
    wp_localize_script('orova-quiz-script', 'orova_quiz_data', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'rest_url' => esc_url_raw(rest_url('wc/v3/products')),
        'nonce'    => wp_create_nonce('wp_rest')
    ));
}
add_action('wp_enqueue_scripts', 'orova_scent_quiz_assets');

// 2. Register Custom Scent Specification Metaboxes in WooCommerce Admin
function orova_add_product_specs_metabox() {
    add_meta_box(
        'orova_product_specs',
        'Orova Luxury Scent Specifications',
        'orova_render_product_specs_metabox',
        'product',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'orova_add_product_specs_metabox');

function orova_render_product_specs_metabox($post) {
    // Retrieve current values
    $top_notes = get_post_meta($post->ID, '_orova_top_notes', true);
    $heart_notes = get_post_meta($post->ID, '_orova_heart_notes', true);
    $base_notes = get_post_meta($post->ID, '_orova_base_notes', true);
    $longevity = get_post_meta($post->ID, '_orova_longevity', true);
    $sillage = get_post_meta($post->ID, '_orova_sillage', true);
    $projection = get_post_meta($post->ID, '_orova_projection', true);
    $inspired_by = get_post_meta($post->ID, '_orova_inspired_by', true);

    wp_nonce_field('orova_save_product_specs_nonce', 'orova_product_specs_nonce');
    ?>
    <div style="padding: 10px 0; font-family: sans-serif;">
        <p style="margin-bottom: 15px;"><strong>Note Breakdown:</strong> Enter comma-separated items (e.g. Saffron, Cinnamon)</p>
        
        <table class="form-table" style="width: 100%;">
            <tr>
                <th style="width: 20%;"><label for="orova_top_notes">Top Notes</label></th>
                <td><input type="text" id="orova_top_notes" name="orova_top_notes" value="<?php echo esc_attr($top_notes); ?>" style="width: 80%; padding: 6px;" placeholder="e.g. Saffron, Spices" /></td>
            </tr>
            <tr>
                <th><label for="orova_heart_notes">Heart Notes</label></th>
                <td><input type="text" id="orova_heart_notes" name="orova_heart_notes" value="<?php echo esc_attr($heart_notes); ?>" style="width: 80%; padding: 6px;" placeholder="e.g. Amberwood, Jasmine" /></td>
            </tr>
            <tr>
                <th><label for="orova_base_notes">Base Notes</label></th>
                <td><input type="text" id="orova_base_notes" name="orova_base_notes" value="<?php echo esc_attr($base_notes); ?>" style="width: 80%; padding: 6px;" placeholder="e.g. Fir Resin, Cedar" /></td>
            </tr>
            <tr>
                <th colspan="2"><hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;" /></th>
            </tr>
            <tr>
                <th><label for="orova_longevity">Longevity</label></th>
                <td>
                    <select id="orova_longevity" name="orova_longevity" style="width: 30%; padding: 6px;">
                        <option value="6+ Hours" <?php selected($longevity, '6+ Hours'); ?>>6+ Hours</option>
                        <option value="8+ Hours" <?php selected($longevity, '8+ Hours'); ?>>8+ Hours</option>
                        <option value="12+ Hours" <?php selected($longevity, '12+ Hours'); ?>>12+ Hours (Beast Mode)</option>
                    </select>
                </td>
            </tr>
            <tr>
                <th><label for="orova_sillage">Sillage</label></th>
                <td>
                    <select id="orova_sillage" name="orova_sillage" style="width: 30%; padding: 6px;">
                        <option value="Intimate" <?php selected($sillage, 'Intimate'); ?>>Intimate</option>
                        <option value="Moderate" <?php selected($sillage, 'Moderate'); ?>>Moderate</option>
                        <option value="Strong" <?php selected($sillage, 'Strong'); ?>>Strong</option>
                    </select>
                </td>
            </tr>
            <tr>
                <th><label for="orova_projection">Projection</label></th>
                <td>
                    <select id="orova_projection" name="orova_projection" style="width: 30%; padding: 6px;">
                        <option value="Personal" <?php selected($projection, 'Personal'); ?>>Personal</option>
                        <option value="Moderate" <?php selected($projection, 'Moderate'); ?>>Moderate</option>
                        <option value="Radiant" <?php selected($projection, 'Radiant'); ?>>Radiant</option>
                    </select>
                </td>
            </tr>
            <tr>
                <th><label for="orova_inspired_by">Inspired By / Scent Style</label></th>
                <td><input type="text" id="orova_inspired_by" name="orova_inspired_by" value="<?php echo esc_attr($inspired_by); ?>" style="width: 80%; padding: 6px;" placeholder="e.g. Original Luxury Blend, Niche Oud" /></td>
            </tr>
        </table>
    </div>
    <?php
}

// 3. Save Product Metabox Data
function orova_save_product_specs($post_id) {
    if (!isset($_POST['orova_product_specs_nonce']) || !wp_verify_nonce($_POST['orova_product_specs_nonce'], 'orova_save_product_specs_nonce')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $fields = array(
        'orova_top_notes'   => '_orova_top_notes',
        'orova_heart_notes' => '_orova_heart_notes',
        'orova_base_notes'  => '_orova_base_notes',
        'orova_longevity'   => '_orova_longevity',
        'orova_sillage'     => '_orova_sillage',
        'orova_projection'  => '_orova_projection',
        'orova_inspired_by' => '_orova_inspired_by'
    );

    foreach ($fields as $post_key => $meta_key) {
        if (isset($_POST[$post_key])) {
            update_post_meta($post_id, $meta_key, sanitize_text_field($_POST[$post_key]));
        }
    }
}
add_action('save_post_product', 'orova_save_product_specs');

// 4. Inject Visual Luxury Note Breakdown into single-product details
function orova_inject_note_breakdowns() {
    global $product;
    if (!$product) return;

    $top = get_post_meta($product->get_id(), '_orova_top_notes', true);
    $heart = get_post_meta($product->get_id(), '_orova_heart_notes', true);
    $base = get_post_meta($product->get_id(), '_orova_base_notes', true);

    if (empty($top) && empty($heart) && empty($base)) return;

    $top_arr = array_map('trim', explode(',', $top));
    $heart_arr = array_map('trim', explode(',', $heart));
    $base_arr = array_map('trim', explode(',', $base));

    ?>
    <div class="orova-luxury-notes-panel" style="margin: 25px 0; padding: 20px; border: 1px solid rgba(197,160,89,0.25); border-radius: 12px; background: #FAF8F5;">
        <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; tracking-wider; color: #C5A059; display: block; margin-bottom: 5px;">Scent Profile</span>
        <h4 style="font-family: serif; font-size: 18px; margin: 0 0 15px 0; color: #1C1917;">Olfactory Note Structure</h4>
        
        <div style="display: grid; grid-template-columns: 1; gap: 15px;">
            <?php if (!empty($top)): ?>
            <div style="border-bottom: 1px solid #F0ECE6; padding-bottom: 8px;">
                <p style="margin: 0 0 5px 0; font-size: 11px; text-transform: uppercase; font-weight: bold; color: #78716C;">Top Notes (Opening)</p>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    <?php foreach ($top_arr as $n): ?>
                        <span style="background: white; border: 1px solid #E7E5E4; border-radius: 20px; padding: 4px 10px; font-size: 10px; color: #444; font-weight: 600;"><?php echo esc_html($n); ?></span>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>

            <?php if (!empty($heart)): ?>
            <div style="border-bottom: 1px solid #F0ECE6; padding-bottom: 8px;">
                <p style="margin: 0 0 5px 0; font-size: 11px; text-transform: uppercase; font-weight: bold; color: #78716C;">Heart Notes (Core Scent)</p>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    <?php foreach ($heart_arr as $n): ?>
                        <span style="background: white; border: 1px solid rgba(197,160,89,0.3); border-radius: 20px; padding: 4px 10px; font-size: 10px; color: #C5A059; font-weight: 600;"><?php echo esc_html($n); ?></span>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>

            <?php if (!empty($base)): ?>
            <div>
                <p style="margin: 0 0 5px 0; font-size: 11px; text-transform: uppercase; font-weight: bold; color: #78716C;">Base Notes (Dry Down)</p>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    <?php foreach ($base_arr as $n): ?>
                        <span style="background: #1C1917; border-radius: 20px; padding: 4px 10px; font-size: 10px; color: #C5A059; font-weight: 600;"><?php echo esc_html($n); ?></span>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </div>
    <?php
}
add_action('woocommerce_single_product_summary', 'orova_inject_note_breakdowns', 35);

// 5. Shortcode definition for Scent Matcher Quiz: [orova_scent_quiz]
function orova_scent_quiz_shortcode() {
    wp_enqueue_style('orova-quiz-style');
    wp_enqueue_script('orova-quiz-script');

    ob_start();
    ?>
    <div id="orova-scent-quiz-app" class="orova-quiz-wrapper">
        <div class="orova-quiz-card">
            <!-- Quiz Start State -->
            <div id="quiz-step-start" class="quiz-step active">
                <span class="quiz-subtitle">Orova Paris</span>
                <h2 class="quiz-title">Find Your Signature Olfactory Scent Profile</h2>
                <p class="quiz-desc">Answer a few curated sensory questions to match with a premium, high-concentration niche masterpiece.</p>
                <button id="btn-start-quiz" class="btn-primary">Begin Experience</button>
            </div>

            <!-- Quiz Step 1: Gender Preference -->
            <div id="quiz-step-1" class="quiz-step">
                <span class="quiz-progress-text">Step 1 of 4</span>
                <h3 class="quiz-question">How do you prefer your scent expression?</h3>
                <div class="quiz-options-grid">
                    <button class="quiz-option" data-val="Men">For Him (Masculine, bold wood, spicier profiles)</button>
                    <button class="quiz-option" data-val="Women">For Her (Feminine, radiant florals, elegant sweetness)</button>
                    <button class="quiz-option" data-val="Unisex">Unisex (Neutral, niche, shared luxury formulations)</button>
                </div>
            </div>

            <!-- Quiz Step 2: Longevity Requirement -->
            <div id="quiz-step-2" class="quiz-step">
                <span class="quiz-progress-text">Step 2 of 4</span>
                <h3 class="quiz-question">What is your longevity standard?</h3>
                <div class="quiz-options-grid">
                    <button class="quiz-option" data-val="6+ Hours">Fresh & Intimate (6+ Hours projection)</button>
                    <button class="quiz-option" data-val="8+ Hours">Full Day Endurance (8+ Hours rich expression)</button>
                </div>
            </div>

            <!-- Quiz Step 3: Intensity & Sillage Level (Slider) -->
            <div id="quiz-step-3" class="quiz-step">
                <span class="quiz-progress-text">Step 3 of 4</span>
                <h3 class="quiz-question">Select your desired projection and trail (Sillage):</h3>
                <div class="slider-container">
                    <input type="range" id="sillage-range" min="1" max="3" value="2" class="luxury-slider" />
                    <div class="slider-labels">
                        <span>Intimate (Soft trail)</span>
                        <span class="active">Moderate (Balanced)</span>
                        <span>Strong (Beast mode)</span>
                    </div>
                </div>
                <button id="btn-next-step-3" class="btn-primary" style="margin-top: 30px;">Continue</button>
            </div>

            <!-- Quiz Step 4: Primary Mood Selection -->
            <div id="quiz-step-4" class="quiz-step">
                <span class="quiz-progress-text">Step 4 of 4</span>
                <h3 class="quiz-question">Which mood matches your ideal atmosphere?</h3>
                <div class="quiz-options-grid">
                    <button class="quiz-option" data-val="Elegant">Elegant & Majestic (Mysterious Ouds, Sandalwood)</button>
                    <button class="quiz-option" data-val="Fresh">Fresh & Invigorating (Crisp Citrus, Marine breezes)</button>
                    <button class="quiz-option" data-val="Seductive">Seductive & Warm (Deep Spices, Amber, Vanilla)</button>
                </div>
            </div>

            <!-- Quiz Result Recommendations State -->
            <div id="quiz-step-results" class="quiz-step">
                <h3 class="quiz-question">Your Perfect Olfactory Matches</h3>
                <p class="quiz-desc">Based on your dynamic sensory profile, we recommend these luxury masterpieces:</p>
                
                <div id="quiz-results-container" class="results-grid">
                    <!-- Dynamic recommendations will load here via AJAX -->
                    <div class="quiz-loading">Analyzing sensory attributes...</div>
                </div>
                
                <button id="btn-reset-quiz" class="btn-secondary" style="margin-top: 25px;">Retake Quiz</button>
            </div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('orova_scent_quiz', 'orova_scent_quiz_shortcode');

// 6. Ajax handler for Quiz Scent Matching Recommendations
function orova_get_quiz_matches() {
    $gender = sanitize_text_field($_POST['gender']);
    $longevity = sanitize_text_field($_POST['longevity']);
    $sillage = sanitize_text_field($_POST['sillage']);
    $mood = sanitize_text_field($_POST['mood']);

    // Perform WooCommerce Product Query
    $args = array(
        'post_type'      => 'product',
        'posts_per_page' => 3,
        'meta_query'     => array(
            'relation' => 'OR',
            array(
                'key'     => '_orova_longevity',
                'value'   => $longevity,
                'compare' => '='
            ),
            array(
                'key'     => '_orova_sillage',
                'value'   => $sillage,
                'compare' => '='
            )
        )
    );

    $query = new WP_Query($args);
    $matches = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            global $product;
            $matches[] = array(
                'id'          => $product->get_id(),
                'name'        => $product->get_name(),
                'price'       => $product->get_price_html(),
                'url'         => get_permalink(),
                'image'       => get_the_post_thumbnail_url($product->get_id(), 'medium'),
                'description' => wp_trim_words(get_the_excerpt(), 12)
            );
        }
        wp_reset_postdata();
    }

    // Fallback Mock products if no dynamic WooCommerce catalog items exist yet
    if (empty($matches)) {
        $matches = array(
            array(
                'id'          => 1,
                'name'        => 'Orova Purple Oud',
                'price'       => '<span class="woocommerce-Price-amount amount">₹3,599</span>',
                'url'         => '#',
                'image'       => 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
                'description' => 'A mysterious blend of luxury purple saffron and intense Cambodian dark oud.'
            ),
            array(
                'id'          => 4,
                'name'        => 'Orova Santal Woods',
                'price'       => '<span class="woocommerce-Price-amount amount">₹3,299</span>',
                'url'         => '#',
                'image'       => 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
                'description' => 'Creamy Mysore sandalwood fused with premium Virginia cedarwood oils.'
            )
        );
    }

    wp_send_json_success($matches);
}
add_action('wp_ajax_orova_get_quiz_matches', 'orova_get_quiz_matches');
add_action('wp_ajax_nopriv_orova_get_quiz_matches', 'orova_get_quiz_matches');
