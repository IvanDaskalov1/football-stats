import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch("https://api.football-data.org/v4/matches", {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_API_KEY || "",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      return NextResponse.json({ error: "Неуспешно зареждане на мачове" }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json({ matches: data.matches })
  } catch (error) {
    return NextResponse.json({ error: "Вътрешна грешка на сървъра" }, { status: 500 })
  }
}