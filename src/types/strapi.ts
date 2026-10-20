export interface StrapiButton {
  id: number;
  label: string;
  url: string | null;
  variant: string | null;
  openNewTab: boolean | null;
}

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  url: string;
  width: number;
  height: number;
}

export interface StrapiHero {
  id: number;
  titleLine1: string;
  titleLine2: string;
  description: string;
  eyebroww: string;
  primaryButton: StrapiButton | null;
  secondaryButton: StrapiButton | null;
  backgroundImage: StrapiImage | null;
}

export interface StrapiMarqueeItem {
  id: number;
  order: number;
  text: string;
  isActive: boolean | null;
}

export interface StrapiProject {
  id: number;
  documentId: string;
  title: string;
  slug: string | null;
  shortDescription: string;
  thumbnail: StrapiImage | null;
  category?: string | null;
}

export interface StrapiLatestProjects {
  id: number;
  Eyebrow: string;
  Title: string;
  Description: string;
  ViewAllButton: StrapiButton | null;
  projects: StrapiProject[];
}

export interface StrapiWhyChooseUsCard {
  id: number;
  order: number;
  title: string;
  description: string;
  icons: StrapiImage | null;
}

export interface StrapiWhyChooseUsItem {
  id: number;
  title: string;
  description: string;
  eyebroww: string;
  cards: StrapiWhyChooseUsCard[];
}

export interface StrapiContactForm {
  id: number;
  FullNameLabel: string;
  FullNamePlaceholder: string;
  EmailLabel: string;
  EmailPlaceholder: string;
  PhoneLabel: string;
  PhonePlaceholder: string;
  SubjectLabel: string;
  SubjectOptions: unknown | null;
  MessageLabel: string;
  MessagePlaceholder: string;
  SubmitButton: StrapiButton | null;
}

export interface StrapiContact {
  id: number;
  Email: string | null;
  Phone: string | null;
  Address: string | null;
  SectionLabel: string;
  Title: string;
  Description: string;
  ContactForm: StrapiContactForm | null;
}

export interface StrapiCTAA {
  id: number;
  title: string;
  description: string;
  eyebrow: string;
  primaryButton: StrapiButton | null;
  secondaryButton: StrapiButton | null;
}

export interface StrapiHomePage {
  id: number;
  documentId: string;
  Hero: StrapiHero;
  Marquee: StrapiMarqueeItem[];
  LatestProjects: StrapiLatestProjects;
  WhyChooseUs: StrapiWhyChooseUsItem[];
  Contact: StrapiContact;
  CTAA: StrapiCTAA;
}

export interface StrapiAboutStatistic {
  id: number;
  label: string;
  value: string;
}

export interface StrapiAboutFeature {
  id: number;
  title: string;
  description: string;
  icon?: StrapiImage | null;
}

export interface StrapiAboutCompanyIntro {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  highlights: StrapiAboutFeature[];
  image: StrapiImage | null;
}

export interface StrapiPhilosophyBullet {
  id: number;
  text?: string;
  bullets?: string;
}

export interface StrapiPhilosophyCard {
  id: number;
  title: string;
  description: string;
  bullets: StrapiPhilosophyBullet[];
  icon: StrapiImage | null;
  bulletColor?: string;
}

export interface StrapiAboutPhilosophy {
  id: number;
  Eyebrow: string;
  Title: string;
  Description: string;
  cards: StrapiPhilosophyCard[];
}

export interface StrapiAboutPage {
  id: number;
  documentId: string;
  Heroo: StrapiHero;
  Statistics: StrapiAboutStatistic[];
  CompanyIntro: StrapiAboutCompanyIntro;
  Philosophy: StrapiAboutPhilosophy;
  Collaborationn: StrapiCTAA;
}

export interface StrapiResponse<T = StrapiHomePage> {
  data: T;
  meta: Record<string, unknown>;
}

export interface StrapiServicesHero {
  id: number;
  eyebrow: string;
  titleone: string;
  titletwo: string;
  titlethree: string | null;
  description: string;
}

export interface StrapiServiceItem {
  id: number;
  Title: string;
  Description: string;
  Icon: StrapiImage | null;
  URL: string | null;
  OpenNewTab: boolean | null;
  IsActive: boolean | null;
  Order: number | null;
}

export interface StrapiServicesSection {
  id: number;
  Title: string;
  Description: string;
  Services: StrapiServiceItem[];
}

export interface StrapiFeaturedProject {
  id: number;
  Title: string;
  Description: string;
  eyebrow: string;
  image: StrapiImage | null;
  CTAButtons: any[];
}

export interface StrapiServicesPage {
  id: number;
  documentId: string;
  Heroo: StrapiServicesHero;
  Statistics: StrapiAboutStatistic[];
  Servicessection: StrapiServicesSection | null;
  FeaturedProject: StrapiFeaturedProject | null;
  CTAA: StrapiCTAA | null;
}

