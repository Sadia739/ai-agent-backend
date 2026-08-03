import axios from "axios";

export const webSearch = async (
  query: string
) => {
  console.log("==================================");
  console.log("WEB SEARCH TOOL CALLED");
  console.log("Query:", query);
  console.log(
    "TAVILY_API_KEY exists:",
    !!process.env.TAVILY_API_KEY
  );
  console.log("==================================");

  try {
    const response = await axios.post(
      "https://api.tavily.com/search",
      {
        api_key: process.env.TAVILY_API_KEY,
        query,
        search_depth: "basic",
        include_answer: true,
        max_results: 3,
      }
    );

    console.log("===== TAVILY SUCCESS =====");
    console.log(
      JSON.stringify(response.data, null, 2)
    );

    return response.data.answer;
  } catch (error: any) {
    console.log("===== TAVILY FAILED =====");

    console.log(
      error.response?.status
    );

    console.log(
      JSON.stringify(
        error.response?.data,
        null,
        2
      )
    );

    console.log(error.message);

    throw error;
  }
};