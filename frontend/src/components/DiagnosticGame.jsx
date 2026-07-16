import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, ChevronRight, ChevronLeft, Sparkles, Trophy, Zap } from 'lucide-react';

/**
 * DiagnosticGame — A Duolingo-inspired step-by-step quiz experience
 * 
 * Props:
 *   questions: Array<{ id, text, subject, marks, options, correct }>
 *   standard: string - the student's grade level
 *   onComplete: (scores) => void - callback when quiz is submitted
 */
export default function DiagnosticGame({ questions = [], standard = '', onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [slideDir, setSlideDir] = useState('right'); // 'left' or 'right' for transition direction
  const [animating, setAnimating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [streak, setStreak] = useState(0);

  const totalQuestions = questions.length;
  const currentQ = questions[currentStep];
  const answeredCount = Object.keys(answers).filter(k => answers[k] !== '').length;
  const progress = totalQuestions > 0 ? Math.round((currentStep / totalQuestions) * 100) : 0;

  const handleSelectOption = useCallback((option) => {
    if (showFeedback || animating) return;

    setAnswers(prev => ({ ...prev, [currentQ.id]: option }));
    setShowFeedback(true);
    const isCorrect = option === currentQ.correct;
    setFeedbackCorrect(isCorrect);

    if (isCorrect) {
      setXpEarned(prev => prev + (currentQ.marks * 10));
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  }, [currentQ, showFeedback, animating]);

  const goNext = useCallback(() => {
    if (animating) return;
    if (currentStep < totalQuestions - 1) {
      setAnimating(true);
      setSlideDir('right');
      setShowFeedback(false);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setAnimating(false);
      }, 300);
    }
  }, [currentStep, totalQuestions, animating]);

  const goPrev = useCallback(() => {
    if (animating || currentStep === 0) return;
    setAnimating(true);
    setSlideDir('left');
    setShowFeedback(false);
    setTimeout(() => {
      setCurrentStep(prev => prev - 1);
      setAnimating(false);
    }, 300);
  }, [currentStep, animating]);

  const handleSubmit = useCallback(() => {
    let mathScore = 0, scienceScore = 0, mathTotal = 0, scienceTotal = 0;
    questions.forEach(q => {
      const isCorrect = answers[q.id] === q.correct;
      const pts = isCorrect ? q.marks : 0;
      if (q.subject === 'Mathematics') { mathScore += pts; mathTotal += q.marks; }
      else if (q.subject === 'Science') { scienceScore += pts; scienceTotal += q.marks; }
    });
    const scores = {
      Mathematics: Math.round((mathScore / mathTotal) * 100) || 0,
      Science: Math.round((scienceScore / scienceTotal) * 100) || 0,
      mathMarksText: `${mathScore}/${mathTotal}`,
      scienceMarksText: `${scienceScore}/${scienceTotal}`,
      totalMarksText: `${mathScore + scienceScore}/${mathTotal + scienceTotal}`
    };
    setCompleted(true);
    setTimeout(() => {
      onComplete?.(scores, answers);
    }, 2500);
  }, [questions, answers, onComplete]);

  const allAnswered = questions.every(q => answers[q.id] !== undefined && answers[q.id] !== '');
  const isLastQuestion = currentStep === totalQuestions - 1;

  // Completion celebration screen
  if (completed) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 space-y-6 animate-fade-in diagnostic-game-card">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 animate-bounce">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-white text-[10px] font-black border-2 border-white shadow-lg">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-800">Test Complete! 🎉</h2>
        <p className="text-sm text-slate-500 font-semibold">You earned <span className="text-emerald-600 font-black">{xpEarned} XP</span> from this placement test</p>
        <div className="flex items-center justify-center gap-4">
          <div className="bg-blue-50 border border-blue-100 px-4 py-2.5 rounded-2xl">
            <span className="text-[9px] text-blue-500 font-bold block uppercase">Questions</span>
            <span className="text-lg font-black text-blue-700">{totalQuestions}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-2xl">
            <span className="text-[9px] text-emerald-500 font-bold block uppercase">Correct</span>
            <span className="text-lg font-black text-emerald-700">{Object.entries(answers).filter(([id, ans]) => { const q = questions.find(q => q.id === id); return q && ans === q.correct; }).length}</span>
          </div>
          <div className="bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-2xl">
            <span className="text-[9px] text-amber-500 font-bold block uppercase">XP Earned</span>
            <span className="text-lg font-black text-amber-700">{xpEarned}</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-xs text-slate-400 font-bold">Setting up your personalized learning path...</span>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  const selectedAnswer = answers[currentQ.id];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden no-glass diagnostic-game-card">
      {/* Top Progress Bar */}
      <div className="h-2 bg-slate-100 relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${Math.round(((currentStep + (showFeedback ? 1 : 0)) / totalQuestions) * 100)}%` }}
        />
      </div>

      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-black text-slate-800">Placement Test</h3>
            <p className="text-[10px] text-slate-400 font-bold">Calibrated for {standard} Level</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* XP Counter */}
          <div className="bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] font-black text-amber-700">{xpEarned} XP</span>
          </div>

          {/* Streak */}
          {streak >= 2 && (
            <div className="bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-xl flex items-center gap-1 animate-bounce">
              <span className="text-[10px] font-black text-orange-600">🔥 {streak} streak!</span>
            </div>
          )}

          {/* Step indicator */}
          <div className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl">
            <span className="text-[10px] font-black text-slate-500">{currentStep + 1}/{totalQuestions}</span>
          </div>
        </div>
      </div>

      {/* Step Indicator Dots */}
      <div className="px-6 pb-4 flex items-center gap-1.5">
        {questions.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx < currentStep
                ? (answers[questions[idx].id] === questions[idx].correct
                    ? 'bg-emerald-400 flex-grow'
                    : 'bg-rose-400 flex-grow')
                : idx === currentStep
                ? 'bg-blue-500 flex-grow-[2]'
                : 'bg-slate-200 flex-grow'
            }`}
          />
        ))}
      </div>

      {/* Question Card */}
      <div className={`px-6 pb-2 transition-all duration-300 ${animating ? (slideDir === 'right' ? 'opacity-0 translate-x-8' : 'opacity-0 -translate-x-8') : 'opacity-100 translate-x-0'}`}>
        {/* Subject + Marks badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
            {currentQ.subject} • {currentQ.marks} Marks
          </span>
        </div>

        {/* Question text */}
        <h4 className="text-base font-black text-slate-800 leading-relaxed text-left mb-5">
          {currentQ.text}
        </h4>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = selectedAnswer === opt;
            const isCorrectOpt = opt === currentQ.correct;
            const showResult = showFeedback && isSelected;

            let optionClasses = 'diagnostic-option-btn text-left text-xs font-semibold py-3.5 px-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 group';

            if (showFeedback) {
              if (isCorrectOpt) {
                optionClasses += ' bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm shadow-emerald-500/10';
              } else if (isSelected && !isCorrectOpt) {
                optionClasses += ' bg-rose-50 text-rose-600 border-rose-300 shadow-sm shadow-rose-500/10';
              } else {
                optionClasses += ' bg-white text-slate-400 border-slate-100 opacity-60';
              }
            } else if (isSelected) {
              optionClasses += ' selected bg-blue-50 text-blue-700 border-blue-400 shadow-sm shadow-blue-500/10';
            } else {
              optionClasses += ' bg-white text-slate-600 border-slate-150 hover:bg-slate-50 hover:border-slate-300';
            }

            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelectOption(opt)}
                disabled={showFeedback}
                className={optionClasses}
              >
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 border transition-all ${
                  showFeedback && isCorrectOpt
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : showFeedback && isSelected && !isCorrectOpt
                    ? 'bg-rose-500 text-white border-rose-500'
                    : isSelected
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-slate-50 text-slate-400 border-slate-200 group-hover:bg-slate-100'
                }`}>
                  {showFeedback && isCorrectOpt ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                   showFeedback && isSelected && !isCorrectOpt ? <XCircle className="w-3.5 h-3.5" /> :
                   String.fromCharCode(65 + optIdx)}
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Banner */}
        {showFeedback && (
          <div className={`rounded-2xl px-4 py-3 flex items-center gap-3 mb-3 animate-slide-up ${
            feedbackCorrect
              ? 'bg-emerald-50 border border-emerald-200'
              : 'bg-rose-50 border border-rose-200'
          }`}>
            {feedbackCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div className="text-left">
                  <span className="text-xs font-black text-emerald-700">Correct! +{currentQ.marks * 10} XP</span>
                  {streak >= 2 && <span className="text-[10px] text-emerald-500 font-bold ml-2">🔥 {streak} in a row!</span>}
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <div className="text-left">
                  <span className="text-xs font-black text-rose-700">Not quite!</span>
                  <span className="text-[10px] text-rose-500 font-semibold ml-2">Correct: {currentQ.correct}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentStep === 0}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 ${
            currentStep === 0
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-500 hover:text-slate-800 hover:bg-white'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {showFeedback && !isLastQuestion && (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-blue-500/20 border-0 active:scale-95"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {isLastQuestion && allAnswered && (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-emerald-500/20 border-0 active:scale-95"
            >
              Complete Test
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}

          {!showFeedback && !allAnswered && (
            <span className="text-[10px] text-slate-400 font-bold">
              Select an answer to continue
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
