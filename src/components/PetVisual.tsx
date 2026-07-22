import React from 'react';
import { motion } from 'motion/react';
import { PetType } from '../types';

interface PetVisualProps {
  type: PetType;
  state: 'idle' | 'studying' | 'eating' | 'sleeping';
  equippedAccessories: string[];
  hunger: number;
}

export const PetVisual: React.FC<PetVisualProps> = ({
  type,
  state,
  equippedAccessories,
  hunger,
}) => {
  // Determine pet face expression based on current action or hunger level
  const isHungry = hunger < 30;
  
  const getExpression = () => {
    if (state === 'sleeping') return 'sleeping';
    if (state === 'eating') return 'eating';
    if (state === 'studying') return 'studying';
    if (isHungry) return 'sad';
    return 'happy';
  };

  const expression = getExpression();

  // Custom visual components for each animal character
  const renderBunny = () => {
    return (
      <svg viewBox="0 0 200 220" className="w-full h-full max-h-[180px]">
        {/* Ears */}
        <motion.g
          animate={{
            rotate: state === 'sleeping' ? [0, -3, 0] : [0, 5, -3, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
          style={{ originX: '70px', originY: '90px' }}
        >
          {/* Left Ear */}
          <ellipse cx="75" cy="45" rx="14" ry="40" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="3" />
          <ellipse cx="75" cy="48" rx="8" ry="30" fill="#FDA4AF" />
        </motion.g>

        <motion.g
          animate={{
            rotate: state === 'sleeping' ? [0, 3, 0] : [0, -5, 3, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
            delay: 0.2
          }}
          style={{ originX: '125px', originY: '90px' }}
        >
          {/* Right Ear */}
          <ellipse cx="125" cy="45" rx="14" ry="40" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="3" />
          <ellipse cx="125" cy="48" rx="8" ry="30" fill="#FDA4AF" />
        </motion.g>

        {/* Body & Cheeks */}
        <ellipse cx="100" cy="145" rx="55" ry="45" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="3" />
        
        {/* Head */}
        <ellipse cx="100" cy="105" rx="48" ry="42" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="3" />

        {/* Cute blush cheeks */}
        <ellipse cx="68" cy="118" rx="7" ry="4" fill="#FECDD3" opacity="0.8" />
        <ellipse cx="132" cy="118" rx="7" ry="4" fill="#FECDD3" opacity="0.8" />

        {/* Eyes & Mouth depending on expression */}
        {expression === 'sleeping' && (
          <>
            {/* Sleeping eyes: simple arches */}
            <path d="M 65 110 Q 75 116 85 110" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <path d="M 115 110 Q 125 116 135 110" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <path d="M 96 117 Q 100 120 104 117" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {expression === 'eating' && (
          <>
            <circle cx="75" cy="110" r="4.5" fill="#1E293B" />
            <circle cx="125" cy="110" r="4.5" fill="#1E293B" />
            {/* Chewing mouth */}
            <motion.ellipse 
              cx="100" 
              cy="120" 
              rx="6" 
              ry="4" 
              fill="#FDA4AF" 
              animate={{ ry: [2, 6, 2], cy: [119, 122, 119] }}
              transition={{ repeat: Infinity, duration: 0.4 }}
            />
          </>
        )}

        {expression === 'studying' && (
          <>
            {/* Laser-focused eyebrows */}
            <path d="M 66 102 L 78 105" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 134 102 L 122 105" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="75" cy="110" r="5" fill="#1E293B" />
            <circle cx="125" cy="110" r="5" fill="#1E293B" />
            <path d="M 96 116 Q 100 119 104 116" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {expression === 'sad' && (
          <>
            {/* Sad downturned eyebrows & mouth */}
            <path d="M 68 106 Q 74 101 80 106" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            <path d="M 120 106 Q 126 101 132 106" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="75" cy="112" rx="4" ry="5" fill="#475569" />
            <ellipse cx="125" cy="112" rx="4" ry="5" fill="#475569" />
            <path d="M 95 122 Q 100 116 105 122" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {expression === 'happy' && (
          <>
            {/* Shiny happy eyes */}
            <circle cx="75" cy="110" r="5.5" fill="#1E293B" />
            <circle cx="73" cy="108" r="2" fill="#FFFFFF" />
            <circle cx="125" cy="110" r="5.5" fill="#1E293B" />
            <circle cx="123" cy="108" r="2" fill="#FFFFFF" />
            {/* W mouth */}
            <path d="M 92 116 Q 96 120 100 116 Q 104 120 108 116" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {/* Nose */}
        <polygon points="97,112 103,112 100,115" fill="#FDA4AF" />
      </svg>
    );
  };

  const renderPanda = () => {
    return (
      <svg viewBox="0 0 200 220" className="w-full h-full max-h-[180px]">
        {/* Panda Ears */}
        <circle cx="60" cy="72" r="18" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
        <circle cx="140" cy="72" r="18" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
        
        {/* Body */}
        <ellipse cx="100" cy="150" rx="58" ry="42" fill="#1E293B" />
        <ellipse cx="100" cy="150" rx="40" ry="32" fill="#FFFFFF" />

        {/* Head */}
        <ellipse cx="100" cy="110" rx="48" ry="40" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="3" />

        {/* Panda Eye Patches */}
        <ellipse cx="74" cy="112" rx="12" ry="15" fill="#1E293B" transform="rotate(-10 74 112)" />
        <ellipse cx="126" cy="112" rx="12" ry="15" fill="#1E293B" transform="rotate(10 126 112)" />

        {/* Cute blush cheeks */}
        <ellipse cx="60" cy="122" rx="6" ry="3" fill="#FDA4AF" opacity="0.7" />
        <ellipse cx="140" cy="122" rx="6" ry="3" fill="#FDA4AF" opacity="0.7" />

        {/* Eyes & Mouth depending on expression */}
        {expression === 'sleeping' && (
          <>
            <path d="M 70 110 Q 74 114 78 110" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 122 110 Q 126 114 130 110" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 96 122 Q 100 124 104 122" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {expression === 'eating' && (
          <>
            <circle cx="74" cy="111" r="3" fill="#FFFFFF" />
            <circle cx="126" cy="111" r="3" fill="#FFFFFF" />
            <motion.ellipse 
              cx="100" 
              cy="123" 
              rx="5" 
              ry="3" 
              fill="#E11D48" 
              animate={{ ry: [1, 5, 1], cy: [122, 124, 122] }}
              transition={{ repeat: Infinity, duration: 0.4 }}
            />
          </>
        )}

        {expression === 'studying' && (
          <>
            <path d="M 68 102 L 76 104" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <path d="M 132 102 L 124 104" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <circle cx="74" cy="112" r="3.5" fill="#FFFFFF" />
            <circle cx="126" cy="112" r="3.5" fill="#FFFFFF" />
            <path d="M 96 121 Q 100 123 104 121" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {expression === 'sad' && (
          <>
            <circle cx="74" cy="114" r="3" fill="#F8FAFC" />
            <circle cx="126" cy="114" r="3" fill="#F8FAFC" />
            <path d="M 95 124 Q 100 118 105 124" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {expression === 'happy' && (
          <>
            <circle cx="74" cy="111" r="4" fill="#FFFFFF" />
            <circle cx="73" cy="110" r="1" fill="#1E293B" />
            <circle cx="126" cy="111" r="4" fill="#FFFFFF" />
            <circle cx="125" cy="110" r="1" fill="#1E293B" />
            {/* W-style smile */}
            <path d="M 94 120 Q 97 123 100 120 Q 103 123 106 120" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {/* Tiny nose */}
        <ellipse cx="100" cy="116" rx="4" ry="2.5" fill="#1E293B" />
      </svg>
    );
  };

  const renderCat = () => {
    return (
      <svg viewBox="0 0 200 220" className="w-full h-full max-h-[180px]">
        {/* Cat Ears */}
        <polygon points="56,84 44,48 80,72" fill="#FDBA74" stroke="#F97316" strokeWidth="2.5" />
        <polygon points="53,80 47,52 74,70" fill="#FECDD3" />
        <polygon points="144,84 156,48 120,72" fill="#FDBA74" stroke="#F97316" strokeWidth="2.5" />
        <polygon points="147,80 153,52 126,70" fill="#FECDD3" />

        {/* Body */}
        <ellipse cx="100" cy="148" rx="55" ry="40" fill="#FDBA74" stroke="#F97316" strokeWidth="2" />
        <ellipse cx="100" cy="148" rx="35" ry="26" fill="#FFFBEB" />

        {/* Head */}
        <ellipse cx="100" cy="108" rx="46" ry="38" fill="#FFEDD5" stroke="#F97316" strokeWidth="2.5" />

        {/* Whiskers */}
        <line x1="42" y1="112" x2="26" y2="110" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="118" x2="24" y2="120" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
        <line x1="158" y1="112" x2="174" y2="110" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
        <line x1="158" y1="118" x2="176" y2="120" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />

        {/* Blush */}
        <ellipse cx="65" cy="118" rx="5" ry="2.5" fill="#FCA5A5" opacity="0.6" />
        <ellipse cx="135" cy="118" rx="5" ry="2.5" fill="#FCA5A5" opacity="0.6" />

        {/* Eyes & Mouth */}
        {expression === 'sleeping' && (
          <>
            <path d="M 64 110 Q 72 115 80 110" fill="none" stroke="#431407" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 120 110 Q 128 115 136 110" fill="none" stroke="#431407" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 96 118 Q 100 120 104 118" fill="none" stroke="#431407" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {expression === 'eating' && (
          <>
            <circle cx="72" cy="110" r="4.5" fill="#431407" />
            <circle cx="128" cy="110" r="4.5" fill="#431407" />
            <motion.path 
              d="M 94 118 Q 100 126 106 118 Z" 
              fill="#F43F5E" 
              animate={{ d: ["M 94 118 Q 100 120 106 118 Z", "M 94 118 Q 100 128 106 118 Z", "M 94 118 Q 100 120 106 118 Z"] }}
              transition={{ repeat: Infinity, duration: 0.4 }}
            />
          </>
        )}

        {expression === 'studying' && (
          <>
            <circle cx="72" cy="110" r="5" fill="#431407" />
            <circle cx="128" cy="110" r="5" fill="#431407" />
            <path d="M 68 103 L 78 104" stroke="#431407" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 132 103 L 122 104" stroke="#431407" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 95 117 Q 100 119 105 117" fill="none" stroke="#431407" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {expression === 'sad' && (
          <>
            <ellipse cx="72" cy="112" rx="4" ry="5" fill="#431407" />
            <ellipse cx="128" cy="112" rx="4" ry="5" fill="#431407" />
            <path d="M 94 122 Q 100 115 106 122" fill="none" stroke="#431407" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {expression === 'happy' && (
          <>
            <circle cx="72" cy="110" r="5.5" fill="#431407" />
            <circle cx="70" cy="108" r="1.5" fill="#FFFFFF" />
            <circle cx="128" cy="110" r="5.5" fill="#431407" />
            <circle cx="126" cy="108" r="1.5" fill="#FFFFFF" />
            {/* Double curve cute cat smile */}
            <path d="M 93 117 Q 96.5 121 100 117 Q 103.5 121 107 117" fill="none" stroke="#431407" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {/* Nose */}
        <polygon points="98,113 102,113 100,115" fill="#F43F5E" />
      </svg>
    );
  };

  const renderPenguin = () => {
    return (
      <svg viewBox="0 0 200 220" className="w-full h-full max-h-[180px]">
        {/* Feet */}
        <ellipse cx="75" cy="180" rx="15" ry="8" fill="#F59E0B" />
        <ellipse cx="125" cy="180" rx="15" ry="8" fill="#F59E0B" />

        {/* Flippers */}
        <motion.ellipse 
          cx="44" 
          cy="140" 
          rx="10" 
          ry="25" 
          fill="#38BDF8" 
          animate={state === 'eating' ? { rotate: [0, 20, 0] } : { rotate: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{ originX: '54px', originY: '125px' }}
        />
        <motion.ellipse 
          cx="156" 
          cy="140" 
          rx="10" 
          ry="25" 
          fill="#38BDF8" 
          animate={state === 'eating' ? { rotate: [0, -20, 0] } : { rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{ originX: '146px', originY: '125px' }}
        />

        {/* Body (Main background) */}
        <ellipse cx="100" cy="125" rx="55" ry="55" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
        
        {/* White Belly/Face contour */}
        <path d="M 100 75 Q 70 75 60 115 Q 55 160 100 175 Q 145 160 140 115 Q 130 75 100 75 Z" fill="#F8FAFC" />

        {/* Cute blush cheeks */}
        <ellipse cx="72" cy="120" rx="5" ry="3" fill="#FDA4AF" opacity="0.8" />
        <ellipse cx="128" cy="120" rx="5" ry="3" fill="#FDA4AF" opacity="0.8" />

        {/* Eyes & Mouth depending on expression */}
        {expression === 'sleeping' && (
          <>
            <path d="M 72 110 Q 78 114 84 110" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 116 110 Q 122 114 128 110" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="95,115 105,115 100,122" fill="#D97706" />
          </>
        )}

        {expression === 'eating' && (
          <>
            <circle cx="78" cy="110" r="4" fill="#0F172A" />
            <circle cx="122" cy="110" r="4" fill="#0F172A" />
            {/* Happy chewing beak */}
            <motion.polygon 
              points="94,115 106,115 100,125" 
              fill="#F59E0B"
              animate={{ points: ["94,115 106,115 100,119", "94,115 106,115 100,125", "94,115 106,115 100,119"] }}
              transition={{ repeat: Infinity, duration: 0.4 }}
            />
          </>
        )}

        {expression === 'studying' && (
          <>
            <circle cx="78" cy="110" r="4.5" fill="#0F172A" />
            <circle cx="122" cy="110" r="4.5" fill="#0F172A" />
            <path d="M 74 104 L 84 105" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 126 104 L 116 105" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="95,114 105,114 100,121" fill="#F59E0B" />
          </>
        )}

        {expression === 'sad' && (
          <>
            <ellipse cx="78" cy="112" rx="3.5" ry="4.5" fill="#334155" />
            <ellipse cx="122" cy="112" rx="3.5" ry="4.5" fill="#334155" />
            <polygon points="95,117 105,117 100,126" fill="#D97706" />
          </>
        )}

        {expression === 'happy' && (
          <>
            <circle cx="78" cy="110" r="5" fill="#0F172A" />
            <circle cx="76" cy="108" r="1.5" fill="#FFFFFF" />
            <circle cx="122" cy="110" r="5" fill="#0F172A" />
            <circle cx="120" cy="108" r="1.5" fill="#FFFFFF" />
            {/* Happy yellow beak */}
            <polygon points="94,114 106,114 100,123" fill="#F59E0B" />
          </>
        )}
      </svg>
    );
  };

  const getPetMarkup = () => {
    switch (type) {
      case 'bunny': return renderBunny();
      case 'panda': return renderPanda();
      case 'cat': return renderCat();
      case 'penguin': return renderPenguin();
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full h-full select-none">
      <motion.div
        className="relative flex items-center justify-center w-full max-w-[200px]"
        animate={{
          y: state === 'sleeping' ? [0, 4, 0] : state === 'eating' ? [0, -6, 0] : [0, -4, 0],
          scaleY: state === 'sleeping' ? [1, 0.97, 1] : state === 'studying' ? [1, 0.99, 1] : [1, 1.02, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: state === 'sleeping' ? 4 : state === 'eating' ? 0.6 : 2.5,
          ease: "easeInOut"
        }}
      >
        {/* Render base pet character */}
        {getPetMarkup()}

        {/* Render equipped accessory overlays */}
        {equippedAccessories.map((accId) => {
          return (
            <div key={accId} className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {accId === 'grad_cap' && (
                // Academic graduation cap
                <svg viewBox="0 0 200 220" className="w-full h-full absolute">
                  <path d="M 60 70 L 100 50 L 140 70 L 100 90 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
                  <path d="M 80 77 L 80 92 C 80 98, 120 98, 120 92 L 120 77" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
                  {/* Yellow hanging tassel */}
                  <path d="M 100 70 L 138 82 L 138 100" fill="none" stroke="#EAB308" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="138" cy="102" r="3" fill="#EAB308" />
                </svg>
              )}

              {accId === 'glasses' && (
                // Smart round reading glasses
                <svg viewBox="0 0 200 220" className="w-full h-full absolute">
                  <circle cx="75" cy="110" r="14" fill="none" stroke="#475569" strokeWidth="3.5" />
                  <circle cx="125" cy="110" r="14" fill="none" stroke="#475569" strokeWidth="3.5" />
                  <line x1="89" y1="110" x2="111" y2="110" stroke="#475569" strokeWidth="3.5" />
                  <path d="M 61 108 C 55 106, 52 108, 48 114" fill="none" stroke="#475569" strokeWidth="2.5" />
                  <path d="M 139 108 C 145 106, 148 108, 152 114" fill="none" stroke="#475569" strokeWidth="2.5" />
                </svg>
              )}

              {accId === 'crown' && (
                // Shiny gold floating crown
                <svg viewBox="0 0 200 220" className="w-full h-full absolute">
                  <path d="M 75 56 L 68 32 L 88 44 L 100 24 L 112 44 L 132 32 L 125 56 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
                  <rect x="75" y="52" width="50" height="5" fill="#D97706" rx="2" />
                  <circle cx="68" cy="30" r="2.5" fill="#EF4444" />
                  <circle cx="100" cy="22" r="2.5" fill="#3B82F6" />
                  <circle cx="132" cy="30" r="2.5" fill="#EF4444" />
                </svg>
              )}

              {accId === 'headphones' && (
                // Cool music/gaming headphones
                <svg viewBox="0 0 200 220" className="w-full h-full absolute">
                  {/* Headband */}
                  <path d="M 46 115 A 56 56 0 0 1 154 115" fill="none" stroke="#3B82F6" strokeWidth="5.5" strokeLinecap="round" />
                  {/* Left ear pad */}
                  <rect x="36" y="100" width="14" height="30" fill="#1E293B" stroke="#3B82F6" strokeWidth="2" rx="4" />
                  {/* Right ear pad */}
                  <rect x="150" y="100" width="14" height="30" fill="#1E293B" stroke="#3B82F6" strokeWidth="2" rx="4" />
                </svg>
              )}

              {accId === 'scarf' && (
                // Snug red scarf around the neck
                <svg viewBox="0 0 200 220" className="w-full h-full absolute">
                  <path d="M 64 140 Q 100 155 136 140 C 145 152, 136 162, 100 162 C 64 162, 55 152, 64 140 Z" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
                  {/* Scarf hanging tail */}
                  <path d="M 120 148 L 132 184 L 116 182 Z" fill="#DC2626" stroke="#B91C1C" strokeWidth="1" />
                  <line x1="116" y1="182" x2="132" y2="184" stroke="#FEE2E2" strokeWidth="2.5" />
                </svg>
              )}

              {accId === 'bowtie' && (
                // Neat gentleman bowtie
                <svg viewBox="0 0 200 220" className="w-full h-full absolute">
                  <polygon points="100,148 84,138 84,158" fill="#EC4899" stroke="#DB2777" strokeWidth="1" />
                  <polygon points="100,148 116,138 116,158" fill="#EC4899" stroke="#DB2777" strokeWidth="1" />
                  <circle cx="100" cy="148" r="4.5" fill="#F472B6" />
                </svg>
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
