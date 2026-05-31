import { volunteersRepository } from "./repository";
import type {
  CreateBloodDonorInput,
  CreateEnquiryInput,
  CreateVolunteerGroupInput,
} from "./schemas";

export const volunteersService = {
  listGroups() {
    return volunteersRepository.listGroups();
  },

  listBloodDonors(bloodGroup?: string, location?: string) {
    return volunteersRepository.listBloodDonors(bloodGroup, location);
  },

  registerBloodDonor(input: CreateBloodDonorInput, userId: string) {
    return volunteersRepository.registerBloodDonor(input, userId);
  },

  submitEnquiry(input: CreateEnquiryInput, userId?: string) {
    return volunteersRepository.createEnquiry(input, userId);
  },

  createGroup(input: CreateVolunteerGroupInput) {
    return volunteersRepository.createGroup(input);
  },
};
