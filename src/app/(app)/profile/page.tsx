import { redirect } from "next/navigation";
import { UserCircle, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdvisorProfileForm } from "@/components/AdvisorProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "advisor") {
    redirect("/dashboard");
  }

  const { data: advisorProfile } = await supabase
    .from("advisor_profiles")
    .select("subjects, bio, hourly_rate, rating_avg")
    .eq("user_id", user.id)
    .single();

  const { count: reviewCount } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("advisor_id", user.id);

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-10">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-brand/10">
          <UserCircle className="size-5 text-brand-dark" />
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">Mi perfil</h1>
      </div>
      <p className="text-sm text-ink/50">
        Los estudiantes verán esta información cuando envíes una propuesta.
      </p>

      {advisorProfile?.rating_avg ? (
        <div className="flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-3 shadow-md shadow-ink/5">
          <Star className="size-5 fill-status-pending text-status-pending" />
          <span className="font-bold text-ink">{advisorProfile.rating_avg}</span>
          <span className="text-sm text-ink/50">
            ({reviewCount ?? 0} {reviewCount === 1 ? "calificación" : "calificaciones"})
          </span>
        </div>
      ) : (
        <p className="text-sm text-ink/50">Aún no tienes calificaciones.</p>
      )}

      <AdvisorProfileForm
        userId={user.id}
        initialSubjects={advisorProfile?.subjects?.join(", ") ?? ""}
        initialBio={advisorProfile?.bio ?? ""}
        initialHourlyRate={advisorProfile?.hourly_rate?.toString() ?? ""}
      />
    </main>
  );
}
