import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Target, CheckCircle2, Circle, Edit3, Save, X, Dumbbell, Brain, Heart, Briefcase } from 'lucide-react';

const defaultGoals = [
  {
    id: 1,
    title: "Ter um corpo estético e funcional",
    emoji: "💪",
    color: "from-orange-500 to-red-600",
    tasks: [
      { id: 1, name: "Treinos de Musculação", target: 200, current: 0 },
      { id: 2, name: "Treinos de Kickboxing", target: 120, current: 0 },
      { id: 3, name: "Treinos de Jiu-Jitsu", target: 120, current: 0 },
    ]
  },
  {
    id: 2,
    title: "Ficar mais inteligente",
    emoji: "🧠",
    color: "from-blue-500 to-cyan-600",
    tasks: [
      { id: 1, name: "Livros lidos", target: 24, current: 0 },
    ]
  },
  {
    id: 3,
    title: "Mais intimidade com Deus",
    emoji: "✝️",
    color: "from-purple-500 to-indigo-600",
    tasks: [
      { id: 1, name: "Capítulos da Bíblia lidos", target: 1189, current: 0 },
    ]
  },
  {
    id: 4,
    title: "Sair da minha parentela",
    emoji: "🚀",
    color: "from-green-500 to-emerald-600",
    tasks: [
      { id: 1, name: "Ofertas lançadas", target: 24, current: 0 },
      { id: 2, name: "Melhorar Oratória", target: 1, current: 0 },
      { id: 3, name: "Abrir Instagram Pro", target: 1, current: 0 },
    ]
  }
];

