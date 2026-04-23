"use client";

import { FormEvent, useEffect, useState } from "react";

type TodoItem = {
  id: string;
  title: string;
  createdAt: string;
  note: string;
  completed: boolean;
};

type TodoManagementTableProps = {
  profileId: string;
  profileName: string;
};

export function TodoManagementTable({ profileId, profileName }: TodoManagementTableProps) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [activeTodoId, setActiveTodoId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/todos?profileId=${encodeURIComponent(profileId)}`);
        if (res.ok && !cancelled) {
          const data: TodoItem[] = await res.json();
          setTodos(data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [profileId]);

  const activeTodo = todos.find((t) => t.id === activeTodoId) ?? null;

  const handleAddTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTitle = title.trim();
    if (!normalizedTitle) return;

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId, title: normalizedTitle, note: "", completed: false }),
    });

    if (res.ok) {
      const created: TodoItem = await res.json();
      setTodos((prev) => [...prev, created]);
      setTitle("");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      if (activeTodoId === id) {
        setActiveTodoId(null);
        setNoteDraft("");
      }
    }
  };

  const openTodoDetail = (todo: TodoItem) => {
    setActiveTodoId(todo.id);
    setNoteDraft(todo.note);
  };

  const closeTodoDetail = () => {
    setActiveTodoId(null);
    setNoteDraft("");
  };

  const handleSaveNote = async () => {
    if (activeTodoId === null) return;

    const res = await fetch(`/api/todos/${activeTodoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: noteDraft.trim() }),
    });

    if (res.ok) {
      const updated: TodoItem = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === activeTodoId ? updated : t)));
      closeTodoDetail();
    }
  };

  const handleToggleCompleted = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });

    if (res.ok) {
      const updated: TodoItem = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
  };

  return (
    <section id="todo" className="section section-animate">
      <div className="section__inner">
        <h2 className="section__title">
          <span className="section__title-en">To Do</span>
          <span className="section__title-ja">{profileName} の To Do 管理テーブル</span>
        </h2>

        <form className="todo-form" onSubmit={handleAddTodo}>
          <label className="todo-form__label" htmlFor="todo-title">
            タスク名
          </label>
          <div className="todo-form__controls">
            <input
              id="todo-title"
              type="text"
              className="todo-form__input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="追加するタスクを入力"
            />
            <button type="submit" className="todo-form__submit">
              追加
            </button>
          </div>
        </form>

        <div className="todo-table-wrap">
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-500">読み込み中...</p>
          ) : (
            <table className="todo-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>タスク</th>
                  <th>作成日</th>
                  <th>状態</th>
                  <th>メモ</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {todos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="todo-table__empty">
                      タスクはありません。
                    </td>
                  </tr>
                ) : (
                  todos.map((todo, index) => (
                    <tr key={todo.id}>
                      <td>{index + 1}</td>
                      <td>
                        <button
                          type="button"
                          className="todo-table__task-trigger"
                          onClick={() => openTodoDetail(todo)}
                        >
                          {todo.title}
                        </button>
                      </td>
                      <td>{todo.createdAt}</td>
                      <td>{todo.completed ? "完了" : "未完了"}</td>
                      <td>{todo.note ? "あり" : "-"}</td>
                      <td>
                        <div className="todo-table__actions">
                          <button
                            type="button"
                            className="todo-table__delete"
                            onClick={() => handleToggleCompleted(todo.id)}
                          >
                            {todo.completed ? "未完了に戻す" : "完了"}
                          </button>
                          <button
                            type="button"
                            className="todo-table__delete"
                            onClick={() => handleDeleteTodo(todo.id)}
                          >
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {activeTodo ? (
          <div className="todo-modal-backdrop" role="presentation" onClick={closeTodoDetail}>
            <div
              className="todo-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="todo-detail-title"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="todo-detail-title" className="todo-modal__title">
                タスク詳細
              </h3>
              <dl className="todo-modal__meta">
                <div>
                  <dt>タスク名</dt>
                  <dd>{activeTodo.title}</dd>
                </div>
                <div>
                  <dt>作成日</dt>
                  <dd>{activeTodo.createdAt}</dd>
                </div>
              </dl>
              <label className="todo-modal__label" htmlFor="todo-note">
                メモ
              </label>
              <textarea
                id="todo-note"
                className="todo-modal__textarea"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="このタスクのメモを入力"
              />
              <div className="todo-modal__actions">
                <button
                  type="button"
                  className="todo-modal__button todo-modal__button--ghost"
                  onClick={closeTodoDetail}
                >
                  閉じる
                </button>
                <button
                  type="button"
                  className="todo-modal__button todo-modal__button--primary"
                  onClick={handleSaveNote}
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
