import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Clock,
  Sparkles,
  ShoppingBag,
  Award,
  Flame,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Play,
  Pause,
  Plus,
  Trash2,
  ChevronRight,
  User,
  Heart,
  ChevronLeft,
  Calendar,
  Volume2,
  FileText,
  Check,
  RefreshCw,
  LogOut,
  HelpCircle,
  Info
} from 'lucide-react';

import {
  Task,
  Milestone,
  StudyPlan,
  QuizQuestion,
  Quiz,
  PetType,
  PetStatus,
  ShopItem,
  StudyLog
} from './types';
import { PetVisual } from './components/PetVisual';

const SHOP_ITEMS: ShopItem[] = [
  // Foods
  { id: 'cupcake', name: 'Carrot Cupcake', type: 'food', price: 10, emoji: '🧁', description: 'Sweet bunny cake! Refills +35 hunger.' },
  { id: 'bamboo', name: 'Bamboo Shoot', type: 'food', price: 12, emoji: '🎋', description: 'Fresh and crunchy! Refills +40 hunger.' },
  { id: 'nigiri', name: 'Salmon Nigiri', type: 'food', price: 15, emoji: '🍣', description: 'Perfect cat treat! Refills +50 hunger.' },
  { id: 'boba', name: 'Bubble Tea', type: 'food', price: 18, emoji: '🧋', description: 'Creamy tapioca tea! Refills +60 hunger.' },
  { id: 'cookie', name: 'Star Cookie', type: 'food', price: 8, emoji: '🍪', description: 'A quick sweet snack. Refills +25 hunger.' },

  // Accessories
  { id: 'grad_cap', name: 'Academic Cap', type: 'accessory', price: 50, emoji: '🎓', description: 'Display your high-achiever intellect.' },
  { id: 'glasses', name: 'Smart Glasses', type: 'accessory', price: 30, emoji: '👓', description: 'Makes your pet look like a true scholar.' },
  { id: 'crown', name: 'Golden Crown', type: 'accessory', price: 100, emoji: '👑', description: 'Fit for royal, focused study kings.' },
  { id: 'headphones', name: 'Cool Headphones', type: 'accessory', price: 45, emoji: '🎧', description: 'Helps your companion block out noises.' },
  { id: 'scarf', name: 'Warm Scarf', type: 'accessory', price: 25, emoji: '🧣', description: 'Cozy red scarf for chilly study nights.' },
  { id: 'bowtie', name: 'Neat Bowtie', type: 'accessory', price: 15, emoji: '🎀', description: 'A very dapper, classy pink bowtie.' },

  // Background Room Themes
  { id: 'bg_library', name: 'Cozy Library Theme', type: 'background', price: 75, emoji: '📚', description: 'Surround your pet with beautiful mahogany bookshelves.' },
  { id: 'bg_forest', name: 'Quiet Forest Theme', type: 'background', price: 60, emoji: '🌲', description: 'A peace-inducing cabin deep in the woods.' },
  { id: 'bg_bedroom', name: 'Dreamy Bedroom Theme', type: 'background', price: 50, emoji: '🛏️', description: 'A soft lavender space with cute cloud pillows.' },
  { id: 'bg_space', name: 'Cosmic Desk Theme', type: 'background', price: 90, emoji: '🌌', description: 'A futuristic workstation orbiting the earth.' }
];

const DEFAULT_PETS: { type: PetType; name: string; desc: string; icon: string }[] = [
  { type: 'bunny', name: 'Boba', desc: 'An active, curious white rabbit who loves cupcakes and summaries.', icon: '🐰' },
  { type: 'panda', name: 'Pippin', desc: 'A laid-back, gentle giant panda who enjoys bamboo and silent study.', icon: '🐼' },
  { type: 'cat', name: 'Mochi', desc: 'A dapper ginger cat who demands fresh salmon and neat organization.', icon: '🐱' },
  { type: 'penguin', name: 'Penny', desc: 'A hard-working, disciplined penguin ready to crush exam sessions.', icon: '🐧' }
];

