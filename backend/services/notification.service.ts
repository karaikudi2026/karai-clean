import type {
  NotificationAudience,
  NotificationCategory,
} from "@mykaraikudi/constants";
import { supabaseAdmin } from "../config/supabase";
import { AppError } from "../utils/errors";

export interface CreateNotificationInput {
  title: string;
  body: string;
  category: NotificationCategory;
  targetAudience: NotificationAudience;
  payload?: Record<string, unknown>;
  templateId?: string;
  createdBy?: string;
  locale?: string;
}

/**
 * FCM integration stub — persists notification records for in-app history.
 * Replace `dispatchToDevices` with Firebase Admin SDK when ready.
 */
export class NotificationService {
  async createAndQueue(input: CreateNotificationInput) {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .insert({
        title: input.title,
        body: input.body,
        category: input.category,
        target_audience: input.targetAudience,
        payload: input.payload ?? {},
        template_id: input.templateId ?? null,
        created_by: input.createdBy ?? null,
        locale: input.locale ?? "ta",
        status: "queued",
      })
      .select("id, title, body, category, status, created_at")
      .single();

    if (error) {
      throw AppError.internal(`Failed to queue notification: ${error.message}`);
    }

    await this.dispatchToDevices(data.id, input);

    return data;
  }

  /** @internal Wire FCM here */
  private async dispatchToDevices(
    notificationId: string,
    _input: CreateNotificationInput
  ) {
    // TODO: Firebase Admin — send multicast, update delivery status
    await supabaseAdmin
      .from("notifications")
      .update({ status: "pending_dispatch" })
      .eq("id", notificationId);
  }

  async registerDevice(input: {
    deviceToken: string;
    platform: "ios" | "android" | "web";
    userId?: string;
    isGuest?: boolean;
    language?: string;
  }) {
    const { data, error } = await supabaseAdmin
      .from("notification_devices")
      .upsert(
        {
          device_token: input.deviceToken,
          platform: input.platform,
          user_id: input.userId ?? null,
          is_guest: input.isGuest ?? !input.userId,
          language: input.language ?? "ta",
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: "device_token" }
      )
      .select("id, device_token, platform, language")
      .single();

    if (error) {
      throw AppError.internal(`Device registration failed: ${error.message}`);
    }

    return data;
  }

  async getHistoryForUser(userId: string, limit = 50) {
    const { data, error } = await supabaseAdmin
      .from("notification_recipients")
      .select(
        `
        id,
        read_at,
        delivered_at,
        notifications (
          id,
          title,
          body,
          category,
          payload,
          created_at
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw AppError.internal(`Failed to fetch notifications: ${error.message}`);
    }

    return data;
  }
}

export const notificationService = new NotificationService();
