import axios from "axios";

export const webSearch = async (
  query: string
) => {
  const response = await axios.post(
    "https://api.tavily.com/search",
    {
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: "advanced",
      include_answer: true,
      include_images: false,
      max_results: 5,
    }
  );

  return (
    response.data.answer ??
    JSON.stringify(response.data.results)
  );
};