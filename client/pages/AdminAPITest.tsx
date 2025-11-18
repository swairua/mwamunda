import { useState } from "react";
import { API_CONFIG } from "@/lib/config";

export default function AdminAPITest() {
  const [response, setResponse] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testInitProducts = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log("API Base URL:", API_CONFIG.BASE_URL);
      console.log("Request body:", JSON.stringify({ action: "init_products_table" }));

      const response = await fetch(API_CONFIG.BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "init_products_table",
        }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      setResponse(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      console.error("Error:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const testInitApplications = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log("API Base URL:", API_CONFIG.BASE_URL);
      console.log("Request body:", JSON.stringify({ action: "init_applications_table" }));

      const response = await fetch(API_CONFIG.BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "init_applications_table",
        }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      setResponse(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      console.error("Error:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Configuration</h2>
          <p className="text-sm text-gray-600 mb-2">
            API Base URL: <code className="bg-gray-100 px-2 py-1">{API_CONFIG.BASE_URL}</code>
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <button
            onClick={testInitProducts}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test Init Products"}
          </button>

          <button
            onClick={testInitApplications}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test Init Applications"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-900 mb-2">Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {response && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Response</h3>
            <pre className="text-sm text-green-700 overflow-auto bg-white p-3 rounded border border-green-200">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
