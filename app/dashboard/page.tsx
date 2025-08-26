'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/libs/UserContext';
import { useRouter } from 'next/navigation';
import ButtonAccount from '@/components/ButtonAccount';
import { supabase } from '@/libs/supabaseClient';

export const dynamic = 'force-dynamic';

interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  due_date: string;
  timeframe: string;
  priority: string;
  status: boolean;
  created_at: string;
  duration?: string; // e.g. "1–2 hours"
  preferred_time?: string; // 🆕 new field (morning, afternoon, evening, night)
  custom_time?: string;    // 🆕 new field (HH:MM format)
  buffer_minutes?: number; // 🆕 new field (buffer time in minutes)
}

const hormoneTips = [
  { title: '🟩 Boost Dopamine!', tip: 'Finish a small task or clean your room to feel more motivated ✅' },
  { title: '🟦 Boost Serotonin!', tip: 'Get outside in the sun for 10 minutes ☀️' },
  { title: '🟨 Boost Oxytocin!', tip: 'Text a friend or give someone a compliment 💬' },
  { title: '🟧 Boost Endorphins!', tip: 'Watch a funny video or dance to your favorite song 🎶😂' },
  { title: '🧠 Mini Mood Hack!', tip: 'Name 3 things you’re grateful for right now 💛' },
];

