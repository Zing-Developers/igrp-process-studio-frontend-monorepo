import { createProcessStudioClient } from "@irn/framework-process-studio-client";

describe("Process Studio Client", () => {
  test("creates the complete high-level client surface", () => {
    const client = createProcessStudioClient({
      baseUrl: "http://localhost:8085",
    });

    expect(client.projects).toBeDefined();
    expect(client.processDefinitions).toBeDefined();
    expect(client.parameterization).toBeDefined();
    expect(client.m2mKeys).toBeDefined();
  });

  test("uses NEXT_PUBLIC_API_GATEWAY when baseUrl is omitted", async () => {
    const originalBaseUrl = process.env.NEXT_PUBLIC_API_GATEWAY;
    process.env.NEXT_PUBLIC_API_GATEWAY = "http://localhost:8085";
    const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      headers: { get: () => "application/json" },
      text: async () => JSON.stringify({ content: [] }),
    } as unknown as Response);

    try {
      await createProcessStudioClient({}).projects.getAll();
      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:8085/api/v1/projects",
        expect.objectContaining({ method: "GET" }),
      );
    } finally {
      fetchMock.mockRestore();
      process.env.NEXT_PUBLIC_API_GATEWAY = originalBaseUrl;
    }
  });
});
