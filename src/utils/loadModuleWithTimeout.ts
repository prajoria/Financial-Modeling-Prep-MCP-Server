import type { ModuleLoader, ToolRegistrationFunction } from "../types/index.js";

/**
 * Helper function to create a timeout promise that rejects after a specified time
 * @param timeoutMs - Timeout in milliseconds
 * @param moduleName - Name of the module (for error message)
 * @returns Promise that rejects with timeout error
 */
function createTimeoutPromise(timeoutMs: number, moduleName: string): Promise<never> {
    return new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Module loading timeout for ${moduleName}`)), timeoutMs)
    );
  }
  
  /**
   * Loads a module with timeout protection
   * @param moduleLoader - The module loader function
   * @param moduleName - Name of the module being loaded
   * @param timeoutMs - Timeout in milliseconds (default: 10000)
   * @returns Promise that resolves to the registration function
   */
 export async function loadModuleWithTimeout(
    moduleLoader: ModuleLoader, 
    moduleName: string, 
    timeoutMs: number = 10000
  ): Promise<ToolRegistrationFunction> {
    return await Promise.race([
      moduleLoader(),
      createTimeoutPromise(timeoutMs, moduleName)
    ]);
  }