"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Profile } from "@/features/profile/profile-data";
import { loadProfiles, saveProfiles } from "@/features/profile/profile-storage";

type ProfileEditorClientProps = {
  baseProfiles: Profile[];
};

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

function toFormState(profile?: Profile): ProfileFormState {
  if (!profile) {
    return {
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
  }

  return {
    id: profile.id,
    name: profile.name,
    role: profile.role,
    age: profile.age,
    catchCopy: profile.catchCopy,
    about1: profile.about[0] ?? "",
    about2: profile.about[1] ?? "",
    about3: profile.about[2] ?? "",
    tags: profile.tags.join(", "),
  };
}

function makeProfileId(name: string): string {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || `profile-${Date.now()}`;
}

function fromFormState(form: ProfileFormState, fallbackId?: string): Profile {
  const candidateId = form.id.trim() || makeProfileId(form.name);
  const id = fallbackId || candidateId;

  return {
    id,
    name: form.name.trim(),
    role: form.role.trim(),
    age: form.age.trim(),
    catchCopy: form.catchCopy.trim(),
    about: [form.about1.trim(), form.about2.trim(), form.about3.trim()],
    tags: form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  };
}

function isProfileList(value: unknown): value is Profile[] {
  return Array.isArray(value) && value.every((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }
    const candidate = item as Record<string, unknown>;
    return (
      typeof candidate.id === "string" &&
      typeof candidate.name === "string" &&
      typeof candidate.role === "string" &&
      typeof candidate.age === "string" &&
      typeof candidate.catchCopy === "string" &&
      Array.isArray(candidate.about) &&
      Array.isArray(candidate.tags)
    );
  });
}

export function ProfileEditorClient({ baseProfiles }: ProfileEditorClientProps) {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>(baseProfiles);
  const [form, setForm] = useState<ProfileFormState>(() => toFormState());
  const [message, setMessage] = useState("");

  useEffect(() => {
    setProfiles(loadProfiles(baseProfiles));
  }, [baseProfiles]);

  const saveAndReflect = (nextProfiles: Profile[], nextMessage: string) => {
    setProfiles(nextProfiles);
    saveProfiles(nextProfiles);
    setMessage(nextMessage);
  };

  const handleSubscribe = () => {
    if (!form.name.trim() || !form.role.trim()) {
      setMessage("名前と職業は必須です。");
      return;
    }

    const nextProfile = fromFormState(form);
    const nextProfiles = [...profiles, nextProfile];

    saveAndReflect(nextProfiles, "新規登録しました。プロフィール選択画面に戻ります。");
    router.push("/profiles");
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      const list = Array.isArray(parsed) ? parsed : parsed?.profiles;
      if (!isProfileList(list)) {
        setMessage("JSON形式が正しくありません。");
        return;
      }

      const importedProfiles = list.map((profile) => ({
        ...profile,
        about: [...profile.about, "", ""].slice(0, 3),
        tags: profile.tags.map((tag) => String(tag).trim()).filter(Boolean),
      }));

      saveAndReflect(importedProfiles, "JSONをインポートしました。");
      setForm(toFormState());
      event.target.value = "";
    } catch {
      setMessage("JSONの読み込みに失敗しました。");
    }
  };

  return (
    <main className="ui-shell min-h-screen">
      <section className="ui-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="ui-title">プロフィール新規登録</h1>
            <p className="ui-subtitle">
              この画面では新規アカウントの登録のみ行えます。
            </p>
          </div>
          <Link href="/profiles" className="ui-btn-secondary">
            プロフィール選択へ戻る
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <input
            value={form.id}
            onChange={(event) => setForm((prev) => ({ ...prev, id: event.target.value }))}
            className="ui-input"
            placeholder="ID（任意）"
          />
          <input
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="ui-input"
            placeholder="名前"
          />
          <input
            value={form.role}
            onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
            className="ui-input"
            placeholder="職業"
          />
          <input
            value={form.age}
            onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
            className="ui-input"
            placeholder="年齢"
          />
          <input
            value={form.catchCopy}
            onChange={(event) => setForm((prev) => ({ ...prev, catchCopy: event.target.value }))}
            className="ui-input md:col-span-2"
            placeholder="キャッチコピー"
          />
          <textarea
            value={form.about1}
            onChange={(event) => setForm((prev) => ({ ...prev, about1: event.target.value }))}
            className="ui-textarea md:col-span-2"
            placeholder="自己紹介 1"
          />
          <textarea
            value={form.about2}
            onChange={(event) => setForm((prev) => ({ ...prev, about2: event.target.value }))}
            className="ui-textarea md:col-span-2"
            placeholder="自己紹介 2"
          />
          <textarea
            value={form.about3}
            onChange={(event) => setForm((prev) => ({ ...prev, about3: event.target.value }))}
            className="ui-textarea md:col-span-2"
            placeholder="自己紹介 3"
          />
          <input
            value={form.tags}
            onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
            className="ui-input md:col-span-2"
            placeholder="タグ（カンマ区切り）"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSubscribe}
            className="ui-btn-primary"
          >
            新規登録
          </button>
          <label className="ui-btn-secondary cursor-pointer gap-2">
            JSONをインポート
            <input type="file" accept=".json,application/json" className="hidden" onChange={handleImport} />
          </label>
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        </div>
      </section>
    </main>
  );
}
