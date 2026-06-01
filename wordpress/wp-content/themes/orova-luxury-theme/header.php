<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=2.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="orova-header">
    <div class="orova-nav-container">
        <!-- Luxury Brand Logo -->
        <a href="<?php echo esc_url(home_url('/')); ?>" class="orova-logo">
            orova<span>paris</span>
        </a>

        <!-- Sliding Menu Links -->
        <nav>
            <ul class="orova-menu">
                <li><a href="<?php echo esc_url(home_url('/')); ?>">Home</a></li>
                <li><a href="<?php echo esc_url(home_url('/scent-quiz')); ?>">Scent Matcher</a></li>
                <li><a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>">Collections</a></li>
                <li><a href="<?php echo esc_url(home_url('/#story')); ?>">Brand Story</a></li>
            </ul>
        </nav>

        <!-- WooCommerce Mini Cart Icon -->
        <div class="orova-cart-icon">
            <a href="<?php echo esc_url(wc_get_cart_url()); ?>" style="display: flex; align-items: center; gap: 8px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-bag" style="color: #1C1917;"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <?php if (in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins')))): ?>
                    <span style="background: #1C1917; color: #C5A059; font-size: 9px; font-weight: 700; border-radius: 50%; width: 15px; height: 15px; display: flex; align-items: center; justify-content: center; font-family: sans-serif;">
                        <?php echo esc_html(WC()->cart->get_cart_contents_count()); ?>
                    </span>
                <?php endif; ?>
            </a>
        </div>
    </div>
</header>
