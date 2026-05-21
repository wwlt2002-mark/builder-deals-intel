import { unsubscribeByToken } from "@/lib/storage";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ token: string }>;
};

export const metadata = {
  title: "Unsubscribe | Builder Deals Intel"
};

export default async function UnsubscribePage({ params }: Props) {
  const { token } = await params;
  const ok = await unsubscribeByToken(token);

  return (
    <div className="page">
      <section className="page-title">
        <span className="eyebrow">Newsletter</span>
        <h1>{ok ? "You are unsubscribed." : "Unsubscribe link not found."}</h1>
        <p>
          {ok
            ? "This email address will no longer receive the daily builder deals brief."
            : "The link may be expired, already used, or not connected to an active subscriber."}
        </p>
      </section>
    </div>
  );
}
