"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Profile } from "@/features/profile/profile-data";
import { loadProfiles } from "@/features/profile/profile-storage";

type ProfileSelectionClientProps = {
  baseProfiles: Profile[];
};

export function ProfileSelectionClient({ baseProfiles }: ProfileSelectionClientProps) {
  const [profiles, setProfiles] = useState<Profile[]>(baseProfiles);

  useEffect(() => {
    setProfiles(loadProfiles(baseProfiles));
  }, [baseProfiles]);

  return (
    <>
      <section className="ui-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="ui-title">プロフィールを選択</h1>
            <p className="ui-subtitle">
              ログインしました。表示したいプロフィールを選択してください。
            </p>
          </div>
          <Link href="/logout" className="ui-btn-secondary">
            ログアウト
          </Link>
        </div>
      </section>

      <section className="ui-card mt-6">
        <h2 className="text-xl font-bold text-slate-900">プロフィール新規登録</h2>
        <p className="ui-subtitle">
          編集画面を開いて、新規登録を行えます。
        </p>
        <Link href="/profiles/edit" className="ui-btn-primary mt-4">
          プロフィール新規登録画面を開く
        </Link>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {profiles.map((profile) => (
          <article
            key={profile.id}
            className="rounded-xl border border-slate-200/80 bg-white/95 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-xs font-semibold tracking-wide text-slate-500">PROFILE</p>
            <h2 className="mt-2 text-xl font-bold">{profile.name}</h2>
            <p className="mt-1 text-sm text-slate-700">{profile.role}</p>
            <p className="mt-1 text-sm text-slate-600">年齢: {profile.age}</p>
            <p className="mt-3 text-sm text-slate-600">{profile.catchCopy}</p>
            {profile.tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
            <Link
              href={`/profiles/${profile.id}`}
              className="ui-btn-primary mt-4"
            >
              詳細を見る
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
