"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Profile } from "@/features/profile/profile-data";
import { TodoManagementTable } from "@/features/todo/todo-management-table";

function stagger(n: number): CSSProperties {
  return { ["--stagger"]: n } as CSSProperties;
}

type ProfileDetailViewProps = {
  profile: Profile;
};

export function ProfileDetailView({ profile }: ProfileDetailViewProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isEditDeleteOpen, setIsEditDeleteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

  const specialties = profile.specialties ?? [
    "ダイエット・体重管理",
    "筋トレ・ボディメイク",
    "健康維持・姿勢改善",
    "スポーツパフォーマンス向上",
  ];
  const hobbies = profile.hobbies ?? ["スノーボード", "ジム・自重トレーニング", "アウトドア・ハイキング"];
  const credentials = profile.credentials ?? [
    "NSCA-CPT（全米ストレングス＆コンディショニング協会認定パーソナルトレーナー）",
    "薬学部卒業後医薬品開発職 → 独立してパーソナルトレーナーとして活動中",
  ];

  const formValues = {
    name: editForm.name || profile.name,
    role: editForm.role || profile.role,
    age: editForm.age || profile.age,
    catchCopy: editForm.catchCopy || profile.catchCopy,
    about1: editForm.about1 || profile.about[0] || "",
    about2: editForm.about2 || profile.about[1] || "",
    about3: editForm.about3 || profile.about[2] || "",
    tags: editForm.tags || profile.tags.join(", "),
  };

  const handleUpdateProfile = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/profiles/${profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formValues.name.trim() || profile.name,
          role: formValues.role.trim() || profile.role,
          age: formValues.age.trim() || profile.age,
          catchCopy: formValues.catchCopy.trim() || profile.catchCopy,
          about: [
            formValues.about1.trim() || profile.about[0] || "",
            formValues.about2.trim() || profile.about[1] || "",
            formValues.about3.trim() || profile.about[2] || "",
          ],
          tags: formValues.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      if (res.ok) {
        setEditForm({ name: "", role: "", age: "", catchCopy: "", about1: "", about2: "", about3: "", tags: "" });
        setMessage("プロフィールを更新しました。");
        router.refresh();
      } else {
        setMessage("更新に失敗しました。");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm(`「${profile.name}」を削除しますか？`)) return;

    const res = await fetch(`/api/profiles/${profile.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/profiles");
    } else {
      setMessage("削除に失敗しました。");
    }
  };

  return (
    <>
      <a className="skip-link" href="#main">
        メインコンテンツへ
      </a>

      <header className="site-header" role="banner">
        <nav className="site-nav" aria-label="ページ内ナビゲーション">
          <a href="#hero" className="site-nav__brand">
            {profile.name}
          </a>
          <button
            type="button"
            className="site-nav__menu-toggle"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="profile-nav-links"
          >
            {isMobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          </button>
          <ul
            id="profile-nav-links"
            className={`site-nav__links ${isMobileMenuOpen ? "site-nav__links--open" : ""}`}
          >
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
                src={profile.imagePath ?? "/images/profile_image.jpg"}
                width={300}
                height={300}
                alt={`${profile.name}のプロフィール写真`}
                priority
              />
            </figure>
            <div className="hero__text">
              <p className="hero__role">{profile.role}</p>
              <h1 className="hero__name">{profile.name}</h1>
              <p className="hero__catch">{profile.catchCopy}</p>
              <dl className="hero__meta">
                <div className="hero__meta-row">
                  <dt>年齢</dt>
                  <dd>{profile.age}</dd>
                </div>
                <div className="hero__meta-row">
                  <dt>職業</dt>
                  <dd>{profile.role}</dd>
                </div>
              </dl>
              {profile.tags.length > 0 ? (
                <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                  {profile.tags.map((tag, index) => (
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
              {profile.about.slice(0, 2).map((line) => (
                <p key={line}>{line}</p>
              ))}
              <p className="prose__highlight">{profile.about[2]}</p>
            </div>
          </div>
        </section>

        <section id="specialties" className="section section--alt section-animate" style={stagger(2)}>
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

        <section id="credentials" className="section section--alt section-animate" style={stagger(4)}>
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

        <TodoManagementTable profileId={profile.id} profileName={profile.name} />

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
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="名前"
                />
                <input
                  value={formValues.role}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="職業"
                />
                <input
                  value={formValues.age}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, age: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="年齢"
                />
                <input
                  value={formValues.catchCopy}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, catchCopy: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="キャッチコピー"
                />
                <textarea
                  value={formValues.about1}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, about1: e.target.value }))}
                  className="min-h-20 rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                  placeholder="自己紹介 1"
                />
                <textarea
                  value={formValues.about2}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, about2: e.target.value }))}
                  className="min-h-20 rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                  placeholder="自己紹介 2"
                />
                <textarea
                  value={formValues.about3}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, about3: e.target.value }))}
                  className="min-h-20 rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                  placeholder="自己紹介 3"
                />
                <input
                  value={formValues.tags}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, tags: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                  placeholder="タグ（カンマ区切り）"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  disabled={submitting}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                >
                  {submitting ? "更新中..." : "更新"}
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

      <nav className="mobile-bottom-nav" aria-label="モバイルページ内ナビゲーション">
        <a href="#hero">Top</a>
        <a href="#about">About</a>
        <a href="#todo">To Do</a>
        <button type="button" onClick={() => setIsEditDeleteOpen((prev) => !prev)}>
          {isEditDeleteOpen ? "edit閉じる" : "edit/delete"}
        </button>
      </nav>

      <footer className="site-footer section-animate" style={stagger(6)}>
        <p className="site-footer__copy">&copy; 2026 {profile.name}</p>
      </footer>
    </>
  );
}
