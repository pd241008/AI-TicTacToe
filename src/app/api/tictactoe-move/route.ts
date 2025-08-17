import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  // Read the request body ONCE at the beginning
  let requestBody;
  try {
    requestBody = await req.json();
  } catch (parseError) {
    console.error("❌ Failed to parse request body:", parseError);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { board }: { board: string[] } = requestBody;

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing Gemini API key.");
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a Tic Tac Toe bot playing as "O".
The board is an array of 9 elements: ${JSON.stringify(board)}.
Return the best next move index (0-8) as a single number only. Do not return any text, explanation, or extra characters.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text().trim();
    console.log("🔍 Gemini Response:", content);

    const move = parseInt(content, 10);

    if (isNaN(move) || move < 0 || move > 8 || board[move] !== "") {
      console.warn("⚠️ Invalid move from Gemini:", content);
      return NextResponse.json(
        { error: "Invalid move from Gemini" },
        { status: 500 }
      );
    }

    return NextResponse.json({ move });
  } catch (error: unknown) {
    console.error("❌ Gemini API call failed:", JSON.stringify(error, null, 2));
    console.warn("⚠️ An error occurred, falling back to random move");

    // The board is already available from the initial read
    const emptyIndices: number[] = [];
    board.forEach((value, index) => {
      if (value === "") emptyIndices.push(index);
    });

    if (emptyIndices.length > 0) {
      const fallbackMove =
        emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      return NextResponse.json({ move: fallbackMove });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
