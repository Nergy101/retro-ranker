import { PiGear } from "@preact-icons/pi";
import { Device } from "../../../data/models/device.model.ts";

interface MiscellaneousSpecsProps {
  device: Device;
}

export function MiscellaneousSpecs({ device }: MiscellaneousSpecsProps) {
  return (
    <section class="specs-section overflow-auto">
      <h3>
        <PiGear />
        Miscellaneous
      </h3>
      <table class="striped">
        <tbody>
          {device.colors && (
            <tr>
              <th>Colors</th>
              <td>{device.colors.join(", ")}</td>
            </tr>
          )}
          {device.notes && (
            <tr>
              <th>Notes</th>
              <td>{device.notes.join(", ")}</td>
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
          {device.reviews.writtenReviews.length > 0 && (
            <tr>
              <th>Written Reviews</th>
              <td>
                <ul>
                  {device.reviews.writtenReviews.map((review) => (
                    <li>
                      <a href={review.url} target="_blank" alt={review.name}>
                        {review.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
          {device.reviews.videoReviews.length > 0 && (
            <tr>
              <th>Video Reviews</th>
              <td>
                <ul>
                  {device.reviews.videoReviews.map((review) => (
                    <li>
                      <a href={review.url} target="_blank" alt={review.name}>
                        {review.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </td>
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
          {device.vendorLinks.length > 0 && (
            <tr>
              <th>Vendor Links</th>
              <td>
                <ul>
                  {device.vendorLinks.map((link) => (
                    <li>
                      <a href={link.url} target="_blank" alt={link.name}>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
          {device.shellMaterial && (
            <tr>
              <th>Shell Material</th>
              <td>{device.shellMaterial}</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
} 