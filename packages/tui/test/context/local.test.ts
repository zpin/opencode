import { expect, test } from "bun:test"
import { parseModel, recentModels, syncPlanBuildModels } from "../../src/context/local"

test("parses model IDs containing slashes", () => {
  expect(parseModel("provider/family/model")).toEqual({
    providerID: "provider",
    modelID: "family/model",
  })
})

test("moves a model to the front, deduplicates, and limits recents", () => {
  const recent = Array.from({ length: 12 }, (_, index) => ({
    providerID: "provider",
    modelID: `model-${index}`,
  }))

  expect(recentModels({ providerID: "provider", modelID: "model-5" }, recent)).toEqual([
    { providerID: "provider", modelID: "model-5" },
    ...recent.slice(0, 5),
    ...recent.slice(6, 10),
  ])
})

test("syncs model selection across plan and build", () => {
  const custom = { providerID: "provider", modelID: "custom" }
  const selected = { providerID: "provider", modelID: "selected" }

  expect(
    syncPlanBuildModels(
      {
        plan: { providerID: "provider", modelID: "plan" },
        build: { providerID: "provider", modelID: "build" },
        custom,
      },
      selected,
    ),
  ).toEqual({
    plan: selected,
    build: selected,
    custom,
  })
})
