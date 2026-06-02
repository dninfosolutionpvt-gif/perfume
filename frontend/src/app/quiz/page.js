'use client';

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Compass, Check, ArrowRight, RefreshCw, ShoppingBag, Star, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { API_BASE_URL } from '../../config';

export default function ScentQuiz() {
  const { addToCart } = useCart();

  const [step, setStep] = useState(0); // 0: Intro, 1: Sweet vs Strong, 2: Day vs Night, 3: Occasion, 4: Longevity, 5: Results
  const [answers, setAnswers] = useState({
    sweetness: '', // 'sweet' or 'strong'
    daytime: '',   // 'day' or 'night'
    venue: '',     // 'office', 'party', 'date'
    time_period: '' // '4-6', '8+', 'allday'
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const questions = [
    {
      id: 'sweetness',
      title: 'What fragrance intensity profile do you prefer?',
      desc: 'Choose sweet floral trails or deep warm woody tones.',
      options: [
        { label: 'Sweet & Floral', value: 'sweet', desc: 'Blooming jasmine, tuberose, vanilla and soft powder.' },
        { label: 'Bold & Woody', value: 'strong', desc: 'Dark agarwood (oud), cedar, dry cardamom and leather.' }
      ]
    },
    {
      id: 'daytime',
      title: 'When do you plan to wear this scent most?',
      desc: 'Fragrances evaporate differently depending on temperature.',
      options: [
        { label: 'Morning & Daytime', value: 'day', desc: 'Fresh marine salts, crisp lemon, and sunny bergamot.' },
        { label: 'Evening & Night', value: 'night', desc: 'Deep warm amber, smoky resins, and coffee absolute.' }
      ]
    },
    {
      id: 'venue',
      title: 'Select the primary setting for this perfume.',
      desc: 'Match your projection to the social setting.',
      options: [
        { label: 'Office & Meetings', value: 'office', desc: 'Moderate, professional projection. Sophisticated cedar & iris.' },
        { label: 'Party & Celebrations', value: 'party', desc: 'Heavy sillage. Noticeable trails of sweet rose & tuberose.' },
        { label: 'Date Nights & Dinner', value: 'date', desc: 'Intimate, warm sillage. Seductive coffee and deep vanilla.' }
      ]
    },
    {
      id: 'time_period',
      title: 'How long do you need the fragrance to last?',
      desc: 'Select your preferred concentration longevity.',
      options: [
        { label: '4 - 6 Hours (Fresh)', value: '4-6', desc: 'Eau de Toilette concentration. Perfect for brief outings.' },
        { label: '8+ Hours (Intense)', value: '8+', desc: 'Eau de Parfum. Lasts through a full workday.' },
        { label: 'All Day (Extrait)', value: 'allday', desc: 'Extrait de Parfum. Heavy concentration that lingers into the next day.' }
      ]
    }
  ];

  const handleSelect = (key, val) => {
    setAnswers({ ...answers, [key]: val });
    if (step < questions.length) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#a88020', '#ffffff', '#704e2d']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#a88020', '#ffffff', '#704e2d']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const calculateScentMatch = async () => {
    setLoading(true);
    setStep(5);

    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });
      const data = await response.json();
      setResults(data);
      triggerConfetti();
    } catch (err) {
      console.warn('Backend connection failed. Scoring matches client-side.');
      
      // Standalone algorithm matching logic for resilience
      const fallbackProducts = [
        {
          id: 1,
          name: 'Oud Midnight',
          price: 3499.00,
          gender: 'Unisex',
          fragrance_type: 'Woody',
          occasion: 'Date Night',
          longevity: '8+ Hours',
          mood: 'Bold',
          description: 'A rich, hypnotic blend of dark agarwood (oud) and sweet damask rose.',
          image_front: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
          image_side: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
          top_notes: ['Saffron', 'Nutmeg'],
          heart_notes: ['Damask Rose', 'Jasmine'],
          base_notes: ['Oud (Agarwood)', 'Amber'],
          sillage: 'Heavy',
          projection: 'Strong',
          rating: 4.9,
          reviews_count: 142,
          stock: 8,
          inspired_by: 'Oud Wood'
        },
        {
          id: 2,
          name: 'Citrus Breeze',
          price: 2199.00,
          gender: 'Men',
          fragrance_type: 'Citrus',
          occasion: 'Gym',
          longevity: '4-6 Hours',
          mood: 'Fresh',
          description: 'An explosive burst of crisp Mediterranean lemon and bitter bergamot.',
          image_front: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
          image_side: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
          top_notes: ['Lemon', 'Bergamot'],
          heart_notes: ['Sea Salt', 'Lavender'],
          base_notes: ['Cedarwood', 'Oakmoss'],
          sillage: 'Moderate',
          projection: 'Moderate',
          rating: 4.7,
          reviews_count: 98,
          stock: 15,
          inspired_by: 'Dior Sauvage'
        },
        {
          id: 3,
          name: 'Velvet Bloom',
          price: 2899.00,
          gender: 'Women',
          fragrance_type: 'Floral',
          occasion: 'Party',
          longevity: '8+ Hours',
          mood: 'Romantic',
          description: 'A luxurious, ultra-feminine bouquet of white tuberose and vanilla.',
          image_front: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
          image_side: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
          top_notes: ['Pink Pepper', 'Pear'],
          heart_notes: ['Tuberose', 'Rose'],
          base_notes: ['Vanilla', 'Patchouli'],
          sillage: 'Strong',
          projection: 'Strong',
          rating: 4.8,
          reviews_count: 86,
          stock: 7,
          inspired_by: 'My Way'
        },
        {
          id: 4,
          name: 'Sandalwood Monarch',
          price: 3299.00,
          gender: 'Men',
          fragrance_type: 'Woody',
          occasion: 'Office',
          longevity: 'All Day',
          mood: 'Elegant',
          description: 'A warm, creamy Indian sandalwood core, sharpened by cedar.',
          image_front: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
          image_side: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
          top_notes: ['Cardamom', 'Violet'],
          heart_notes: ['Iris', 'Papyrus'],
          base_notes: ['Sandalwood', 'Cedarwood'],
          sillage: 'Moderate',
          projection: 'Strong',
          rating: 4.9,
          reviews_count: 114,
          stock: 9,
          inspired_by: 'Santal 33'
        },
        {
          id: 5,
          name: 'Blue Vague',
          price: 2499.00,
          gender: 'Unisex',
          fragrance_type: 'Aquatic',
          occasion: 'Summer',
          longevity: '4-6 Hours',
          mood: 'Fresh',
          description: 'An endless summer in a bottle. Shimmering marine accords, ozone, and wet stones.',
          image_front: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
          image_side: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
          top_notes: ['Marine Accord', 'Grapefruit'],
          heart_notes: ['Seaweed', 'Sage'],
          base_notes: ['Driftwood', 'Vetiver'],
          sillage: 'Moderate',
          projection: 'Moderate',
          rating: 4.6,
          reviews_count: 74,
          stock: 12,
          inspired_by: 'Wood Sage & Sea Salt'
        },
        {
          id: 6,
          name: 'Nuit Noir',
          price: 3599.00,
          gender: 'Women',
          fragrance_type: 'Oriental',
          occasion: 'Date Night',
          longevity: 'All Day',
          mood: 'Bold',
          description: 'Seductive, mysterious, and intoxicating. Rich, dark roasted coffee beans and sweet vanilla.',
          image_front: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
          image_side: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
          top_notes: ['Pear', 'Orange Blossom'],
          heart_notes: ['Coffee Beans', 'Bitter Almond'],
          base_notes: ['Vanilla', 'Patchouli'],
          sillage: 'Strong',
          projection: 'Strong',
          rating: 4.9,
          reviews_count: 156,
          stock: 5,
          inspired_by: 'Black Opium'
        },
        {
          id: 7,
          name: 'Orova Paris Tuberose',
          price: 3699.00,
          gender: 'Women',
          fragrance_type: 'Floral',
          occasion: 'Evening',
          longevity: '10+ Hours',
          mood: 'Romantic',
          description: 'A luxurious white floral fragrance crafted with creamy tuberose petals, soft vanilla, and sensual woods for an unforgettable signature scent. Experience the elegance of blooming tuberose blended with radiant florals and warm musk.',
          image_front: '/orova_tuberose.png',
          image_side: '/orova_tuberose.png',
          top_notes: ['Pink Pepper', 'Creamy Peach', 'Orange Blossom'],
          heart_notes: ['Creamy Tuberose', 'Blooming Jasmine', 'Radiant Florals'],
          base_notes: ['Soft Vanilla', 'Sensual Woods', 'Warm Musk'],
          sillage: 'Heavy',
          projection: 'Strong',
          rating: 5.0,
          reviews_count: 189,
          stock: 12,
          inspired_by: 'Orova Paris Signature Formula'
        }
      ];

      // Score matching
      const scored = fallbackProducts.map((p) => {
        let matchPercent = 50; // Base score

        if (answers.sweetness === 'sweet' && ['Floral', 'Oriental'].includes(p.fragrance_type)) matchPercent += 15;
        if (answers.sweetness === 'strong' && ['Woody', 'Musky', 'Oriental'].includes(p.fragrance_type)) matchPercent += 15;

        if (answers.daytime === 'day' && p.best_time?.toLowerCase().includes('day')) matchPercent += 15;
        if (answers.daytime === 'night' && p.best_time?.toLowerCase().includes('night')) matchPercent += 15;

        if (answers.venue === 'office' && p.occasion.toLowerCase() === 'office') matchPercent += 15;
        if (answers.venue === 'party' && p.occasion.toLowerCase() === 'party') matchPercent += 15;
        if (answers.venue === 'date' && p.occasion.toLowerCase() === 'date night') matchPercent += 15;

        if (answers.time_period === 'allday' && (p.longevity === 'All Day' || p.longevity === '8+ Hours' || p.longevity === '10+ Hours')) matchPercent += 15;
        if (answers.time_period === '8+' && (p.longevity === '8+ Hours' || p.longevity === 'All Day' || p.longevity === '10+ Hours')) matchPercent += 15;
        if (answers.time_period === '4-6' && p.longevity === '4-6 Hours') matchPercent += 15;

        return { ...p, matchPercent: Math.min(matchPercent, 100) };
      });

      scored.sort((a, b) => b.matchPercent - a.matchPercent);
      setResults(scored.slice(0, 3));
      triggerConfetti();
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setAnswers({ sweetness: '', daytime: '', venue: '', time_period: '' });
    setResults([]);
    setStep(0);
  };

  const currentQuestion = questions[step - 1];
  const progress = step > 0 ? (step / questions.length) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[75vh] flex flex-col justify-center bg-[#FAF8F5] text-[#1C1917]">
      <AnimatePresence mode="wait">
        
        {/* Step 0: Welcome / Intro */}
        {step === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -35 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6 max-w-lg mx-auto"
          >
            <div className="p-4 bg-white border border-gold/15 rounded-full inline-flex text-gold justify-center shadow-md">
              <Compass className="w-10 h-10 animate-spin-slow" />
            </div>
            
            <div className="space-y-2 text-center">
              <span className="text-xs uppercase tracking-widest text-gold font-sans font-bold block">Interactive Scent Finder</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1C1917]">Find Your Signature Scent</h1>
              <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed font-sans max-w-md mx-auto">
                Our olfactory matching algorithm evaluates your style preferences, longevity requirements, and mood traits to recommend the perfect French-imported luxury elixir.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-10 py-3.5 bg-gold hover:bg-gold-dark text-black font-sans font-bold uppercase tracking-wider text-xs rounded transition-all duration-300 shadow-lg hover:shadow-gold/20 flex items-center justify-center cursor-pointer mx-auto"
              >
                <span>Start Scent Finder</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 1-4: Questionnaire */}
        {step > 0 && step <= questions.length && (
          <motion.div
            key={`question-${step}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Progress Bar & Headers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-600 uppercase tracking-widest font-semibold">
                <span>Step {step} of {questions.length}</span>
                <span className="text-gold font-bold">{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden border border-zinc-100 shadow-inner">
                <div className="bg-gold h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              
              <div className="text-center md:text-left">
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1C1917] mt-2">{currentQuestion.title}</h2>
                <p className="text-zinc-600 text-xs sm:text-sm mt-1">{currentQuestion.desc}</p>
              </div>
            </div>

            {/* Selector Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(currentQuestion.id, opt.value)}
                  className="p-6 rounded border border-zinc-200 bg-white hover:border-gold/30 hover:bg-gold/5 text-left transition-all duration-300 group cursor-pointer flex flex-col justify-between h-40 shadow-sm"
                >
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1C1917] group-hover:text-gold transition-colors">{opt.label}</h3>
                    <p className="text-zinc-600 text-xs mt-2 leading-relaxed font-sans">{opt.desc}</p>
                  </div>
                  <div className="flex items-center text-xs text-gold font-bold uppercase tracking-wider mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Select Option</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>

            {/* Back Button */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={handleBack}
                className="px-4 py-2 text-xs text-zinc-600 hover:text-gold uppercase tracking-wider font-semibold font-sans cursor-pointer transition-colors"
              >
                Go Back
              </button>
              {step === questions.length && answers[currentQuestion.id] && (
                <button
                  onClick={calculateScentMatch}
                  className="px-6 py-2.5 bg-gold hover:bg-gold-dark text-black font-sans font-bold uppercase tracking-wider text-xs rounded transition-colors cursor-pointer shadow-sm"
                >
                  Reveal Matches
                </button>
              )}
            </div>

          </motion.div>
        )}

        {/* Step 5: Loading / Processing */}
        {step === 5 && loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4 py-16"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold mx-auto"></div>
            <h2 className="font-serif text-xl text-[#1C1917]">Matching Scent Profiles...</h2>
            <p className="text-zinc-600 text-xs uppercase tracking-widest font-sans">Evaluating sillage, projection, and mood notes</p>
          </motion.div>
        )}

        {/* Step 5: Results Display */}
        {step === 5 && !loading && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            
            {/* Header Results */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gold/10 border border-gold/25 rounded-full text-gold text-xs uppercase tracking-widest font-semibold shadow-sm">
                <Compass className="w-3.5 h-3.5" />
                <span>Quiz Complete</span>
              </div>
              <h2 className="font-serif text-3xl font-extrabold text-[#1C1917]">Your Signature Scent Profile</h2>
              <p className="text-zinc-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Based on your criteria, we have extracted the top 3 luxury inspired fragrances that best align with your persona.
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.map((product, index) => (
                <div
                  key={product.id}
                  className={`rounded border p-4 bg-white relative flex flex-col justify-between shadow-sm text-left ${
                    index === 0 ? 'border-gold shadow-md bg-gradient-to-b from-white to-gold/5' : 'border-zinc-200'
                  }`}
                >
                  {/* Match Percentage Overlay */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-gold/10 border border-gold/30 rounded-full text-gold font-sans font-bold text-[9px] uppercase tracking-wider shadow-sm">
                    {product.matchPercent ? `${product.matchPercent}% Match` : `${95 - index * 5}% Match`}
                  </div>

                  {index === 0 && (
                    <div className="absolute top-[-10px] left-4 px-2 py-0.5 bg-gold text-black rounded text-[9px] uppercase tracking-widest font-extrabold shadow">
                      Top recommendation
                    </div>
                  )}

                  <div className="space-y-4">
                    <img
                      src={product.image_front || 'https://images.unsplash.com/photo-1594035910387-fea47794261f'}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded bg-[#FAF8F5] border border-zinc-150 shadow-sm"
                    />

                    <div>
                      <span className="text-[9px] text-zinc-550 uppercase tracking-widest block italic font-semibold">
                        Inspired by {product.inspired_by || 'Original'}
                      </span>
                      <h3 className="font-serif text-base font-bold text-[#1C1917] mt-0.5">{product.name}</h3>
                      
                      <div className="flex items-center space-x-1 mt-1 text-gold">
                        <Star className="w-3.5 h-3.5 fill-gold stroke-gold" />
                        <span className="text-[11px] font-sans text-zinc-700 font-semibold">{product.rating}</span>
                      </div>

                      <p className="text-[11px] text-zinc-600 line-clamp-2 mt-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-sm font-sans font-bold text-gold">₹{product.price.toLocaleString()}</span>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/product/${product.handle || product.id}`}
                        className="text-[10px] uppercase font-bold text-zinc-500 hover:text-gold tracking-wider font-sans py-1.5 transition-colors"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="px-3 py-1.5 bg-gold hover:bg-gold-dark text-black rounded text-[10px] font-sans font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Restart Button */}
            <div className="text-center pt-4">
              <button
                onClick={handleRestart}
                className="px-6 py-2.5 bg-white hover:bg-gold/5 border border-zinc-200 text-zinc-700 hover:text-gold font-sans font-semibold uppercase tracking-wider text-xs rounded transition-colors flex items-center justify-center space-x-2 mx-auto cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restart Scent Quiz</span>
              </button>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
