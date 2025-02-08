import { Device } from "../../../data/device.model.ts";

interface MiscellaneousSpecsTableProps {
  device: Device;
}

export function MiscellaneousSpecsTable(
  { device }: MiscellaneousSpecsTableProps,
) {
  return (
    <table class="striped">
      <tbody>
        {device.shellMaterial && (
          <tr>
            <th>Shell Material</th>
            <td>
              {device.shellMaterial.raw || [
                device.shellMaterial.isPlastic && "Plastic",
                device.shellMaterial.isMetal && "Metal",
                device.shellMaterial.isAluminum && "Aluminum",
                device.shellMaterial.isMagnesiumAlloy && "Magnesium Alloy",
                device.shellMaterial.isOther && "Other",
              ].filter(Boolean).join(", ")}
            </td>
          </tr>
        )}
        {device.performance.emulationLimit && (
          <tr>
            <th>Emulation Limit</th>
            <td>{device.performance.emulationLimit}</td>
          </tr>
        )}
        {device.performance.maxEmulation && (
          <tr>
            <th>Max Emulation</th>
            <td>{device.performance.maxEmulation}</td>
          </tr>
        )}
        {device.colors && device.colors.length > 0 && (
          <tr>
            <th>Colors</th>
            <td>{device.colors.join(", ")}</td>
          </tr>
        )}
        {device.notes &&
          device.notes.filter((note) => note.trim() !== "").length > 0 &&
          (
            <tr>
              <th>Notes</th>
              <td>{device.notes.join(", ")}</td>
            </tr>
          )}
        {device.pros.length > 0 && (
          <tr>
            <th>Pros</th>
            <td>
              {device.pros.map((pro) => <span>{pro}</span>)}
            </td>
          </tr>
        )}
        {device.cons.length > 0 && (
          <tr>
            <th>Cons</th>
            <td>
              {device.cons.map((con) => <span>{con}</span>)}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
