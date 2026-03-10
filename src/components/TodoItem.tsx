"use client";

import { useState } from 'react';

export interface TodoData {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoItemProps {
  todo: TodoData;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, title: string, description: string) => Promise<void>;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(
    todo.description || ''
  );
  const [editError, setEditError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggle(todo.id, !todo.completed);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await onDelete(todo.id);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      setEditError('Title cannot be empty.');
      return;
    }
    setSaving(true);
    setEditError(null);
    try {
      await onUpdate(todo.id, editTitle.trim(), editDescription.trim());
      setIsEditing(false);
    } catch {
      setEditError('Failed to update. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditError(null);
    setIsEditing(false);
  };

  const formattedDate = new Date(todo.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border-l-4 p-5 transition-all duration-200 ${
        todo.completed
          ? 'border-green-400 opacity-75'
          : 'border-indigo-400 hover:shadow-md'
      }`}
    >
      {isEditing ? (
        <div>
          {editError && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
              {editError}
            </div>
          )}
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-3"
            disabled={saving}
            placeholder="Title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none mb-3"
            rows={2}
            disabled={saving}
            placeholder="Description (optional)"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium py-1.5 px-4 rounded-lg transition"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={saving}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium py-1.5 px-4 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4">
          <button
            onClick={handleToggle}
            disabled={toggling}
            title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
            className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
              todo.completed
                ? 'bg-green-400 border-green-400 text-white'
                : 'border-gray-300 hover:border-indigo-400'
            } ${toggling ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
          >
            {todo.completed && (
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-base font-semibold break-words ${
                todo.completed
                  ? 'line-through text-gray-400'
                  : 'text-gray-800'
              }`}
            >
              {todo.title}
            </h3>
            {todo.description && (
              <p
                className={`text-sm mt-1 break-words ${
                  todo.completed ? 'line-through text-gray-400' : 'text-gray-500'
                }`}
              >
                {todo.description}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-2">{formattedDate}</p>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => {
                setIsEditing(true);
                setConfirmDelete(false);
              }}
              title="Edit todo"
              className="text-gray-400 hover:text-indigo-600 transition p-1 rounded"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"
                />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              title={confirmDelete ? 'Click again to confirm delete' : 'Delete todo'}
              className={`transition p-1 rounded text-sm font-medium ${
                confirmDelete
                  ? 'text-white bg-red-500 hover:bg-red-600 px-2 rounded-lg'
                  : 'text-gray-400 hover:text-red-500'
              } ${deleting ? 'opacity-50 cursor-wait' : ''}`}
            >
              {confirmDelete ? (
                deleting ? 'Deleting...' : 'Confirm?'
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </button>
            {confirmDelete && !deleting && (
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1 rounded text-xs"
                title="Cancel delete"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
