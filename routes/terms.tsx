import { FreshContext, page, PageProps } from "fresh";
import { CustomFreshState } from "@interfaces/state.ts";
import { TranslationPipe } from "@data/frontend/services/i18n/i18n.service.ts";

export const handler = {
  async GET(ctx: FreshContext) {
    (ctx.state as CustomFreshState).seo = {
      title: "Retro Ranker - ToS",
      description:
        "Read the terms and conditions for using Retro Ranker, your comprehensive retro gaming handheld comparison platform. Understand your rights and responsibilities when using our service.",
      url: `https://retroranker.site${ctx.url.pathname}`,
      keywords:
        "retro ranker terms, gaming website terms, retro gaming legal, handheld comparison terms of service, retro gaming platform rules",
    };
    return page(ctx);
  },
};

export default function Terms({ url: _url }: PageProps, ctx: FreshContext) {
  const translations = (ctx.state as CustomFreshState).translations ?? {};

  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="text-4xl font-bold mb-6">
        {TranslationPipe(translations, "terms.title")}
      </h1>

      <div>
        <section>
          <h2 class="text-2xl font-semibold mb-3">
            {TranslationPipe(translations, "terms.acceptance.title")}
          </h2>
          <p class="mb-4">
            {TranslationPipe(translations, "terms.acceptance.content")}
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-3">2. Use License</h2>
          <p class="mb-4">
            Permission is granted to temporarily access the materials
            (information or software) on Retro Ranker for personal,
            non-commercial viewing only. This is the grant of a license, not a
            transfer of title.
          </p>
          <p class="mb-4">
            Under this license, you may not:
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>
              Attempt to decompile or reverse engineer any software contained on
              Retro Ranker
            </li>
            <li>
              Remove any copyright or other proprietary notations from the
              materials
            </li>
            <li>
              Transfer the materials to another person or "mirror" the materials
              on any other server
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-3">3. Disclaimer</h2>
          <p class="mb-4">
            The materials on Retro Ranker are provided on an 'as is' basis.
            Retro Ranker makes no warranties, expressed or implied, and hereby
            disclaims and negates all other warranties including, without
            limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-3">4. Limitations</h2>
          <p class="mb-4">
            In no event shall Retro Ranker or its suppliers be liable for any
            damages (including, without limitation, damages for loss of data or
            profit, or due to business interruption) arising out of the use or
            inability to use the materials on Retro Ranker, even if Retro Ranker
            or a Retro Ranker authorized representative has been notified orally
            or in writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-3">5. Accuracy of Materials</h2>
          <p class="mb-4">
            The materials appearing on Retro Ranker could include technical,
            typographical, or photographic errors. Retro Ranker does not warrant
            that any of the materials on its website are accurate, complete, or
            current. Retro Ranker may make changes to the materials contained on
            its website at any time without notice.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-3">6. Links</h2>
          <p class="mb-4">
            Retro Ranker has not reviewed all of the sites linked to its website
            and is not responsible for the contents of any such linked site. The
            inclusion of any link does not imply endorsement by Retro Ranker of
            the site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-3">7. Modifications</h2>
          <p class="mb-4">
            Retro Ranker may revise these terms of service at any time without
            notice. By using this website, you are agreeing to be bound by the
            then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-3">8. Governing Law</h2>
          <p class="mb-4">
            These terms and conditions are governed by and construed in
            accordance with the laws and you irrevocably submit to the exclusive
            jurisdiction of the courts in that location.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-3">Contact Us</h2>
          <p class="mb-4">
            If you have any questions about these Terms of Service, please
            contact us at our{" "}
            <a href="/contact" class="text-primary">Contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
