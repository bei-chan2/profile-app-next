"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Profile } from "@/features/profile/profile-data";
import { loadProfiles, saveProfiles } from "@/features/profile/profile-storage";
import { TodoManagementTable } from "@/features/todo/todo-management-table";

function stagger(n: number): CSSProperties {
  return { ["--stagger"]: n } as CSSProperties;
}

type ProfileDetailViewProps = {
  profileId: string;
  baseProfiles: Profile[];
};

export function ProfileDetailView({ profileId, baseProfiles }: ProfileDetailViewProps) {
  const router = useRouter();
  const initialProfiles = useMemo(() => loadProfiles(baseProfiles), [baseProfiles]);
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [message, setMessage] = useState("");
  const [isEditDeleteOpen, setIsEditDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    role: "",
    age: "",
    catchCopy: "",
    about1: "",
    about2: "",
    about3: "",
    tags: "",
  });

  const displayProfile = useMemo(() => {
    return profiles.find((profile) => profile.id === profileId) ?? null;
  }, [profiles, profileId]);
  const specialties = displayProfile?.specialties ?? [
    "ダイエット・体重管理",
    "筋トレ・ボディメイク",
    "健康維持・姿勢改善",
    "スポーツパフォーマンス向上",
  ];
  const hobbies = displayProfile?.hobbies ?? [
    "スノーボード",
    "ジム・自重トレーニング",
    "アウトドア・ハイキング",
  ];
  const credentials = displayProfile?.credentials ?? [
    "NSCA-CPT（全米ストレングス＆コンディショニング協会認定パーソナルトレーナー）",
    "薬学部卒業後医薬品開発職 → 独立してパーソナルトレーナーとして活動中",
  ];

  if (!displayProfile) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">プロフィールが見つかりません</h1>
          <p className="mt-2 text-sm text-slate-600">
            一覧に戻って、プロフィールを選択してください。
          </p>
          <Link
            href="/profiles"
            className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            プロフィール選択へ戻る
          </Link>
        </section>
      </main>
    );
  }

  const formValues = {
    name: editForm.name || displayProfile.name,
    role: editForm.role || displayProfile.role,
    age: editForm.age || displayProfile.age,
    catchCopy: editForm.catchCopy || displayProfile.catchCopy,
    about1: editForm.about1 || displayProfile.about[0] || "",
    about2: editForm.about2 || displayProfile.about[1] || "",
    about3: editForm.about3 || displayProfile.about[2] || "",
    tags: editForm.tags || displayProfile.tags.join(", "),
  };

  const handleUpdateProfile = () => {
    const nextProfile: Profile = {
      ...displayProfile,
      name: formValues.name.trim() || displayProfile.name,
      role: formValues.role.trim() || displayProfile.role,
      age: formValues.age.trim() || displayProfile.age,
      catchCopy: formValues.catchCopy.trim() || displayProfile.catchCopy,
      about: [
        formValues.about1.trim() || displayProfile.about[0] || "",
        formValues.about2.trim() || displayProfile.about[1] || "",
        formValues.about3.trim() || displayProfile.about[2] || "",
      ],
      tags: formValues.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    const nextProfiles = profiles.map((profile) => (profile.id === displayProfile.id ? nextProfile : profile));
    setProfiles(nextProfiles);
    saveProfiles(nextProfiles);
    setEditForm({
      name: "",
      role: "",
      age: "",
      catchCopy: "",
      about1: "",
      about2: "",
      about3: "",
      tags: "",
    });
    setMessage("プロフィールを更新しました。");
  };

  const handleDeleteProfile = () => {
    const confirmed = window.confirm(`「${displayProfile.name}」を削除しますか？`);
    if (!confirmed) {
      return;
    }

    const nextProfiles = profiles.filter((profile) => profile.id !== displayProfile.id);
    saveProfiles(nextProfiles);
    router.push("/profiles");
  };

  return (
    <>
      <a className="skip-link" href="#main">
        メインコンテンツへ
      </a>

      <header className="site-header" role="banner">
        <nav className="site-nav" aria-label="ページ内ナビゲーション">
          <a href="#hero" className="site-nav__brand">
            {displayProfile.name}
          </a>
          <ul className="site-nav__links">
            <li>
              <Link href="/profiles">プロフィール選択へ戻る</Link>
            </li>
            <li>
              <Link href="/logout">ログアウト</Link>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#specialties">得意分野</a>
            </li>
            <li>
              <a href="#hobbies">趣味</a>
            </li>
            <li>
              <a href="#credentials">資格・経歴</a>
            </li>
            <li>
              <a href="#todo">To Do</a>
            </li>
            <li>
              <button
                type="button"
                className="todo-table__task-trigger"
                onClick={() => setIsEditDeleteOpen((prev) => !prev)}
              >
                {isEditDeleteOpen ? "edit/delete を閉じる" : "edit/delete を開く"}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main">
        <section id="hero" className="hero section-animate" style={stagger(0)}>
          <div className="hero__inner">
            <figure className="hero__figure">
              <Image
                className="hero__photo"
                src={displayProfile.imagePath ?? "/images/profile_image.jpg"}
                width={300}
                height={300}
                alt={`${displayProfile.name}のプロフィール写真（プレースホルダー）`}
                priority
              />
            </figure>
            <div className="hero__text">
              <p className="hero__role">{displayProfile.role}</p>
              <h1 className="hero__name">{displayProfile.name}</h1>
              <p className="hero__catch">{displayProfile.catchCopy}</p>
              <dl className="hero__meta">
                <div className="hero__meta-row">
                  <dt>年齢</dt>
                  <dd>{displayProfile.age}</dd>
                </div>
                <div className="hero__meta-row">
                  <dt>職業</dt>
                  <dd>{displayProfile.role}</dd>
                </div>
              </dl>
              {displayProfile.tags.length > 0 ? (
                <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                  {displayProfile.tags.map((tag, index) => (
                    <span key={`${tag}-${index}`} className="rounded-full bg-white px-3 py-1 text-xs text-slate-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section id="about" className="section section-animate" style={stagger(1)}>
          <div className="section__inner">
            <h2 className="section__title">
              <span className="section__title-en">About</span>
              <span className="section__title-ja">自己紹介</span>
            </h2>
            <div className="prose">
              {displayProfile.about.slice(0, 2).map((line) => (
                <p key={line}>{line}</p>
              ))}
              <p className="prose__highlight">{displayProfile.about[2]}</p>
            </div>
          </div>
        </section>

        <section
          id="specialties"
          className="section section--alt section-animate"
          style={stagger(2)}
        >
          <div className="section__inner">
            <h2 className="section__title">
              <span className="section__title-en">Focus</span>
              <span className="section__title-ja">得意分野</span>
            </h2>
            <ul className="card-grid">
              {specialties.map((item, index) => (
                <li className="specialty-card" key={item}>
                  <span className="specialty-card__icon" aria-hidden="true">
                    {["🔥", "💪", "🧘", "🏃", "🎨", "✨"][index % 6]}
                  </span>
                  <h3 className="specialty-card__title">{item}</h3>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="hobbies" className="section section-animate" style={stagger(3)}>
          <div className="section__inner">
            <h2 className="section__title">
              <span className="section__title-en">Lifestyle</span>
              <span className="section__title-ja">趣味</span>
            </h2>
            <ul className="hobby-list">
              {hobbies.map((item, index) => (
                <li className="hobby-item" key={item}>
                  <span className="hobby-item__icon" aria-hidden="true">
                    {["🏂", "🏋️", "🥾", "☕", "🎬", "🎹", "🌸", "✈️"][index % 8]}
                  </span>
                  <div className="hobby-item__body">
                    <h3 className="hobby-item__title">{item}</h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="credentials"
          className="section section--alt section-animate"
          style={stagger(4)}
        >
          <div className="section__inner">
            <h2 className="section__title">
              <span className="section__title-en">Background</span>
              <span className="section__title-ja">資格・経歴</span>
            </h2>
            <div className="credentials">
              <div className="credentials__block">
                <h3 className="credentials__label">資格・経歴</h3>
                {credentials.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <TodoManagementTable
          profileId={displayProfile.id}
          profileName={displayProfile.name}
          defaultTodos={displayProfile.todoDefaults}
        />

        {isEditDeleteOpen ? (
          <section id="edit-delete" className="section section--alt section-animate" style={stagger(5)}>
            <div className="section__inner">
              <h2 className="section__title">
                <span className="section__title-en">edit/delete</span>
                <span className="section__title-ja">アカウント編集・削除</span>
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={formValues.name}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="名前"
                />
                <input
                  value={formValues.role}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, role: event.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="職業"
                />
                <input
                  value={formValues.age}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, age: event.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="年齢"
                />
                <input
                  value={formValues.catchCopy}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, catchCopy: event.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="キャッチコピー"
                />
                <textarea
                  value={formValues.about1}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, about1: event.target.value }))}
                  className="min-h-20 rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                  placeholder="自己紹介 1"
                />
                <textarea
                  value={formValues.about2}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, about2: event.target.value }))}
                  className="min-h-20 rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                  placeholder="自己紹介 2"
                />
                <textarea
                  value={formValues.about3}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, about3: event.target.value }))}
                  className="min-h-20 rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                  placeholder="自己紹介 3"
                />
                <input
                  value={formValues.tags}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, tags: event.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                  placeholder="タグ（カンマ区切り）"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  更新
                </button>
                <button
                  type="button"
                  onClick={handleDeleteProfile}
                  className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  削除
                </button>
                {message ? <p className="text-sm text-slate-600">{message}</p> : null}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <footer className="site-footer section-animate" style={stagger(6)}>
        <p className="site-footer__copy">&copy; 2026 {displayProfile.name}</p>
      </footer>
    </>
  );
}