export interface StrapiPortfolioHero {
  id: number;
  eyebrow: string;
  titleone: string;
  order: number;
  text: string;
  isActive: boolean | null;
}

export interface StrapiProject {
  id: number;
  documentId: string;
  title: string;
  slug: string | null;
  shortDescription: string;
  thumbnail: StrapiImage | null;
  eyebrow?: string | null;
  ProjectOverview?: string | null;
  Gallery?: StrapiImage[];
  HowToPlay?: string | null;
  KeyFeatures?: any | null;
  QRCode?: StrapiImage | null;
  DownloadLinks?: any | null;
  ProjectTag?: any | null;
  CTA?: any | null;
}

export interface StrapiLatestProjects {
  id: number;
  Eyebrow: string;
  Title: string;
  Description: string;
  ViewAllButton: StrapiButton | null;
  projects: StrapiProject[];
}

export interface StrapiWhyChooseUsCard {
  id: number;
  order: number;
  title: string;
  description: string;
  icons: StrapiImage | null;
}

export interface StrapiWhyChooseUsItem {
  id: number;
  title: string;
  description: string;
  eyebroww: string;
  cards: StrapiWhyChooseUsCard[];
}

export interface StrapiContactForm {
  id: number;
  FullNameLabel: string;
  FullNamePlaceholder: string;
  EmailLabel: string;
  EmailPlaceholder: string;
  PhoneLabel: string;
  PhonePlaceholder: string;
  SubjectLabel: string;
  SubjectOptions: unknown | null;
  MessageLabel: string;
  MessagePlaceholder: string;
  SubmitButton: StrapiButton | null;
}

export interface StrapiContact {
  id: number;
  Email: string | null;
  Phone: string | null;
  Address: string | null;
  SectionLabel: string;
  Title: string;
  Description: string;
  ContactForm: StrapiContactForm | null;
}

export interface StrapiCTAA {
  id: number;
  title: string;
  description: string;
  eyebrow: string;
  primaryButton: StrapiButton | null;
  secondaryButton: StrapiButton | null;
}

export interface StrapiHomePage {
  id: number;
  documentId: string;
  Hero: StrapiHero;
  Marquee: StrapiMarqueeItem[];
  LatestProjects: StrapiLatestProjects;
  WhyChooseUs: StrapiWhyChooseUsItem[];
  Contact: StrapiContact;
  CTAA: StrapiCTAA;
}

export interface StrapiAboutStatistic {
  id: number;
  label: string;
  value: string;
}

export interface StrapiAboutFeature {
  id: number;
  title: string;
  description: string;
  icon?: StrapiImage | null;
}

export interface StrapiAboutCompanyIntro {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  highlights: StrapiAboutFeature[];
  image: StrapiImage | null;
}

export interface StrapiPhilosophyBullet {
  id: number;
  text?: string;
  bullets?: string;
}

export interface StrapiPhilosophyCard {
  id: number;
  title: string;
  description: string;
  bullets: StrapiPhilosophyBullet[];
  icon: StrapiImage | null;
  bulletColor?: string;
}

export interface StrapiAboutPhilosophy {
  id: number;
  Eyebrow: string;
  Title: string;
  Description: string;
  cards: StrapiPhilosophyCard[];
}

export interface StrapiAboutPage {
  id: number;
  documentId: string;
  Heroo: StrapiHero;
  Statistics: StrapiAboutStatistic[];
  CompanyIntro: StrapiAboutCompanyIntro;
  Philosophy: StrapiAboutPhilosophy;
  Collaborationn: StrapiCTAA;
}

export interface StrapiResponse<T = StrapiHomePage> {
  data: T;
  meta: Record<string, unknown>;
}

export interface StrapiServicesHero {
  id: number;
  eyebrow: string;
  titleone: string;
  titletwo: string;
  titlethree: string | null;
  description: string;
}

export interface StrapiServiceItem {
  id: number;
  Title: string;
  Description: string;
  Icon: StrapiImage | null;
  URL: string | null;
  OpenNewTab: boolean | null;
  IsActive: boolean | null;
  Order: number | null;
}

export interface StrapiServicesSection {
  id: number;
  Title: string;
  Description: string;
  Services: StrapiServiceItem[];
}

export interface StrapiFeaturedProject {
  id: number;
  Title: string;
  Description: string;
  eyebrow: string;
  image: StrapiImage | null;
  CTAButtons: any[];
}

export interface StrapiServicesPage {
  id: number;
  documentId: string;
  Heroo: StrapiServicesHero;
  Statistics: StrapiAboutStatistic[];
  Servicessection: StrapiServicesSection | null;
  FeaturedProject: StrapiFeaturedProject | null;
  CTAA: StrapiCTAA | null;
}

