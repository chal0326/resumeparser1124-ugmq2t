import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const extractSkill = async (responsibility: string): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "system",
      content: "You are a career coach expert at identifying transferable skills from job responsibilities. Respond with only one word or short phrase representing the main transferable skill."
    }, {
      role: "user",
      content: `Extract the main transferable skill from this responsibility: "${responsibility}"`
    }],
    temperature: 0.3,
    max_tokens: 10
  });

  return response.choices[0].message.content?.trim() || "Problem Solving";
};