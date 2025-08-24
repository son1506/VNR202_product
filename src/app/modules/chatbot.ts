// Chatbot module: gọi Gemini AI bằng API key từ .env
const GEMINI_API_KEY = import.meta.env.VITE_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function askGemini(question: string, systemPrompt?: string): Promise<string> {
	if (!GEMINI_API_KEY) throw new Error('Missing Gemini API key');
	const prompt = (systemPrompt ? systemPrompt + '\n\n' : '') + question;
	const body = {
		contents: [{ parts: [{ text: prompt }] }],
		generationConfig: {
			temperature: 0.4,
			topK: 40,
			topP: 0.95,
			maxOutputTokens: 800,
			stopSequences: ["Câu hỏi:"]
		},
		safetySettings: [
			{ category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
			{ category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
			{ category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
			{ category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
		]
	};
	 const resp = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	const data = await resp.json();
	if (!resp.ok) throw new Error(data.error?.message || 'Gemini API error');
	const candidates = data.candidates;
	if (!candidates || candidates.length === 0) return 'Không có phản hồi từ AI.';
	const content = candidates[0]?.content?.parts?.[0]?.text || candidates[0]?.content || '';
	return content.trim();
}
