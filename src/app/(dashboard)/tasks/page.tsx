'use client';

import React, { useEffect, useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Filter,
  Flame,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Select } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { formatDate } from '@/lib/utils';
import { useRBAC } from '@/contexts/rbac-context';

export default function TasksPage() {
  const { user } = useRBAC();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) setTasks(await res.json());
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          dueDate: dueDate ? new Date(dueDate).toISOString() : new Date(Date.now() + 86400000).toISOString(),
          priority,
        }),
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setDueDate('');
        setCreateModalOpen(false);
        fetchTasks();
      }
    } catch (err) {
      console.error('Create task error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTaskStatus = async (task: any) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      // Optimistic update
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, status: newStatus }),
      });
    } catch (err) {
      console.error('Update task status error:', err);
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'OVERDUE') {
      return new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED';
    }
    return t.status === filterStatus;
  });

  const overdueCount = tasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-brand-600" /> Operational Tasks & Follow-up Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Agent task assignments, client follow-up deadlines, and token registry milestones.
          </p>
        </div>

        <Button
          onClick={() => setCreateModalOpen(true)}
          className="gap-1.5 text-xs bg-brand-600 hover:bg-brand-500 text-white font-semibold"
        >
          <Plus className="w-4 h-4" /> + Create Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg text-xs">
          {[
            { key: 'ALL', label: `All Tasks (${tasks.length})` },
            { key: 'PENDING', label: `Pending (${tasks.filter((t) => t.status === 'PENDING').length})` },
            { key: 'OVERDUE', label: `Overdue (${overdueCount})`, isAlert: overdueCount > 0 },
            { key: 'COMPLETED', label: `Completed (${tasks.filter((t) => t.status === 'COMPLETED').length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-all ${
                filterStatus === tab.key
                  ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              } ${tab.isAlert ? 'text-rose-600 font-bold' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-60" />
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">No Tasks in this Filter</h3>
            <p className="text-xs text-slate-400 mt-1">All follow-ups and operational items are up to date.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';
            const isCompleted = task.status === 'COMPLETED';

            return (
              <Card
                key={task.id}
                className={`p-4 space-y-3 transition-all ${
                  isCompleted
                    ? 'opacity-60 bg-slate-50 dark:bg-slate-900/40'
                    : isOverdue
                    ? 'border-rose-500/50 bg-rose-50/10'
                    : 'hover:border-brand-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      isCompleted
                        ? 'success'
                        : isOverdue
                        ? 'danger'
                        : task.priority === 'URGENT'
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {isCompleted ? 'COMPLETED' : isOverdue ? 'OVERDUE' : `${task.priority} PRIORITY`}
                  </Badge>
                  <span
                    className={`text-xs font-mono flex items-center gap-1 ${
                      isOverdue ? 'text-rose-600 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" /> {formatDate(task.dueDate)}
                  </span>
                </div>

                <div>
                  <h3
                    className={`font-bold text-sm text-slate-900 dark:text-slate-100 ${
                      isCompleted ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{task.description}</p>
                  )}
                  {task.lead && (
                    <div className="mt-2 text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                      Lead: {task.lead.name} ({task.lead.phone})
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <User className="w-3 h-3" /> {task.assignedTo?.name || 'Assigned Agent'}
                  </span>

                  <button
                    onClick={() => toggleTaskStatus(task)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                      isCompleted
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                    }`}
                  >
                    {isCompleted ? 'Reopen' : '✓ Mark Complete'}
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create Follow-up Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Task / Follow-up Title *
            </label>
            <Input
              required
              placeholder="e.g. Call client for Kohistan Enclave token confirmation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description / Notes
            </label>
            <textarea
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
              rows={3}
              placeholder="Add specifics like plot number, client feedback, or required documentation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Due Date & Time
              </label>
              <Input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent (SLA)</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-brand-600 hover:bg-brand-500 text-white">
              {submitting ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
