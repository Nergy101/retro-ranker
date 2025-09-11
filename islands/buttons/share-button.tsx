import { PiShare } from "@preact-icons/pi";

export function ShareButton(
  { title, tooltip = "Share", shareTitle, url, appearance = "default" }: {
    title: string;
    tooltip?: string;
    shareTitle: string;
    url: string;
    appearance?:
      | "default"
      | "outline"
      | "outline contrast"
      | "outline secondary";
  },
) {
  const getIconSizeBasedOnDevice = () => {
    if (globalThis.innerWidth < 768) {
      return 32;
    }
    return 16;
  };

  const handleShare = async () => {
    // Check if the Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url,
        });
      } catch (error) {
        // User cancelled the share dialog or other error
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback: Copy URL to clipboard
      try {
        await navigator.clipboard.writeText(url);
        // Show a temporary notification
        const notification = document.createElement('div');
        notification.textContent = 'Link copied to clipboard!';
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: var(--pico-primary);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          z-index: 1000;
          font-size: 0.875rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 3000);
      } catch (error) {
        // Fallback for browsers that don't support clipboard API
        console.error('Failed to copy to clipboard:', error);
        // Show an alert as last resort
        alert(`Share this link: ${url}`);
      }
    }
  };

  if (
    appearance === "outline" || appearance === "outline contrast" ||
    appearance === "outline secondary"
  ) {
    return (
      <button
        class={`button secondary ${appearance}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          cursor: "pointer",
        }}
        aria-label="Share page"
        onClick={handleShare}
        data-tooltip={tooltip}
        data-placement="bottom"
        role="button"
        type="button"
      >
        <PiShare size={getIconSizeBasedOnDevice()} />
        <span class="device-detail-action-button-label">{title}</span>
      </button>
    );
  }

  return (
    <div
      aria-label="Share page"
      class="device-detail-action-button"
      onClick={handleShare}
      data-tooltip={tooltip}
      data-placement="right"
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          cursor: "pointer",
        }}
      >
        <PiShare size={getIconSizeBasedOnDevice()} />
        <span class="device-detail-action-button-label">Share</span>
      </span>
    </div>
  );
}
