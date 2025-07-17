import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Plus, Check, X, Clock, Trophy, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const translations = {
  en: { 
    add: "Add Task", 
    placeholder: "What needs to be done?", 
    done: "Complete", 
    undone: "Undo", 
    delete: "Delete", 
    completed: "Completed", 
    incomplete: "Pending", 
    theme: "Theme", 
    language: "Language",
    title: "Multi-Language Todo",
    timer: "Session Time",
    stats: "Progress Stats",
    allTasks: "All Tasks",
    noTasks: "No tasks yet. Add one above!",
    taskComplete: "Task completed! 🎉"
  },
  pt: { 
    add: "Adicionar", 
    placeholder: "O que precisa ser feito?", 
    done: "Concluir", 
    undone: "Desfazer", 
    delete: "Excluir", 
    completed: "Concluídas", 
    incomplete: "Pendentes", 
    theme: "Tema", 
    language: "Idioma",
    title: "Lista Multi-Idioma",
    timer: "Tempo da Sessão",
    stats: "Estatísticas",
    allTasks: "Todas as Tarefas",
    noTasks: "Nenhuma tarefa ainda. Adicione uma acima!",
    taskComplete: "Tarefa concluída! 🎉"
  },
  tr: { 
    add: "Ekle", 
    placeholder: "Ne yapılması gerekiyor?", 
    done: "Tamamla", 
    undone: "Geri Al", 
    delete: "Sil", 
    completed: "Tamamlanan", 
    incomplete: "Bekleyen", 
    theme: "Tema", 
    language: "Dil",
    title: "Çok Dilli Yapılacaklar",
    timer: "Oturum Süresi",
    stats: "İlerlemeler",
    allTasks: "Tüm Görevler",
    noTasks: "Henüz görev yok. Yukarıdan bir tane ekleyin!",
    taskComplete: "Görev tamamlandı! 🎉"
  }
};

interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [time, setTime] = useState(0);

  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    const timer = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const addTask = () => {
    if (input.trim()) {
      const newTask: Task = {
        id: Date.now(),
        text: input.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTasks([newTask, ...tasks]);
      setInput("");
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const incompleteCount = tasks.length - completedCount;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-hero text-white border-0">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold">{t.title}</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-24 bg-white/20 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">EN</SelectItem>
                    <SelectItem value="pt">PT</SelectItem>
                    <SelectItem value="tr">TR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.timer}</p>
                <p className="text-2xl font-bold">{formatTime(time)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-full">
                <Trophy className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.completed}</p>
                <p className="text-2xl font-bold text-success">{completedCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.incomplete}</p>
                <p className="text-2xl font-bold text-primary">{incompleteCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Task */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-2">
              <Input 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.placeholder}
                className="flex-1"
              />
              <Button onClick={addTask} className="px-6">
                <Plus className="h-4 w-4 mr-2" />
                {t.add}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        {tasks.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">{completionRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div 
                  className="bg-success h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {t.allTasks}
              {tasks.length > 0 && (
                <Badge variant="secondary">{tasks.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence mode="popLayout">
              {tasks.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t.noTasks}</p>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      whileHover={{ scale: 1.01 }}
                      className="group"
                    >
                      <Card className={`transition-all duration-200 ${
                        task.completed 
                          ? 'bg-success/5 border-success/20' 
                          : 'hover:shadow-md'
                      }`}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <Button
                              variant={task.completed ? "default" : "outline"}
                              size="icon"
                              onClick={() => toggleTask(task.id)}
                              className={task.completed ? 'bg-success hover:bg-success/90' : ''}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <span className={`flex-1 ${
                              task.completed 
                                ? 'line-through text-muted-foreground' 
                                : 'text-foreground'
                            }`}>
                              {task.text}
                            </span>
                            {task.completed && (
                              <Badge variant="outline" className="text-success border-success">
                                ✓ {t.completed}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}