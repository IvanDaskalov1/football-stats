import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get the URL parameters
    const { searchParams } = new URL(request.url);
    
    // Default to a 14-day window if no dates provided
    const today = new Date();
    const defaultFrom = new Date(today);
    defaultFrom.setDate(today.getDate() - 7);
    const defaultTo = new Date(today);
    defaultTo.setDate(today.getDate() + 7);
    
    // Format dates as YYYY-MM-DD
    const dateFrom = searchParams.get('dateFrom') || defaultFrom.toISOString().split('T')[0];
    const dateTo = searchParams.get('dateTo') || defaultTo.toISOString().split('T')[0];
    
    console.log(`Fetching matches from ${dateFrom} to ${dateTo}`);
    
    // Try with the competitions endpoint which might be more flexible
    const res = await fetch(
      `https://api.football-data.org/v4/competitions/CL/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`, 
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_API_KEY || "",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      try {
        const errorData = await res.json();
        console.error("API Error Details:", errorData);
      } catch (e) {
        // Ignore if we can't parse error response
      }
      
      return NextResponse.json({ 
        error: "Failed to load matches", 
        status: res.status,
        statusText: res.statusText
      }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ matches: data.matches || [] });
  } catch (error) {
    console.error("API Request Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}