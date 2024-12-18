// optional-auth.decorator.ts
import { SetMetadata } from "@nestjs/common";

export const OptionalAuth = () => SetMetadata("optional-auth", true);
