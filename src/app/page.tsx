import type { CSSProperties } from "react";
import Image from "next/image";
import { TodoManagementTable } from "@/features/todo/todo-management-table";

function stagger(n: number): CSSProperties {
  return { ["--stagger"]: n } as CSSProperties;
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        メインコンテンツへ
      </a>

      <header className="site-header" role="banner">
        <nav className="site-nav" aria-label="ページ内ナビゲーション">
          <a href="#hero" className="site-nav__brand">
            べいちゃん
          </a>
          <ul className="site-nav__links">
            <li>
              <a href="#hero">Top</a>
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
          </ul>
        </nav>
      </header>

      <main id="main">
        <section id="hero" className="hero section-animate" style={stagger(0)}>
          <div className="hero__inner">
            <figure className="hero__figure">
              <Image
                className="hero__photo"
                src="/images/profile_image.jpg"
                width={300}
                height={300}
                alt="べいちゃんのプロフィール写真（プレースホルダー）"
                priority
              />
            </figure>
            <div className="hero__text">
              <p className="hero__role">Personal Trainer</p>
              <h1 className="hero__name">べいちゃん</h1>
              <p className="hero__catch">あなたの体と向き合う、一番の味方になります。</p>
              <dl className="hero__meta">
                <div className="hero__meta-row">
                  <dt>年齢</dt>
                  <dd>30歳くらい</dd>
                </div>
                <div className="hero__meta-row">
                  <dt>職業</dt>
                  <dd>パーソナルトレーナー</dd>
                </div>
              </dl>
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
              <p>
                30歳のパーソナルトレーナーとして、クライアント一人ひとりの目標に寄り添いながらサポートしています。
              </p>
              <p>
                今年からスノーボードにはまり、趣味として雪山に出かけるのが楽しみです。体を動かすことが好きで、日々クライアントと一緒に健康を追求しています。
              </p>
              <p className="prose__highlight">体を変えることは、人生を変えること。一緒に始めましょう！</p>
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
              <li className="specialty-card">
                <span className="specialty-card__icon" aria-hidden="true">
                  🔥
                </span>
                <h3 className="specialty-card__title">ダイエット・体重管理</h3>
                <p className="specialty-card__desc">
                  無理のない食事・運動の習慣づくりからサポートします。
                </p>
              </li>
              <li className="specialty-card">
                <span className="specialty-card__icon" aria-hidden="true">
                  💪
                </span>
                <h3 className="specialty-card__title">筋トレ・ボディメイク</h3>
                <p className="specialty-card__desc">
                  フォームと負荷のバランスを整え、理想のラインを目指します。
                </p>
              </li>
              <li className="specialty-card">
                <span className="specialty-card__icon" aria-hidden="true">
                  🧘
                </span>
                <h3 className="specialty-card__title">健康維持・姿勢改善</h3>
                <p className="specialty-card__desc">
                  日常の疲れやすさ、猫背など、身体の使い方から整えます。
                </p>
              </li>
              <li className="specialty-card">
                <span className="specialty-card__icon" aria-hidden="true">
                  🏃
                </span>
                <h3 className="specialty-card__title">スポーツパフォーマンス向上</h3>
                <p className="specialty-card__desc">
                  競技に必要な筋力・柔軟性・持久力をトレーニングで底上げします。
                </p>
              </li>
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
              <li className="hobby-item">
                <span className="hobby-item__icon" aria-hidden="true">
                  🏂
                </span>
                <div className="hobby-item__body">
                  <h3 className="hobby-item__title">スノーボード</h3>
                  <p>
                    今年から本格的にハマり中！週末は雪山へ。滑るだけでなく、体幹や下半身の使い方も日々のトレーニングに活かしています。
                  </p>
                </div>
              </li>
              <li className="hobby-item">
                <span className="hobby-item__icon" aria-hidden="true">
                  🏋️
                </span>
                <div className="hobby-item__body">
                  <h3 className="hobby-item__title">ジム・自重トレーニング</h3>
                  <p>
                    仕事でもプライベートでも、体を鍛えるのが好きです。新しいメニューや器具を試すのも楽しみのひとつです。
                  </p>
                </div>
              </li>
              <li className="hobby-item">
                <span className="hobby-item__icon" aria-hidden="true">
                  🥾
                </span>
                <div className="hobby-item__body">
                  <h3 className="hobby-item__title">アウトドア・ハイキング</h3>
                  <p>自然の中を歩く時間でリフレッシュ。有酸素と景色の両方を楽しみます。</p>
                </div>
              </li>
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
                <h3 className="credentials__label">取得資格（例）</h3>
                <p>
                  NSCA-CPT（全米ストレングス＆コンディショニング協会認定パーソナルトレーナー）
                </p>
              </div>
              <div className="credentials__block">
                <h3 className="credentials__label">経歴（例）</h3>
                <p>薬学部卒業後医薬品開発職 → 独立してパーソナルトレーナーとして活動中</p>
              </div>
            </div>
          </div>
        </section>

        <TodoManagementTable />
      </main>

      <footer className="site-footer section-animate" style={stagger(5)}>
        <p className="site-footer__copy">&copy; 2026 べいちゃん</p>
      </footer>
    </>
  );
}
