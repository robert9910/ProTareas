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
        <UserCircle className="size-6 text-sky-600" />
        <h1 className="text-2xl font-semibold text-slate-900">Mi perfil</h1>
      </div>
      <p className="text-sm text-slate-500">
        Los estudiantes verán esta información cuando envíes una propuesta.
      </p>

      {advisorProfile?.rating_avg ? (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Star className="size-5 fill-amber-400 text-amber-400" />
          <span className="font-medium text-slate-900">{advisorProfile.rating_avg}</span>
          <span className="text-sm text-slate-500">
            ({reviewCount ?? 0} {reviewCount === 1 ? "calificación" : "calificaciones"})
          </span>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Aún no tienes calificaciones.</p>
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
