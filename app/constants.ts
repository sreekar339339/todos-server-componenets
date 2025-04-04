import { createMirrorEnum } from "@/lib/utils";

export const filter = createMirrorEnum(["all", "active", "completed"]);
export const name = createMirrorEnum(["intent", "data", "filter"])
export const intent = createMirrorEnum(["statusUpdate", "textUpdate", "create", "delete"]);