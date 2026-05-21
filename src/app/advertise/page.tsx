import { redirect } from "next/navigation";

export const metadata = {
  title: "Advertise | Builder Deals Intel",
  description: "Advertise to builders through verified deal placements, sponsorships, and affiliate partnerships."
};

export default function AdvertisePage() {
  redirect("/sponsor");
}
