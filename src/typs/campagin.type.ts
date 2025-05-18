export type CampaignSchedule = {
  id: string
  day: number
  hour: number
  minute: number
  active: boolean
  campaignId: string
  budget: string
  state: 'ENABLED' | 'PAUSED' | 'ARCHIVED' | string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export type Campaign = {
  id: string
  companyId: string
  profileId: string
  campaignName: string
  campaignType: 'SPONSORED_PRODUCTS' | 'SPONSORED_BRANDS' | 'SPONSORED_DISPLAY' | string
  campaignState: 'PAUSED' | 'ACTIVE' | 'ENDED' | string
  campaignBudget: string
  campaignStartDate: string
  campaignEndDate: string
  activeSchedule: number
  inActiveSchedule: number
  totalAdGroups: number
  totalKeywords: number
  totalProducts: number
}
