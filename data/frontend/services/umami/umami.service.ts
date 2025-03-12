export class UmamiService {
  private static instance: UmamiService;
  private constructor() {}

  public static getInstance() {
    if (!UmamiService.instance) {
      UmamiService.instance = new UmamiService();
    }
    return UmamiService.instance;
  }

  public async sendEvent(
    eventName: string,
    eventData: Record<string, unknown>,
  ) {
    if (globalThis.location.hostname !== "retroranker.site") {
      return;
    }

    const payload = {
      payload: {
        hostname: globalThis.location.hostname,
        language: navigator.language,
        referrer: globalThis.document.referrer,
        screen: `${globalThis.screen.width}x${globalThis.screen.height}`,
        title: globalThis.document.title,
        url: globalThis.location.pathname,
        website: "34d0e3cb-e9cf-4554-8b1c-27541fb877c0",
        name: eventName,
        data: { ...eventData },
      },
      type: "event",
    };

    await fetch("https://umami.nergy.space/api/send", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
