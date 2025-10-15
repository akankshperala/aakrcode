import { NextResponse } from "next/server";

// A mapping from our friendly language names to Judge0's language IDs
// You can find more IDs here: https://judge0.com/
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

    // 1. Input Validation
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

    // 2. Prepare the payload for the Judge0 API
    const submissionPayload = {
      source_code: code,
      language_id: languageId,
      stdin: input || "", // Standard input
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

    // 3. First API call to create the submission and get a token
    const createSubmissionResponse = await fetch(
      `https://${process.env.RAPIDAPI_HOST}/submissions?base64_encoded=false&wait=false`,
      options
    );
      
    if (!createSubmissionResponse.ok) {
      const errorData = await createSubmissionResponse.json();
      console.error("Judge0 API Error:", errorData);
      return NextResponse.json({ error: "Failed to create submission." }, { status: 500 });
    }
    
    const { token } = await createSubmissionResponse.json();

    // 4. Poll for the result using the token
    let result;
    let statusId = 1; // Processing

    const getOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
        }
    };

    while (statusId === 1 || statusId === 2) { // 1 = In Queue, 2 = Processing
        // Add a small delay to avoid spamming the API
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        const getSubmissionResponse = await fetch(`https://${process.env.RAPIDAPI_HOST}/submissions/${token}?base64_encoded=false`, getOptions);
        
        if (!getSubmissionResponse.ok) {
          const errorData = await getSubmissionResponse.json();
          console.error("Judge0 polling error:", errorData);
          return NextResponse.json({ error: "Failed to fetch submission result." }, { status: 500 });
        }

        result = await getSubmissionResponse.json();
        statusId = result.status.id;
    }

    // 5. Send the final result back to the client
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred on the server." },
      { status: 500 }
    );
  }
}