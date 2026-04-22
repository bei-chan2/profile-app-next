"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { z } from "zod";

type TodoItem = {
  id: number;
  title: string;
  createdAt: string;
  note: string;
};

const STORAGE_KEY = "profile-app:todos";

const initialTodos: TodoItem[] = [
  { id: 1, title: "初回カウンセリングの準備", createdAt: "2026-04-10", note: "" },
  { id: 2, title: "トレーニングメニューの見直し", createdAt: "2026-04-11", note: "" },
];

const todoItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  createdAt: z.string(),
  note: z.string().optional().default(""),
});

const todosSchema = z.array(todoItemSchema);

function loadTodos(): TodoItem[] {
  if (typeof window === "undefined") {
    return initialTodos;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return initialTodos;
    }
    const parsed: unknown = JSON.parse(raw);
    return todosSchema.parse(parsed);
  } catch {
    return initialTodos;
  }
}

export function TodoManagementTable() {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [hydrated, setHydrated] = useState(false);
  const [title, setTitle] = useState("");
  const [activeTodoId, setActiveTodoId] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setTodos(loadTodos());
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos, hydrated]);

  const nextId = useMemo(() => {
    if (todos.length === 0) {
      return 1;
    }
    return Math.max(...todos.map((todo) => todo.id)) + 1;
  }, [todos]);

  const handleAddTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      return;
    }

    const createdAt = new Date().toISOString().slice(0, 10);

    setTodos((prev) => [
      ...prev,
      {
        id: nextId,
        title: normalizedTitle,
        createdAt,
        note: "",
      },
    ]);
    setTitle("");
  };

  const handleDeleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    if (activeTodoId === id) {
      setActiveTodoId(null);
      setNoteDraft("");
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

  const handleSaveNote = () => {
    if (activeTodoId === null) {
      return;
    }

    setTodos((prev) =>
      prev.map((todo) => (todo.id === activeTodoId ? { ...todo, note: noteDraft.trim() } : todo)),
    );
    closeTodoDetail();
  };

  const activeTodo = useMemo(
    () => todos.find((todo) => todo.id === activeTodoId) ?? null,
    [todos, activeTodoId],
  );

  return (
    <section id="todo" className="section section-animate">
      <div className="section__inner">
        <h2 className="section__title">
          <span className="section__title-en">To Do</span>
          <span className="section__title-ja">To Do 管理テーブル</span>
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
              onChange={(event) => setTitle(event.target.value)}
              placeholder="追加するタスクを入力"
            />
            <button type="submit" className="todo-form__submit">
              追加
            </button>
          </div>
        </form>

        <div className="todo-table-wrap">
          <table className="todo-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>タスク</th>
                <th>作成日</th>
                <th>メモ</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {todos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="todo-table__empty">
                    タスクはありません。
                  </td>
                </tr>
              ) : (
                todos.map((todo) => (
                  <tr key={todo.id}>
                    <td>{todo.id}</td>
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
                    <td>{todo.note ? "あり" : "-"}</td>
                    <td>
                      <button
                        type="button"
                        className="todo-table__delete"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {activeTodo ? (
          <div className="todo-modal-backdrop" role="presentation" onClick={closeTodoDetail}>
            <div
              className="todo-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="todo-detail-title"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 id="todo-detail-title" className="todo-modal__title">
                タスク詳細
              </h3>
              <dl className="todo-modal__meta">
                <div>
                  <dt>ID</dt>
                  <dd>{activeTodo.id}</dd>
                </div>
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
                onChange={(event) => setNoteDraft(event.target.value)}
                placeholder="このタスクのメモを入力"
              />
              <div className="todo-modal__actions">
                <button type="button" className="todo-modal__button todo-modal__button--ghost" onClick={closeTodoDetail}>
                  閉じる
                </button>
                <button type="button" className="todo-modal__button todo-modal__button--primary" onClick={handleSaveNote}>
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
