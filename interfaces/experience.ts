export interface Experience {
  signInMethods: SignInMethods
  signInMode: string
  socialSignInConnectorTargets: string[]
}

export interface SignInMethods {
  email: string
  sms: string
  social: string
  username: string
}

export interface BrandType {
  darkMode: boolean
  color: string
  logo: string
  slogan: string
}

export interface OtherType {
  enabled: boolean
  contractUrl: string
}
