import { fetchProfile } from "@/lib/data"
import HeroClient from "@/components/hero-client"

export default async function Hero() {
  const profile = await fetchProfile()
  return <HeroClient profile={profile} />
}
