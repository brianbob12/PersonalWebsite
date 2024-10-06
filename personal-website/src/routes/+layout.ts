export const prerender = true;

import posthog from 'posthog-js'
import { browser } from '$app/environment';

export const load = async () => {

  if (browser) {
    posthog.init(
      'phc_1Rz5LMSCuR49hytghVIFsGkhF2ou50KtSoG8IRwpS5a',
      { 
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
      }
    )
  }
  return
};