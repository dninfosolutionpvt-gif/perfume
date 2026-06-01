<?php
/**
 * Main Template Index Fallback
 */

get_header();
?>

<div class="orova-container">
    <div style="max-width: 800px; margin: 0 auto; padding-top: 40px;">
        <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?> style="margin-bottom: 50px;">
                <header>
                    <h2 class="entry-title" style="font-family: var(--font-serif); font-size: 26px; margin: 0 0 10px 0;">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h2>
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-stone); margin-bottom: 20px;">
                        Posted on <?php echo get_the_date(); ?> by <?php the_author(); ?>
                    </div>
                </header>

                <div class="entry-content" style="font-size: 14px; line-height: 1.7; color: #4A4A4A;">
                    <?php the_excerpt(); ?>
                </div>
            </article>
        <?php endwhile; else : ?>
            <p>No posts match your sensory request.</p>
        <?php endif; ?>
    </div>
</div>

<?php
get_footer();
