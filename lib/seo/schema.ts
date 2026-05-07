import { SOK, SITE } from '../constants'

export function ngoSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: SOK.legalName,
    alternateName: SOK.shortName,
    url: SITE.url,
    logo: `${SITE.url}/logo.svg`,
    description: SOK.shortMission,
    foundingDate: SOK.registeredAt,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SOK.address.street,
      postalCode: SOK.address.postalCode,
      addressLocality: SOK.address.city,
      addressCountry: SOK.address.country,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SOK.contact.phone,
        contactType: 'customer service',
        availableLanguage: ['Polish'],
      },
      {
        '@type': 'ContactPoint',
        telephone: SOK.contact.cwuPhone,
        contactType: 'humanitarian aid',
        availableLanguage: ['Polish', 'Ukrainian', 'English'],
      },
    ],
    sameAs: [SOK.social.facebook, SOK.social.instagram, SOK.social.youtube],
    identifier: [
      { '@type': 'PropertyValue', propertyID: 'KRS', value: SOK.krs },
      { '@type': 'PropertyValue', propertyID: 'NIP', value: SOK.nip },
      { '@type': 'PropertyValue', propertyID: 'REGON', value: SOK.regon },
    ],
  }
}

export function donateActionSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'DonateAction',
    recipient: ngoSchema(),
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE.url}/wesprzyj`,
    },
  }
}

export function articleSchema(args: { title: string; date: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: args.title,
    datePublished: args.date,
    description: args.description,
    url: args.url,
    author: { '@type': 'Organization', name: SOK.legalName },
    publisher: ngoSchema(),
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
