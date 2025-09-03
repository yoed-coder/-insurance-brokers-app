const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.generateLetter = async ({ insured, insurer, letterType, instructions }) => {
  let subject = '';
  
  if (insured) {
    subject = `Insured details:\n- Name: ${insured.insured_name}`;
  } else if (insurer) {
    subject = `Insurer details:\n- Name: ${insurer.insurer_name}`;
  } else {
    subject = 'No subject details provided.';
  }

  const prompt = `
Write a professional ${letterType || 'general'} insurance letter.

${subject}

Additional instructions: ${instructions || 'None'}

Format it like a formal letter with greeting, body, and closing.
`;

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
  });

  return response.choices[0].message.content.trim();
};
