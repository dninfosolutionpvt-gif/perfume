jQuery(document).ready(function($) {
    // Quiz state variables
    let currentStep = 'start';
    let answers = {
        gender: '',
        longevity: '',
        sillage: 'Moderate',
        mood: ''
    };

    const sillageMap = {
        1: 'Intimate',
        2: 'Moderate',
        3: 'Strong'
    };

    // Transition helper
    function showStep(stepId) {
        $('.quiz-step').removeClass('active');
        setTimeout(function() {
            $('.quiz-step').hide();
            $('#' + stepId).show().addClass('active');
        }, 150);
    }

    // Begin Experience Click
    $('#btn-start-quiz').on('click', function() {
        currentStep = 'step-1';
        showStep('quiz-step-1');
    });

    // Step 1 Option Click (Gender)
    $('#quiz-step-1 .quiz-option').on('click', function() {
        answers.gender = $(this).data('val');
        currentStep = 'step-2';
        showStep('quiz-step-2');
    });

    // Step 2 Option Click (Longevity)
    $('#quiz-step-2 .quiz-option').on('click', function() {
        answers.longevity = $(this).data('val');
        currentStep = 'step-3';
        showStep('quiz-step-3');
    });

    // Sillage Slider Input Change
    $('#sillage-range').on('input', function() {
        const val = $(this).val();
        answers.sillage = sillageMap[val];
        
        // Update label highlight
        $('.slider-labels span').removeClass('active');
        $('.slider-labels span').eq(val - 1).addClass('active');
    });

    // Step 3 Next Button (Sillage)
    $('#btn-next-step-3').on('click', function() {
        currentStep = 'step-4';
        showStep('quiz-step-4');
    });

    // Step 4 Option Click (Mood) - FINAL STEP
    $('#quiz-step-4 .quiz-option').on('click', function() {
        answers.mood = $(this).data('val');
        currentStep = 'results';
        showStep('quiz-step-results');
        fetchRecommendations();
    });

    // Reset Quiz
    $('#btn-reset-quiz').on('click', function() {
        currentStep = 'start';
        answers = {
            gender: '',
            longevity: '',
            sillage: 'Moderate',
            mood: ''
        };
        $('#sillage-range').val(2);
        $('.slider-labels span').removeClass('active');
        $('.slider-labels span').eq(1).addClass('active');
        
        showStep('quiz-step-start');
    });

    // AJAX WooCommerce Recommendation Engine Query
    function fetchRecommendations() {
        $('#quiz-results-container').html('<div class="quiz-loading">Analyzing sensory attributes...</div>');
        
        $.ajax({
            url: orova_quiz_data.ajax_url,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'orova_get_quiz_matches',
                gender: answers.gender,
                longevity: answers.longevity,
                sillage: answers.sillage,
                mood: answers.mood
            },
            success: function(response) {
                if (response.success && response.data.length > 0) {
                    let html = '';
                    response.data.forEach(function(item) {
                        html += `
                            <div class="result-card">
                                <img src="${item.image}" alt="${item.name}" class="result-image" />
                                <div class="result-info">
                                    <h4 class="result-name">${item.name}</h4>
                                    <p class="result-desc">${item.description}</p>
                                    <div class="result-footer">
                                        <span class="result-price">${item.price}</span>
                                        <a href="${item.url}" class="btn-view-product">View Scent</a>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    $('#quiz-results-container').html(html);
                } else {
                    $('#quiz-results-container').html('<div class="quiz-loading" style="color: #EF4444;">No sensory matches found in active catalog.</div>');
                }
            },
            error: function() {
                $('#quiz-results-container').html('<div class="quiz-loading" style="color: #EF4444;">Error connecting to WooCommerce engine.</div>');
            }
        });
    }
});
