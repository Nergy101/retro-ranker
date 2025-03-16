// deno-lint-ignore-file no-console no-explicit-any
import PocketBase, {
  ClientResponseError,
  ListResult,
  LocalAuthStore,
  RecordModel,
} from "npm:pocketbase";
import { User } from "../frontend/contracts/user.contract.ts";

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
    this.pb = new PocketBase(url);
    this.pb.autoCancellation(false);
  }

  /**
   * Get the PocketBase instance
   * @returns PocketBase instance
   */
  public getPocketBaseClient(): PocketBase {
    return this.pb;
  }

  /**
   * Authenticate a user with email and password
   * @param email User email
   * @param password User password
   * @returns Authentication data
   */
  public async authWithPassword(email: string, password: string): Promise<any> {
    try {
      return await this.pb.collection("users").authWithPassword(
        email,
        password,
      );
    } catch (error) {
      if (error instanceof ClientResponseError) {
        console.error("Authentication error:", error.message);
      }
      throw error;
    }
  }

  /**
   * Register a new user
   * @param email User email
   * @param password User password
   * @param passwordConfirm Password confirmation
   * @param additionalData Additional user data
   * @returns Created user data
   */
  public async createUser(
    nickname: string,
    email: string,
    password: string,
    passwordConfirm: string,
  ): Promise<any> {
    try {
      const data = {
        email,
        password,
        passwordConfirm,
        nickname,
        emailVisibility: true,
        verified: false,
      };

      return await this.pb.collection("users").create(data);
    } catch (error) {
      if (error instanceof ClientResponseError) {
        console.error("User creation error:", error.message);
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
    filter: string = "",
    expand: string = "",
  ): Promise<ListResult<any>> {
    try {
      return await this.pb.collection(collection).getList(page, perPage, {
        filter,
        expand,
      });
    } catch (error) {
      if (error instanceof ClientResponseError) {
        console.error(`Error fetching ${collection}:`, error.message);
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
  public async getOne(collection: string, id: string, expand: string = ""): Promise<RecordModel> {
    try {
      return await this.pb.collection(collection).getOne(id, { expand });
    } catch (error) {
      if (error instanceof ClientResponseError) {
        console.error(`Error fetching ${collection} record:`, error.message);
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
      return await this.pb.collection(collection).create(data);
    } catch (error) {
      if (error instanceof ClientResponseError) {
        console.error(`Error creating ${collection} record:`, error.message);
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
      return await this.pb.collection(collection).update(id, data);
    } catch (error) {
      if (error instanceof ClientResponseError) {
        console.error(`Error updating ${collection} record:`, error.message);
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
    } catch (error) {
      if (error instanceof ClientResponseError) {
        console.error(`Error deleting ${collection} record:`, error.message);
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
    this.pb.authStore.isValid &&
      await this.pb.collection("users").authRefresh();
  }

  public getAuthStore(): LocalAuthStore {
    return this.pb.authStore as LocalAuthStore;
  }

  public async getUser(cookieHeader: string): Promise<User> {
    const jwt = cookieHeader?.split("pb_auth=")[1]?.split(";")[0];
    this.pb.authStore.save(jwt, null); // Store JWT in PocketBase instance
    const user = await this.pb.collection("users").authRefresh();
    return user.record as unknown as User;
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
    );

  return pb;
}
