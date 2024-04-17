export interface SiteConfig {
  name: string
  site?: string
  base?: string
  trailingSlash?: boolean
  googleSiteVerificationId?: string
}
export interface MetaDataConfig extends Omit<MetaData, 'title'> {
  title?: {
    default: string
    template: string
  }
}
export interface I18NConfig {
  language: string
  textDirection: string
  dateFormatter?: Intl.DateTimeFormat
}
export interface AppBlogConfig {
  isEnabled: boolean
  postsPerPage: number
  post: {
    isEnabled: boolean
    permalink: string
    robots: {
      index: boolean
      follow: boolean
    }
  }
  list: {
    isEnabled: boolean
    pathname: string
    robots: {
      index: boolean
      follow: boolean
    }
  }
  category: {
    isEnabled: boolean
    pathname: string
    robots: {
      index: boolean
      follow: boolean
    }
  }
  tag: {
    isEnabled: boolean
    pathname: string
    robots: {
      index: boolean
      follow: boolean
    }
  }
}
export interface AnalyticsConfig {
  vendors: {
    googleAnalytics: {
      id?: string
      partytown?: boolean
    }
  }
}

const DEFAULT_SITE_NAME = 'Website'

const getSite = () => {
  const _default = {
    name: DEFAULT_SITE_NAME,
    site: undefined,
    base: '/',
    trailingSlash: false,

    googleSiteVerificationId: ''
  }

  return _default as SiteConfig
}

const getMetadata = () => {
  const siteConfig = getSite()

  const _default = {
    title: {
      default: siteConfig?.name || DEFAULT_SITE_NAME,
      template: '%s'
    },
    description: '',
    robots: {
      index: false,
      follow: false
    },
    openGraph: {
      type: 'website'
    }
  }

  return _default as MetaDataConfig
}

const getI18N = () => {
  const _default = {
    language: 'en',
    textDirection: 'ltr'
  }

  const value = _default

  return Object.assign(value, {
    dateFormatter: new Intl.DateTimeFormat(value.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    })
  }) as I18NConfig
}

const getAppBlog = () => {
  const _default = {
    isEnabled: false,
    postsPerPage: 6,
    post: {
      isEnabled: true,
      permalink: '/blog/%slug%',
      robots: {
        index: true,
        follow: true
      }
    },
    list: {
      isEnabled: true,
      pathname: 'blog',
      robots: {
        index: true,
        follow: true
      }
    },
    category: {
      isEnabled: true,
      pathname: 'category',
      robots: {
        index: true,
        follow: true
      }
    },
    tag: {
      isEnabled: true,
      pathname: 'tag',
      robots: {
        index: false,
        follow: true
      }
    }
  }

  return _default as AppBlogConfig
}

const getUI = () => {
  const _default = {
    theme: 'system',
    classes: {},
    tokens: {}
  }

  return _default
}

const getAnalytics = () => {
  const _default = {
    vendors: {
      googleAnalytics: { id: import.meta.env.ANALYTIC_ID, partytown: true }
    }
  }
  return _default
}

export const SITE = getSite()
export const I18N = getI18N()
export const METADATA = getMetadata()
export const APP_BLOG = getAppBlog()
export const UI = getUI()
export const ANALYTICS = getAnalytics()
