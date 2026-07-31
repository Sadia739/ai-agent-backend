// import axios from "axios";

// export const webSearch = async (
//   query: string
// ) => {
//   try {
//     console.log("Searching:", query);

//     const response = await axios.post(
//       "https://api.tavily.com/search",
//       {
//         api_key: process.env.TAVILY_API_KEY,
//         query,
//         search_depth: "basic",
//         include_answer: true,
//         max_results: 3,
//       }
//     );

//     console.log("Tavily Response:", response.data);

//     return response.data.answer;
//   } catch (error: any) {
//     console.error(
//       "Tavily Error:",
//       error.response?.data || error.message
//     );

//     return "Web search failed.";
//   }
// };