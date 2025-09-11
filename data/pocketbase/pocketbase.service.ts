// deno-lint-ignore-file no-explicit-any
import PocketBase, {
  BaseAuthStore,
  ClientResponseError,
  ListResult,
  LocalAuthStore,
  RecordModel,
} from "npm:pocketbase";
import { User } from "../frontend/contracts/user.contract.ts";
import { logJson } from "../tracing/tracer.ts";

/**
 * PocketBaseService - A service to interface with PocketBase in a Deno environment
 * Stateless implementation for server-side use
 */
export class PocketBaseService {
  private pb: PocketBase;

  /**
   * Constructor for PocketBaseService
   * @param url The URL of your PocketBase instance
   */
  public constructor(url: string) {
    this.pb = new PocketBase(url, new MemoryAuthStore());
    this.pb.autoCancellation(false);
  }

  /**
   * Get the PocketBase instance
   * @returns PocketBase instance
   */
  public getPocketBaseClient(): PocketBase {
    return this.pb;
  }

  public async authWithOAuth2Code(
    provider: string,
    code: string,
    codeVerifier: string,
    redirectUrl: string,
    createData: Record<string, any>,
  ): Promise<any> {
    try {
      logJson("info", "PocketBase OAuth2 parameters", {
        provider,
        code,
        codeVerifier,
        redirectUrl,
        createData,
      });
      const result = await this.pb.collection("users").authWithOAuth2Code(
        provider,
        code,
        codeVerifier,
        redirectUrl,
        createData,
      );
      logJson("info", "PocketBase OAuth2 result", { provider, result });

      return result;
    } catch (error: unknown) {
      logJson("error", "PocketBase OAuth2 error", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Authenticate a user with nickname and password
   * @param nickname User nickname
   * @param password User password
   * @returns Authentication data
   */
  public async authWithPassword(
    nickname: string,
    password: string,
  ): Promise<any> {
    try {
      const result = await this.pb.collection("users").authWithPassword(
        nickname,
        password,
      );
      return result;
    } catch (error: unknown) {
      if (error instanceof ClientResponseError) {
        logJson("error", "Authentication error", { error: error.message });
      }
      throw error;
    }
  }

  /**
   * Register a new user
   * @param password User password
   * @param passwordConfirm Password confirmation
   * @param additionalData Additional user data
   * @returns Created user data
   */
  public async createUser(
    nickname: string,
    password: string,
    passwordConfirm: string,
  ): Promise<any> {
    try {
      const data = {
        nickname,
        password,
        passwordConfirm,
        emailVisibility: false,
        verified: false,
      };

      const result = await this.pb.collection("users").create(data);
      return result;
    } catch (error: unknown) {
      if (error instanceof ClientResponseError) {
        logJson("error", "User creation error", { error: error.message });
      }
      throw error;
    }
  }

  public async getAll(
    collection: string,
    options: {
      filter: string;
      expand: string;
      sort: string;
    } = {
      filter: "",
      expand: "",
      sort: "",
    },
  ): Promise<any[]> {
    const startTime = performance.now();
    try {
      logJson("info", "PocketBase getAll - Starting", {
        collection,
        filter: options.filter,
        expand: options.expand,
        sort: options.sort,
      });

      const result = await this.pb.collection(collection).getFullList(
        options,
      );
      const totalTime = performance.now() - startTime;

      logJson("info", "PocketBase getAll - Completed", {
        collection,
        resultCount: result.length,
        totalTime: `${totalTime.toFixed(2)}ms`,
        filter: options.filter,
        expand: options.expand,
        sort: options.sort,
      });

      return result;
    } catch (error: unknown) {
      if (error instanceof ClientResponseError) {
        logJson("error", `Error fetching ${collection}`, {
          error: error.message,
          totalTime: `${(performance.now() - startTime).toFixed(2)}ms`,
        });
      }
      throw error;
    }
  }

  /**
   * Fetch records from a collection
   * @param collection Collection name
   * @param page Page number (optional)
   * @param perPage Items per page (optional)
   * @param filter Filter query (optional)
   * @returns List of records
   */
  public async getList(
    collection: string,
    page: number = 1,
    perPage: number = 50,
    options: {
      filter: string;
      sort: string;
      expand: string;
    } = {
      filter: "",
      sort: "",
      expand: "",
    },
  ): Promise<ListResult<any>> {
    try {
      const result = await this.pb.collection(collection).getList(
        page,
        perPage,
        {
          filter: options.filter,
          sort: options.sort,
          expand: options.expand,
        },
      );
      return result;
    } catch (error: unknown) {
      if (error instanceof ClientResponseError) {
        logJson("error", `Error fetching ${collection}`, {
          error: error.message,
        });
      }
      throw error;
    }
  }

  /**
   * Fetch a single record by ID
   * @param collection Collection name
   * @param id Record ID
   * @returns Record data
   */
  public async getOne(
    collection: string,
    id: string,
    expand: string = "",
  ): Promise<RecordModel> {
    try {
      const result = await this.pb.collection(collection).getOne(id, {
        expand,
      });
      return result;
    } catch (error: unknown) {
      if (error instanceof ClientResponseError) {
        logJson("error", `Error fetching ${collection} record`, {
          error: error.message,
        });
      }
      throw error;
    }
  }

  /**
   * Create a record in a collection
   * @param collection Collection name
   * @param data Record data
   * @returns Created record
   */
  public async create(
    collection: string,
    data: Record<string, any>,
  ): Promise<any> {
    try {
      const result = await this.pb.collection(collection).create(data);
      return result;
    } catch (error: unknown) {
      if (error instanceof ClientResponseError) {
        logJson("error", `Error creating ${collection} record`, {
          error: error.message,
        });
      }
      throw error;
    }
  }

  /**
   * Update a record in a collection
   * @param collection Collection name
   * @param id Record ID
   * @param data Updated data
   * @returns Updated record
   */
  public async update(
    collection: string,
    id: string,
    data: Record<string, any>,
  ): Promise<any> {
    try {
      const result = await this.pb.collection(collection).update(id, data);
      return result;
    } catch (error: unknown) {
      if (error instanceof ClientResponseError) {
        logJson("error", `Error updating ${collection} record`, {
          error: error.message,
        });
      }
      throw error;
    }
  }

  /**
   * Delete a record from a collection
   * @param collection Collection name
   * @param id Record ID
   * @returns void
   */
  public async delete(collection: string, id: string): Promise<void> {
    try {
      await this.pb.collection(collection).delete(id);
    } catch (error: unknown) {
      if (error instanceof ClientResponseError) {
        logJson("error", `Error deleting ${collection} record`, {
          error: error.message,
        });
      }
      throw error;
    }
  }

  /**
   * Check if a user is authenticated
   * @returns boolean
   */
  public isAuthenticated(): boolean {
    return this.pb.authStore.isValid;
  }

  /**
   * Get the current authenticated user data
   * @returns User data or null
   */
  public getCurrentUser(): User {
    return this.pb.authStore.record as unknown as User;
  }

  public async authRefresh(): Promise<void> {
    if (this.pb.authStore.isValid) {
      await this.pb.collection("users").authRefresh();
    }
  }

  public getAuthStore(): LocalAuthStore {
    return this.pb.authStore as LocalAuthStore;
  }

  public async getUser(cookieHeader: string): Promise<User> {
    const startTime = performance.now();
    try {
      logJson("info", "PocketBase getUser - Starting", {
        hasCookieHeader: !!cookieHeader,
        cookieLength: cookieHeader?.length || 0,
      });

      const jwt = cookieHeader?.split("pb_auth=")[1]?.split(";")[0];
      this.pb.authStore.save(jwt, null);

      const authStart = performance.now();
      const user = await this.pb.collection("users").authRefresh();
      const authEnd = performance.now();

      const totalTime = performance.now() - startTime;

      logJson("info", "PocketBase getUser - Completed", {
        authTime: `${(authEnd - authStart).toFixed(2)}ms`,
        totalTime: `${totalTime.toFixed(2)}ms`,
        hasUser: !!user.record,
        userId: user.record?.id,
      });

      return user.record as unknown as User;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Unknown error";

      logJson("error", "PocketBase getUser - Error", {
        error: errorMessage,
        totalTime: `${(performance.now() - startTime).toFixed(2)}ms`,
      });

      throw error;
    }
  }

  /**
   * Logout the current user
   */
  public logout(): void {
    this.pb.authStore.clear();
  }
}

/**
 * Create a new PocketBase service instance
 * This function creates a fresh instance each time it's called,
 * making it suitable for server-side environments where state
 * should not be shared between requests
 */
export async function createPocketBaseService(
  url: string = "https://pocketbase.retroranker.site",
): Promise<PocketBaseService> {
  const pb = new PocketBaseService(url);
  return pb;
}

export async function createLoggedInPocketBaseService(
  cookie: string,
  url: string = "https://pocketbase.retroranker.site",
): Promise<PocketBaseService> {
  const pb = new PocketBaseService(url);
  if (cookie) {
    await pb.getUser(cookie);
  }
  return pb;
}

// Create a pocketbase service from the environment variable POCKETBASE_URL
// and make it into a super-user using the POCKETBASE_SUPERUSER_EMAIL and POCKETBASE_SUPERUSER_PASSWORD
export async function createSuperUserPocketBaseService(
  email: string,
  password: string,
  url: string = "https://pocketbase.retroranker.site",
): Promise<PocketBaseService> {
  const startTime = performance.now();

  logJson("info", "createSuperUserPocketBaseService - Starting", {
    url,
    hasEmail: !!email,
    hasPassword: !!password,
  });

  const pb = new PocketBaseService(url);

  const authStart = performance.now();
  await pb.getPocketBaseClient().collection("_superusers")
    .authWithPassword(
      email,
      password,
      {
        autoRefreshThreshold: 30 * 60,
      },
    );
  const authEnd = performance.now();

  const totalTime = performance.now() - startTime;

  logJson("info", "createSuperUserPocketBaseService - Completed", {
    authTime: `${(authEnd - authStart).toFixed(2)}ms`,
    totalTime: `${totalTime.toFixed(2)}ms`,
    url,
  });

  return pb;
}

// extending the base abstract class should be sufficient
class MemoryAuthStore extends BaseAuthStore {}
