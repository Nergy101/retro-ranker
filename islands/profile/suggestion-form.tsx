import { PiPaperPlaneRight } from "@preact-icons/pi";
import { useState } from "preact/hooks";

export function SuggestionForm({ csrfToken }: { csrfToken: string }) {
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          suggestion,
          csrf_token: csrfToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit suggestion");
      }

      // Success
      setSuggestion("");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div class="suggestion-success">
        <p>Thank you for your feedback! We appreciate your input.</p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          class="outline"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} class="suggestion-form">
      <input type="hidden" name="csrf_token" value={csrfToken} />
      <div class="grid">
        <label for="suggestion">
          <strong>Have a suggestion for RetroRanker?</strong>
          <textarea
            id="suggestion"
            name="suggestion"
            placeholder="Share your ideas, feature requests, or feedback..."
            value={suggestion}
            onInput={(e) =>
              setSuggestion((e.target as HTMLTextAreaElement).value)}
            required
            rows={4}
          />
        </label>
      </div>

      {error && <div class="error-message">{error}</div>}

      <button
        type="submit"
        disabled={isSubmitting || !suggestion.trim()}
        class="outline insert-btn"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          width: "fit-content",
        }}
      >
        <PiPaperPlaneRight /> Submit
      </button>
    </form>
  );
}