export default function App() {
  // --- Persistent Storage State ---
  const [petStatus, setPetStatus] = useState<PetStatus>(() => {
    const saved = localStorage.getItem('study_buddy_pet');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default */ }
    }
    return {
      type: 'bunny',
      name: 'Boba',
      level: 1,
      xp: 0,
      coins: 20, // Start with a few coins to buy initial food
      hunger: 80,
      equippedAccessories: [],
      equippedBackground: null
    };
  });

  const [purchasedItems, setPurchasedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('study_buddy_purchased');
    return saved ? JSON.parse(saved) : [];
  });

  const [streak, setStreak] = useState<number>(() => {
    return Number(localStorage.getItem('study_buddy_streak')) || 1;
  });

  const [lastStudyDate, setLastStudyDate] = useState<string | null>(() => {
    return localStorage.getItem('study_buddy_last_date');
  });

  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(() => {
    const saved = localStorage.getItem('study_buddy_plan');
    return saved ? JSON.parse(saved) : null;
  });

  const [studyLogs, setStudyLogs] = useState<StudyLog[]>(() => {
    const saved = localStorage.getItem('study_buddy_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [distractApps, setDistractApps] = useState<string[]>(() => {
    const saved = localStorage.getItem('study_buddy_distract');
    return saved ? JSON.parse(saved) : ['Instagram', 'YouTube', 'TikTok'];
  });

  // --- UI Layout / Interactive State ---
  const [currentTab, setCurrentTab] = useState<'pet' | 'timer' | 'planner' | 'quiz'>('pet');
  const [petActionState, setPetActionState] = useState<'idle' | 'studying' | 'eating' | 'sleeping'>('idle');
  const [feedMessages, setFeedMessages] = useState<string[]>([
    'Boba is excited to start studying with you today!'
  ]);
  const [shopCategory, setShopCategory] = useState<'all' | 'food' | 'accessory' | 'background'>('all');
  const [customAppName, setCustomAppName] = useState('');

  // --- Timer State ---
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [timerTotal, setTimerTotal] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [distractionBlockActive, setDistractionBlockActive] = useState(false);
  const [distractionWarning, setDistractionWarning] = useState<string | null>(null);

  // --- Planner Input State ---
  const [plannerSubjects, setPlannerSubjects] = useState('');
  const [plannerHours, setPlannerHours] = useState('2');
  const [plannerDays, setPlannerDays] = useState('5');
  const [plannerLoading, setPlannerLoading] = useState(false);

  // --- Quiz Generator State ---
  const [quizTopic, setQuizTopic] = useState('');
  const [quizResourceText, setQuizResourceText] = useState('');
  const [quizNumQs, setQuizNumQs] = useState(3);
  const [quizLoading, setQuizLoading] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  // --- Audio / Toast Feedback Simulation ---
  const [notifToast, setNotifToast] = useState<{ message: string; type: 'success' | 'warn' | 'info' } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Sync Storage Effects ---
  useEffect(() => {
    localStorage.setItem('study_buddy_pet', JSON.stringify(petStatus));
  }, [petStatus]);

  useEffect(() => {
    localStorage.setItem('study_buddy_purchased', JSON.stringify(purchasedItems));
  }, [purchasedItems]);

  useEffect(() => {
    localStorage.setItem('study_buddy_streak', streak.toString());
  }, [streak]);

  if (lastStudyDate) {
    localStorage.setItem('study_buddy_last_date', lastStudyDate);
  }

  useEffect(() => {
    localStorage.setItem('study_buddy_plan', JSON.stringify(studyPlan));
  }, [studyPlan]);

  useEffect(() => {
    localStorage.setItem('study_buddy_logs', JSON.stringify(studyLogs));
  }, [studyLogs]);

  useEffect(() => {
    localStorage.setItem('study_buddy_distract', JSON.stringify(distractApps));
  }, [distractApps]);

  // --- Push Cute Feed Messages ---
  const pushFeedMessage = (msg: string) => {
    setFeedMessages((prev) => [msg, ...prev.slice(0, 14)]);
  };

  const showToast = (message: string, type: 'success' | 'warn' | 'info' = 'info') => {
    setNotifToast({ message, type });
    setTimeout(() => {
      setNotifToast(null);
    }, 4000);
  };

  // --- Streak Manager ---
  const updateStreak = () => {
    const todayStr = new Date().toDateString();
    if (lastStudyDate !== todayStr) {
      if (lastStudyDate) {
        const lastDate = new Date(lastStudyDate);
        const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) {
          // Increment streak
          setStreak(prev => prev + 1);
          pushFeedMessage(`🔥 Streak extended! Keep studying to secure your ${streak + 1} day streak!`);
          showToast(`Study Streak: ${streak + 1} Days! 🔥`, 'success');
        } else {
          // Streak broken
          setStreak(1);
          pushFeedMessage(`💔 Your streak reset. Let's build it back up with Boba!`);
          showToast(`Streak reset to 1 day.`, 'info');
        }
      } else {
        setStreak(1);
      }
      setLastStudyDate(todayStr);
    }
  };

  // --- Level & XP Handler ---
  const addXPAndCoins = (xpEarned: number, coinsEarned: number) => {
    setPetStatus((prev) => {
      const nextXp = prev.xp + xpEarned;
      const xpNeeded = prev.level * 100;
      let nextLevel = prev.level;
      let remainingXp = nextXp;

      if (nextXp >= xpNeeded) {
        nextLevel += 1;
        remainingXp = nextXp - xpNeeded;
        pushFeedMessage(`🎉 LEVEL UP! ${prev.name} is now Level ${nextLevel}!`);
        showToast(`🎉 Level Up! Your pet reached Level ${nextLevel}!`, 'success');
      }

      return {
        ...prev,
        level: nextLevel,
        xp: remainingXp,
        coins: prev.coins + coinsEarned
      };
    });
  };

  // --- Distraction Warning system ---
  useEffect(() => {
    const handleBlur = () => {
      if (timerRunning && distractionBlockActive && !isBreak) {
        // Punish the user
        setPetActionState('idle');
        setTimerRunning(false);
        setPetStatus(prev => {
          const nextCoins = Math.max(0, prev.coins - 2);
          return { ...prev, coins: nextCoins };
        });
        
        const warning = `⚠️ Distraction Detected! You left your study space to browse unblocked areas. ${petStatus.name} caught you slacking! Penalty: -2 Study Coins.`;
        setDistractionWarning(warning);
        pushFeedMessage(`🚫 Slacking alert! ${petStatus.name} is disappointed you got distracted.`);
        showToast("Distraction detected! Coins docked.", "warn");
      }
    };

    if (distractionBlockActive && timerRunning) {
      window.addEventListener('blur', handleBlur);
      document.addEventListener('visibilitychange', handleBlur);
    }

    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleBlur);
    };
  }, [timerRunning, distractionBlockActive, isBreak, petStatus.name]);

  // --- Timer Tick Handler ---
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setTimerRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, isBreak]);

  const handleTimerComplete = () => {
    if (isBreak) {
      // Break over
      pushFeedMessage(`🔔 Break is over! Time to get back to work with ${petStatus.name}!`);
      showToast("Break over! Time to study.", "success");
      setIsBreak(false);
      setTimeLeft(25 * 60);
      setTimerTotal(25 * 60);
      setPetActionState('idle');
    } else {
      // Study over
      const minutesStudied = Math.round(timerTotal / 60);
      const coinsEarned = 20;
      const xpEarned = 50;

      addXPAndCoins(xpEarned, coinsEarned);
      updateStreak();

      // Reduce hunger
      setPetStatus(prev => ({
        ...prev,
        hunger: Math.max(10, prev.hunger - 15)
      }));

      // Log study session
      const newLog: StudyLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        durationMinutes: minutesStudied,
        subjects: studyPlan?.planTitle || 'Custom Focus Session',
        coinsEarned,
        xpEarned
      };

      setStudyLogs(prev => [newLog, ...prev]);

      pushFeedMessage(`🎓 Focus block complete! You studied for ${minutesStudied} mins and earned +${coinsEarned} Coins / +${xpEarned} XP! ${petStatus.name} feels hungry.`);
      showToast(`Finished focus session! +${coinsEarned} Coins! 🪙`, 'success');

      // Switch to break
      setIsBreak(true);
      setTimeLeft(5 * 60);
      setTimerTotal(5 * 60);
      setPetActionState('sleeping');
    }
  };

  // --- Shop Purchases & Equips ---
  const handlePurchase = (item: ShopItem) => {
    if (petStatus.coins < item.price) {
      showToast("Insufficient Study Coins! Study more to earn rewards.", "warn");
      return;
    }

    if (item.type !== 'food' && purchasedItems.includes(item.id)) {
      showToast("You already own this item!", "info");
      return;
    }

    // Process purchase
    setPetStatus(prev => ({
      ...prev,
      coins: prev.coins - item.price
    }));

    if (item.type === 'food') {
      // Feed immediately
      let refillValue = 25;
      if (item.id === 'cupcake') refillValue = 35;
      if (item.id === 'bamboo') refillValue = 40;
      if (item.id === 'nigiri') refillValue = 50;
      if (item.id === 'boba') refillValue = 60;

      setPetStatus(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + refillValue)
      }));
      setPetActionState('eating');
      setTimeout(() => setPetActionState('idle'), 2500);

      pushFeedMessage(`😋 Fed ${petStatus.name} a ${item.name}! Refilled +${refillValue} hunger. ${petStatus.name} looks happy!`);
      showToast(`Fed ${petStatus.name}! 😋`, 'success');
    } else {
      // Add accessory/background to inventory
      setPurchasedItems(prev => [...prev, item.id]);
      pushFeedMessage(`🛍️ Purchased ${item.emoji} ${item.name}! Go to Inventory to equip it.`);
      showToast(`Purchased ${item.name}!`, 'success');
    }
  };

  const handleEquipAccessory = (itemId: string) => {
    setPetStatus(prev => {
      const isEquipped = prev.equippedAccessories.includes(itemId);
      const nextEquipped = isEquipped
        ? prev.equippedAccessories.filter(id => id !== itemId)
        : [...prev.equippedAccessories, itemId];

      return {
        ...prev,
        equippedAccessories: nextEquipped
      };
    });
    showToast("Accessory configuration updated!");
  };

  const handleEquipBackground = (bgId: string | null) => {
    setPetStatus(prev => ({
      ...prev,
      equippedBackground: prev.equippedBackground === bgId ? null : bgId
    }));
    showToast("Room background updated!");
  };

  // --- Change Pet Character ---
  const handleSelectPet = (pet: typeof DEFAULT_PETS[0]) => {
    setPetStatus(prev => ({
      ...prev,
      type: pet.type,
      name: pet.name
    }));
    pushFeedMessage(`✨ Your new Study Buddy is ${pet.name}!`);
    showToast(`Meet ${pet.name}!`);
  };

  // --- Fetch Study Plan via API ---
  const generateAIPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plannerSubjects.trim()) {
      showToast("Please list some subjects first!", "warn");
      return;
    }

    setPlannerLoading(true);
    try {
      const response = await fetch("/api/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjects: plannerSubjects,
          hoursPerDay: plannerHours,
          durationDays: plannerDays,
          distractions: distractApps
        })
      });

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }

      const data = await response.json();
      
      // Transform tasks into structured Task objects
      const structuredMilestones: Milestone[] = data.milestones.map((m: any) => ({
        ...m,
        tasks: m.tasks.map((tText: string, idx: number) => ({
          id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 5)}-${idx}`,
          text: tText,
          completed: false
        }))
      }));

      setStudyPlan({
        planTitle: data.planTitle,
        summary: data.summary,
        milestones: structuredMilestones,
        customTips: data.customTips
      });

      pushFeedMessage(`🎯 AI Study Plan generated! Let's conquer "${data.planTitle}"!`);
      showToast("AI Study Plan Created!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to generate study plan. Please try again.", "warn");
    } finally {
      setPlannerLoading(false);
    }
  };

  // --- Toggle Planner Task Completion ---
  const toggleTask = (milestoneIndex: number, taskIndex: number) => {
    if (!studyPlan) return;

    const nextPlan = { ...studyPlan };
    const task = nextPlan.milestones[milestoneIndex].tasks[taskIndex];
    task.completed = !task.completed;

    setStudyPlan(nextPlan);

    if (task.completed) {
      // Award points
      addXPAndCoins(10, 5);
      pushFeedMessage(`✅ Completed task: "${task.text}"! Earned +5 Coins / +10 XP.`);
      showToast("Task Complete! +5 Coins 🪙", "success");
    } else {
      // Deduct points slightly or do nothing
      setPetStatus(prev => ({
        ...prev,
        coins: Math.max(0, prev.coins - 5),
        xp: Math.max(0, prev.xp - 10)
      }));
    }
  };

  // --- Fetch Quiz via API ---
  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTopic.trim()) {
      showToast("Please enter a study topic!", "warn");
      return;
    }

    setQuizLoading(true);
    setActiveQuiz(null);
    setQuizComplete(false);
    setQuizScore(0);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setQuizSubmitted(false);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: quizTopic,
          resourceText: quizResourceText,
          numQuestions: quizNumQs
        })
      });

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }

      const data = await response.json();
      setActiveQuiz(data);
      pushFeedMessage(`📝 Custom Quiz path unlocked: "${data.quizTitle}"!`);
      showToast("Quiz Generated!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to generate quiz. Please try again.", "warn");
    } finally {
      setQuizLoading(false);
    }
  };

  // --- Quiz Submission Answers ---
  const handleAnswerSubmit = () => {
    if (selectedOptionIndex === null || !activeQuiz) return;

    setQuizSubmitted(true);
    const question = activeQuiz.questions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === question.correctOptionIndex;

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      // Reward
      addXPAndCoins(30, 15);
      pushFeedMessage(`✨ Correct answer on Question ${currentQuestionIndex + 1}! Earned +15 Coins / +30 XP!`);
      showToast("Correct! +15 Coins! 🪙", "success");
    } else {
      pushFeedMessage(`❌ Question ${currentQuestionIndex + 1} incorrect. Check the explanation below!`);
      showToast("Incorrect answer.", "warn");
    }
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;

    if (currentQuestionIndex + 1 < activeQuiz.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setQuizSubmitted(false);
    } else {
      // Quiz complete
      setQuizComplete(true);
      pushFeedMessage(`🏆 Quiz complete! You scored ${quizScore}/${activeQuiz.questions.length} on "${activeQuiz.quizTitle}".`);
    }
  };

  // --- Add Distraction Target ---
  const handleAddDistractApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAppName.trim() && !distractApps.includes(customAppName.trim())) {
      setDistractApps(prev => [...prev, customAppName.trim()]);
      setCustomAppName('');
      showToast(`Added block target: ${customAppName}`);
    }
  };

  const handleRemoveDistractApp = (appName: string) => {
    setDistractApps(prev => prev.filter(app => app !== appName));
    showToast(`Removed block target: ${appName}`);
  };

  // --- Reset All App State ---
  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all your study pet levels, coins, plans, and history? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Helper variables for timer percentage
  const timerPercentage = timerTotal > 0 ? (timeLeft / timerTotal) * 100 : 0;
  const formattedTime = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;

  // Find active room background styling
  const equippedBgItem = SHOP_ITEMS.find(item => item.id === petStatus.equippedBackground);
  const getRoomBackgroundClass = () => {
    if (!equippedBgItem) return 'bg-gradient-to-b from-sky-50 via-indigo-50 to-white border-sky-100';
    if (equippedBgItem.id === 'bg_library') return 'bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-950 border-amber-900/30 text-amber-100';
    if (equippedBgItem.id === 'bg_forest') return 'bg-gradient-to-b from-slate-900 via-emerald-950/40 to-slate-950 border-emerald-900/30 text-emerald-100';
    if (equippedBgItem.id === 'bg_bedroom') return 'bg-gradient-to-b from-slate-900 via-purple-950/40 to-slate-950 border-purple-900/30 text-purple-100';
    if (equippedBgItem.id === 'bg_space') return 'bg-gradient-to-b from-slate-950 via-sky-950/40 to-slate-950 border-sky-900/30 text-sky-100';
    return 'bg-slate-100';
  };

  const isDarkBg = !!equippedBgItem;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-500 selection:text-white flex flex-col">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notifToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 shadow-xl rounded-2xl px-6 py-3 flex items-center gap-3 font-semibold text-sm border ${
              notifToast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-100' :
              notifToast.type === 'warn' ? 'bg-rose-50 text-rose-800 border-rose-200 shadow-rose-100' :
              'bg-blue-50 text-blue-800 border-blue-200 shadow-blue-100'
            }`}
          >
            {notifToast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            {notifToast.type === 'warn' && <AlertTriangle className="w-5 h-5 text-rose-500" />}
            {notifToast.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
            <span>{notifToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Main Navigation Header --- */}
      <header className="bg-white/80 border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-opacity-95 text-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-100">
              B
            </div>
            <div>
              <h1 className="font-display font-black text-xl tracking-tight text-slate-900 flex items-center gap-2">
                StudyBuddy AI <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full font-sans font-bold">PRO</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Achieve study goals & nurture your companion</p>
            </div>
          </div>

          {/* Core Player Stats */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80">
            {/* Level & XP */}
            <div className="px-3.5 py-1.5 rounded-xl bg-white flex items-center gap-2 border border-slate-200 shadow-sm">
              <Award className="w-4 h-4 text-indigo-500" />
              <div className="text-left leading-none">
                <span className="text-[10px] text-slate-400 block font-extrabold uppercase tracking-wider">LEVEL {petStatus.level}</span>
                <span className="text-xs font-mono font-bold text-slate-800">{petStatus.xp}/{petStatus.level * 100} <span className="text-[9px] text-slate-400 font-sans">XP</span></span>
              </div>
            </div>

            {/* Daily Streak */}
            <div className="px-3.5 py-1.5 rounded-xl bg-orange-50 border border-orange-100 flex items-center gap-2 shadow-sm">
              <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
              <div className="text-left leading-none">
                <span className="text-[10px] text-orange-500 block font-extrabold uppercase tracking-wider">STREAK</span>
                <span className="text-xs font-mono font-bold text-orange-700">{streak} <span className="text-[9px] text-orange-500 font-sans">DAYS</span></span>
              </div>
            </div>

            {/* Study Coins */}
            <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-2 shadow-sm">
              <span className="text-sm">💎</span>
              <div className="text-left leading-none">
                <span className="text-[10px] text-blue-500 block font-extrabold uppercase tracking-wider">CARROTS</span>
                <span className="text-xs font-mono font-black text-blue-700">{petStatus.coins}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Dashboard Container --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= LEFT SIDEBAR: PET COMPANION ROOM & CHATTER ================= */}
        <section className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Pet Play Room Display */}
          <div className={`relative overflow-hidden rounded-[40px] border border-slate-200/80 shadow-md transition-all duration-300 flex flex-col ${getRoomBackgroundClass()}`}>
            
            {/* Header within Pet space */}
            <div className="p-5 z-10 flex items-center justify-between bg-white/40 backdrop-blur-xs border-b border-slate-200/20">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🐾</span>
                <div>
                  <h3 className={`font-display font-bold text-base ${isDarkBg ? 'text-white' : 'text-slate-800'}`}>
                    {petStatus.name}'s Room
                  </h3>
                  <p className={`text-xs ${isDarkBg ? 'text-slate-300' : 'text-slate-500'}`}>
                    State: <span className="capitalize font-bold text-blue-600">{petActionState}</span>
                  </p>
                </div>
              </div>

              {/* Reset App Trigger in top right */}
              <button 
                onClick={handleResetData}
                className="p-1.5 rounded-lg bg-slate-950/20 hover:bg-slate-950/40 border border-slate-800/10 hover:border-slate-800/30 text-xs text-slate-500 transition-all flex items-center gap-1.5"
                title="Reset all study data and start over"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            {/* Interactive Room Canvas */}
            <div className="h-64 flex items-center justify-center relative p-6">
              {/* Floating sparks or indicators if studying */}
              {petActionState === 'studying' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <motion.div animate={{ y: [-10, 10, -10], opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute top-10 left-1/4 text-sky-400 text-lg">💡</motion.div>
                  <motion.div animate={{ y: [10, -10, 10], opacity: [0.2, 0.7, 0.2] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute top-16 right-1/4 text-sky-400 text-lg">📚</motion.div>
                </div>
              )}
              {petActionState === 'sleeping' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <motion.div animate={{ y: [0, -15, 0], x: [0, 5, 0], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute top-12 right-1/3 text-purple-400 font-mono font-bold text-sm">Zzz</motion.div>
                  <motion.div animate={{ y: [0, -20, 0], x: [0, -5, 0], opacity: [0, 0.8, 0] }} transition={{ repeat: Infinity, duration: 3.5, delay: 1 }} className="absolute top-8 right-1/4 text-purple-400 font-mono font-bold text-xs">Zz</motion.div>
                </div>
              )}

              {/* The Live Interactive Avatar */}
              <div className="w-48 h-48 flex items-center justify-center">
                <PetVisual 
                  type={petStatus.type} 
                  state={petActionState} 
                  equippedAccessories={petStatus.equippedAccessories}
                  hunger={petStatus.hunger}
                />
              </div>

              {/* Foreground Shelf / Floor design */}
              <div className={`absolute bottom-0 left-0 right-0 h-4 border-t ${isDarkBg ? 'bg-slate-950/40 border-slate-800/30' : 'bg-slate-200/50 border-slate-300/40'}`} />
            </div>

            {/* Interactive Room Footer with Hunger Status & Pet Picker */}
            <div className={`p-5 border-t z-10 ${isDarkBg ? 'bg-slate-900/95 border-slate-800/60 text-slate-100' : 'bg-white border-slate-200'}`}>
              
              {/* Pet Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Hunger Meter */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> Pet Hunger
                    </span>
                    <span className={petStatus.hunger < 35 ? 'text-rose-500 font-extrabold' : 'text-slate-600'}>
                      {petStatus.hunger}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        petStatus.hunger < 35 ? 'bg-rose-500' :
                        petStatus.hunger < 60 ? 'bg-amber-500' :
                        'bg-emerald-500'
                      }`}
                      style={{ width: `${petStatus.hunger}%` }}
                    />
                  </div>
                </div>

                {/* Level Progress */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                    <span className="text-slate-500">XP Progress</span>
                    <span className="text-slate-600">{Math.round((petStatus.xp / (petStatus.level * 100)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${(petStatus.xp / (petStatus.level * 100)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Pet character quick switcher */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-2">Switch Study Companion:</span>
                <div className="flex gap-2">
                  {DEFAULT_PETS.map((pet) => (
                    <button
                      key={pet.type}
                      onClick={() => handleSelectPet(pet)}
                      className={`flex-1 py-1 px-2 text-sm rounded-xl border transition-all flex items-center justify-center gap-1 font-bold ${
                        petStatus.type === pet.type
                          ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500'
                      }`}
                      title={pet.desc}
                    >
                      <span>{pet.icon}</span>
                      <span className="text-[11px] hidden sm:inline">{pet.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* --- Interactive Pet Dialogue Feed & Study Journal --- */}
          <div className="bg-white border border-slate-200 rounded-[32px] p-5 flex flex-col h-[280px] shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3.5">
              <span className="font-display font-black text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                💬 Companion Logs & Feed
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Message Feed list */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
              {feedMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`text-xs p-3 rounded-2xl transition-all ${
                    index === 0 
                      ? 'bg-blue-50/80 text-blue-800 border-l-4 border-blue-600 font-medium shadow-xs shadow-blue-100/50' 
                      : 'text-slate-500 bg-slate-50 border border-slate-100'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm">💬</span>
                    <p className="leading-relaxed font-sans">{msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= RIGHT BENTO CONTENT PANEL ================= */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Menu Navigation Tabs (Notion style) */}
          <nav className="bg-white p-1.5 rounded-2xl border border-slate-200 grid grid-cols-4 gap-1.5 shadow-xs">
            <button
              onClick={() => { setCurrentTab('pet'); setPetActionState('idle'); }}
              className={`py-2.5 px-2 text-xs md:text-sm font-bold rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                currentTab === 'pet'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pet Shop</span>
            </button>

            <button
              onClick={() => setCurrentTab('timer')}
              className={`py-2.5 px-2 text-xs md:text-sm font-bold rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                currentTab === 'timer'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Study Timer</span>
            </button>

            <button
              onClick={() => setCurrentTab('planner')}
              className={`py-2.5 px-2 text-xs md:text-sm font-bold rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                currentTab === 'planner'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>AI Planner</span>
            </button>

            <button
              onClick={() => setCurrentTab('quiz')}
              className={`py-2.5 px-2 text-xs md:text-sm font-bold rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                currentTab === 'quiz'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Goal Quizzes</span>
            </button>
          </nav>

          {/* ================= TAB CONTENT VIEWPORTS ================= */}
          <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm min-h-[460px] flex flex-col justify-between text-slate-800">
            
            {/* 1. PET SHOP TAB */}
            {currentTab === 'pet' && (
              <div className="flex-1 flex flex-col gap-5">
                
                {/* Shop Category Tabs */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="font-display font-black text-lg text-slate-900">Buddy Shop & Inventory</h2>
                    <p className="text-xs text-slate-500 font-medium">Buy treats or accessories to boost your pet's mood</p>
                  </div>
                  <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                    {(['all', 'food', 'accessory', 'background'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setShopCategory(cat)}
                        className={`text-xs px-3 py-1.5 rounded-lg capitalize font-bold transition-all ${
                          shopCategory === cat
                            ? 'bg-white text-blue-600 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Inventory Catalog */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
                  {SHOP_ITEMS.filter(item => shopCategory === 'all' || item.type === shopCategory).map((item) => {
                    const isPurchased = purchasedItems.includes(item.id);
                    const isEquipped = petStatus.equippedAccessories.includes(item.id) || petStatus.equippedBackground === item.id;
                    
                    return (
                      <div 
                        key={item.id} 
                        className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                          isEquipped 
                            ? 'border-blue-300 bg-blue-50/50 shadow-xs' 
                            : isPurchased 
                              ? 'border-slate-200 bg-slate-50/80' 
                              : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Item Icon */}
                        <div className="text-3xl bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-center">
                          {item.emoji}
                        </div>

                        {/* Item Info */}
                        <div className="flex-1 text-left leading-snug">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold text-sm text-slate-800">{item.name}</span>
                            <span className="text-[10px] bg-slate-200/60 text-slate-600 px-2.5 py-0.5 rounded-full capitalize font-bold tracking-wide">
                              {item.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mb-2">{item.description}</p>
                          
                          {/* Buy / Equip Button */}
                          <div className="flex items-center justify-between mt-auto pt-1">
                            {/* Price */}
                            {item.type === 'food' || !isPurchased ? (
                              <span className="text-xs font-mono font-bold text-amber-600 flex items-center gap-1">
                                🪙 {item.price} carrots
                              </span>
                            ) : (
                              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                                Owned ✔
                              </span>
                            )}

                            {/* Action Button */}
                            {item.type === 'food' ? (
                              <button
                                onClick={() => handlePurchase(item)}
                                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1 shadow-md shadow-amber-100"
                              >
                                Buy & Feed 😋
                              </button>
                            ) : isPurchased ? (
                              <button
                                onClick={() => {
                                  if (item.type === 'accessory') {
                                    handleEquipAccessory(item.id);
                                  } else {
                                    handleEquipBackground(item.id);
                                  }
                                }}
                                className={`px-3 py-1.5 font-bold rounded-xl text-xs transition-all border ${
                                  isEquipped 
                                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-md shadow-blue-100'
                                }`}
                              >
                                {isEquipped ? 'Unequip' : 'Equip 👓'}
                              </button>
                            ) : (
                              <button
                                onClick={() => handlePurchase(item)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-100"
                              >
                                Purchase 🛒
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. STUDY TIMER TAB */}
            {currentTab === 'timer' && (
              <div className="flex-1 flex flex-col gap-5">
                
                {/* Header */}
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="font-display font-black text-lg text-slate-900">Interactive Study Clock</h2>
                  <p className="text-xs text-slate-500 font-medium">Lock distractions and earn rewards by completing focus sessions</p>
                </div>

                {/* Distraction Alert Panel */}
                {distractionWarning && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-[20px] flex items-start gap-3 text-left">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-red-800">Session Interrupted!</h4>
                      <p className="text-xs text-red-700 leading-normal font-medium">{distractionWarning}</p>
                      <button 
                        onClick={() => setDistractionWarning(null)} 
                        className="text-xs font-bold text-red-600 hover:text-red-800 underline mt-1.5 block"
                      >
                        Acknowledge & Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* Timer Body Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4">
                  
                  {/* Left Column: Big Visual Clock */}
                  <div className="flex flex-col items-center justify-center p-4">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      
                      {/* SVG Ring Background & Progress */}
                      <svg className="w-full h-full transform -rotate-90">
                        {/* Static Background circle */}
                        <circle
                          cx="96"
                          cy="96"
                          r="86"
                          stroke="#F1F5F9"
                          strokeWidth="10"
                          fill="transparent"
                        />
                        {/* Active moving circle */}
                        <motion.circle
                          cx="96"
                          cy="96"
                          r="86"
                          stroke={isBreak ? '#10B981' : '#2563EB'}
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 86}
                          animate={{ strokeDashoffset: (2 * Math.PI * 86) * (1 - timerPercentage / 100) }}
                          transition={{ duration: 0.5, ease: "linear" }}
                        />
                      </svg>

                      {/* Absolute Center text */}
                      <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-mono font-black text-slate-850 tracking-tight">
                          {formattedTime}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold mt-1">
                          {isBreak ? 'Break Timer' : 'Study Timer'}
                        </span>
                      </div>
                    </div>

                    {/* Timer controls */}
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => {
                          setTimerRunning(!timerRunning);
                          setPetActionState(timerRunning ? 'idle' : isBreak ? 'sleeping' : 'studying');
                        }}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-md ${
                          timerRunning 
                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100'
                        }`}
                      >
                        {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {timerRunning ? 'Pause Session' : 'Start Session'}
                      </button>

                      <button
                        onClick={() => {
                          setTimerRunning(false);
                          setTimeLeft(timerTotal);
                          setPetActionState('idle');
                        }}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all shadow-xs"
                        title="Reset countdown"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Timer Presets & Distraction blocker config */}
                  <div className="flex flex-col gap-4 text-left">
                    
                    {/* Presets */}
                    <div>
                      <span className="text-[10px] uppercase font-black text-slate-400 block mb-1.5 tracking-wider">Session Types:</span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Pomodoro (25m)', secs: 25 * 60, break: false },
                          { label: 'Deep Focus (45m)', secs: 45 * 60, break: false },
                          { label: 'Short Break (5m)', secs: 5 * 60, break: true },
                          { label: 'Long Break (15m)', secs: 15 * 60, break: true }
                        ].map((preset, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setTimerRunning(false);
                              setIsBreak(preset.break);
                              setTimeLeft(preset.secs);
                              setTimerTotal(preset.secs);
                              setPetActionState('idle');
                              showToast(`Loaded ${preset.label}`);
                            }}
                            className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                              timerTotal === preset.secs && isBreak === preset.break
                                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Distraction Blocker Config */}
                    <div className="p-4 bg-slate-50 rounded-[24px] border border-slate-200/60">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            🛑 Distraction Blocker Shield
                          </h4>
                          <p className="text-[10px] text-slate-500">Leaving this tab pauses the clock & loses 2 carrots</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={distractionBlockActive} 
                            onChange={(e) => setDistractionBlockActive(e.target.checked)} 
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white" />
                        </label>
                      </div>

                      {/* Display apps listed */}
                      <div className="border-t border-slate-200 pt-2.5 mt-2.5">
                        <span className="text-[10px] uppercase font-black text-slate-400 block mb-1.5">Target Apps to Block:</span>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {distractApps.map((app) => (
                            <span 
                              key={app} 
                              className="text-[10px] bg-white text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1 font-bold shadow-xs"
                            >
                              {app}
                              <button 
                                onClick={() => handleRemoveDistractApp(app)} 
                                className="text-slate-400 hover:text-rose-500 ml-0.5 font-bold"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>

                        {/* Add app form */}
                        <form onSubmit={handleAddDistractApp} className="flex gap-1.5 mt-2">
                          <input
                            type="text"
                            placeholder="Add app (e.g. Instagram)"
                            value={customAppName}
                            onChange={(e) => setCustomAppName(e.target.value)}
                            className="flex-1 bg-white border border-slate-200 rounded-xl text-xs px-3 py-1.5 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                          <button 
                            type="submit"
                            className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>

                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* 3. AI PLANNER TAB */}
            {currentTab === 'planner' && (
              <div className="flex-1 flex flex-col gap-5">
                
                {/* Header */}
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-black text-lg text-slate-900">AI Subjects Planner</h2>
                    <p className="text-xs text-slate-500 font-medium">Generate structured milestone pathways from subjects</p>
                  </div>
                  {studyPlan && (
                    <button 
                      onClick={() => setStudyPlan(null)}
                      className="text-xs text-rose-500 hover:text-rose-700 font-bold hover:underline flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear Plan
                    </button>
                  )}
                </div>

                {/* Main Planner View or Input Form */}
                {!studyPlan ? (
                  <form onSubmit={generateAIPlan} className="space-y-4 text-left">
                    <div className="bg-slate-50 p-4 rounded-[24px] border border-slate-200/60 space-y-3.5">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          Which subjects do you need to study? <span className="text-blue-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Calculus derivative mechanics, Organic Chemistry aldehydes"
                          value={plannerSubjects}
                          onChange={(e) => setPlannerSubjects(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl text-xs p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1.5">
                            Hours Available Per Day:
                          </label>
                          <select
                            value={plannerHours}
                            onChange={(e) => setPlannerHours(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl text-xs p-2 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="1">1 hour / day</option>
                            <option value="2">2 hours / day</option>
                            <option value="3">3 hours / day</option>
                            <option value="5">5+ hours / day</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1.5">
                            Goal Timeline Duration:
                          </label>
                          <select
                            value={plannerDays}
                            onChange={(e) => setPlannerDays(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl text-xs p-2 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="3">3 Days (Sprint)</option>
                            <option value="5">5 Days (Standard)</option>
                            <option value="7">7 Days (Weekly)</option>
                            <option value="14">14 Days (Extended)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={plannerLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100"
                    >
                      {plannerLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Generating AI Study Pathway...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Create AI Customized Plan</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  // Render generated AI Study Plan
                  <div className="flex-1 overflow-y-auto max-h-[380px] space-y-4 pr-1 text-left">
                    {/* Header Summary */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      <h3 className="font-display font-bold text-sm text-blue-600 mb-1">
                        🎯 {studyPlan.planTitle}
                      </h3>
                      <p className="text-xs text-slate-600 leading-normal font-medium">{studyPlan.summary}</p>
                    </div>

                    {/* Milestones / Phases */}
                    <div className="space-y-3">
                      <span className="text-[10px] uppercase font-black text-slate-400 block mb-1 tracking-wider">Milestones Checklist:</span>
                      {studyPlan.milestones.map((milestone, mIdx) => (
                        <div key={mIdx} className="border border-slate-200 bg-white rounded-2xl p-4 shadow-xs">
                          <div className="flex items-start justify-between border-b border-slate-100 pb-2.5 mb-2.5">
                            <div>
                              <h4 className="text-xs font-bold text-slate-800">
                                Milestone {mIdx + 1}: {milestone.title}
                              </h4>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-medium">
                                {milestone.description}
                              </p>
                            </div>
                            <span className="text-[10px] text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-mono font-bold shrink-0">
                              ⏱️ {milestone.estimatedHours} hrs
                            </span>
                          </div>

                          {/* Action tasks checklist */}
                          <div className="space-y-2">
                            {milestone.tasks.map((task, tIdx) => (
                              <label 
                                key={task.id} 
                                className="flex items-start gap-2.5 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-all text-xs font-medium"
                              >
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => toggleTask(mIdx, tIdx)}
                                  className="w-4 h-4 accent-blue-600 rounded border-slate-300 text-blue-600 mt-0.5 cursor-pointer shrink-0"
                                />
                                <span className={`${task.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-700'}`}>
                                  {task.text}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI Custom Tips */}
                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                      <h4 className="text-xs font-bold text-blue-700 flex items-center gap-1.5 mb-2">
                        💡 AI Distraction Blocks & Focus Tips:
                      </h4>
                      <ul className="list-disc pl-4 space-y-1.5 text-xs text-blue-800 leading-normal font-medium">
                        {studyPlan.customTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* 4. GOAL QUIZZES TAB */}
            {currentTab === 'quiz' && (
              <div className="flex-1 flex flex-col gap-5">
                
                {/* Header */}
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-black text-lg text-slate-900">Interactive Assessment Paths</h2>
                    <p className="text-xs text-slate-500 font-medium">Generate smart quizzes based on your custom notes or general topics</p>
                  </div>
                  {activeQuiz && (
                    <button 
                      onClick={() => setActiveQuiz(null)}
                      className="text-xs text-rose-500 hover:text-rose-700 font-bold hover:underline flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Close Quiz
                    </button>
                  )}
                </div>

                {/* Form generator view */}
                {!activeQuiz ? (
                  <form onSubmit={handleGenerateQuiz} className="space-y-4 text-left">
                    <div className="bg-slate-50 p-4 rounded-[24px] border border-slate-200/60 space-y-3.5">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          What is the quiz topic? <span className="text-blue-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. photosynthesis dark reactions, Newton's third law"
                          value={quizTopic}
                          onChange={(e) => setQuizTopic(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl text-xs p-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-slate-700">
                            Provide study resources/notes (Optional):
                          </label>
                          <span className="text-[10px] text-slate-400 font-bold">Copy paste notes here</span>
                        </div>
                        <textarea
                          placeholder="Paste lecture notes, definitions, or textbook extracts. AI will craft custom assessment questions targeting this specific material!"
                          value={quizResourceText}
                          onChange={(e) => setQuizResourceText(e.target.value)}
                          className="w-full h-24 bg-white border border-slate-200 rounded-xl text-xs p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none font-sans leading-normal"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          Number of questions:
                        </label>
                        <select
                          value={quizNumQs}
                          onChange={(e) => setQuizNumQs(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-xl text-xs p-2 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="3">3 Questions</option>
                          <option value="5">5 Questions</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={quizLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100"
                    >
                      {quizLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>AI is composing your custom assessment...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Generate Custom Assessment Quiz</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  // Active interactive quiz player
                  <div className="flex-1 flex flex-col justify-between text-left">
                    {!quizComplete ? (
                      <div className="space-y-4">
                        
                        {/* Quiz Title & Header Progress */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                            Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                          </span>
                          <span className="text-xs text-slate-500 font-mono font-bold">
                            Accrued: {quizScore} Correct
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
                          />
                        </div>

                        {/* Question Text */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                          <p className="text-xs md:text-sm font-bold text-slate-850 leading-relaxed">
                            {activeQuiz.questions[currentQuestionIndex].questionText}
                          </p>
                        </div>

                        {/* Multiple Choice Options */}
                        <div className="space-y-2">
                          {activeQuiz.questions[currentQuestionIndex].options.map((option, idx) => {
                            const isCorrect = idx === activeQuiz.questions[currentQuestionIndex].correctOptionIndex;
                            const isSelected = idx === selectedOptionIndex;

                            return (
                              <button
                                key={idx}
                                disabled={quizSubmitted}
                                onClick={() => setSelectedOptionIndex(idx)}
                                className={`w-full p-3.5 text-left text-xs font-bold rounded-xl border transition-all flex items-start gap-2.5 ${
                                  quizSubmitted
                                    ? isCorrect
                                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                                      : isSelected
                                        ? 'border-rose-300 bg-rose-50 text-rose-800'
                                        : 'border-slate-100 text-slate-400'
                                    : isSelected
                                      ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-xs'
                                      : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                                }`}
                              >
                                {/* Circle selection indicator */}
                                <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                  isSelected ? 'border-blue-500 bg-blue-100' : 'border-slate-300'
                                }`}>
                                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                                </span>
                                <span>{option}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanations View */}
                        {quizSubmitted && (
                          <div className={`p-4 rounded-xl text-xs leading-normal font-medium ${
                            selectedOptionIndex === activeQuiz.questions[currentQuestionIndex].correctOptionIndex
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                              : 'bg-rose-50 text-rose-800 border border-rose-100'
                          }`}>
                            <span className="font-bold block mb-1">
                              {selectedOptionIndex === activeQuiz.questions[currentQuestionIndex].correctOptionIndex 
                                ? '🎉 Correct!' 
                                : '❌ Incorrect.'}
                            </span>
                            <p>{activeQuiz.questions[currentQuestionIndex].explanation}</p>
                          </div>
                        )}

                        {/* Footer controllers */}
                        <div className="pt-2 flex justify-end">
                          {!quizSubmitted ? (
                            <button
                              disabled={selectedOptionIndex === null}
                              onClick={handleAnswerSubmit}
                              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 font-bold rounded-xl text-xs transition-all flex items-center gap-1 shadow-md shadow-blue-100"
                            >
                              Verify Answer <Check className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={handleNextQuestion}
                              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-blue-100"
                            >
                              {currentQuestionIndex + 1 < activeQuiz.questions.length ? 'Next Question' : 'Complete Assessment'}
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                      </div>
                    ) : (
                      // Final Quiz score report card
                      <div className="py-8 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-full w-20 h-20 flex items-center justify-center">
                          <Award className="w-10 h-10 text-yellow-500 animate-bounce" />
                        </div>
                        <div>
                          <h3 className="font-display font-black text-xl text-slate-900">Quiz Finished!</h3>
                          <p className="text-xs text-slate-500 mt-1 font-medium">Outstanding effort! Your study pet is very proud of you.</p>
                        </div>
                        <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-200 font-mono">
                          <span className="text-slate-400 uppercase text-[10px] block font-extrabold tracking-wider">Final Score</span>
                          <span className="text-2xl font-black text-blue-600">{quizScore} / {activeQuiz.questions.length}</span>
                        </div>
                        <div className="text-xs text-slate-600 leading-normal max-w-sm font-medium">
                          {quizScore === activeQuiz.questions.length 
                            ? "🏆 Absolute Perfection! You secured 100% and earned full study carrots."
                            : "🌟 Great job! Complete more focused reading cycles to achieve a perfect score next time."}
                        </div>
                        <button
                          onClick={() => {
                            setActiveQuiz(null);
                            setQuizTopic('');
                          }}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-100 text-white"
                        >
                          Back to Quizzes
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* Footer indicators inside tabs panel */}
            <div className="mt-5 border-t border-slate-100 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-400 font-bold">
              <span className="flex items-center gap-1">
                📌 Earn <span className="text-amber-500 font-extrabold">Carrots</span> by finishing timers, tasks, and quizzes.
              </span>
              <span className="font-mono">
                Buddy State: {petStatus.name} is Level {petStatus.level}
              </span>
            </div>

          </div>

          {/* --- Recent Activity Logs / Stat cards --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Quick Stat info */}
            <div className="bg-white border border-slate-200/60 rounded-[28px] p-4.5 text-left flex flex-col justify-between min-h-[130px] shadow-xs">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  📈 Accumulation Analytics
                </h4>
                <p className="text-[10px] text-slate-400 font-bold">Overview of your productivity sessions</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Focus Cycles</span>
                  <span className="text-xs font-mono font-black text-slate-800">
                    {studyLogs.length} blocks
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Total Mins</span>
                  <span className="text-xs font-mono font-black text-slate-800">
                    {studyLogs.reduce((sum, log) => sum + log.durationMinutes, 0)} mins
                  </span>
                </div>
              </div>
            </div>

            {/* Recent History log */}
            <div className="bg-white border border-slate-200/60 rounded-[28px] p-4.5 text-left flex flex-col justify-between min-h-[130px] shadow-xs">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                📋 Recent Focus History
              </h4>
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[85px] scrollbar-thin scrollbar-thumb-slate-100">
                {studyLogs.length === 0 ? (
                  <span className="text-xs text-slate-400 font-medium block mt-1">No completed focus cycles yet.</span>
                ) : (
                  studyLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium">
                      <span className="truncate text-slate-700 max-w-[140px] font-bold">⏱️ {log.subjects}</span>
                      <span className="text-slate-500 shrink-0 font-mono font-bold">+{log.durationMinutes}m (+{log.coinsEarned}🥕)</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </section>

      </main>

      {/* --- Page footer credits --- */}
      <footer className="mt-auto bg-white py-5 border-t border-slate-200/80 text-center text-xs text-slate-400 font-medium shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 AI Study Buddy. Designed for students inspired by Study Bunny, Duolingo, & Notion.</p>
          <div className="flex gap-4">
            <span className="text-[11px]">Designed with Vibrant Palette theme</span>
            <span className="text-slate-200">|</span>
            <span className="text-[11px]">Powered by Gemini API</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