export interface StrapiPortfolioHero {
  id: number;
  eyebrow: string;
  titleone: string;
  titletwo: string;
  titlethree: string | null;
  backgroundImage: StrapiImage | null;
}

export interface StrapiPortfolioProjectItem {
  id: number;
  project: StrapiProject | null;
  Orderr: number | null;
  IsActivee: boolean | null;
  ViewDetailsLabel: string | null;
  eyebrow?: string | null;
}

export interface StrapiPortfolioCategoryItem {
  id: number;
  title: string;
  slug: string;
  eyebrow?: string | null;
  description: string;
  coverImage?: StrapiImage | null;
  buttonText?: string | null;
  order?: number | null;
}

export interface StrapiPortfolioPage {
  id: number;
  documentId: string;
  Heroo: StrapiPortfolioHero;
  category?: StrapiPortfolioCategoryItem[];
  PortfolioProjects?: StrapiPortfolioProjectItem[];
}

export interface StrapiBlogPost {
  id: number;
  documentId: string;
  Title: string;
  Slug: string;
  slug?: string;
  Category: string | null;
  Excerpt: string | null;
  Content: any | null;
  FeaturedImage: StrapiImage | null;
  PublishedDate: string | null;
  publishedAt: string | null;
}

export interface StrapiBlogHero {
  id: number;
  eyebrow: string;
  titleone: string;
  titletwo: string | null;
  description: string | null;
}

export interface StrapiBlogPage {
  id: number;
  documentId: string;
  Hero: StrapiBlogHero | null;
}

export interface StrapiJobCard {
  id: number;
  order: number;
  title: string;
  description: string;
  jobstags: any; // Could be enum or string or relation, we will parse safely
  location: string;
  icons: StrapiImage | null;
}

export interface StrapiJobRoleItem {
  id: number;
  eyebroww: string;
  eyebrow?: string;
  title: string;
  description: string;
  cards: StrapiJobCard[];
}

export interface StrapiJobsHero {
  id: number;
  eyebrow: string;
  TitleLine: string;
  description: any;
  backgroundImage: StrapiImage | null;
}

export interface StrapiJobsPage {
  id: number;
  documentId: string;
  Hero: StrapiJobsHero | null;
  whychooseus: StrapiWhyChooseUsItem[];
  jobs: StrapiJobRoleItem[];
  CTA: StrapiCTAA | null;
}

export interface StrapiJobPosition {
  id: number;
  documentId: string;
  Title: string;
  Slug: string;
  EmploymentType: string | null;
  Location: string | null;
  Description: any;
  Department: string | null;
  ApplyUrl: string | null;
  Order: number | null;
  IsActive: boolean | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiContactHero {
  id: number;
  eyebrow: string;
  titleone: string;
  titletwo: string | null;
  description: string | null;
  backgroundImage: StrapiImage | null;
}

export interface StrapiContactInfoItem {
  id: number;
  Order: number | null;
  Label: string;
  Type: string | null;
  Link: string | null;
  IsActive: boolean | null;
  Icon: StrapiImage | null;
}

export interface StrapiContactPageFormDetails {
  id: number;
  FullNameLabel: string;
  FullNamePlaceholder: string;
  EmailLabel: string;
  EmailPlaceholder: string;
  PhoneLabel: string;
  PhonePlaceholder: string;
  SubjectLabel: string;
  SubjectOptions: string | null;
  MessageLabel: string;
  MessagePlaceholder: string;
  SubmitButton: StrapiButton | null;
}

export interface StrapiContactPageFormSection {
  id: number;
  SectionLabel: string | null;
  Title: string;
  Description: string;
  Email: string | null;
  Phone: string | null;
  Address: string | null;
  Items: StrapiContactInfoItem[];
  ContactForm: StrapiContactPageFormDetails;
}

export interface StrapiMapSection {
  id: number;
  MapTitle: string | null;
  Latitude: string | null;
  Longitude: string | null;
  Zoom: string | null;
}

export interface StrapiContactPage {
  id: number;
  documentId: string;
  Hero: StrapiContactHero | null;
  ContactForm: StrapiContactPageFormSection | null;
  Map: StrapiMapSection | null;
  CTA: StrapiCTAA | null;
}

export interface StrapiSocialLink {
  id: number;
  order?: number;
  platform: string;
  url: string;
  isActive?: boolean | null;
  icon?: StrapiImage | null;
  iconn?: string | null;
}

export interface StrapiFooter {
  id: number;
  Description?: string | null;
  CopyrightText?: string | null;
  social?: StrapiSocialLink[];
}

export interface StrapiSiteSetting {
  id: number;
  documentId?: string;
  SiteName?: string | null;
  Tagline?: string | null;
  Logo?: StrapiImage | null;
  Favicon?: StrapiImage | null;
  Footer?: StrapiFooter | null;
}

