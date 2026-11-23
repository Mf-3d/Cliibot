import type { Server } from "node:http";
import type { Logger } from "@mf-3d/logger";
import type { Client } from "discord.js";
import type { Kysely } from "kysely";
import { describe, it, expect, vi, afterEach } from "vitest";
import type { Database } from "./database/schema.js";
import { registerShutdownHandler } from "./shutdown-handler.js";

const originalExitCode = process.exitCode;

afterEach(() => {
  vi.restoreAllMocks();
  process.exitCode = originalExitCode;
});

describe("registerShutdownHandler", () => {
  it("Registers SIGINT and SIGTERM handlers", () => {
    const onceSpy = vi.spyOn(process, "once").mockImplementation(() => process);

    const client = {
      destroy: vi.fn(),
    } as unknown as Client;

    const server = {
      close: vi.fn((callback) => callback()),
    } as unknown as Server;

    const db = {
      destroy: vi.fn(),
    } as unknown as Kysely<Database>;

    const logger = {
      info: vi.fn(),
      error: vi.fn(),
    } as unknown as Logger;

    registerShutdownHandler(client, server, db, logger);
    expect(onceSpy).toHaveBeenCalledWith("SIGINT", expect.any(Function));

    expect(onceSpy).toHaveBeenCalledWith("SIGTERM", expect.any(Function));
  });

  it("Closes resources in the correct order on successful shutdown", async () => {
    const callOrder: string[] = [];

    const onceSpy = vi.spyOn(process, "once").mockImplementation(() => process);

    const client = {
      destroy: vi.fn(() => {
        callOrder.push("client");
      }),
    } as unknown as Client;

    const server = {
      close: vi.fn((callback) => {
        callOrder.push("server");
        callback();
      }),
    } as unknown as Server;

    const db = {
      destroy: vi.fn(() => {
        callOrder.push("database");
      }),
    } as unknown as Kysely<Database>;

    const logger = {
      info: vi.fn(),
      error: vi.fn(),
    } as unknown as Logger;

    registerShutdownHandler(client, server, db, logger);

    const handler = onceSpy.mock.calls[0]?.[1];

    expect(handler).toBeTypeOf("function");

    if (!handler) {
      throw new Error("SIGINT handler was not registered.");
    }

    await handler("SIGINT");

    expect(callOrder).toEqual(["client", "server", "database"]);
  });

  it("Sets the exit code to 0 when all shutdown operations succeed", async () => {
    const onceSpy = vi.spyOn(process, "once").mockImplementation(() => process);

    const client = {
      destroy: vi.fn(),
    } as unknown as Client;

    const server = {
      close: vi.fn((callback) => callback()),
    } as unknown as Server;

    const db = {
      destroy: vi.fn(),
    } as unknown as Kysely<Database>;

    const logger = {
      info: vi.fn(),
      error: vi.fn(),
    } as unknown as Logger;

    registerShutdownHandler(client, server, db, logger);

    const handler = onceSpy.mock.calls[0]?.[1];

    expect(handler).toBeTypeOf("function");

    if (!handler) {
      throw new Error("SIGINT handler was not registered.");
    }

    await handler("SIGINT");
    expect(process.exitCode).toBe(0);
  });

  it("Continues shutdown when client destruction fails", async () => {
    const callOrder: string[] = [];

    const onceSpy = vi.spyOn(process, "once").mockImplementation(() => process);

    const client = {
      destroy: vi.fn(() => {
        callOrder.push("client");
        return Promise.reject(new Error("Test error"));
      }),
    } as unknown as Client;

    const server = {
      close: vi.fn((callback) => {
        callOrder.push("server");
        callback();
      }),
    } as unknown as Server;

    const db = {
      destroy: vi.fn(() => {
        callOrder.push("database");
      }),
    } as unknown as Kysely<Database>;

    const logger = {
      info: vi.fn(),
      error: vi.fn(),
    } as unknown as Logger;

    registerShutdownHandler(client, server, db, logger);

    const handler = onceSpy.mock.calls[0]?.[1];

    expect(handler).toBeTypeOf("function");

    if (!handler) {
      throw new Error("SIGINT handler was not registered.");
    }

    await handler("SIGINT");

    expect(callOrder).toEqual(["client", "server", "database"]);
    expect(logger.error).toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });

  it("Continues shutdown when server closure fails", async () => {
    const callOrder: string[] = [];

    const onceSpy = vi.spyOn(process, "once").mockImplementation(() => process);

    const client = {
      destroy: vi.fn(() => {
        callOrder.push("client");
      }),
    } as unknown as Client;

    const server = {
      close: vi.fn((callback) => {
        callOrder.push("server");
        callback(new Error("Test error"));
      }),
    } as unknown as Server;

    const db = {
      destroy: vi.fn(() => {
        callOrder.push("database");
      }),
    } as unknown as Kysely<Database>;

    const logger = {
      info: vi.fn(),
      error: vi.fn(),
    } as unknown as Logger;

    registerShutdownHandler(client, server, db, logger);

    const handler = onceSpy.mock.calls[0]?.[1];

    expect(handler).toBeTypeOf("function");

    if (!handler) {
      throw new Error("SIGINT handler was not registered.");
    }

    await handler("SIGINT");

    expect(callOrder).toEqual(["client", "server", "database"]);
    expect(logger.error).toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });

  it("Sets the exit code to 1 when database destruction fails", async () => {
    const callOrder: string[] = [];

    const onceSpy = vi.spyOn(process, "once").mockImplementation(() => process);

    const client = {
      destroy: vi.fn(() => {
        callOrder.push("client");
      }),
    } as unknown as Client;

    const server = {
      close: vi.fn((callback) => {
        callOrder.push("server");
        callback();
      }),
    } as unknown as Server;

    const db = {
      destroy: vi.fn(() => {
        callOrder.push("database");
        return Promise.reject(new Error("Test error"));
      }),
    } as unknown as Kysely<Database>;

    const logger = {
      info: vi.fn(),
      error: vi.fn(),
    } as unknown as Logger;

    registerShutdownHandler(client, server, db, logger);

    const handler = onceSpy.mock.calls[0]?.[1];

    expect(handler).toBeTypeOf("function");

    if (!handler) {
      throw new Error("SIGINT handler was not registered.");
    }

    await handler("SIGINT");

    expect(callOrder).toEqual(["client", "server", "database"]);
    expect(logger.error).toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });

  it("Should prevent multiple shutdown executions", async () => {
    const onceSpy = vi.spyOn(process, "once").mockImplementation(() => process);

    // Keep the Promise pending so the test can control
    // when the client destruction completes.
    let resolveDestroy!: () => void;

    const client = {
      destroy: vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveDestroy = resolve;
          })
      ),
    } as unknown as Client;

    const server = {
      close: vi.fn((callback) => callback()),
    } as unknown as Server;

    const db = {
      destroy: vi.fn(),
    } as unknown as Kysely<Database>;

    const logger = {
      info: vi.fn(),
      error: vi.fn(),
    } as unknown as Logger;

    registerShutdownHandler(client, server, db, logger);

    const sigintHandler = onceSpy.mock.calls[0]?.[1];
    const sigtermHandler = onceSpy.mock.calls[1]?.[1];

    expect(sigintHandler).toBeTypeOf("function");
    expect(sigtermHandler).toBeTypeOf("function");

    if (!sigintHandler) {
      throw new Error("SIGINT handler was not registered.");
    }

    if (!sigtermHandler) {
      throw new Error("SIGTERM handler was not registered.");
    }

    // Start the first shutdown without waiting for it to complete.
    const firstShutdown = sigintHandler("SIGINT");

    // Attempt to start another shutdown while the first one is still running.
    await sigtermHandler("SIGTERM");

    expect(client.destroy).toHaveBeenCalledTimes(1);
    expect(server.close).toHaveBeenCalledTimes(0);
    expect(db.destroy).toHaveBeenCalledTimes(0);

    resolveDestroy();
    await firstShutdown;

    expect(client.destroy).toHaveBeenCalledTimes(1);
    expect(server.close).toHaveBeenCalledTimes(1);
    expect(db.destroy).toHaveBeenCalledTimes(1);
  });
});
