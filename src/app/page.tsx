import { redirect } from "next/navigation";
import { createSession, isValidLogin } from "@/features/auth/simple-auth";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const hasError = params.error === "1";

  async function loginAction(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!isValidLogin(email, password)) {
      redirect("/?error=1");
    }

    await createSession();
    redirect("/profiles");
  }

  return (
    <main className="ui-shell flex min-h-screen max-w-md items-center">
      <section className="ui-card w-full">
        <p className="text-xs font-semibold tracking-[0.16em] text-indigo-500">PROFILE APP</p>
        <h1 className="ui-title mt-2">ログイン</h1>
        <p className="ui-subtitle">
          アカウント情報を入力して、プロフィール選択画面に進んでください。
        </p>

        <form action={loginAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              メールアドレスまたはユーザーネーム
            </label>
            <input
              id="email"
              name="email"
              type="text"
              required
              className="ui-input"
              placeholder="メールアドレスまたはユーザーネーム"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="ui-input"
              placeholder="********"
            />
          </div>
          {hasError ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              メールアドレスまたはパスワードが正しくありません。
            </p>
          ) : null}
          <button
            type="submit"
            className="ui-btn-primary w-full py-2.5"
          >
            ログインして進む
          </button>
        </form>
      </section>
    </main>
  );
}
