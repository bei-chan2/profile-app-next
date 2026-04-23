"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ProfileFormState = {
  id: string;
  name: string;
  role: string;
  age: string;
  catchCopy: string;
  about1: string;
  about2: string;
  about3: string;
  tags: string;
};

const emptyForm: ProfileFormState = {
  id: "",
  name: "",
  role: "",
  age: "",
  catchCopy: "",
  about1: "",
  about2: "",
  about3: "",
  tags: "",
};

export function ProfileEditorClient() {
  const router = useRouter();
  const [form, setForm] = useState<ProfileFormState>(emptyForm);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async () => {
    if (!form.name.trim() || !form.role.trim()) {
      setMessage("名前と職業は必須です。");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id.trim() || undefined,
          name: form.name.trim(),
          role: form.role.trim(),
          age: form.age.trim(),
          catchCopy: form.catchCopy.trim(),
          about: [form.about1.trim(), form.about2.trim(), form.about3.trim()].filter(Boolean),
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      if (res.ok) {
        router.push("/profiles");
        router.refresh();
      } else {
        const data = await res.json();
        setMessage(data.error ?? "登録に失敗しました。");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="ui-shell min-h-screen">
      <section className="ui-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="ui-title">プロフィール新規登録</h1>
            <p className="ui-subtitle">この画面では新規アカウントの登録のみ行えます。</p>
          </div>
          <Link href="/profiles" className="ui-btn-secondary">
            プロフィール選択へ戻る
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <input
            value={form.id}
            onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))}
            className="ui-input"
            placeholder="ID（任意）"
          />
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="ui-input"
            placeholder="名前"
          />
          <input
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
            className="ui-input"
            placeholder="職業"
          />
          <input
            value={form.age}
            onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))}
            className="ui-input"
            placeholder="年齢"
          />
          <input
            value={form.catchCopy}
            onChange={(e) => setForm((prev) => ({ ...prev, catchCopy: e.target.value }))}
            className="ui-input md:col-span-2"
            placeholder="キャッチコピー"
          />
          <textarea
            value={form.about1}
            onChange={(e) => setForm((prev) => ({ ...prev, about1: e.target.value }))}
            className="ui-textarea md:col-span-2"
            placeholder="自己紹介 1"
          />
          <textarea
            value={form.about2}
            onChange={(e) => setForm((prev) => ({ ...prev, about2: e.target.value }))}
            className="ui-textarea md:col-span-2"
            placeholder="自己紹介 2"
          />
          <textarea
            value={form.about3}
            onChange={(e) => setForm((prev) => ({ ...prev, about3: e.target.value }))}
            className="ui-textarea md:col-span-2"
            placeholder="自己紹介 3"
          />
          <input
            value={form.tags}
            onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
            className="ui-input md:col-span-2"
            placeholder="タグ（カンマ区切り）"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSubscribe}
            disabled={submitting}
            className="ui-btn-primary disabled:opacity-50"
          >
            {submitting ? "登録中..." : "新規登録"}
          </button>
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        </div>
      </section>
    </main>
  );
}
