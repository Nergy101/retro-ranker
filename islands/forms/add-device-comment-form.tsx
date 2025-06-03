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
          <ProfileImage name={user.nickname} size={32} />
          <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
            {user.nickname}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <textarea
            placeholder="Write your comment here..."
            name="content"
            value={comment}
            onInput={(e) => setComment((e.target as HTMLTextAreaElement).value)}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "0.25rem",
              border: "1px solid var(--pico-muted-border-color)",
              minHeight: "80px",
              resize: "vertical",
            }}
          />
        </div>
        <button
          type="submit"
          role="button"
          class="primary"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.25rem",
            color: "var(--pico-color)",
            width: "fit-content",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              cursor: "pointer",
            }}
          >
            <PiPaperPlaneRight /> Add comment
          </span>
        </button>
      </form>
    </div>
  );
}
