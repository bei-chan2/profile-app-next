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
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-10">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold tracking-wide text-slate-500">PROFILE APP</p>
        <h1 className="mt-2 text-2xl font-bold">ログイン</h1>
        <p className="mt-2 text-sm text-slate-600">
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
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-500"
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
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-500"
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
            className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            ログインして進む
          </button>
        </form>
      </section>
    </main>
  );
}
