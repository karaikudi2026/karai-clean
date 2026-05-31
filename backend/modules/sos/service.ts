import { AppError } from "../../utils/errors";
import { sosRepository } from "./repository";
import type { UpsertSosProfileInput } from "./schemas";

export const sosService = {
  listEmergencyContacts() {
    return sosRepository.listEmergencyContacts();
  },

  getProfile(userId: string) {
    return sosRepository.getUserProfile(userId);
  },

  saveProfile(input: UpsertSosProfileInput, userId: string) {
    return sosRepository.upsertUserProfile(input, userId);
  },

  /**
   * Returns SMS/call payload for client-side emergency actions.
   * Actual SMS/call is initiated on-device for reliability and cost control.
   */
  async buildEmergencyPayload(userId: string) {
    const profile = await sosRepository.getUserProfile(userId);
    if (!profile) {
      throw AppError.badRequest(
        "SOS profile not configured. Please set up emergency contacts first."
      );
    }

    const contacts = await sosRepository.listEmergencyContacts();

    const message =
      profile.custom_message ??
      `SOS from myKaraikudi user. Emergency contact: ${profile.emergency_contact_name} (${profile.emergency_contact_phone})`;

    return {
      countdown_seconds: profile.countdown_seconds,
      primary_contact: {
        name: profile.emergency_contact_name,
        phone: profile.emergency_contact_phone,
      },
      reference_contacts: contacts,
      sms_body: message,
      call_targets: [
        profile.emergency_contact_phone,
        ...contacts.map((c: { phone: string }) => c.phone),
      ],
    };
  },
};
