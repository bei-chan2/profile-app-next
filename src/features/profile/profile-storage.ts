import type { Profile } from "@/features/profile/profile-data";

export const PROFILE_STORAGE_KEY = "profile-app-profiles";

function isProfile(value: unknown): value is Profile {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const hasStringArray = (key: string) =>
    Array.isArray(candidate[key]) && (candidate[key] as unknown[]).every((item) => typeof item === "string");

  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.role === "string" &&
    typeof candidate.age === "string" &&
    typeof candidate.catchCopy === "string" &&
    hasStringArray("about") &&
    hasStringArray("tags")
  );
}

function normalizeProfile(profile: Profile): Profile {
  const about = [...profile.about, "", ""].slice(0, 3);
  const tags = profile.tags.map((tag) => tag.trim()).filter(Boolean);

  return {
    ...profile,
    imagePath:
      profile.imagePath ??
      (profile.id === "ayaka" ? "/images/sakura_profile.png" : "/images/profile_image.jpg"),
    name: profile.name.trim(),
    role: profile.role.trim(),
    age: profile.age.trim(),
    catchCopy: profile.catchCopy.trim(),
    about,
    tags,
  };
}

function migrateAyakaToSakura(profile: Profile): Profile {
  if (profile.id !== "ayaka") {
    return profile;
  }

  const isLegacyAyaka =
    profile.name === "あやか" ||
    profile.role === "フィットネスインストラクター" ||
    profile.catchCopy === "楽しく動いて、心も体もリフレッシュ。";

  if (!isLegacyAyaka) {
    return {
      ...profile,
      imagePath: profile.imagePath ?? "/images/sakura_profile.png",
    };
  }

  return {
    ...profile,
    imagePath: "/images/sakura_profile.png",
    name: "林 さくら",
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
  };
}

export function loadProfiles(baseProfiles: Profile[]): Profile[] {
  if (typeof window === "undefined") {
    return baseProfiles.map(normalizeProfile);
  }

  const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) {
    return baseProfiles.map(normalizeProfile);
  }

  try {
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.profiles) ? parsed.profiles : null;

    if (!list) {
      return baseProfiles.map(normalizeProfile);
    }

    const valid = list.filter(isProfile).map(normalizeProfile).map(migrateAyakaToSakura);
    return valid.length > 0 ? valid : baseProfiles.map(normalizeProfile);
  } catch {
    return baseProfiles.map(normalizeProfile);
  }
}

export function saveProfiles(profiles: Profile[]): void {
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profiles.map(normalizeProfile)));
}
