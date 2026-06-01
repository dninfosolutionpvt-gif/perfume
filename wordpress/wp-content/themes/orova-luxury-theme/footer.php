<?php
/**
 * Theme Footer Template
 */
?>

<footer class="orova-footer">
    <div class="orova-footer-grid">
        <!-- Brand Segment -->
        <div class="footer-brand">
            <h3>orova<span>paris</span></h3>
            <p>Crafting high-concentration luxury niche masterpieces for individuals who command elegance and standard.</p>
        </div>

        <!-- Collections -->
        <div class="footer-links">
            <h4>Collections</h4>
            <ul>
                <li><a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>">Oud Series</a></li>
                <li><a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>">Fresh Citrus</a></li>
                <li><a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>">Sandalwood Premium</a></li>
            </ul>
        </div>

        <!-- Brand Story -->
        <div class="footer-links">
            <h4>Heritage</h4>
            <ul>
                <li><a href="<?php echo esc_url(home_url('/#story')); ?>">Our Story</a></li>
                <li><a href="#">Artisanal Scent Lab</a></li>
                <li><a href="#">Sustainability</a></li>
            </ul>
        </div>

        <!-- Support -->
        <div class="footer-links">
            <h4>Client Care</h4>
            <ul>
                <li><a href="#">Shipping & Returns</a></li>
                <li><a href="#">Private Consultations</a></li>
                <li><a href="#">Store Locator</a></li>
            </ul>
        </div>
    </div>

    <!-- Copyright -->
    <div class="footer-bottom">
        <p>&copy; <?php echo date('Y'); ?> Orova Paris. All Rights Reserved. Exclusively Serving the United States.</p>
        <p style="letter-spacing: 0.1em; text-transform: uppercase;">Niche Fragrance House</p>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