export default function Dashboard() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [randomTip, setRandomTip] = useState(hormoneTips[0]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [timeframe, setTimeframe] = useState('today');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState(false);
  const [duration, setDuration] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const [timeframeFilter, setTimeframeFilter] = useState<'all' | 'today' | 'this_week' | 'this_month'>('all');
  const [preferredTime, setPreferredTime] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [bufferTime, setBufferTime] = useState('0'); 
 
  const fetchTasks = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching tasks:', error.message);
    } else {
      setTasks(data || []);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }

    if (user) {
      const random = Math.floor(Math.random() * hormoneTips.length);
      setRandomTip(hormoneTips[random]);
      fetchTasks();
    }
  }, [loading, user, router, fetchTasks]);

  const handleCheckinSubmit = async () => {
    if (!user) return;

    const { error } = await supabase.from('checkins').insert([
      {
        user_id: user.id,
        mood,
        energy,
      },
    ]);

    if (error) {
      console.error('❌ Failed to save check-in:', error.message);
      setSubmitted(false);
    } else {
      setSubmitted(true);

      // 🧠 Ask AI for mood message
      try {
        const res = await fetch('/api/aiMoodMessage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mood, energy }),
        });

        const data = await res.json();
        setAiMessage(data.message || '💬 Mood message unavailable');
      } catch (err) {
        console.error('❌ Failed to fetch AI message:', err);
        setAiMessage('💬 Mood message unavailable');
      }
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      console.error('❌ No user found during task submission');
      return;
    }

    // Validate required fields
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    const taskData = {
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate || null,
      timeframe,
      priority,
      status,
      duration,
      preferred_time: preferredTime || null,
      custom_time: customTime || null,
      buffer_minutes: parseInt(bufferTime) || 0,
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase.from('tasks').insert([taskData]);

      if (error) {
        console.error('❌ Error adding task:', error);
        alert('Failed to save task: ' + error.message);
      } else {
        setTitle('');
        setDescription('');
        setDueDate('');
        setTimeframe('today');
        setPriority('medium');
        setStatus(false);
        setDuration('');
        setPreferredTime('');
        setCustomTime('');
        setBufferTime('0');
        await fetchTasks();
        alert('Task saved successfully!');
      }
    } catch (catchError) {
      console.error('🚨 Unexpected error during task submission:', catchError);
      alert('Unexpected error occurred: ' + String(catchError));
    }
  };

  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    console.log('🔄 Toggle button clicked!');
    console.log('📋 Task ID:', taskId);
    console.log('📊 Current Status:', currentStatus);
    console.log('🔄 New Status will be:', !currentStatus);

    if (!taskId) {
      console.error('❌ No task ID provided');
      alert('Error: No task ID found');
      return;
    }

    try {
      const newStatus = !currentStatus;
      console.log('💾 About to update database with:', { status: newStatus });
      console.log('🔍 Updating task with ID:', taskId);
      
      const { data, error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)
        .select(); // Add select() to return updated data
    
      console.log('📊 Supabase update response - data:', data);
      console.log('📊 Supabase update response - error:', error);
    
      if (error) {
        console.error('❌ Error updating task status:', error.message);
        console.error('❌ Error details:', error);
        alert('Failed to update task status: ' + error.message);
      } else {
        console.log('✅ Task status updated successfully!');
        await fetchTasks();
      }
    } catch (catchError) {
      console.error('🚨 Unexpected error in handleToggleComplete:', catchError);
      alert('Unexpected error: ' + String(catchError));
    }
  };

  // Enhanced schedule generator with intelligent breaks
  const generateScheduleWithBreaks = () => {
    const durationToMinutes = (duration: string) => {
      const durationMap: { [key: string]: number } = {
        '15 min': 15,
        '30 min': 30,
        '1 hour': 60,
        '1–2 hours': 90,
        '2+ hours': 120
      };
      return durationMap[duration] || 60; // default to 1 hour
    };

    // 🆕 Enhanced time block system
    const timeBlocks = {
      morning: [8, 12],     // 8am–12pm
      afternoon: [12, 17],  // 12pm–5pm
      evening: [17, 22],    // 5pm–10pm
      night: [22, 24]       // 10pm–12am
    };

    const preferredTimeRank = (preferredTime: string | undefined) => {
      if (!preferredTime) return 99;
      const rankings = { morning: 1, afternoon: 2, evening: 3, night: 4 };
      return rankings[preferredTime.toLowerCase() as keyof typeof rankings] ?? 99;
    };

    const getTimeBlockStart = (preferredTime: string) => {
      const timeSlots: { [key: string]: number } = {
        'morning': 8,    // 8 AM
        'afternoon': 12, // 12 PM
        'evening': 17,   // 5 PM
        'night': 22      // 10 PM
      };
      return timeSlots[preferredTime.toLowerCase()] || 8; // default to 8 AM
    };

    const todayTasks = tasks.filter(
      (task) => !task.status && task.timeframe === 'today'
    );

    // 🆕 Smart sorting: custom_time first, then group by preferred_time, then priority
    const sortedTasks = [...todayTasks].sort((a, b) => {
      // STEP 1: Tasks with custom_time should be scheduled first (in chronological order)
      if (a.custom_time && b.custom_time) {
        return a.custom_time.localeCompare(b.custom_time);
      }
      if (a.custom_time && !b.custom_time) return -1;
      if (!a.custom_time && b.custom_time) return 1;
      
      // STEP 2: Group by preferred_time (morning → afternoon → evening → night)
      const timeDiff = preferredTimeRank(a.preferred_time) - preferredTimeRank(b.preferred_time);
      if (timeDiff !== 0) return timeDiff;
      
      // STEP 3: Within same time block, sort by priority
      const priorityMap = { high: 1, medium: 2, low: 3 };
      const aPriority = priorityMap[a.priority as keyof typeof priorityMap] || 4;
      const bPriority = priorityMap[b.priority as keyof typeof priorityMap] || 4;
      if (aPriority !== bPriority) return aPriority - bPriority;
      
      // STEP 4: Finally, sort by due_date
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      if (a.due_date && !b.due_date) return -1;
      if (!a.due_date && b.due_date) return 1;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    const schedule: Array<{
      title: string;
      start: string;
      end: string;
      type: 'task' | 'break';
      duration: number;
    }> = [];

    let currentTime = new Date();
    currentTime.setHours(9, 0, 0, 0); // Default start at 9 AM
    let cumulativeWorkTime = 0;

    for (const task of sortedTasks) {
      const taskDuration = durationToMinutes(task.duration || '');
      
      // 🆕 Handle custom_time: set exact time if specified
      if (task.custom_time) {
        const [hours, minutes] = task.custom_time.split(':').map(Number);
        const customTime = new Date();
        customTime.setHours(hours, minutes, 0, 0);
        
        // Only use custom time if it's later than current time
        if (customTime.getTime() > currentTime.getTime()) {
          currentTime = customTime;
          cumulativeWorkTime = 0; // Reset cumulative time for custom scheduled tasks
        }
      }
      // 🆕 Handle preferred_time: adjust start time based on preference
      else if (task.preferred_time && cumulativeWorkTime === 0) {
        const preferredHour = getTimeBlockStart(task.preferred_time);
        const preferredTime = new Date();
        preferredTime.setHours(preferredHour, 0, 0, 0);
        
        // Only use preferred time if it's later than current time
        if (preferredTime.getTime() > currentTime.getTime()) {
          currentTime = preferredTime;
        }
      }
      
      // Check if we need a break before this task
      if (cumulativeWorkTime > 0 && cumulativeWorkTime + taskDuration > 75) {
        // Insert a 10-minute break
        const breakEndTime = new Date(currentTime.getTime() + 10 * 60000);
        schedule.push({
          title: 'Take a 10-minute break ☕',
          start: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          end: breakEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'break',
          duration: 10
        });
        
        currentTime = breakEndTime;
        cumulativeWorkTime = 0; // Reset cumulative time after break
      }

      // Add the task
      const taskEndTime = new Date(currentTime.getTime() + taskDuration * 60000);
      schedule.push({
        title: task.title,
        start: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        end: taskEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'task',
        duration: taskDuration
      });

      // 🆕 Add buffer time after task completion
      const bufferMinutes = task.buffer_minutes || 0;
      const nextAvailableTime = new Date(taskEndTime.getTime() + bufferMinutes * 60000);
      
      currentTime = nextAvailableTime;
      cumulativeWorkTime += taskDuration;
    }

    return schedule;
  };

  // Legacy function for backward compatibility
  const generateSchedule = () => {
    return generateScheduleWithBreaks().map(item => ({
      title: item.title,
      start: item.start,
      end: item.end
    }));
  };

  if (loading) return <p className="p-8">Checking your login status...</p>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <aside className="w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            A-D-H-WHAT?
          </h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back, {user.email.split('@')[0]} 🎉</p>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Mood Check-in Section */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-5 border border-blue-200">
            <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-4">🧠 Daily Check-in</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mood: {mood}/5</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={mood} 
                  onChange={(e) => setMood(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Energy: {energy}/5</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={energy} 
                  onChange={(e) => setEnergy(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" 
                />
              </div>
              <button
                onClick={handleCheckinSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Submit Check-in
              </button>
              {submitted && <p className="text-sm text-green-600 font-medium">✅ Check-in saved!</p>}
              {aiMessage && (
                <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400">
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">🤖</span>
                    <div>
                      <p className="text-sm font-semibold text-yellow-700 mb-1">Your Personal AI Coach</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{aiMessage}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Daily Tip Section */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border border-yellow-200">
            <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-500 mb-3">💡 Daily Tip</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Break large tasks into smaller, manageable chunks. Your brain loves checking things off! ✅
            </p>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-200">
          <ButtonAccount />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
        <div className="h-full p-8">
          <div className="max-w-6xl mx-auto h-full">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 h-full overflow-hidden">
              {/* Main Content Header */}
              <div className="bg-gradient-to-r from-blue-500 to-green-500 px-8 py-6">
                <h1 className="text-3xl font-bold text-white mb-2">Task Management</h1>
                <p className="text-blue-100">Create, organize, and schedule your tasks efficiently</p>
              </div>

              {/* Main Content Body */}
              <div className="p-8 h-full overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                  {/* Left: Task Form */}
                  <div className="space-y-6">
                    <form onSubmit={handleTaskSubmit} className="space-y-6">
                      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-6">📝 Add New Task</h2>

          {/* Basic Information */}
          <div className="space-y-4">
            <div className="border-l-4 border-blue-200 pl-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">📋 Task Details</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="What needs to be done?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Optional details about this task..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="space-y-4">
            <div className="border-l-4 border-green-200 pl-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">📅 When & How Long</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
                  <select
                    id="timeframe"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="today">Today</option>
                    <option value="this_week">This Week</option>
                    <option value="this_month">This Month</option>
                    <option value="this_year">This Year</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <select
                    id="duration"
                    name="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select duration</option>
                    <option value="15 min">15 min</option>
                    <option value="30 min">30 min</option>
                    <option value="1 hour">1 hour</option>
                    <option value="1–2 hours">1–2 hours</option>
                    <option value="2+ hours">2+ hours</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="high">🔴 High Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="low">🟢 Low Priority</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Time Preferences */}
          <div className="space-y-4">
            <div className="border-l-4 border-purple-200 pl-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">⏰ Time Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-1">Best Time of Day</label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                  >
                    <option value="">Select one...</option>
                    <option value="morning">🌅 Morning (6–11am)</option>
                    <option value="afternoon">☀️ Afternoon (12–4pm)</option>
                    <option value="evening">🌆 Evening (5–8pm)</option>
                    <option value="night">🌙 Night (9pm+)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="customTime" className="block text-sm font-medium text-gray-700 mb-1">Specific Time</label>
                  <input
                    id="customTime"
                    name="customTime"
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                  />
                  <span className="text-xs text-gray-500 mt-1 block">Optional: Choose exact hour</span>
                </div>
              </div>

              <div className="mt-4">
                <div>
                  <label htmlFor="bufferTime" className="block text-sm font-medium text-gray-700 mb-1">Buffer Time After Task</label>
                  <select
                    id="bufferTime"
                    name="bufferTime"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={bufferTime}
                    onChange={(e) => setBufferTime(e.target.value)}
                  >
                    <option value="0">No buffer</option>
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                  </select>
                  <span className="text-xs text-gray-500 mt-1 block">Add break time after completing this task</span>
                </div>
              </div>
            </div>
          </div>

                      {/* Task Status & Submit */}
                      <div className="border-t border-gray-100 pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              id="markDone"
                              type="checkbox"
                              checked={status}
                              onChange={(e) => setStatus(e.target.checked)}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor="markDone" className="text-sm font-medium text-gray-700">Mark as completed</label>
                          </div>
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                          >
                            ➕ Add Task
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Right: Task List & Schedule */}
                  <div className="space-y-6">
                    {tasks && tasks.length > 0 ? (
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">📌 Your Tasks ({tasks.length})</h2>
                        
                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setFilter('all')}
                            className={`text-sm px-3 py-1 rounded-full transition-all ${
                              filter === 'all' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            All
                          </button>
                          <button
                            onClick={() => setFilter('pending')}
                            className={`text-sm px-3 py-1 rounded-full transition-all ${
                              filter === 'pending' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => setFilter('completed')}
                            className={`text-sm px-3 py-1 rounded-full transition-all ${
                              filter === 'completed' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Completed
                          </button>
                        </div>

                        {/* Suggested Schedule */}
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-400 rounded-xl p-4">
                          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-3">🧠 Today's Schedule</h3>
                          {generateScheduleWithBreaks().length === 0 ? (
                            <p className="text-sm text-gray-600">No tasks scheduled for today.</p>
                          ) : (
                            <div className="space-y-2">
                              {generateScheduleWithBreaks().map((slot, index) => (
                                <div
                                  key={index}
                                  className={`p-3 rounded-lg border-l-4 ${
                                    slot.type === 'break'
                                      ? 'bg-green-50 border-l-green-400 text-green-800'
                                      : 'bg-blue-50 border-l-blue-400 text-blue-800'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                      <strong>{slot.start}–{slot.end}</strong>
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                                      {slot.duration} min
                                    </span>
                                  </div>
                                  <div className={`mt-1 text-sm ${
                                    slot.type === 'break' ? 'italic' : 'font-medium'
                                  }`}>
                                    {slot.title}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Task List */}
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {tasks
                            .filter((task) => {
                              if (filter === 'pending') return task.status === false;
                              if (filter === 'completed') return task.status === true;
                              return true;
                            })
                            .filter((task) => {
                              if (timeframeFilter === 'all') return true;
                              return task.timeframe === timeframeFilter;
                            })
                            .map((task, index) => (
                            <div
                              key={task.id || index}
                              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800">{task.title || 'No title'}</p>
                                  <p className="text-sm text-gray-600 mt-1">{task.description || 'No description'}</p>
                                  <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                                    <span>📅 {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}</span>
                                    <span>⏱️ {task.timeframe || 'No timeframe'}</span>
                                    <span>🎯 {task.priority || 'Not set'}</span>
                                  </div>
                                  {task.preferred_time && (
                                    <span className="inline-block text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded mt-1">
                                      ⏰ {task.preferred_time}
                                    </span>
                                  )}
                                  {task.custom_time && (
                                    <span className="inline-block text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1 ml-1">
                                      🕐 {task.custom_time}
                                    </span>
                                  )}
                                  {task.buffer_minutes > 0 && (
                                    <span className="inline-block text-xs text-green-600 bg-green-50 px-2 py-1 rounded mt-1 ml-1">
                                      ⏱️ +{task.buffer_minutes}min buffer
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleToggleComplete(task.id, task.status)}
                                  className={`text-xs px-3 py-1 rounded-full transition-all ${
                                    task.status 
                                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  {task.status ? '✔ Done' : '○ Pending'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center">
                        <div className="text-gray-500">
                          <p className="text-4xl mb-4">📝</p>
                          <p className="text-lg font-medium mb-2">No tasks yet!</p>
                          <p className="text-sm">Create your first task using the form on the left.</p>
                        </div>
                      </div>
                    )}
                    
                    {/* ChatCoach removed */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
