import type { Dictionary } from "@/i18n/get-dictionary";
import type { Tool } from "@/content/tools";

/** License, runtime and specs as a definition list (shared by cards and the tool page). */
export default function ToolFacts({ tool, dict, full = false }: { tool: Tool; dict: Dictionary; full?: boolean }) {
  const t = dict.tools;
  const p = dict.toolPage;
  return (
    <dl className="tool-facts">
      <div>
        <dt>{t.license}</dt>
        <dd>
          {t.licenseKinds[tool.license.kind]}
          {tool.license.kind !== "not_stated" && <> · <span dir="ltr">{tool.license.name}</span></>}
        </dd>
      </div>
      <div><dt>{t.runtime}</dt><dd>{tool.runtime.map((r) => t.runtimes[r]).join(" · ")}</dd></div>
      {(tool.specs.parameters || full) && (
        <div><dt>{t.params}</dt><dd dir={tool.specs.parameters ? "ltr" : undefined}>{tool.specs.parameters ?? p.notStated}</dd></div>
      )}
      {(tool.specs.contextTokens || full) && (
        <div><dt>{t.context}</dt><dd dir={tool.specs.contextTokens ? "ltr" : undefined}>{tool.specs.contextTokens ?? p.notStated}</dd></div>
      )}
      {full && tool.specs.modalities && (
        <div>
          <dt>{p.modalities}</dt>
          <dd>{tool.specs.modalities.map((m) => p.modalityNames[m as keyof typeof p.modalityNames] ?? m).join(" · ")}</dd>
        </div>
      )}
    </dl>
  );
}
