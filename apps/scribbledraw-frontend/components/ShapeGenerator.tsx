// components/ShapeGenerator.js

export default function ShapeGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [generationType, setGenerationType] = useState("shape"); // 'shape' or 'svg'

  const generateShape = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint =
        generationType === "svg"
          ? "/api/generate-svg"
          : "https://openrouter.ai/api/v1/chat/completions";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.LLM_TOKEN}`,
          // "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
          // "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-small-3.2-24b-instruct:free",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text:
                    prompt +
                    " Return only valid JSON arrays. No markdown, no explanations, no additional text.",
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate shape");
      }

      if (data.success) {
        setResult(data.generated_text);
      } else {
        setError(data.error || "Generation failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    "Create a blue circle with radius 50px",
    "Generate a red rectangle 200x100",
    "Make a green triangle pointing upward",
    "Create a 5-pointed yellow star",
    "Draw a purple hexagon with rounded corners",
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        AI Shape Generator
      </h1>

      {/* Generation Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Generation Type
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="shape"
              checked={generationType === "shape"}
              onChange={(e) => setGenerationType(e.target.value)}
              className="mr-2"
            />
            Shape Description
          </label>
        </div>
      </div>

      {/* Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Describe the shape you want to create:
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Create a blue circle with radius 50px"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>

      {/* Example Prompts */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Examples:
        </label>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateShape}
        disabled={loading || !prompt.trim()}
        className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
          loading || !prompt.trim()
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Generating..." : `Generate Shape`}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Generated Result:
          </h3>

          <div className="p-4 bg-gray-50 border rounded-md">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {result}
            </pre>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Copy Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
