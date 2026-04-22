export type Profile = {
  id: string;
  name: string;
  imagePath?: string;
  role: string;
  age: string;
  catchCopy: string;
  about: string[];
  tags: string[];
  specialties?: string[];
  hobbies?: string[];
  credentials?: string[];
  todoDefaults?: {
    title: string;
    createdAt: string;
    note?: string;
    completed?: boolean;
  }[];
};

export const profiles: Profile[] = [
  {
    id: "beichan",
    name: "べいちゃん",
    imagePath: "/images/profile_image.jpg",
    role: "パーソナルトレーナー",
    age: "30歳くらい",
    catchCopy: "あなたの体と向き合う、一番の味方になります。",
    about: [
      "30歳のパーソナルトレーナーとして、クライアント一人ひとりの目標に寄り添いながらサポートしています。",
      "今年からスノーボードにはまり、趣味として雪山に出かけるのが楽しみです。体を動かすことが好きで、日々クライアントと一緒に健康を追求しています。",
      "体を変えることは、人生を変えること。一緒に始めましょう！",
    ],
    tags: ["筋トレ", "ダイエット", "姿勢改善"],
    specialties: [
      "ダイエット・体重管理",
      "筋トレ・ボディメイク",
      "健康維持・姿勢改善",
      "スポーツパフォーマンス向上",
    ],
    hobbies: ["スノーボード", "ジム・自重トレーニング", "アウトドア・ハイキング"],
    credentials: [
      "NSCA-CPT（全米ストレングス＆コンディショニング協会認定パーソナルトレーナー）",
      "薬学部卒業後医薬品開発職 → 独立してパーソナルトレーナーとして活動中",
    ],
    todoDefaults: [
      { title: "初回カウンセリングの準備", createdAt: "2026-04-10" },
      { title: "トレーニングメニューの見直し", createdAt: "2026-04-11" },
    ],
  },
  {
    id: "ayaka",
    name: "林 さくら",
    imagePath: "/images/sakura_profile.png",
    role: "フリーランス UXデザイナー ＆ クリエイティブディレクター",
    age: "29歳",
    catchCopy: "使いやすくて、かわいい。",
    about: [
      "東京を拠点に活動するフリーランス UXデザイナー＆クリエイティブディレクター。デザイン歴は7年です。",
      "モットーは「使いやすくて、かわいい」。好きな言葉は「美しさは機能である」。",
      "ユーザー体験とビジュアルの両立を大切に、30社以上のプロジェクトを支援してきました。",
    ],
    tags: ["UXデザイン", "ブランディング", "React", "フォトディレクション"],
    specialties: [
      "UI/UXデザイン（Figma・プロトタイプ設計・ユーザーリサーチ）",
      "ブランディング（ロゴ・VI開発・トーン＆マナー設計）",
      "フロントエンド（HTML / CSS / React）",
      "フォトディレクション（商品・ポートレート撮影の方向性設計）",
    ],
    hobbies: [
      "カフェ巡り",
      "デザイン書収集",
      "フラワーアレンジメント",
      "映画鑑賞（主にA24作品）",
      "旅行（ヨーロッパ好き）",
      "ピアノ",
      "料理・お菓子作り",
      "手帳・文房具",
    ],
    credentials: [
      "2014年：多摩美術大学 グラフィックデザイン学科 卒業",
      "2015年：Webクリエイター能力認定試験（上級）取得",
      "2014〜2019年：株式会社〇〇クリエイティブ UIデザイナー（チームリーダー経験あり）",
      "2020年：Google UX Design Certificate 取得",
      "2020年〜現在：フリーランス クリエイティブディレクター（30社以上支援）",
    ],
    todoDefaults: [
      { title: "Motion Design（After Effects）を習得する", createdAt: "2026-04-12" },
      { title: "パリのデザイン展示会に参加する", createdAt: "2026-04-13" },
      { title: "コスメブランドのオリジナルパッケージデザインを手掛ける", createdAt: "2026-04-14" },
      { title: "デザイン思考のオンライン講座を開設する", createdAt: "2026-04-15" },
      { title: "英語でのデザインプレゼンをできるようにする", createdAt: "2026-04-16" },
      {
        title: "ポートフォリオサイトをリニューアルする（完了）",
        createdAt: "2026-04-11",
        completed: true,
      },
    ],
  },
];
