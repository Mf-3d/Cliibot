import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { AnniversaryRepository } from "./repository.js";

describe("AnniversaryRepository", () => {
  describe("create()", () => {
    it("Creates an anniversary repository", async () => {
      const configPath = path.resolve(process.cwd(), "tests/fixtures/anniversaries.yml");
      const repository = await AnniversaryRepository.create(configPath);

      expect(repository.findAll()).toEqual([
        {
          id: "test1",
          name: "テスト１",
          date: {
            month: 2,
            day: 7,
          },
          guildId: "123456789012345678",
          channelId: "987654321098765432",
        },
        {
          id: "test2",
          name: "テスト２",
          date: {
            month: 2,
            day: 8,
          },
          guildId: "123456789012345678",
          channelId: "987654321098765432",
        },
        {
          id: "test3",
          name: "テスト３",
          date: {
            month: 2,
            day: 8,
          },
          guildId: "123456789012345678",
          channelId: "987654321098765432",
        },
      ]);
    });

    it("Throw an error if the configuration file does not exist", async () => {
      const configPath = path.resolve(process.cwd(), "tests/fixtures/not-found.yml");

      await expect(AnniversaryRepository.create(configPath)).rejects.toThrow();
    });

    it("Throws an error when the syntax is incorrect", async () => {
      const configPath = path.resolve(process.cwd(), "tests/fixtures/anniversaries-invalid.yml");

      await expect(AnniversaryRepository.create(configPath)).rejects.toThrow();
    });

    it("Throws an error when the configuration does not match the schema", async () => {
      const configPath = path.resolve(
        process.cwd(),
        "tests/fixtures/anniversaries-invalid-schema.yml"
      );

      await expect(AnniversaryRepository.create(configPath)).rejects.toThrow();
    });
  });

  describe("findByDate()", () => {
    let repository: AnniversaryRepository;

    beforeEach(async () => {
      const configPath = path.resolve(process.cwd(), "tests/fixtures/anniversaries.yml");
      repository = await AnniversaryRepository.create(configPath);
    });

    it("Returns the anniversary that matches the specified date.", async () => {
      expect(repository.findByDate(2, 7)).toHaveLength(1);
      expect(repository.findByDate(2, 7)).toEqual([
        {
          id: "test1",
          name: "テスト１",
          date: {
            month: 2,
            day: 7,
          },
          guildId: "123456789012345678",
          channelId: "987654321098765432",
        },
      ]);
    });

    it("Returns all anniversaries with the same date", () => {
      expect(repository.findByDate(2, 8)).toHaveLength(2);
      expect(repository.findByDate(2, 8)).toEqual([
        {
          id: "test2",
          name: "テスト２",
          date: {
            month: 2,
            day: 8,
          },
          guildId: "123456789012345678",
          channelId: "987654321098765432",
        },
        {
          id: "test3",
          name: "テスト３",
          date: {
            month: 2,
            day: 8,
          },
          guildId: "123456789012345678",
          channelId: "987654321098765432",
        },
      ]);
    });

    it("Returns an empty array if there are no matching anniversaries", () => {
      expect(repository.findByDate(12, 31)).toEqual([]);
    });
  });
});
