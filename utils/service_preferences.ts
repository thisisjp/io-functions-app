import { ServicePreference } from "@pagopa/io-functions-commons/dist/generated/definitions/ServicePreference";
import { ServicesPreferencesModeEnum } from "@pagopa/io-functions-commons/dist/generated/definitions/ServicesPreferencesMode";
import { Profile } from "@pagopa/io-functions-commons/dist/src/models/profile";
import { RetrievedServicePreference } from "@pagopa/io-functions-commons/dist/src/models/service_preference";
import { NonNegativeInteger } from "@pagopa/io-functions-commons/node_modules/@pagopa/ts-commons/lib/numbers";

import * as te from "fp-ts/lib/TaskEither";

const toUserServicePreference = (
  emailEnabled: boolean,
  inboxEnabled: boolean,
  webhookEnabled: boolean,
  version: NonNegativeInteger
): ServicePreference => ({
  is_email_enabled: emailEnabled,
  is_inbox_enabled: inboxEnabled,
  is_webhook_enabled: webhookEnabled,
  settings_version: version
});

/**
 * Map RetrievedServicePreference to ServicePreference
 *
 * @param servicePref
 * @returns
 */
export const toUserServicePreferenceFromModel = (
  servicePref: RetrievedServicePreference
): ServicePreference =>
  toUserServicePreference(
    servicePref.isEmailEnabled,
    servicePref.isInboxEnabled,
    servicePref.isWebhookEnabled,
    servicePref.settingsVersion
  );

/**
 * Create a default ENABLED ServicePreference
 *
 * @param version the service preference version
 * @returns
 */
export const toDefaultEnabledUserServicePreference = (
  version: NonNegativeInteger
): ServicePreference => toUserServicePreference(true, true, true, version);

/**
 * Create a default DISABLED ServicePreference
 *
 * @param version the service preference version
 * @returns
 */
export const toDefaultDisabledUserServicePreference = (
  version: NonNegativeInteger
): ServicePreference => toUserServicePreference(false, false, false, version);

/**
 *
 * @param profile
 * @returns
 */
export const nonLegacyServicePreferences = (profile: Profile): boolean => {
  return (
    profile.servicePreferencesSettings.mode ===
      ServicesPreferencesModeEnum.AUTO ||
    profile.servicePreferencesSettings.mode ===
      ServicesPreferencesModeEnum.MANUAL
  );
};

/**
 * Get Service Preference Setting Version for giver profile,
 * or fail if is negative
 *
 * @param profile
 * @returns
 */
export function getServicePreferenceSettingsVersion(
  profile
): te.TaskEither<Error, NonNegativeInteger> {
  return te
    .fromEither(
      NonNegativeInteger.decode(profile.servicePreferencesSettings.version)
    )
    .mapLeft(_ => Error("Service Preferences Version < 0 not allowed"));
}