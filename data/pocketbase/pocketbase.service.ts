// deno-lint-ignore-file no-console no-explicit-any
import PocketBase, {
  BaseAuthStore,
  ClientResponseError,
  ListResult,
  LocalAuthStore,
  RecordModel,
} from "npm:pocketbase";
import { User } from "../frontend/contracts/user.contract.ts";
import { tracer, logJson } from "../tracing/tracer.ts";

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
    return await tracer.startActiveSpan("authWithOAuth2", async (span) => {

      try {
        logJson("info", "PocketBase OAuth2 parameters", { provider, code, codeVerifier, redirectUrl, createData });
        const result = await this.pb.collection("users").authWithOAuth2Code(
          provider,
          code,
          codeVerifier,
          redirectUrl,
          createData,
      );
      logJson("info", "PocketBase OAuth2 result", { provider, result });

        span.setStatus({ code: 0 }); // OK
        return result;
      } catch (error: unknown) {
        logJson("error", "PocketBase OAuth2 error", { error: error instanceof Error ? error.message : String(error) });
        span.setStatus({ code: 2, message: error instanceof Error ? error.message : String(error) });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  // public async authWithOAuth2(
  //   provider: string,
  //   redirectUrl: string,
  //   createData?: Record<string, any>,
  // ): Promise<any> {
  //   return await tracer.startActiveSpan("authWithOAuth2", async (span) => {
  //     const result = await this.pb.collection("users").auth(
  //       provider,
  //       redirectUrl,
  //       createData,
  //     );
  //     span.setStatus({ code: 0 }); // OK
  //     return result;
  //   });
  // }

  /**
   * Authenticate a user with nickname and password
   * @param nickname User nickname
   * @param password User password
   * @returns Authentication data
   */
  public async authWithPassword(nickname: string, password: string): Promise<any> {
    return await tracer.startActiveSpan("authWithPassword", async (span) => {
      try {
        const result = await this.pb.collection("users").authWithPassword(
          nickname,
          password
        );
        span.setStatus({ code: 0 }); // OK
        return result;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown error";
        span.setStatus({ code: 2, message: errorMessage }); // ERROR
        if (error instanceof ClientResponseError) {
          logJson("error", "Authentication error", { error: error.message });
        }
        throw error;
      } finally {
        span.end();
      }
    });
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
    return await tracer.startActiveSpan("createUser", async (span) => {
      try {
        const data = {
          nickname,
          password,
          passwordConfirm,
          emailVisibility: false,
          verified: false,
        };

        const result = await this.pb.collection("users").create(data);
        span.setStatus({ code: 0 }); // OK
        return result;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown error";
        span.setStatus({ code: 2, message: errorMessage }); // ERROR
        if (error instanceof ClientResponseError) {
          logJson("error", "User creation error", { error: error.message });
        }
        throw error;
      } finally {
        span.end();
      }
    });
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
    return await tracer.startActiveSpan("getAll", async (span) => {
      try {
        span.setAttribute("collection", collection);
        span.setAttribute("filter", options.filter);
        span.setAttribute("expand", options.expand);

        const result = await this.pb.collection(collection).getFullList(
          options,
        );
        span.setStatus({ code: 0 }); // OK
        return result;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown error";
        span.setStatus({ code: 2, message: errorMessage }); // ERROR
        if (error instanceof ClientResponseError) {
          logJson("error", `Error fetching ${collection}`, { error: error.message });
        }
        throw error;
      } finally {
        span.end();
      }
    });
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
    return await tracer.startActiveSpan("getList", async (span) => {
      try {
        span.setAttribute("collection", collection);
        span.setAttribute("page", page);
        span.setAttribute("perPage", perPage);
        span.setAttribute("filter", options.filter);
        span.setAttribute("sort", options.sort);
        span.setAttribute("expand", options.expand);

        const result = await this.pb.collection(collection).getList(
          page,
          perPage,
          {
            filter: options.filter,
            sort: options.sort,
            expand: options.expand,
          },
        );
        span.setStatus({ code: 0 }); // OK
        return result;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown error";
        span.setStatus({ code: 2, message: errorMessage }); // ERROR
        if (error instanceof ClientResponseError) {
          logJson("error", `Error fetching ${collection}`, { error: error.message });
        }
        throw error;
      } finally {
        span.end();
      }
    });
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
    return await tracer.startActiveSpan("getOne", async (span) => {
      try {
        span.setAttribute("collection", collection);
        span.setAttribute("id", id);
        span.setAttribute("expand", expand);

        const result = await this.pb.collection(collection).getOne(id, {
          expand,
        });
        span.setStatus({ code: 0 }); // OK
        return result;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown error";
        span.setStatus({ code: 2, message: errorMessage }); // ERROR
        if (error instanceof ClientResponseError) {
          logJson("error", `Error fetching ${collection} record`, { error: error.message });
        }
        throw error;
      } finally {
        span.end();
      }
    });
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
    return await tracer.startActiveSpan("create", async (span) => {
      try {
        span.setAttribute("collection", collection);

        const result = await this.pb.collection(collection).create(data);
        span.setStatus({ code: 0 }); // OK
        return result;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown error";
        span.setStatus({ code: 2, message: errorMessage }); // ERROR
        if (error instanceof ClientResponseError) {
          logJson("error", `Error creating ${collection} record`, { error: error.message });
        }
        throw error;
      } finally {
        span.end();
      }
    });
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
    return await tracer.startActiveSpan("update", async (span) => {
      try {
        span.setAttribute("collection", collection);
        span.setAttribute("id", id);

        const result = await this.pb.collection(collection).update(id, data);
        span.setStatus({ code: 0 }); // OK
        return result;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown error";
        span.setStatus({ code: 2, message: errorMessage }); // ERROR
        if (error instanceof ClientResponseError) {
          logJson("error", `Error updating ${collection} record`, { error: error.message });
        }
        throw error;
      } finally {
        span.end();
      }
    });
  }

  /**
   * Delete a record from a collection
   * @param collection Collection name
   * @param id Record ID
   * @returns void
   */
  public async delete(collection: string, id: string): Promise<void> {
    return await tracer.startActiveSpan("delete", async (span) => {
      try {
        span.setAttribute("collection", collection);
        span.setAttribute("id", id);

        await this.pb.collection(collection).delete(id);
        span.setStatus({ code: 0 }); // OK
      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown error";
        span.setStatus({ code: 2, message: errorMessage }); // ERROR
        if (error instanceof ClientResponseError) {
          logJson("error", `Error deleting ${collection} record`, { error: error.message });
        }
        throw error;
      } finally {
        span.end();
      }
    });
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
    return await tracer.startActiveSpan("authRefresh", async (span) => {
      try {
        if (this.pb.authStore.isValid) {
          await this.pb.collection("users").authRefresh();
        }
        span.setStatus({ code: 0 }); // OK
      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown error";
        span.setStatus({ code: 2, message: errorMessage }); // ERROR
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public getAuthStore(): LocalAuthStore {
    return this.pb.authStore as LocalAuthStore;
  }

  public async getUser(cookieHeader: string): Promise<User> {
    return await tracer.startActiveSpan("getUser", async (span) => {
      try {
        const jwt = cookieHeader?.split("pb_auth=")[1]?.split(";")[0];
        this.pb.authStore.save(jwt, null);
        const user = await this.pb.collection("users").authRefresh();
        span.setStatus({ code: 0 }); // OK
        return user.record as unknown as User;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown error";
        span.setStatus({ code: 2, message: errorMessage }); // ERROR
        throw error;
      } finally {
        span.end();
      }
    });
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
  const pb = new PocketBaseService(url);
  await pb.getPocketBaseClient().collection("_superusers")
    .authWithPassword(
      email,
      password,
      {
        autoRefreshThreshold: 30 * 60,
      },
    );

  return pb;
}

// extending the base abstract class should be sufficient
class MemoryAuthStore extends BaseAuthStore {}