export default function GoalsApp() {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('metas2026LeonardoV2');
    return saved ? JSON.parse(saved) : defaultGoals;
  });
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newGoal, setNewGoal] = useState({ title: '', emoji: '🎯', color: 'from-blue-500 to-purple-600' });
  const [newTask, setNewTask] = useState({ name: '', target: 100 });

  useEffect(() => {
    localStorage.setItem('metas2026LeonardoV2', JSON.stringify(goals));
  }, [goals]);

  const colorOptions = [
    'from-orange-500 to-red-600',
    'from-blue-500 to-cyan-600',
    'from-purple-500 to-indigo-600',
    'from-green-500 to-emerald-600',
    'from-pink-500 to-rose-600',
    'from-yellow-500 to-orange-600',
    'from-indigo-500 to-blue-600',
    'from-cyan-500 to-teal-600',
  ];

  const emojiOptions = ['🎯', '💪', '🧠', '✝️', '🚀', '💰', '❤️', '🏆', '⭐', '🔥', '💎', '📚', '🙏', '💼'];

  const calculateGoalProgress = (goal) => {
    if (!goal.tasks.length) return 0;
    const totalProgress = goal.tasks.reduce((sum, task) => {
      return sum + (task.current / task.target) * 100;
    }, 0);
    return Math.round(totalProgress / goal.tasks.length);
  };

  const calculateOverallProgress = () => {
    if (!goals.length) return 0;
    const total = goals.reduce((sum, goal) => sum + calculateGoalProgress(goal), 0);
    return Math.round(total / goals.length);
  };

  const updateTaskProgress = (goalId, taskId, increment) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: goal.tasks.map(task => {
            if (task.id === taskId) {
              const newCurrent = Math.max(0, Math.min(task.target, task.current + increment));
              return { ...task, current: newCurrent };
            }
            return task;
          })
        };
      }
      return goal;
    }));
  };

  const setTaskProgress = (goalId, taskId, value) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: goal.tasks.map(task => {
            if (task.id === taskId) {
              const newCurrent = Math.max(0, Math.min(task.target, parseInt(value) || 0));
              return { ...task, current: newCurrent };
            }
            return task;
          })
        };
      }
      return goal;
    }));
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;
    const goal = {
      id: Date.now(),
      title: newGoal.title,
      emoji: newGoal.emoji,
      color: newGoal.color,
      tasks: []
    };
    setGoals([...goals, goal]);
    setNewGoal({ title: '', emoji: '🎯', color: 'from-blue-500 to-purple-600' });
    setShowAddGoal(false);
  };

  const deleteGoal = (goalId) => {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      setGoals(goals.filter(g => g.id !== goalId));
      setSelectedGoal(null);
    }
  };

  const addTask = () => {
    if (!newTask.name.trim() || !selectedGoal) return;
    const task = {
      id: Date.now(),
      name: newTask.name,
      target: parseInt(newTask.target) || 100,
      current: 0
    };
    setGoals(goals.map(goal => {
      if (goal.id === selectedGoal.id) {
        return { ...goal, tasks: [...goal.tasks, task] };
      }
      return goal;
    }));
    setNewTask({ name: '', target: 100 });
    setShowAddTask(false);
  };

  const deleteTask = (goalId, taskId) => {
    if (confirm('Excluir esta tarefa?')) {
      setGoals(goals.map(goal => {
        if (goal.id === goalId) {
          return { ...goal, tasks: goal.tasks.filter(t => t.id !== taskId) };
        }
        return goal;
      }));
    }
  };

  const resetAllData = () => {
    if (confirm('Isso vai resetar TODAS as suas metas e progresso. Continuar?')) {
      localStorage.removeItem('metas2026LeonardoV2');
      setGoals(defaultGoals);
      setSelectedGoal(null);
    }
  };

  const currentGoal = selectedGoal ? goals.find(g => g.id === selectedGoal.id) : null;

  // Home Screen - Goals List
  if (!selectedGoal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 pb-24">
        {/* Header */}
        <div className="text-center py-6 mb-2">
          <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            METAS 2026
          </h1>
          <p className="text-gray-400 mt-2">Foco total, Leonardo! 🔥</p>
          
          {/* Overall Progress */}
          <div className="mt-4 bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">Progresso Geral do Ano</span>
              <span className="text-2xl font-bold text-yellow-400">{calculateOverallProgress()}%</span>
            </div>
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all duration-700"
                style={{ width: `${calculateOverallProgress()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="space-y-4">
          {goals.map(goal => {
            const progress = calculateGoalProgress(goal);
            const completedTasks = goal.tasks.filter(t => t.current >= t.target).length;
            return (
              <div
                key={goal.id}
                onClick={() => setSelectedGoal(goal)}
                className={`bg-gradient-to-r ${goal.color} p-[2px] rounded-2xl cursor-pointer transform transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg`}
              >
                <div className="bg-gray-900/95 backdrop-blur rounded-2xl p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {goal.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg leading-tight">{goal.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {completedTasks}/{goal.tasks.length} tarefas completas
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black">{progress}%</span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${goal.color} transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent">
          <div className="flex gap-3 max-w-lg mx-auto">
            <button
              onClick={resetAllData}
              className="flex-1 bg-gray-800 border border-gray-700 text-gray-400 font-medium py-3 rounded-xl active:scale-[0.98] transition-transform"
            >
              Resetar
            </button>
            <button
              onClick={() => setShowAddGoal(true)}
              className="flex-[2] bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-orange-500/30"
            >
              <Plus className="w-5 h-5" />
              Nova Meta
            </button>
          </div>
        </div>

        {/* Add Goal Modal */}
        {showAddGoal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end justify-center z-50" onClick={() => setShowAddGoal(false)}>
            <div className="bg-gray-800 w-full max-w-lg rounded-t-3xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-4" />
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Nova Meta</h2>
                <button onClick={() => setShowAddGoal(false)} className="p-2 hover:bg-gray-700 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Nome da Meta</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    placeholder="Ex: Aprender um novo idioma"
                    className="w-full bg-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {emojiOptions.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setNewGoal({...newGoal, emoji})}
                        className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                          newGoal.emoji === emoji ? 'bg-orange-500 scale-110' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Cor</label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewGoal({...newGoal, color})}
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} transition-all ${
                          newGoal.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800 scale-110' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={addGoal}
                  disabled={!newGoal.title.trim()}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-4 rounded-xl mt-4 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Criar Meta
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes slide-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
        `}</style>
      </div>
    );
  }

  // Goal Detail Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className={`bg-gradient-to-r ${currentGoal?.color || 'from-blue-500 to-purple-600'} p-[2px]`}>
        <div className="bg-gray-900/95 backdrop-blur">
          <div className="flex items-center gap-3 p-4">
            <button 
              onClick={() => setSelectedGoal(null)}
              className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentGoal?.color} flex items-center justify-center text-xl shadow-lg`}>
              {currentGoal?.emoji}
            </div>
            <h1 className="text-lg font-bold flex-1 leading-tight">{currentGoal?.title}</h1>
            <button 
              onClick={() => deleteGoal(currentGoal?.id)}
              className="p-2 rounded-full hover:bg-red-500/20 text-red-400 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          {/* Overall Progress */}
          <div className="px-4 pb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progresso da meta</span>
              <span className="font-bold text-lg">{calculateGoalProgress(currentGoal || {tasks:[]})}%</span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${currentGoal?.color} transition-all duration-500`}
                style={{ width: `${calculateGoalProgress(currentGoal || {tasks:[]})}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="p-4 space-y-4 pb-28">
        {currentGoal?.tasks.map(task => {
          const progress = Math.round((task.current / task.target) * 100);
          const remaining = task.target - task.current;
          const isComplete = task.current >= task.target;
          
          return (
            <div 
              key={task.id} 
              className={`bg-gray-800/80 rounded-2xl p-4 border transition-all ${
                isComplete ? 'border-green-500/50 bg-green-900/20' : 'border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {isComplete ? (
                    <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full border-2 border-gray-500" />
                  )}
                  <div>
                    <h3 className={`font-semibold ${isComplete ? 'text-green-400' : ''}`}>
                      {task.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {isComplete ? (
                        <span className="text-green-400 font-medium">✓ Meta concluída! 🎉</span>
                      ) : (
                        <>Faltam <span className="text-orange-400 font-semibold">{remaining}</span> para a meta</>
                      )}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => deleteTask(currentGoal.id, task.id)}
                  className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-400">{task.current} / {task.target}</span>
                  <span className={`font-bold ${isComplete ? 'text-green-400' : 'text-orange-400'}`}>
                    {progress}%
                  </span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      isComplete 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                        : `bg-gradient-to-r ${currentGoal?.color}`
                    }`}
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateTaskProgress(currentGoal.id, task.id, -1)}
                  className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-2xl font-bold hover:bg-gray-600 active:scale-95 transition-all"
                >
                  −
                </button>
                
                {editingTask === task.id ? (
                  <input
                    type="number"
                    defaultValue={task.current}
                    onBlur={(e) => {
                      setTaskProgress(currentGoal.id, task.id, e.target.value);
                      setEditingTask(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setTaskProgress(currentGoal.id, task.id, e.target.value);
                        setEditingTask(null);
                      }
                    }}
                    className="flex-1 bg-gray-700 rounded-xl px-4 py-3 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => setEditingTask(task.id)}
                    className="flex-1 bg-gray-700 rounded-xl py-3 text-center text-xl font-bold hover:bg-gray-600 transition-colors"
                  >
                    {task.current}
                  </button>
                )}
                
                <button
                  onClick={() => updateTaskProgress(currentGoal.id, task.id, 1)}
                  className={`w-12 h-12 bg-gradient-to-r ${currentGoal?.color} rounded-xl flex items-center justify-center text-2xl font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-lg`}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}

        {currentGoal?.tasks.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Target className="w-20 h-20 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Nenhuma tarefa ainda</p>
            <p className="text-sm mt-1">Adicione tarefas para acompanhar seu progresso</p>
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent">
        <button
          onClick={() => setShowAddTask(true)}
          className={`w-full max-w-lg mx-auto bg-gradient-to-r ${currentGoal?.color} text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg`}
        >
          <Plus className="w-5 h-5" />
          Adicionar Tarefa
        </button>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end justify-center z-50" onClick={() => setShowAddTask(false)}>
          <div className="bg-gray-800 w-full max-w-lg rounded-t-3xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Nova Tarefa</h2>
              <button onClick={() => setShowAddTask(false)} className="p-2 hover:bg-gray-700 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Nome da Tarefa</label>
                <input
                  type="text"
                  value={newTask.name}
                  onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                  placeholder="Ex: Treinos de corrida"
                  className="w-full bg-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Meta (quantidade total)</label>
                <input
                  type="number"
                  value={newTask.target}
                  onChange={(e) => setNewTask({...newTask, target: e.target.value})}
                  placeholder="100"
                  className="w-full bg-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                onClick={addTask}
                disabled={!newTask.name.trim()}
                className={`w-full bg-gradient-to-r ${currentGoal?.color} text-white font-bold py-4 rounded-xl mt-4 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Adicionar Tarefa
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
