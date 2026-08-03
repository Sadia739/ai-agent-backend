import axios from "axios";

export interface WebSearchResult {
  success: boolean;
  query?: string;
  answer?: string;
  results?: Array<{
    title: string;
    url: string;
    content: string;
  }>;
  error?: string;
}

export const webSearch = async (
  query: string
): Promise<WebSearchResult> => {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    console.error("TAVILY_API_KEY is not configured");
    return {
      success: false,
      query,
      error:
        "Web search is not configured. TAVILY_API_KEY is missing.",
    };
  }

  try {
    const response = await axios.post(
      "https://api.tavily.com/search",
      {
        api_key: apiKey,
        query,
        search_depth: "basic",
        include_answer: true,
        max_results: 5,
      },
      { timeout: 15000 }
    );

    const { answer, results = [] } = response.data;

    const formattedResults = results.map(
      (r: { title?: string; url?: string; content?: string }) => ({
        title: (r.title ?? "").trim(),
        url: (r.url ?? "").trim(),
        content: (r.content ?? "").trim(),
      })
    );

    if (!answer && formattedResults.length === 0) {
      return {
        success: false,
        query,
        error: "No search results found for this query.",
      };
    }

    return {
      success: true,
      query,
      answer: answer ?? undefined,
      results: formattedResults,
    };
  } catch (error: any) {
    console.error(
      "Tavily API Error:",
      error.response?.data || error.message
    );

    return {
      success: false,
      query,
      error:
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Unable to fetch search results.",
    };
  }
};
