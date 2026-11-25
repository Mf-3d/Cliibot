import fs from "node:fs/promises";
import path from "node:path";
import { Ajv2020, type Schema } from "ajv/dist/2020.js";
import yaml from "yaml";
import type { Anniversary } from "./model.js";

export type AnniversaryConfig = {
  id: string;
  name: string;
  date: {
    month: number;
    day: number;
  };
  "guild-id": string;
  "channel-id": string;
};

export type AnniversaryConfigFile = {
  anniversaries: AnniversaryConfig[];
};

export class AnniversaryRepository {
  private constructor(private readonly anniversaries: Anniversary[]) {}

  findAll(): readonly Anniversary[] {
    return this.anniversaries;
  }

  findByDate(month: number, day: number): readonly Anniversary[] {
    return this.anniversaries.filter(
      (anniversary) => anniversary.date.month === month && anniversary.date.day === day
    );
  }

  static async create(
    configPath = path.resolve(process.cwd(), "data/anniversaries.yml")
  ): Promise<AnniversaryRepository> {
    const schemaPath = path.resolve(process.cwd(), "schemas/anniversaries.schema.json");

    const schemaText = await fs.readFile(schemaPath, "utf8");
    const schema: Schema = JSON.parse(schemaText);

    const ajv = new Ajv2020();
    const validate = ajv.compile<AnniversaryConfigFile>(schema);

    const configText = await fs.readFile(configPath, "utf8");
    const config: unknown = yaml.parse(configText);

    if (!validate(config)) {
      throw new Error(`Invalid anniversary configuration: ${ajv.errorsText(validate.errors)}`);
    }

    const anniversaries = config.anniversaries.map(AnniversaryRepository.toAnniversary);

    return new AnniversaryRepository(anniversaries);
  }

  private static toAnniversary(config: AnniversaryConfig): Anniversary {
    return {
      id: config.id,
      name: config.name,
      date: config.date,
      guildId: config["guild-id"],
      channelId: config["channel-id"],
    };
  }
}

AnniversaryRepository.create();
