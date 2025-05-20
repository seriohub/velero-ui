import { useUIConfig } from "@/hooks/context/useUIConfig";
import { useAppConfig } from "@/hooks/context/useAppConfig";
import { useServerConfig } from "@/hooks/context/useServerConfig"

export default function useAppBootstrap() {
  useUIConfig();
  useAppConfig();
  useServerConfig();

  return
}
