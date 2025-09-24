import { PiPaperPlaneRight } from "@preact-icons/pi";
import { useState } from "preact/hooks";
import { ProfileImage } from "../../components/auth/profile-image.tsx";
import { Device } from "../../data/frontend/contracts/device.model.ts";
import { User } from "../../data/frontend/contracts/user.contract.ts";

export function AddDeviceCommentForm({
  device,
  user,
}: {
  device: Device;
  user: User;
}) {
  const [comment, setComment] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        margin: "1em",
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
        method="POST"
        action="/api/devices/comments"
      >
        <input type="hidden" name="device" value={device.id} />
        <input type="hidden" name="user" value={user.id} />
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ProfileImage
            name={user.nickname}
            user={user}
            size={32}
          />
          <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
            {user.nickname}
          </span>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <textarea
            placeholder="Write your comment here..."
            name="content"
            value={comment}
            onInput={(e) => setComment((e.target as HTMLTextAreaElement).value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid var(--pico-border-color)",
              borderRadius: "0.25rem",
              resize: "vertical",
              minHeight: "80px",
            }}
            required
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              style={{
                padding: "0.5rem",
                background: "var(--pico-primary)",
                color: "var(--pico-primary-inverse)",
                border: "none",
                borderRadius: "0.25rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                whiteSpace: "nowrap",
                width: "fit-content",
              }}
              disabled={!comment.trim()}
            >
              <PiPaperPlaneRight size={16} />
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
