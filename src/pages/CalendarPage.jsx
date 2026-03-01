import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  Zap,
  MapPin,
  Building2,
  Heart,
  Loader2,
} from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Load all task posts
  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      where('taskCapacity', '>', 0),
      orderBy('taskCapacity'),
      orderBy('postTime', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));

    return unsub;
  }, []);

  // Calendar helpers
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  function prevMonth() {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(null);
  }
  function nextMonth() {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(null);
  }

  // Group tasks by date
  function getTasksForDate(day) {
    return tasks.filter(t => {
      if (!t.postTime?.toDate) return false;
      const d = t.postTime.toDate();
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  }

  // Tasks for selected date
  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  // Check which days have tasks
  function dayHasTasks(day) {
    return getTasksForDate(day).length > 0;
  }

  return (
    <div className="min-h-screen bg-loop-gray">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-loop-gray/50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <h1 className="font-display text-lg font-extrabold flex items-center gap-2">
            <Calendar size={18} className="text-loop-purple" />
            Task Calendar
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Month nav */}
        <div className="bg-white rounded-2xl border border-loop-gray/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="w-9 h-9 rounded-full bg-loop-gray flex items-center justify-center hover:bg-loop-gray/80 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <h2 className="font-display text-lg font-bold">
              {MONTHS[month]} {year}
            </h2>
            <button onClick={nextMonth} className="w-9 h-9 rounded-full bg-loop-gray flex items-center justify-center hover:bg-loop-gray/80 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-loop-green/40 py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before first day */}
            {[...Array(firstDay)].map((_, i) => <div key={`e${i}`} />)}

            {/* Day cells */}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const hasTasks = dayHasTasks(day);
              const isSelected = selectedDate === day;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : day)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all duration-200
                    ${isSelected ? 'bg-loop-purple text-white scale-105 shadow-md' :
                      isToday ? 'bg-loop-purple/10 text-loop-purple font-bold' :
                      hasTasks ? 'bg-loop-green/5 hover:bg-loop-green/10' :
                      'hover:bg-loop-gray/50'}`}
                >
                  <span className={`text-xs ${isSelected ? 'font-bold' : ''}`}>{day}</span>
                  {hasTasks && !isSelected && (
                    <div className="absolute bottom-1 flex gap-0.5">
                      {getTasksForDate(day).slice(0, 3).map((_, j) => (
                        <div key={j} className="w-1 h-1 rounded-full bg-loop-purple" />
                      ))}
                    </div>
                  )}
                  {hasTasks && isSelected && (
                    <span className="text-[8px] font-bold">{getTasksForDate(day).length}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected date tasks */}
        {selectedDate && (
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold text-loop-green/60">
              {MONTHS[month]} {selectedDate} — {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''}
            </h3>
            {selectedTasks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-loop-gray/50 p-8 text-center">
                <p className="text-sm text-loop-green/40">No tasks posted on this day</p>
              </div>
            ) : (
              selectedTasks.map(task => (
                <div key={task.id} className="bg-white rounded-2xl border border-loop-gray/50 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      task.authorRole === 'Inner' ? 'bg-loop-purple/15' : 'bg-loop-red/15'
                    }`}>
                      {task.authorRole === 'Inner'
                        ? <Building2 size={14} className="text-loop-purple" />
                        : <Heart size={14} className="text-loop-red" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{task.authorName}</p>
                      <p className="text-[10px] text-loop-green/40">{task.authorRole}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-loop-green/50">
                      <span className="flex items-center gap-1"><Users size={11} /> {task.taskFilled || 0}/{task.taskCapacity}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> +{task.hoursReward}h</span>
                    </div>
                  </div>
                  <p className="text-sm text-loop-green/70 leading-relaxed">{task.content}</p>
                  {task.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {task.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-loop-blue/15">#{t}</span>
                      ))}
                    </div>
                  )}
                  {(task.taskFilled || 0) >= task.taskCapacity && (
                    <p className="text-[10px] text-loop-red font-semibold flex items-center gap-1">
                      <Zap size={9} /> Full — waitlist open (2× rewards)
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Upcoming tasks list */}
        {!selectedDate && (
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold text-loop-green/60">All Active Tasks</h3>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-loop-purple" /></div>
            ) : tasks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-loop-gray/50 p-8 text-center">
                <Calendar size={28} className="mx-auto text-loop-purple/30 mb-3" />
                <p className="text-sm text-loop-green/40">No tasks posted yet</p>
              </div>
            ) : (
              tasks.slice(0, 10).map(task => (
                <div key={task.id} className="bg-white rounded-2xl border border-loop-gray/50 p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-loop-purple/10 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-loop-purple">
                      {task.postTime?.toDate ? MONTHS[task.postTime.toDate().getMonth()].slice(0, 3) : '—'}
                    </span>
                    <span className="text-sm font-bold text-loop-purple">
                      {task.postTime?.toDate ? task.postTime.toDate().getDate() : '—'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{task.content?.slice(0, 60)}...</p>
                    <p className="text-[10px] text-loop-green/40 flex items-center gap-2 mt-0.5">
                      <span>{task.authorName}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5"><Users size={9} /> {task.taskFilled || 0}/{task.taskCapacity}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5"><Clock size={9} /> +{task.hoursReward}h</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
