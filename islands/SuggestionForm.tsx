import { useSignal } from "@preact/signals";
import { PiChat } from "@preact-icons/pi";

interface SuggestionFormProps {
  userEmail: string;
}

export default function SuggestionForm({ userEmail }: SuggestionFormProps) {
  const suggestion = useSignal("");
  const isSubmitting = useSignal(false);
  const submitted = useSignal(false);
  const error = useSignal("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    isSubmitting.value = true;
    error.value = "";

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          suggestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit suggestion");
      }

      // Success
      suggestion.value = "";
      submitted.value = true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
    } finally {
      isSubmitting.value = false;
    }
  };

  if (submitted.value) {
    return (
      <div class="suggestion-success">
        <p>Thank you for your feedback! We appreciate your input.</p>
        <button
          type="button"
          onClick={() => submitted.value = false}
          class="outline"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} class="suggestion-form">
      <div class="grid">
        <label for="suggestion">
          <strong>Have a suggestion for RetroRanker?</strong>
          <textarea
            id="suggestion"
            name="suggestion"
            placeholder="Share your ideas, feature requests, or feedback..."
            value={suggestion.value}
            onInput={(e) =>
              suggestion.value = (e.target as HTMLTextAreaElement).value}
            required
            rows={4}
          />
        </label>
      </div>

      {error && <div class="error-message">{error}</div>}

      <button
        type="submit"
        disabled={isSubmitting || !suggestion.value.trim()}
        class="primary"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          width: "fit-content",
        }}
      >
        <PiChat /> Submit
      </button>
    </form>
  );
}
