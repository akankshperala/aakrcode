import { NextResponse } from "next/server";

// Judge0 language mapping
const languageMap = {
  javascript: 93,
  python: 71,
  java: 62,
  csharp: 51,
  cpp: 54,
};

export async function POST(req) {
  try {
    const { code, language, input } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Source code cannot be empty." },
        { status: 400 }
      );
    }

    const languageId = languageMap[language];
    if (!languageId) {
      return NextResponse.json(
        { error: `Language '${language}' is not supported.` },
        { status: 400 }
      );
    }

    // Encode source code and input in Base64
    const base64Code = Buffer.from(code, "utf-8").toString("base64");
    const base64Input = Buffer.from(input || "", "utf-8").toString("base64");

    const submissionPayload = {
      source_code: base64Code,
      language_id: languageId,
      stdin: base64Input,
      // optional: enable compiler messages in base64 too
      expected_output: "",
    };

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
      body: JSON.stringify(submissionPayload),
    };

    // Create submission
    const createRes = await fetch(
      `https://${process.env.RAPIDAPI_HOST}/submissions?base64_encoded=true&wait=false`,
      options
    );

    if (!createRes.ok) {
      const err = await createRes.json();
      console.error("Judge0 API Error:", err);
      return NextResponse.json({ error: "Failed to create submission." }, { status: 500 });
    }

    const { token } = await createRes.json();

    // Polling for result
    let statusId = 1;
    let result;

    const getOptions = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
    };

    while (statusId === 1 || statusId === 2) {
      await new Promise((res) => setTimeout(res, 1500));
      const getRes = await fetch(
        `https://${process.env.RAPIDAPI_HOST}/submissions/${token}?base64_encoded=true`,
        getOptions
      );
      if (!getRes.ok) {
        const err = await getRes.json();
        console.error("Judge0 polling error:", err);
        return NextResponse.json({ error: "Failed to fetch submission result." }, { status: 500 });
      }
      result = await getRes.json();
      statusId = result.status.id;
    }

    // Decode output before sending back
    if (result.stdout) result.stdout = Buffer.from(result.stdout, "base64").toString("utf-8");
    if (result.stderr) result.stderr = Buffer.from(result.stderr, "base64").toString("utf-8");
    if (result.compile_output) result.compile_output = Buffer.from(result.compile_output, "base64").toString("utf-8");

    return NextResponse.json(result, { status: 200 });

  } catch (err) {
    console.error("Internal Server Error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
