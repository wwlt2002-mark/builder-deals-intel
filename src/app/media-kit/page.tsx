import { redirect } from "next/navigation";

export const metadata = {
  title: "Media Kit | Builder Deals Intel",
  description: "Sponsor and affiliate partnership options for reaching builders."
};

export default function MediaKitPage() {
  redirect("/sponsor");
}
