<?php
/**
 * Template Name: Orova Luxury Landing
 */

get_header();
?>

<!-- Luxury Hero Section -->
<section class="orova-hero" style="height: 90vh; background: #1C1917; display: flex; align-items: center; justify-content: center; text-align: center; color: white; padding: 0 20px; position: relative; overflow: hidden; margin-top: 0;">
    <!-- Dark subtle overlay -->
    <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(28,25,23,0.3) 0%, rgba(28,25,23,0.9) 100%); z-index: 1;"></div>
    
    <!-- Hero Image background placeholder -->
    <img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1200" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.25; z-index: 0;" alt="Orova Paris Luxury Scent" />

    <div style="position: relative; z-index: 2; max-width: 800px;">
        <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4em; color: #C5A059; display: block; margin-bottom: 15px;">Haute Parfumerie</span>
        <h1 style="font-family: var(--font-serif); font-size: clamp(32px, 6vw, 60px); color: white; margin: 0 0 20px 0; line-height: 1.15; font-weight: 400;">
            Orova Paris
        </h1>
        <p style="font-size: clamp(12px, 2vw, 15px); color: #E7E5E4; max-width: 500px; margin: 0 auto 35px auto; line-height: 1.8; font-weight: 300;">
            Exquisite, high-concentration luxury scent formulations hand-blended for collectors and standard setters.
        </p>
        <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
            <a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>" class="btn-primary" style="display: inline-block;">Explore Collection</a>
            <a href="<?php echo esc_url(home_url('/scent-quiz')); ?>" class="btn-secondary" style="display: inline-block; color: white; border-color: rgba(255,255,255,0.4);">Scent Matcher</a>
        </div>
    </div>
</section>

<!-- Brand Heritage & Story -->
<section id="story" style="padding: 100px 20px; background: #FAF8F5;">
    <div style="max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 50px; align-items: center;">
        <?php if (wp_is_mobile()) : ?>
        <?php else : ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <div style="padding-top: 40px;">
                <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=500" style="width: 100%; border-radius: 12px; border: 1px solid rgba(197,160,89,0.2); box-shadow: 0 10px 20px rgba(0,0,0,0.03);" alt="Orova Scent Crafting" />
            </div>
            <div>
                <img src="https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=500" style="width: 100%; border-radius: 12px; border: 1px solid rgba(197,160,89,0.2); box-shadow: 0 10px 20px rgba(0,0,0,0.03);" alt="Luxury Perfume Spraying" />
            </div>
        </div>
        <?php endif; ?>

        <div style="text-align: center; max-width: 600px; margin: 0 auto;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.25em; color: #C5A059; display: block; margin-bottom: 10px;">The Heritage</span>
            <h2 style="font-family: var(--font-serif); font-size: 32px; color: #1C1917; margin: 0 0 20px 0;">Our Artisanal Standard</h2>
            <p style="font-size: 14px; line-height: 1.8; color: #57534E; margin-bottom: 25px;">
                At Orova Paris, our perfumers combine precious floral absolutes, resinous woods, and exquisite spice extracts. Each bottle is cured in small-batch storage cells, yielding high sillage and unprecedented longevity.
            </p>
            <a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>" style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #1C1917; border-bottom: 2px solid #C5A059; padding-bottom: 4px;">Learn About Our Extraction</a>
        </div>
    </div>
</section>

<!-- WordPress / Gutenberg Editable Area -->
<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
    <section class="gutenberg-editable-content" style="padding: 40px 20px; background: white;">
        <div class="orova-container" style="margin: 0 auto; max-width: 900px;">
            <?php the_content(); ?>
        </div>
    </section>
<?php endwhile; endif; ?>

<!-- Luxury Scent Matcher Call To Action -->
<section style="padding: 80px 20px; background: #1C1917; color: white; text-align: center; border-top: 1px solid rgba(197,160,89,0.25);">
    <div style="max-width: 600px; margin: 0 auto;">
        <span style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3em; color: #C5A059; display: block; margin-bottom: 12px;">Olfactory Matcher</span>
        <h2 style="font-family: var(--font-serif); font-size: 32px; color: white; margin: 0 0 15px 0;">Find Your Masterpiece</h2>
        <p style="font-size: 13px; color: #A8A29E; line-height: 1.8; margin-bottom: 30px;">
            Answer four simple sensory questions, and our bespoke olfactory matching engine will pair you with your exact signature scent expression.
        </p>
        <a href="<?php echo esc_url(home_url('/scent-quiz')); ?>" class="btn-primary" style="display: inline-block;">Unlock Your Scent Match</a>
    </div>
</section>

<?php
get_footer();
